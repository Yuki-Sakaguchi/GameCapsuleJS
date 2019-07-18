/**
 * @fileoverview 共通関数
 */

export const CLASS_NAME = 'GameCapsule'
export const isIos = /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
export const isAndroid = navigator.userAgent.indexOf('Android') > 0
export const isMobile = isIos || isAndroid

/**
 * ランダムの値を生成
 * @param {number} min 最小値
 * @param {number} max 最大値
 * @return {number} min〜max間のランダムの整数値
 */
export const createRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

/**
 * ゼロ詰め
 * @param {number} target 対象の数値
 * @param {number} digit けた数
 * @return {string} ゼロ詰めされた文字列
 */
export const zeroPadding = (target, digit) => {
  let zero = (() => {
    let tmp = ''
    for (let i = 0; i < digit; i++) tmp += '0'
    return tmp
  })()
  return (zero + target.toString()).slice(-digit)
}