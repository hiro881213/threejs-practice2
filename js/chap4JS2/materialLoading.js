import { makePhongMaterial } from './meshphongMaterial.js'
import { makeShaderMaterial } from './meshShaderMaterial.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */

window.onload = function() {
    
    // Phongマテリアルアニメーションd
    makePhongMaterial();

    // シェーダーマテリアルアニメーション
    makeShaderMaterial();
}
