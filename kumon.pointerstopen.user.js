// ==UserScript==
// @name         Pointers to Pen
// @namespace    http://tampermonkey.net/
// @version      2025-04-25
// @description  Convert pointer event to pen events
// @author       You
// @match        https://kumonapp.digital.kumon.com/th/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kumon.com
// @grant        none
// ==/UserScript==

function cloneAndDispatchEvent(event) {
  if(event.pointerType=='pen') return;
  let clonedEvent;
  if (event instanceof CustomEvent) {
    clonedEvent = new CustomEvent(event.type, { detail: event.detail, bubbles: event.bubbles, cancelable: event.cancelable });
  } else if (event instanceof PointerEvent) {
    clonedEvent = new PointerEvent(event.type, {
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      clientX: event.clientX,
      clientY: event.clientY,
      screenX: event.screenX,
      screenY: event.screenY,
      pointerId: event.pointerId,
      pointerType: 'pen',
      isPrimary: event.isPrimary,
      button: event.button,
      buttons: event.buttons,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey
    });
  } else {
    clonedEvent = new Event(event.type, { bubbles: event.bubbles, cancelable: event.cancelable });
  }
  event.stopPropagation();
  event.stopImmediatePropagation();
  event.preventDefault();
  event.target.dispatchEvent(clonedEvent);
}

const penHandler = (e) => cloneAndDispatchEvent(e);
(function() {
    'use strict';

    // Your code here...
    document.addEventListener('pointermove', penHandler);
    document.addEventListener('pointerdown', penHandler);
    document.addEventListener('pointerup', penHandler);
    document.addEventListener('pointerover', penHandler);
    document.addEventListener('pointerenter', penHandler);
    document.addEventListener('pointercancel', penHandler);
    document.addEventListener('pointerout', penHandler);
    document.addEventListener('pointerleave', penHandler);
})();
