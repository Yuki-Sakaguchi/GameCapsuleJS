declare const createjs
import { CLASS_NAME, isIos, isAndroid, isMobile } from './util/util'
import { Gacha } from './util/gacha';

/**
 * @class GameCapsule
 */
export default class GameCapsule {
  private options
  private isPause
  private timer
  private totalTime
  private stage
  private isIos
  private isAndroid
  private isMobile
  private parent
  private canvas
  private Gacha

  constructor (options) {
    // オプション
    this.options = {
      target: '#canvas',
      isRetina: true,
      isTouch: true,
      parent: null,
      countDownSeconds: 0, // 秒を入れる
    }

    // オプション上書き
    if (options) {
      Object.keys(options).forEach(key => {
        this.options[key] = options[key]
      })
    }

    this.isIos = isIos
    this.isAndroid = isAndroid
    this.isMobile = isMobile
    this.Gacha = Gacha

    // ポーズ状態かどうか
    this.isPause = false

    // 経過時間
    this.timer = 0
    this.totalTime
    this._initTimer()

    // 初期化処理
    this._initStage()
    
    // リサイズ時の処理
    let resizeTimer
    window.addEventListener('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        this._resizeHandle()
      }, 200)
    })
  }

  /**
   * stageで使う変数の設定
   *    このコンストラクタで作成したインスタンスでinit関数を上書きしてください
   *    stageの更新が始まる前に１度だけ動く処理です
   *    stageで使う変数をthisに定義して、update関数で使えるようにします
   */
  init () {
    throw new Error(CLASS_NAME + 'コンストラクタで作ったインスタンスにinit関数を定義し、stageの更新で使う変数、関数を定義してください。\n※ init関数ではthis.stageでstageにアクセスできます。\n※ init関数では変数をthisに定義すればupdate関数で利用することができます。\n※ update関数で何もつかわない場合でも中身は空っぽで良いのでinit関数を定義してください。')
  }

  /**
   * stage更新のメインループ
   *    このコンストラクタで作成したインスタンスでupdate関数を上書きしてください
   *    fpsを元に処理されるメインループの処理です
   *    init関数で定義した関数を使ってstageを更新します
   *    この関数内で明示的にstage.update関数をする必要はありません
   *    引数には"tick"イベントが入ってきます
   */
  update (event) {
    throw new Error(CLASS_NAME + 'コンストラクタで作ったインスタンスにupdate関数を定義し、メインループ処理を設定してください。\n※ updade関数ではthis.stageでstageにアクセスできます。\n※ updade関数ではinit関数で定義した変数をthis経由で使用できます。\n※ stage.update()はupdade関数の直後に自動で実行されるのでupdate関数内でstege.update()を実行する必要はありません。\n※ update関数の引数には"tick"イベントが入ってきます')
  }

  /**
   * 処理を開始
   *    諸々の初期化を行い、tickイベントでstage.update()を行う
   *    独自に更新処理はupdate()に記述しておく
   */
  play () {
    // fps設定
    createjs.Ticker.init()
    createjs.Ticker.timingMode = createjs.Ticker.RAF

    // 初期設定
    try {
      this.init()
    } catch(e) {
      console.error(e)
      return false
    }

    // 更新処理
    createjs.Ticker.addEventListener('tick', createjs.Tween)
    createjs.Ticker.addEventListener('tick', event => {
      if (this.isPause) return false

      // 独自で拡張した更新処理
      try {
          this.update(event)
      } catch(e) {
        this._clearStage()
        console.error(e)
      }

      this.stage.update()
    })

    // タイマー
    this.timer = setInterval(() => {
      this.totalTime.s++
      this.totalTime.m = Math.floor(this.totalTime.s/60)
    }, 1000)

    // stageの初回更新
    this.stage.update()
  }

  /**
   * stageの更新を止める
   */
  pause () {
    createjs.Ticker.paused = !createjs.Ticker.paused
    this.isPause = !this.isPause
  }

  /**
   * stageを初期化して初めから動かす
   */
  reset () {
    this._clearStage()
    this._initTimer()
    this._initStage()
    this.play()
  }

  /**
   * 総タイムを元に表示用に整形された値を返す
   * @param {boolean} isZeroPadding trueの場合値をゼロ詰めする
   * @return {Object} s, mを持つオブジェクト
   */
  getDispTime (isZeroPadding) {
    var dispTime: any = {
      s: Math.floor(this.totalTime.s%60),
      m: this.totalTime.m,
    }
    if (isZeroPadding) {
      dispTime.s = this.zeroPadding(dispTime.s, 2)
      dispTime.m = this.zeroPadding(dispTime.m, 2)
    }
    return dispTime
  }

  /**
   * 総タイムとoptions.countDownSecondsを元に残り時間を表示用に整形して値を返す
   * @param {boolean} isZeroPadding trueの場合値をゼロ詰めする
   * @return {Object} s, mを持つオブジェクト
   */
  getRemainingTime (isZeroPadding) {
    if (!this.options.countDownSeconds) return false
    var remainingS = this.options.countDownSeconds - this.totalTime.s
    var remainingM = Math.floor(remainingS/60)
    var dispTime: any = {
      s: remainingS,
      m: remainingM,
    }
    if (isZeroPadding) {
      dispTime.s = this.zeroPadding(dispTime.s, 2)
      dispTime.m = this.zeroPadding(dispTime.m, 2)
    }
    return dispTime
  }

  /**
   * isRetinaがtrueのとき、引数にdevicePixelRatioを割って返す
   * @param {number} num 割られる値
   * @return {number} 引数にdevicePixelRatioを割った値
   */
  divisionRetina = function(num) {
    return this.options.isRetina ? num / window.devicePixelRatio : num
  }

  /**
   * ランダムの値を生成
   * @param {number} min 最小値
   * @param {number} max 最大値
   * @return {number} min〜max間のランダムの整数値
   */
  createRandom = function(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  }

  /**
   * ゼロ詰め
   * @param {number} target 対象の数値
   * @param {number} digit けた数
   * @return {string} ゼロ詰めされた文字列
   */
  zeroPadding = function(target, digit) {
    var zero = (function() {
      var tmp = ''
      for (var i = 0; i < digit; i++) tmp += "0"
      return tmp
    })()
    return (zero + target.toString()).slice(-digit)
  }

  /**
   * カウントダウンが完了した場合はtrue, それ以外はfalse
   *    trueの時には'countDownComplete'イベントが発火
   */
  isCountDownComplete () {
    if (!this.options.countDownSeconds) return false
    if (this.totalTime.s > this.options.countDownSeconds) {
      // カスタムイベントを発火
      var eventCountDownComplete = document.createEvent('HTMLEvents')
      eventCountDownComplete.initEvent('countDownComplete', true, false)
      window.dispatchEvent(eventCountDownComplete)
      return true
    }
    return false
  }

  /**
   * stageを全てクリアする
   */
  _clearStage () {
    this.isPause = createjs.Ticker.paused = false
    createjs.Ticker.removeEventListener("tick", this.stage)
    createjs.Ticker.reset()
    this.stage.removeAllChildren()
    createjs.Tween.removeAllTweens()
    this.stage.clear()
  }

  /**
   * タイマーを初期化
   */
  _initTimer () {
    clearTimeout(this.timer)
    this.totalTime = {
      s: 0,
      m: 0,
    }
  }

  /**
   * stageインスタンスを生成
   */
  _initStage () {
    // 要素の初期化
    this.parent = this.options.parent ? document.querySelector(this.options.parent) : null
    this.canvas = document.querySelector(this.options.target)
    this.canvas.style.setProperty('-webkit-tap-highlight-color', 'rgba(0, 0, 0, 0)') // クリックしてもハイライトしないようにする

    // ステージの初期化
    this.stage = null
    this.stage = new createjs.Stage(this.options.target.replace(/(.|#)/, ''))
    this._setCanvasSize()
    if (this.options.isRetina) this._devicePixelRatio()
    if (this.options.islTouch && createjs.Touch.isSupported()) createjs.Touch.enable(this.stage)
  }

  /**
   * canvasとstageのサイズを設定
   */
  _setCanvasSize () {
    if (this.parent) {
      // 親が設定されていれば親に大きさを揃える
      this.stage.canvas.width = this.canvas.width = this.parent.clientWidth
      this.stage.canvas.height = this.canvas.height = this.parent.clientHeight
    } else {
      // 親が設定されていなければ画面いっぱいの大きさにセット
      this.stage.canvas.width = this.canvas.width = window.innerWidth
      this.stage.canvas.height = this.canvas.height = window.innerHeight
    }
  }

  /**
   * Retinaに対応
   */
  _devicePixelRatio () {
    if (window.devicePixelRatio) {
      var tmpW = this.canvas.width
      var tmpH = this.canvas.height
      this.canvas.width = tmpW * window.devicePixelRatio
      this.canvas.height = tmpH * window.devicePixelRatio
      this.canvas.style.width = tmpW + 'px'
      this.canvas.style.height = tmpH + 'px'
      this.stage.scaleX = this.stage.scaleY = window.devicePixelRatio
    }
  }

  /**
   * リサイズ時の処理
   */
  _resizeHandle () {
    this._setCanvasSize()
    if (this.options.isRetina) this._devicePixelRatio()
  }
}
