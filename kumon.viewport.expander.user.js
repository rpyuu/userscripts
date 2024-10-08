// ==UserScript==
// @name         Viewport Expander
// @version      1.4
// @description  Maximize viewport and draw FOV
// @author       Catalyst
// @include      https://*.kumon.com:*
// @grant        none
// @updateURL    https://gist.github.com/catalyst518/0f769f614b7eb2b7ebea977cacf0385e/raw/Viewport-Expander.meta.js
// @downloadURL  https://gist.github.com/catalyst518/0f769f614b7eb2b7ebea977cacf0385e/raw/Viewport-Expander.user.js
// ==/UserScript==

//--------------SETTINGS--------------
//Change the following variable according to your league's whitelist rules.
//Set the value to false to allow use in-game. Set the value to true to enable spectator-only mode (allowed in any league).
var spec_only=true;
//Set true/false to toggle auto-zoom level when spectating
var auto_zoom=true;
//Field of view color settings (does not show in spectator mode):
//   color in hex with 0x prefix
//   alpha controls the transparency and ranges from 0 (transparent) to 1 (opaque)
var color=0x595959;
var alpha=0.5;
//-----------END OF SETTINGS-----------

var oldh=0;
var oldw=0;
tagpro.ready(function waitForId() {
    if (!tagpro.playerId) {
        return setTimeout(waitForId, 100);
    }
    if(tagpro.spectator || !spec_only)
    {
    //Resize viewport
    resize();
    if(tagpro.spectator)
        tagpro.viewport.followPlayer=false;
    //Check for resizing and update FOV and zoom accordingly
    setInterval(updateFOV, 500);
    }
});

function resize(){
    tagpro.renderer.canvas_width = window.innerWidth;
    tagpro.renderer.canvas_height = window.innerHeight;
    tagpro.renderer.resizeView();
    tagpro.renderer.centerView();
}

function updateFOV() {
    var h = $('#viewport').height();
    var w = $('#viewport').width();
    //Resize viewport
    if (h!=window.innerHeight||w!=window.innerWidth){
        resize();
        h = $('#viewport').height();
        w = $('#viewport').width();
    }
    //Draw FOV
    if(!tagpro.spectator)
    {
    var player = tagpro.players[tagpro.playerId];
    if (!player.sprites.FOV) {
        player.sprites.FOV = new PIXI.Graphics();
        player.sprites.ball.addChild(player.sprites.FOV);
    }
    var x1=18-w/2;
    var x2=19+w/2;
    var y1=18-h/2;
    var y2=19+h/2;
        player.sprites.FOV.clear();
        player.sprites.FOV.beginFill(color);
        player.sprites.FOV.drawPolygon(x1,y1, x2,y1, x2,y2, x1,y2, x1,y1, -621,-381, 659,-381, 659,419, -621,419, -621,-381);
        player.sprites.FOV.endFill();
        player.sprites.FOV.alpha=alpha;
    }
    //Auto-zoom to fill viewport
    if(tagpro.spectator && auto_zoom && (oldh!=h ||oldw!=w))
    {
        var yzoom=tagpro.map[0].length*40/h;
        var xzoom=tagpro.map.length*40/w;
        tagpro.zoom=Math.max(xzoom,yzoom,1);
    }
    oldh=h;
    oldw=w;
}
