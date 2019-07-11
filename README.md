# GameCapsuleJS
create.jsに依存したフレームワーク  
処理の作成に集中できるよう、その他気にしないといけないことはこれがやってくれる  

# やってくれること
- 画面のリサイズ時に画面幅に合わせてcanvasをリサイズ
- オプションのisRetinaが有効のとき、devicePixelRatioに合わせてcanvasサイズを調整（1x, 2x, 3xでも見た目は全て同じになる）
- 動きを止めたり、全てを初期化してリスタートする機能を用意
- モバイルチェック関数
- ランダムな値生成関数

# DEMO
https://yuki-sakaguchi.github.io/GameCapsuleJS/example/particleCircle/index.html

# 使い方
1) このクラスでインスタンスを生成する
2) 生成されたインスタンスにinit関数(canvas上で使う変数の定義)とupdate関数(fpsに合わせたstageの更新処理)を定義する
3) play関数を実行すると動きだす
4) 動きを止めたいときはpause関数をを実行。止まっている時に再びpause関数を実行すると動きだす
5) 全てを初期化して初めから動かし直したいときはreset関数を実行

```
<!-- デフォルトではcanvas[id="canvas"]が対象 -->
<canvas id="canvas"></canvas>

<!-- 依存しているcreate.jsとgame-capsule.jsを読み込む -->
<script src="https://code.createjs.com/1.0.0/createjs.min.js"></script>
<script src="js/plugins/game-capsule.js"></script>
```

```
/**
 * まずはインスタンス生成
 */
// オプションで色々設定できる
var moveCircle = new GameCapsule({
  target: '#canvas', // ターゲットのElement
  isRetina: true, // レティナに対応するかどうか
  isTouch: true, // stageのタッチイベントを有効にするかどうか 
  fps: 60, // 画面の描画頻度
  parent: "#parent" // canvasの大きさを決める親要素
}); 

/**
 *  stageで使う変数などを定義
 */
moveCircle.init = function() {
  // updateで使いたい関数はこんな感じ
  this.move = function() {
    shape.x += 1;
  };

  // ローカルの関数
  function addShape() {
    var shape = new createjs.Shape();
    shape.graphics.beginFill("DarkRed").drawCircle(0, 0, 30);
    return shape;
  }

  // 変数はこんな感じ
  var shape = addShape();
  shape.x = this.divisionRetina(this.stage.canvas.width) / 2; // divisionRetina()はRetina対応によりずれる値を調整する関数
  shape.y = this.divisionRetina(this.stage.canvas.height) / 2;
  this.stage.addChild(shape);
};

/**
 * メインループ（stage.update()は自動でやるので不要）
 */
moveCircle.update = function(e) {
  this.move();
};
```
以下のように外部から再生を制御できる
```
window.addEventListener('load', function() {
  moveCircle.play(); // load後自動で再生

  // ポーズボタンで動きを止める
  document.querySelector('.js-pause').addEventListener('click', function() {
    moveCircle.pause();
  });

  // リセットボタンでリセット
  document.querySelector('.js-reset').addEventListener('click', function() {
    moveCircle.reset();
  });
});
```

## オプション
GameCapsuleコンストラクタでインスタンスを生成する際に渡せるオプション

### target
対象のcanvas  
デフォルトは`#canvas`  

### isRetina
window.devicePixelRatioに応じてcanvasやstageの倍率を変えるかどうか  
これがtrueだとRetinaの端末で画像がボケたりしない  
デフォルトは`true`  

### isTouch
stageをタッチイベントをつけるかどうか  
デフォルトは`true`  

### fps
canvasを描画するフレームレートの設定  
デフォルトは`60`

### parent
canvasの大きさを決める親要素  
ここに指定した要素を元に、canvasの大きさを決める  
親の指定がなければブラウザ幅を元にする  
デフォルトは`null`

## プロパティ
GameCapsuleコンストラクタで生成されたインスタンスが持つプロパティ

### isIos
iPad, iPhone, iPodの場合`true`, それ以外`false`
```
GameCapsule.isIos; //-> true or false
```
### isAndroid
Android端末の場合`true`, それ以外`false`
```
GameCapsule.isAndroid; //-> true or false
```
### isMobile
iPad, iPhone, iPod, Androidのいずれかの場合`true`, それ以外`false`
```
GameCapsule.isMobile; //-> true or false
```

### totalTime
play関数を実行してからの時間を取得できる  
```
GameCapsule.totalTime; //-> {ms: 17260, s: 172, m: 2}
```

## メソッド
GameCapsuleコンストラクタで生成されたインスタンスが使えるメソッド

### play
init関数実行後、update処理を開始
```
GameCapsule.play();
```

### pause
update処理を止める  
update処理が止まっている状態で実行すると再び動き出す
```
GameCapsule.pause();
```

### reset
stageを全て初期化して、play関数を実行し直す
```
GameCapsule.reset();
```

### getDispTime
totalTimeを元に表示用に整形した値を取得  
引数にtrueを入れるとゼロ詰めされた状態で取得
```
GameCapsule.getDispTime(); //-> {ms: 9, s: 16, m: 5}
GameCapsule.getDispTime(true); //-> {ms: "09", s: "16", m: "05"}
```

### divisionRetina
引数の値をwindow.devicePixelRatioで割って返す  
isRetinaがtrueの場合、stageとcanvasがブラウザによって倍率が変わってしまうので、そこらへんを揃えるために使う
```
// window.devicePixelRatio -> 2の場合
GameCapsule.divisionRetina(100); //-> 50
```

### createRandom
第１引数と第２引数の間の整数をランダムで生成する
```
GameCapsule.createRandom(1, 10); //-> 1〜10のどれかの整数
```

### zeroPadding
数字のゼロ詰め  
第１引数にターゲットの数値、第２引数には桁数を入れる
```
GameCapsule.zeroPadding(33, 5); //-> 00033
```