import { makeNormalMap } from './normalMap.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {
    
    // ノーマルマップアニメーションを生成する
    makeNormalMap();
}
