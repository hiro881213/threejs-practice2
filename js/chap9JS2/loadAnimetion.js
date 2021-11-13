import { makeFirstPersonCamera } from './firstPersonCamera.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {
    
    // ファーストパーソンカメラアニメーションを生成する
    makeFirstPersonCamera();

};