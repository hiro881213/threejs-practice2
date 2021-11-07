import { loadPdb } from './loadPdb.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {
    
    // PDBアニメーションを生成する
    loadPdb();

}
