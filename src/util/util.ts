/**
 * @fileoverview 共通関数
 */

export const CLASS_NAME = 'GameCapsule'
export const isIos = /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
export const isAndroid = navigator.userAgent.indexOf('Android') > 0
export const isMobile = isIos || isAndroid
