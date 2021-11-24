import { makeUvMappingManual } from './uvMappingManual.js'
import { makeUvMapping       } from './uvMapping.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {
    
    // // UVマッピングマニュアルアニメーションを生成する
    // makeUvMappingManual();

    // UVマッピングアニメーションを生成する
    makeUvMapping();

}
