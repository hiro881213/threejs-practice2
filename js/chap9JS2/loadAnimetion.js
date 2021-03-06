import { makeFirstPersonCamera } from './firstPersonCamera.js'
import { makeControlsOrbit } from './controlsOrbit.js'
import { makeMorphTraget } from './morphTartget.js'
import { makeMorphTragetManually } from './morphTargetManually.js'
import { makeBonesManually } from './bonesManually.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {
    
    // ファーストパーソンカメラアニメーションを生成する
    makeFirstPersonCamera();

    // // controlsOrbitアニメーションを生成する
    // makeControlsOrbit();

    // MorphTragetアニメーション
    makeMorphTraget();


    // MorphTragetManuallyアニメーション
    makeMorphTragetManually();

    // makeBonesManuallyアニメーション
    makeBonesManually();

};