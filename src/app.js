//app.js

var gameScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var backgroundLayer = new cc.LayerColor(new cc.Color(140, 200, 140, 128));
        this.addChild(backgroundLayer);

        gameLayer = new game();
        this.addChild(gameLayer);
    }
});

var game = cc.Layer.extend({
    ctor: function() {
        this._super();
        var size = cc.director.getWinSize();
        var tile = cc.Sprite.create(res.cover_png);　
        tile.setPosition(size.width/2,size.height/2);　
        this.addChild(tile);
        return true;

    },
});
