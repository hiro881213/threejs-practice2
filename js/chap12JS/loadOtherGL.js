import { makeBasicScene } from './basicScene.js'
import { makeMaterialProperties } from './materialProperties.js'
import { makeShapes } from './shape.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {

    makeBasicScene();
    // makeMaterialProperties();
    // makeShapes()

};
