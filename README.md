###　○格子状に画像を配置する

for(i=0;i<16;i++){  
  var tile = cc.Sprite.create(res.cover_png);  
  this.addChild(tile,0);  
   //タイルを格子状に配置する計算式  
  tile.setPosition(49+i%4*74,400-Math.floor(i/4)*74);  
}  

## ○背景にグラデーションを表示する

  ** var gradient = cc.LayerGradient.create(cc.color(0,0,0,255),cc.color(0x46,0x82,0xB4,255));  **  
this.addChild(gradient);  

##　○グラデーションの開始と終了の色をRGBA(red,green,blue,alpha)の形式で指定します
cc.Colorは10進数(０から255)と16進数（0x00から0xFF）で指定することできます。
上記の例では、黒から青にグラデーションされた背景が表示される

## ○Sprite クラスを拡張する

** var MemoryTile = cc.Sprite.extend({  **
**    ctor:function() { **  
**        this._super(); **  
**        this.initWithFile(res.cover_png); **   
**    },  **  
**  });  **  

for (i = 0; i < 16; i++) {  
    //var tile = cc.Sprite.create(res.cover_png);  
  **  var tile = new MemoryTile(); **


##  ○　タッチやクリックに反応する拡張Spriteクラス

var MemoryTile = cc.Sprite.extend({
    ctor:function() {
        this._super();
        this.initWithFile(res.cover_png);
        //イベントマネージャにイベントリスナーを追加
**        cc.eventManager.addListener(listener.clone(),this); **
** addListener メソッドで使用した変数に合わせてlistenerを定義している **   
    },
});

//listnerの宣言
var listener = cc.EventListener.create({
**  リスナーを生成している **
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
** イベントのタイプを指定してる　 TOUCH_ONE_BY_ONE　は　シングルタッチを許可してる　**  
    swallowTouches: true,
** １つのアクティブなタッチがあったら他のタッチは無視 **  
    onTouchBegan: function (touch, event) {
** タッチやマウスクリックの処理が始まる **
      var target = event.getCurrentTarget();
** クリックされたターゲットを返している **
      var location = target.convertToNodeSpace(touch.getLocation());
** touch.getLocation()　タッチまたはクリック時のゲーム内の座標を取得することができる **
** convertToNodeSpace　タイル地震からの相対座標に変換する　これにより、タイルを基準とした座標となる **
      var targetSize = target.getContentSize();
**target.getContentSize　ターゲットの幅と高さを返す　この場合はタイル **
      var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
**cc.rect　タイルと同じ大きさの矩形を定義、クリックがこの矩形の中にあったかどうか知ることができるようになる **
      if (cc.rectContainsPoint(targetRectangle, location)) {
**　座標が矩形の内側にあるかどうか調べています **
          console.log("I piced a tile!!");
          console_label.setString("I piced a tile!!");
          // 一秒後に消える
       setTimeout(function() {
           console_label.setString("");
       }, 1500);

      }
    }
});

#### 関数、クラスへのデータの受け渡し
今回は、gameレイヤでインスタンスした console_label　に　var listener = cc.EventListener.create({　～で　文字列を与えています。

``    console_label.setString("I piced a tile!!");    ``
　この場合は、console_labelのインスタンス場所と処理される場所が異なるため、
gameレイヤの中で次のように定義しても、関数を跨いで利用できません。
`var label = cc.LabelTTF.create("This is Next Scene!!", "Arial", 26);`  
`    label.setPosition(size.width / 2, size.height / 2);`  
※関数の中の内部var変数は関数の処理が終わったら消去される。外部の関数からは参照できない
そこで、console_labelを事前に外部変数として定義しておき、プログラムのどこからでも参照できるようにしています。　　　　
`　var console_label;　　`  

1. 各タイルは、タッチまたはクリックアクションを検出し、タイルの内側または外部かを判断する2. タッチ／クリックによるタイルの相対座標を取得する  
3. これらの座標がタイルの内側にあるかどうかを参照する
4. もしクリックまたは、タッチされていれば、タイルがクリックされたことを伝えることができる

#### cc.eventManager.addListener( ** listener.clone() **,this);  

listener.clone()
