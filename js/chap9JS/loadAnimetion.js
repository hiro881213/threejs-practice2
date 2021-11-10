import { makeBasicAnimation } from './basicAnimation.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {
    
    // ベーシックアニメーションを生成する
    makeBasicAnimation();

};