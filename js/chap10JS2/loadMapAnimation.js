import { makeNormalMap } from './normalMap.js'
import { makeLightMap  } from './lightMap.js'


// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {
    
    // // ノーマルマップアニメーションを生成する
    // makeNormalMap();
    
    // ライトマップアニメーションを生成する
    makeLightMap();

}
