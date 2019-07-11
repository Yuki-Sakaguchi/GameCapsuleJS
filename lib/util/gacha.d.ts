/**
 * * ガチャガチャ
 * @param {Object} list 設定用オブジェクト
 * @param {string} key パーセントを取り出すキー名
 * @constructor
 */
export declare class Gacha {
    private list;
    private key;
    private totalWeight;
    constructor(list: any, key: any);
    /**
     * ガチャを引く
     */
    draw(): any;
}
