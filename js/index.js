// 球体アニメーションJS
import { makeSquare } from './square.js'
// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/**
 * オンロード関数
 */
window.onload = function() {

    // 球体アニメーションを生成する
    makeSquare();

}