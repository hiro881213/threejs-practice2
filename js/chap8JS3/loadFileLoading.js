import { loadPdb } from './loadPdb.js'
import { loadPly } from './loadPly.js'

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

    // PLYアニメーションを生成する
    loadPly();

}
