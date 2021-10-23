// 球体アニメーションJS
import { makeSquare } from './chap2JS/square.js'
import { makeScene,addCube  } from './chap2JS/scene.js'
import { makeGeometry } from './chap2JS/geometry.js'
import { makeCustomGeometry } from './chap2JS/custom.js'
import { makePropMesh } from './chap2JS/meshProp.js'
import { makeMultiCamera } from './chap2JS/multiCamera.js'
import { makeCameraLookAt } from './chap2JS/cameraLookAt.js';

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

    // カメラアニメーション生成
    makeCameraLookAt();
    
}
