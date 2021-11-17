import { makeBasicTextureDds } from './basicTextureDds.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {

    // DDSテクスチャアニメーションを生成する
    makeBasicTextureDds();

};
