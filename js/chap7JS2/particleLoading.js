import { makeRainyScene } from './rainyScene.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {

    // レイニーシーンアニメーションを生成する
    makeRainyScene();
};