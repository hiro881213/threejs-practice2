import { makeParticles } from './particles.js'
import { makeParticleWebGL } from './particleWebGL.js'
import { makeBasicPointCloud } from './basicPointCloud.js'
import { makeProgramBasedSprites } from './programBasedSprites.js'

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

    // ポイントクラウドアニメーションを生成する
    makeBasicPointCloud();

    // プログラマブルスピリットアニメーションを生成する
    makeProgramBasedSprites();

    // 5a 5b NG
};