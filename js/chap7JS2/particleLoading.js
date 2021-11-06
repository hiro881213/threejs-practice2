import { makeRainyScene } from './rainyScene.js'
import { makeSnowyScene } from './snowyScene.js'
import { makeSprites    } from './sprites.js'
import { makeSprites3D  } from './spirites3D.js'

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

    // // スノーシーンアニメーションを生成する
    // makeSnowyScene();

    // // スプリッツアニメーションを生成する
    // makeSprites();

    // スピリッツ3Dアニメーションを生成する
    makeSprites3D();

};