import { makeExtrudeSvgGeometries } from './extudeSvgGeometries.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */

window.onload = function() {
    
    // extrudeSvgアニメーションを生成する
    makeExtrudeSvgGeometries();

}