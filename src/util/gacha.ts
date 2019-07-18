/**
 * ガチャガチャ
 * @param {Object} list 設定用オブジェクト
 * @param {string} key パーセントを取り出すキー名
 * @constructor
 */
export class Gacha {
  private list
  private key
  private totalWeight

  constructor (list, key) {
    this.list = list
    this.key = key
    this.totalWeight = (() => {
      let sum = 0
      list.forEach(target => sum += target[key])
      return sum
    })()
  }

  /**
   * ガチャを引く
   */
  draw () {
    let r = Math.random() * this.totalWeight
    let s = 0.0
    for (let list in this.list) {
      let target = this.list[list]
      s += target[this.key]
      if (r < s) return target
    }
  }
}
