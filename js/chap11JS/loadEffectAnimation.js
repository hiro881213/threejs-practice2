import { makeBasicEffectComposer  } from './basicEffectComposer.js'
import { makePostProcessingSimple } from './postProcessingSimple.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {

    // makeBasicEffectComposer();

    makePostProcessingSimple();

};
