import { loadObjMtl } from './loadObjMtl.js'

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

}