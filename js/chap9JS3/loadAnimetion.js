import { makeAnimationBlender } from './animationBlender.js'
import { makeAnimationCollada } from './animationCollada.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {

    // Blenderアニメーションを生成する
    makeAnimationBlender();

    // // Colladaアニメーションを生成する
    // makeAnimationCollada();

};