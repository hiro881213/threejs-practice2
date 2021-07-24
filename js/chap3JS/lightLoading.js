import { makeAmbientAnimation } from './ambientLight.js'
import { makePointLight } from './pointLight.js'
// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */

window.onload = function() {

    // 環境光アニメーションを生成する
    makeAmbientAnimation();

    // スポットライトアニメーションを生成する
    makePointLight();

};
