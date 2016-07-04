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

#### listener.clone()
 cc.eventManager.addListener( ** listener.clone() **,this);  
イベントリスナーは１度しか追加することができません。イベントリスナーに登録フラグを設定し、フラグがすでに設定されている場合には、再度イベントリスナを登録できない仕組みになっています。  
そこで、clone（） を用いてリスナーを複製し、各タイルに独自のリスナを持たせています。  

  ----
## ○その場でスプライトを変更する  
- 外部変数の画像の番号を配列で定義する  
`var gameArray = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7];
`  

- pictureValueというプロパティを定義して、値を入れている（ ** ここでやるのは本来はＮＧだ～ ** ）  
`tile.pictureValue = gameArray[i];
`  

- 別の画像を割り当てる処理  
target.initWithFile("res/tile_"+target.pictureValue+".png");


## ○２つのタイルを選択し、一致したらカードを削除する処理

var gameArray = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7];  
  **  var pickedTiles = []; **  
  選択されたカードを一時保管する配列です  

swallowTouches: true,  
onTouchBegan: function (touch, event) {  
**  if (pickedTiles.length < 2) {  **
  //選択されたカードが２枚以内ならば
    var target = event.getCurrentTarget();  
    var location =  target.convertToNodeSpace(touch.getLocation());  
    var targetSize = target.getContentSize();  
    var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);  
    if (cc.rectContainsPoint(targetRectangle, location)) {
        console.log("I piced a tile!!");  
        console_label.setString("pictueValue:"+target.pictureValue);  
        // 一秒後に消える  
     setTimeout(function() {  
         console_label.setString("");  
     }, 1500);  
     //別の画像を割り当てる処理  
     target.initWithFile("res/tile_"+target.pictureValue+".png");  
     // 配列に登録  
     ** pickedTiles.push(target); **
//2枚のカードを選択したら　checkTilesを実行する
    ** if(pickedTiles.length == 2){ **  
    **   checkTiles();  **
     }   
    }  
### ○　checkＴiles  

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
  1. プレイヤーがタイルを記憶する時間を与えるため　checkTiles関数は２秒待機する  
  2. 一致しない場合、再びタイルを背景画像に変更することでタイルを裏返す  
  3. ゲームから選択したカードを removeChildメソッドを用いて削除する
  4. どちらの場合にも　pickedTiles配列を空にして、プレイヤーが新しいタイルを選択できるようにする
