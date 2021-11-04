import { makeRainyScene } from './rainyScene.js'
import { makeSnowyScene } from './snowyScene.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {

    // レイニーシーンアニメーションを生成する
    // makeRainyScene();

    // スノーシーンアニメーションを生成する
    makeSnowyScene();

};