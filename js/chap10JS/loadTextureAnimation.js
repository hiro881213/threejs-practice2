import { makeBasicTextureDds } from './basicTextureDds.js'
import { makeBasicTexturePvr } from './basicTexturePvr.js'
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

    // PVRテクスチャアニメーションを生成する
    makeBasicTexturePvr();

};
