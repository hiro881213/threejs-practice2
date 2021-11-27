import { canvasTextureBumpMap  } from './canvasTextureBumpMap.js'
import { makeVideoTextureAlter } from './videoTextureAlter.js'
// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {

    // // CanvasBumpマップアニメーション
    // canvasTextureBumpMap();

    makeVideoTextureAlter();
}
