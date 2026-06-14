// ==UserScript==
// @name         Kumon Finger Enabler (Aggressive & Safe)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Bypass pen-only restriction and enable finger writing/drawing in Kumon application
// @author       Antigravity
// @match        https://kumonapp.digital.kumon.com/*
// @run-at       document-start
// @grant        none
// @allFrames    true
// ==/UserScript==

(function () {
  "use strict";

  console.log("Kumon Finger Enabler userscript loaded!");

  // Helper to safely log messages
  function log(msg, type = "info") {
    const prefix = "[Kumon Enabler]";
    if (type === "error") {
      console.error(prefix, msg);
    } else if (type === "warn") {
      console.warn(prefix, msg);
    } else {
      console.log(prefix, msg);
    }
  }

  // ==========================================
  // LAYER 1: Force Enable Touch on InkCanvasLib
  // ==========================================
  function monkeypatchInkCanvasLib(lib) {
    if (!lib) return;
    try {
      if (
        lib.setPointerTypeTouchEnabled &&
        !lib.setPointerTypeTouchEnabled.isPatched
      ) {
        const originalSet = lib.setPointerTypeTouchEnabled;

        // Try to overwrite directly
        try {
          lib.setPointerTypeTouchEnabled = function (enabled) {
            log(
              "Intercepted setPointerTypeTouchEnabled, forcing true (requested: " +
                enabled +
                ")",
            );
            return originalSet.call(this, true);
          };
          lib.setPointerTypeTouchEnabled.isPatched = true;
          log("Successfully monkeypatched setPointerTypeTouchEnabled");
        } catch (e) {
          // If direct write fails, try Object.defineProperty
          Object.defineProperty(lib, "setPointerTypeTouchEnabled", {
            value: function (enabled) {
              log(
                "Intercepted setPointerTypeTouchEnabled (via defineProperty), forcing true (requested: " +
                  enabled +
                  ")",
              );
              return originalSet.call(this, true);
            },
            writable: true,
            configurable: true,
          });
          lib.setPointerTypeTouchEnabled.isPatched = true;
          log(
            "Successfully redefined setPointerTypeTouchEnabled via defineProperty",
          );
        }
      }
    } catch (err) {
      log("Failed to patch setPointerTypeTouchEnabled: " + err.message, "warn");
    }
  }

  const inkToolHandler = {
    get(target, prop, receiver) {
      const val = Reflect.get(target, prop, receiver);
      if (prop === "InkCanvasLib" && val) {
        monkeypatchInkCanvasLib(val);
      }
      return val;
    },
    set(target, prop, value, receiver) {
      if (prop === "InkCanvasLib" && value) {
        monkeypatchInkCanvasLib(value);
      }
      return Reflect.set(target, prop, value, receiver);
    },
  };

  // Try setting up getter/setter for window.InkTool
  try {
    if (
      !window.hasOwnProperty("InkTool") ||
      Object.getOwnPropertyDescriptor(window, "InkTool").configurable
    ) {
      let _InkTool = window.InkTool;
      Object.defineProperty(window, "InkTool", {
        get() {
          return _InkTool;
        },
        set(val) {
          if (val && typeof val === "object") {
            _InkTool = new Proxy(val, inkToolHandler);
            log("Intercepted InkTool object assignment (Proxy registered)");
          } else {
            _InkTool = val;
          }
        },
        configurable: true,
      });
      log("Registered getter/setter for window.InkTool");
    } else {
      log(
        "window.InkTool is non-configurable. Bypassing defineProperty on window.",
        "warn",
      );
    }
  } catch (e) {
    log(
      "Error defining window.InkTool property: " +
        e.message +
        ". Will use direct checking/polling.",
      "warn",
    );
  }

  // Direct check & Polling fallback for InkTool / InkCanvasLib
  const pollInterval = setInterval(() => {
    try {
      if (window.InkTool) {
        // If it is a normal object, try wrapping it in a proxy if we haven't already
        if (window.InkTool && !window.InkTool.isProxied) {
          try {
            const originalInkTool = window.InkTool;
            // Only proxy if we can override the reference, otherwise we patch properties directly
            try {
              window.InkTool = new Proxy(originalInkTool, inkToolHandler);
              window.InkTool.isProxied = true;
              log("Successfully wrapped existing window.InkTool in Proxy");
            } catch (proxyError) {
              log(
                "Could not reassign window.InkTool to Proxy. Patching properties directly.",
                "warn",
              );
            }
          } catch (e) {}
        }

        // Direct property patching
        if (window.InkTool.InkCanvasLib) {
          monkeypatchInkCanvasLib(window.InkTool.InkCanvasLib);
          if (
            window.InkTool.InkCanvasLib.setPointerTypeTouchEnabled &&
            window.InkTool.InkCanvasLib.setPointerTypeTouchEnabled.isPatched
          ) {
            log("InkCanvasLib successfully patched. Stopping poll.");
            clearInterval(pollInterval);
          }
        }
      }
    } catch (err) {
      log("Error in InkTool polling loop: " + err.message, "warn");
    }
  }, 50);

  // Stop polling after 15 seconds to save resources if not found
  setTimeout(() => {
    clearInterval(pollInterval);
  }, 15000);

  // ==========================================
  // LAYER 2: Bypass disableTouch Directive (Touch.radiusX/Y)
  // ==========================================
  try {
    if (typeof Touch !== "undefined" && Touch.prototype) {
      Object.defineProperty(Touch.prototype, "radiusX", {
        get() {
          return 1;
        },
        configurable: true,
      });
      Object.defineProperty(Touch.prototype, "radiusY", {
        get() {
          return 1;
        },
        configurable: true,
      });
      log("Successfully patched Touch.prototype.radiusX/Y");
    } else {
      const checkTouchInterval = setInterval(() => {
        try {
          if (typeof Touch !== "undefined" && Touch.prototype) {
            clearInterval(checkTouchInterval);
            Object.defineProperty(Touch.prototype, "radiusX", {
              get() {
                return 1;
              },
              configurable: true,
            });
            Object.defineProperty(Touch.prototype, "radiusY", {
              get() {
                return 1;
              },
              configurable: true,
            });
            log("Successfully patched Touch.prototype.radiusX/Y (deferred)");
          }
        } catch (e) {
          log(
            "Error patching Touch.prototype.radiusX/Y deferred: " + e.message,
            "warn",
          );
        }
      }, 100);
    }
  } catch (e) {
    log("Error patching Touch.prototype.radiusX/Y: " + e.message, "warn");
  }

  // ==========================================
  // LAYER 3: Fake PointerEvent.pointerType (Touch -> Pen)
  // ==========================================
  try {
    if (typeof PointerEvent !== "undefined" && PointerEvent.prototype) {
      const originalPointerTypeDescriptor = Object.getOwnPropertyDescriptor(
        PointerEvent.prototype,
        "pointerType",
      );
      if (originalPointerTypeDescriptor) {
        Object.defineProperty(PointerEvent.prototype, "pointerType", {
          get() {
            try {
              const originalVal = originalPointerTypeDescriptor.get.call(this);
              if (originalVal === "touch" || originalVal === "mouse") {
                return "pen";
              }
              return originalVal;
            } catch (e) {
              return "pen";
            }
          },
          configurable: true,
        });
        log("Successfully patched PointerEvent.prototype.pointerType");
      } else {
        log("PointerEvent.prototype.pointerType descriptor not found", "warn");
      }
    }
  } catch (e) {
    log(
      "Error patching PointerEvent.prototype.pointerType: " + e.message,
      "warn",
    );
  }
})();
