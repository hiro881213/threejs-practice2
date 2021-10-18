import { makeBasicMaterial } from './meshBasicMaterial.js'
import { makeDepthMaterial } from './depthMaterial.js'
import { makeCombinedMaterial } from './combinedMaterial.js'
import { makeNormalMaterial } from './meshNormalMaterial.js'
import { makeMultiMaterial } from './meshMultiMaterial.js'
import { makeLambertMaterial } from './meshLambertMaterial.js'

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

    // Depthマテリアルアニメーション生成処理
    makeDepthMaterial();

    // Combineマテリアルアニメーション生成処理
    makeCombinedMaterial();

    // Normalマテリアルアニメーション生成処理
    makeNormalMaterial();

    // Multiマテリアルアニメーション生成処理
    makeMultiMaterial();

    // Lambertマテリアルアニメーション生成処理
    makeLambertMaterial();

}
