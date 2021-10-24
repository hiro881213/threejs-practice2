import { makePhongMaterial    } from './meshphongMaterial.js'
import { makeShaderMaterial   } from './meshShaderMaterial.js'
import { makeLineMaterial     } from './meshLineMaterial.js'
import { makeDachLineMaterial } from './meshDashLineMaterial.js'
import { makeStandardMaterial } from './meshStandardMaterial.js'

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

    // ラインマテリアルアニメーション
    makeLineMaterial();

    // ダッシュラインマテリアルアニメーション
    makeDachLineMaterial();

    // スタンダードマテリアルアニメーション
    makeStandardMaterial();

}
