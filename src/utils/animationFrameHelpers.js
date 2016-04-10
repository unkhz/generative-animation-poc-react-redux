/**
 * Cross-browser requestAnimationFrame
 */
export const requestAnimationFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  ((cb: func) => setTimeout(cb,1));

/**
 * Cross-browser cancelAnimationFrame
 */
export const cancelAnimationFrame = window.cancelAnimationFrame ||
  window.webkitCancelRequestAnimationFrame ||
  window.mozCancelRequestAnimationFrame ||
  window.oCancelRequestAnimationFrame ||
  window.msCancelRequestAnimationFrame ||
  clearTimeout;
