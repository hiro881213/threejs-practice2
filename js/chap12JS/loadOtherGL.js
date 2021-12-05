import { makeBasicScene } from './basicScene.js'
import { makeMaterialProperties } from './materialProperties.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {

    makeBasicScene();
    makeMaterialProperties();

};
