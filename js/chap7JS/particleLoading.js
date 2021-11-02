import { makeParticles } from './particles.js'
import { makeParticleWebGL } from './particleWebGL.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {
    
    // パーティクルアニメーションを生成する
//    makeParticles();

    // パーティクルWebGLアニメーションを生成する
    makeParticleWebGL();

};