// 球体アニメーションJS
import { makeSquare } from './chap2JS/square.js'
import { makeScene  } from './chap2JS/scene.js'
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

    // // URLを取得する
    // const url = new URL(window.location.href);
    // // パラメータを取得する
    // const params = url.searchParams;
    // let page = params.get('page');
    // // 先頭ページの場合
    // if (page === null || page === '1') {
    //     // id属性で要素を取得
    //     var textbox_element = document.getElementById('lstThreeArea');
    //     // divタグを追加する
    //     var new_element = document.createElement('div');
    //     // id
    //     var div_element = document.getElementById('chap1-1');
    //     div_element.classList.add("swiper-slide")
    //     // 新しいHTML要素を作成
    //     textbox_element.insertBefore( new_element, p1_element);
    // }

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
