import { makeBasicEffectComposer } from './basicEffectComposer.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {
    
    makeBasicEffectComposer();

};
