# GameCapsuleJS
create.jsに依存したゲーム作成用フレームワーク  
ゲームのメイン処理の作成に集中できるよう、その他気にしないといけないことはこれがやってくれる

# やってくれること
- ウィンドウサイズのcanvasを生成
- リサイズイベントに合わせて画面幅をリサイズ
- Retina対応
- ゲームの開始、停止、再開、終了する機能
- デバイスチェック
- ランダムな値生成関数
- カウントダウン

# DEMO
https://yuki-sakaguchi.github.io/GameCapsuleJS/example/es2015/index.html

# 使い方
## 準備
`canvas`要素を定義し、必要なファイルを読み込む
```
<!-- デフォルトではcanvas[id="canvas"]が対象 -->
<canvas id="canvas"></canvas>

<!-- 依存しているcreate.jsとgame-capsule.jsを読み込む -->
<script src="https://code.createjs.com/1.0.0/createjs.min.js"></script>
<script src="js/plugins/game-capsule.js"></script>
```

## 実装
### ES2015
1. `GameCapsule`クラスをextendsしたクラスを定義する
2. 定義したクラスに`init`メソッド(canvas上で使う変数の定義)と`update`メソッド(fpsに合わせたstageの更新処理)を定義する
3. `play`メソッドを実行すると動きだす
4. 動きを止めたいときは`pause`メソッドをを実行。止まっている時に再び`pause`メソッドを実行すると動きだす
5. 全てを初期化して初めから動かし直したいときは`reset`メソッドを実行
```
/**
 * GameCapsuleを継承したクラスを定義
 */
class Game extends GameCapsule {
  constructor (options) {
    super(options)
  }

  /**
  *  stageで使う変数などを定義
  */
  init () {
    // updateで使いたい変数や関数はthisで定義する
    this.move = function() {
      shape.x += 1
    }

    // このスコープで使うだけのものはvarで良い
    var shape = new createjs.Shape()
    shape.graphics.beginFill('DarkRed').drawCircle(0, 0, 30)
    shape.x = this.divisionRetina(this.stage.canvas.width) / 2 // divisionRetina()はRetina対応によりずれる値を調整する関数
    shape.y = this.divisionRetina(this.stage.canvas.height) / 2
    this.stage.addChild(shape)
  }

  /**
  * メインループ（stage.update()は自動でやるので不要）
  */
  update () {
    this.move()
  }
}

// インスタンスを作成する
var game = new Game({
  target: '#canvas',
  isRetina: true,
  isTouch: true,
  parent: '#parent',
  countDownSeconds: 30
})
```


### ES5
1. `GameCapsule`クラスでインスタンスを生成する
2. 生成されたインスタンスに`init`メソッド(canvas上で使う変数の定義)と`update`メソッド(fpsに合わせたstageの更新処理)を定義する
3. `play`メソッドを実行すると動きだす
4. 動きを止めたいときは`pause`メソッドをを実行。止まっている時に再び`pause`メソッドを実行すると動きだす
5. 全てを初期化して初めから動かし直したいときは`reset`メソッドを実行
```
/**
 * まずはインスタンス生成
 */
// オプションで色々設定できる
var game = new GameCapsule({
  target: '#canvas',
  isRetina: true,
  isTouch: true,
  parent: '#parent',
  countDownSeconds: 30
})

/**
 *  stageで使う変数などを定義
 */
game.init = function() {
  // updateで使いたい変数や関数はthisで定義する
  this.move = function() {
    shape.x += 1
  }

  // このスコープで使うだけのものはvarで良い
  var shape = new createjs.Shape()
  shape.graphics.beginFill('DarkRed').drawCircle(0, 0, 30)
  shape.x = this.divisionRetina(this.stage.canvas.width) / 2 // divisionRetina()はRetina対応によりずれる値を調整する関数
  shape.y = this.divisionRetina(this.stage.canvas.height) / 2
  this.stage.addChild(shape)
}

/**
 * メインループ（stage.update()は自動でやるので不要）
 */
game.update = function(e) {
  this.move()
}
```

## 実行
以下のように外部から再生を制御できる
```
window.addEventListener('load', function() {
  game.play() // load後自動で再生

  // ポーズボタンで動きを止める
  document.querySelector('.js-pause').addEventListener('click', function() {
    game.pause()
  });

  // リセットボタンでリセット
  document.querySelector('.js-reset').addEventListener('click', function() {
    game.reset()
  })
})
```

# 使い方詳細
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
### parent
canvasの大きさを決める親要素  
ここに指定した要素を元に、canvasの大きさを決める  
親の指定がなければブラウザ幅を元にする  
デフォルトは`null`
### countDownSeconds
ゲーム開始から終了までのカウントダウンをする場合に使う  
設定できる単位は秒  
設定した秒数が経過した後に`isCountDownComplete`メソッドを実行するとtrueが帰ってくる  
デフォルトは`0`（カウントダウンしない）

## プロパティ
gameCapsuleコンストラクタで生成されたインスタンスが持つプロパティ
### isIos
iPad, iPhone, iPodの場合`true`, それ以外`false`
```
gameCapsule.isIos; //-> true or false
```
### isAndroid
Android端末の場合`true`, それ以外`false`
```
gameCapsule.isAndroid; //-> true or false
```
### isMobile
iPad, iPhone, iPod, Androidのいずれかの場合`true`, それ以外`false`
```
gameCapsule.isMobile; //-> true or false
```
### isPause
ゲームがポーズ状態の場合`true`, それ以外`false`
```
gameCapsule.isPause; //-> true or false
```
### totalTime
play関数を実行してからの時間を取得できる  
```
gameCapsule.totalTime; //-> {ms: 17260, s: 172, m: 2}
```

## メソッド
gameCapsuleコンストラクタで生成されたインスタンスが使えるメソッド
### play
init関数実行後、update処理を開始
```
gameCapsule.play();
```
### pause
update処理を止める  
update処理が止まっている状態で実行すると再び動き出す
```
gameCapsule.pause();
```
### reset
stageを全て初期化して、play関数を実行し直す
```
gameCapsule.reset();
```
### getDispTime
totalTimeを元に表示用に整形した値を取得  
引数にtrueを入れるとゼロ詰めされた状態で取得
```
gameCapsule.getDispTime(); //-> {ms: 9, s: 16, m: 5}
gameCapsule.getDispTime(true); //-> {ms: "09", s: "16", m: "05"}
```
### isCountDownComplete
オプションで`countDownSeconds`を設定しているときに使うことができる  
設定した秒数が過ぎてからこのメソッドを実行すると`true`が返される  
時間が過ぎていない場合、またはcountDownSecondsを設定していない場合は`false`が返される
```
gameCapsule.isCountDownComplete() //-> true or false
```
### divisionRetina
引数の値をwindow.devicePixelRatioで割って返す  
isRetinaがtrueの場合、stageとcanvasがブラウザによって倍率が変わってしまうので、そこらへんを揃えるために使う
```
// window.devicePixelRatio -> 2の場合
gameCapsule.divisionRetina(100); //-> 50
```
### createRandom
第１引数と第２引数の間の整数をランダムで生成する
```
gameCapsule.createRandom(1, 10); //-> 1〜10のどれかの整数
```
### zeroPadding
数字のゼロ詰め  
第１引数にターゲットの数値、第２引数には桁数を入れる
```
gameCapsule.zeroPadding(33, 5); //-> 00033
```