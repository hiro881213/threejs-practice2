import { makeSimpleShaderPass } from './simpleShaderPass.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {

    // シェーダーパスアニメーション生成処理
    makeSimpleShaderPass();

};
