// 球体アニメーションJS
import { makeSquare } from './square.js'
import { makeScene,addCube  } from './scene.js'
import { makeGeometry } from './geometry.js';
import { makeCustomGeometry } from './custom.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/**
 * オンロード関数
 */
window.onload = function() {

    // 球体アニメーションを生成する
    makeSquare();

    // 立方体アニメーション生成
    makeScene();

    // ジオメトリアニメーション生成
    makeGeometry();

    // カスタムジオメトリアニメーション生成
    makeCustomGeometry();

}

const add = () => {
    addCube();
};