import { makeBasicEffectComposer  } from './basicEffectComposer.js'
import { makePostProcessingSimple } from './postProcessingSimple.js'
import { makeGlitchPass           } from './glitchPass.js'
import { makePostProcessingMasks  } from './postProcessingMasks.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {

    // makeBasicEffectComposer();
    // makePostProcessingSimple();
    makeGlitchPass();
    // makePostProcessingMasks();

};
