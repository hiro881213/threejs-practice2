// 球体アニメーションJS
import { makeSquare } from './square.js'
import { makeScene,addCube  } from './scene.js'
import { makeGeometry } from './geometry.js'
import { makeCustomGeometry } from './custom.js'
import { makePropMesh } from './meshProp.js'
import { makeMultiCamera } from './multiCamera.js'

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

    // メッシュプロパティアニメーション生成
    makePropMesh();

    // マルチカメラアニメーション生成
    makeMultiCamera();

}
