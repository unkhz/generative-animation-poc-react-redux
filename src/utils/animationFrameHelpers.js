/**
 * Cross-browser requestAnimationFrame
 *
 * @external
 * @type {Function}
 * @private
 */
export const requestAnimationFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  ((cb) => setTimeout(cb,1));

/**
 * Cross-browser cancelAnimationFrame
 *
 * @external
 * @type {Function}
 * @private
 */
export const cancelAnimationFrame = window.cancelAnimationFrame ||
  window.webkitCancelRequestAnimationFrame ||
  window.mozCancelRequestAnimationFrame ||
  window.oCancelRequestAnimationFrame ||
  window.msCancelRequestAnimationFrame ||
  clearTimeout;
