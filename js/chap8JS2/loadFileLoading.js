import { loadObjMtl } from  './loadObjMtl.js'
import { loadCollada } from './loadCollada.js'
import { loadStl } from './loadStl.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {

    // MTLオブジェクトアニメーションを生成する
    loadObjMtl();

    // Colladaアニメーションを生成する
    loadCollada();

    // stlアニメーションを生成する
    loadStl();

}