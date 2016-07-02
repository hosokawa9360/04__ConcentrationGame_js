###　格子状に画像を配置する

for(i=0;i<16;i++){  
  var tile = cc.Sprite.create(res.cover_png);  
  this.addChild(tile,0);  
   //タイルを格子状に配置する計算式  
  tile.setPosition(49+i%4*74,400-Math.floor(i/4)*74);  
}  

### 背景にグラデーションを表示する
//グラデーションを追加  
`var gradient = cc.LayerGradient.create(cc.color(0,0,0,255),cc.color(0x46,0x82,0xB4,255));  
`this.addChild(gradient);  
