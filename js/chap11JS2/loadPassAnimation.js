import { makeSimpleShaderPass } from './simpleShaderPass.js'
import { makeBlurShaderPass   } from './blurShadePass.js'
import { makeAdvancedShaderPass } from './advancedShaderPass.js';
import { makeCustomShaderPass } from './customShaderPass.js';

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {

    // // シェーダーパスアニメーション生成処理
    // makeSimpleShaderPass();

    // // ブラーシェーダーパスアニメーション生成
    // makeBlurShaderPass();

    // // アドバンスシェーダーアニメーション
    // makeAdvancedShaderPass();

    // カスタムシェーダーアニメーション生成
    makeCustomShaderPass();

};
