import { makeAmbientAnimation } from './ambientLight.js'
import { makePointLight } from './pointLight.js'
import { makeSpotLight } from './spotLight.js'
import { makeDirectionalLight } from './directionalLight.js'
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

    // 点光源アニメーションを生成する
    makePointLight();

    // スポットライトアニメーションを生成する
    makeSpotLight();

    // 直接光アニメーションを生成する
    makeDirectionalLight();

};
