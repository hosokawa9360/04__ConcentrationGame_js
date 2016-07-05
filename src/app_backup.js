//app.js

//外部変数
var console_label;
var gameArray = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
var pickedTiles = [];
var screText;
var moves=0;

//配列をシャッフルする関数
/*
var shuffle = function(v) {
  for(var j,x,i = v.length; i; j = parsInt(Math.random() * i),x = v[--i] ,v[i] = v[j], v[j] = x);
  return v;
};*/
var shuffle = function(v){
    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i),x = v[--i], v[i] = v[j], v[j] = x);
        return v;
};

var gameScene = cc.Scene.extend({
    onEnter: function() {
      gameArray = suffle(gameArray);
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

        var gradient = cc.LayerGradient.create(cc.color(0, 0, 0, 255), cc.color(0x46, 0x82, 0xB4, 255));
        this.addChild(gradient);

        for (i = 0; i < 16; i++) {
            //var tile = cc.Sprite.create(res.cover_png);
            var tile = new MemoryTile();
            //pictureValueというプロパティを定義して、値を入れている
            tile.pictureValue = gameArray[i];
            this.addChild(tile, 0);
            //タイルを格子状に配置する計算式
            tile.setPosition(49 + i % 4 * 74, 400 - Math.floor(i / 4) * 74);
        }
        var size = cc.director.getWinSize();
        console_label = cc.LabelTTF.create("Concentration Game", "Arial", 26);
        console_label.setPosition(size.width / 2, size.height / 6);
        this.addChild(console_label, 1);

        return true;
    },
});

//Spriteクラスを拡張して実装してみた
var MemoryTile = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile(res.cover_png);
        //イベントマネージャにイベントリスナーを追加
        cc.eventManager.addListener(listener.clone(), this);
    },
});

//listnerの宣言
var listener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function(touch, event) {
        if (pickedTiles.length < 2) {
            var target = event.getCurrentTarget();
            var location = target.convertToNodeSpace(touch.getLocation());
            var targetSize = target.getContentSize();
            var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);

            if (cc.rectContainsPoint(targetRectangle, location)) {
                console.log("I piced a tile!!");
                console_label.setString("pictueValue:" + target.pictureValue);
                // 一秒後に消える
                setTimeout(function() {
                    console_label.setString("");
                }, 1500);

                //別の画像を割り当てる処理
                target.initWithFile("res/tile_" + target.pictureValue + ".png");
                pickedTiles.push(target);
                if (pickedTiles.length == 2) {
                    checkTiles();
                }
            }
        }
    },
});

function checkTiles() {
  cc.log("checkTiles");
  setTimeout(function() {
      if(pickedTiles[0].pictureValue != pickedTiles[1].pictureValue){
        pickedTiles[0].initWithFile(res.cover_png);
        pickedTiles[1].initWithFile(res.cover_png);
      }
      else {
        gameLayer.removeChild(pickedTiles[0]);
        gameLayer.removeChild(pickedTiles[1]);
      }
      pickedTiles = [];
  }, 1000);
}
