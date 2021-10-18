import { makePhongMaterial } from './meshphongMaterial.js'


// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */

window.onload = function() {
    makePhongMaterial();
}
