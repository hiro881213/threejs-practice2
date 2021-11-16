import { makeAnimationBlender } from './animationBlender.js'
import { makeAnimationCollada } from './animationCollada.js'
import { makeAnimationMd2     } from './animationMd2.js'
import { makeGltf } from './animationGltf.js'

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

    // // MD2アニメーションを生成する
    // makeAnimationMd2();

    // // gftfアニメーションを生成する
    // makeGltf();

};