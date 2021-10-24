import { make2dPlaneGeometries } from './2dPlaneGeometries.js'


// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {
    
    make2dPlaneGeometries();

};