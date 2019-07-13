/**
 * @class GameCapsule
 */
export default class GameCapsule {
    private options;
    private timer;
    private stage;
    private parent;
    private canvas;
    Gacha: any;
    isIos: any;
    isAndroid: any;
    isMobile: any;
    isPause: any;
    totalTime: any;
    constructor(options: any);
    /**
     * stageで使う変数の設定
     *    このコンストラクタで作成したインスタンスでinit関数を上書きしてください
     *    stageの更新が始まる前に１度だけ動く処理です
     *    stageで使う変数をthisに定義して、update関数で使えるようにします
     */
    init(): void;
    /**
     * stage更新のメインループ
     *    このコンストラクタで作成したインスタンスでupdate関数を上書きしてください
     *    fpsを元に処理されるメインループの処理です
     *    init関数で定義した関数を使ってstageを更新します
     *    この関数内で明示的にstage.update関数をする必要はありません
     *    引数には"tick"イベントが入ってきます
     */
    update(event: any): void;
    /**
     * 処理を開始
     *    諸々の初期化を行い、tickイベントでstage.update()を行う
     *    独自に更新処理はupdate()に記述しておく
     */
    play(): boolean;
    /**
     * stageの更新を止める
     */
    pause(): void;
    /**
     * stageを初期化して初めから動かす
     */
    reset(): void;
    /**
     * 総タイムを元に表示用に整形された値を返す
     * @param {boolean} isZeroPadding trueの場合値をゼロ詰めする
     * @return {Object} s, mを持つオブジェクト
     */
    getDispTime(isZeroPadding: any): any;
    /**
     * 総タイムとoptions.countDownSecondsを元に残り時間を表示用に整形して値を返す
     * @param {boolean} isZeroPadding trueの場合値をゼロ詰めする
     * @return {Object} s, mを持つオブジェクト
     */
    getRemainingTime(isZeroPadding: any): any;
    /**
     * isRetinaがtrueのとき、引数にdevicePixelRatioを割って返す
     * @param {number} num 割られる値
     * @return {number} 引数にdevicePixelRatioを割った値
     */
    divisionRetina: (num: any) => any;
    /**
     * ランダムの値を生成
     * @param {number} min 最小値
     * @param {number} max 最大値
     * @return {number} min〜max間のランダムの整数値
     */
    createRandom: (min: any, max: any) => number;
    /**
     * ゼロ詰め
     * @param {number} target 対象の数値
     * @param {number} digit けた数
     * @return {string} ゼロ詰めされた文字列
     */
    zeroPadding: (target: any, digit: any) => string;
    /**
     * カウントダウンが完了した場合はtrue, それ以外はfalse
     *    trueの時には'countDownComplete'イベントが発火
     */
    isCountDownComplete(): boolean;
    /**
     * stageを全てクリアする
     */
    _clearStage(): void;
    /**
     * タイマーを初期化
     */
    _initTimer(): void;
    /**
     * stageインスタンスを生成
     */
    _initStage(): void;
    /**
     * canvasとstageのサイズを設定
     */
    _setCanvasSize(): void;
    /**
     * Retinaに対応
     */
    _devicePixelRatio(): void;
    /**
     * リサイズ時の処理
     */
    _resizeHandle(): void;
}
