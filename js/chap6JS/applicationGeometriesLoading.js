import { makeConvexGeometries } from './convexGeometries.js'


// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */

window.onload = function() {
    
    // convexアニメーション生成処理
    makeConvexGeometries();

}