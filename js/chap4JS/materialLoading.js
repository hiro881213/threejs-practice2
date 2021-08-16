import { makeBasicMaterial } from './meshBasicMaterial.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */

window.onload = function() {

    // 通常マテリアルアニメーション生成処理
    makeBasicMaterial();

}
