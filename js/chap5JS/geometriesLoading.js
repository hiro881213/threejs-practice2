import { make2dPlaneGeometries } from './2dPlaneGeometries.js'
import { make2dCircleGeometries } from './2dCircleGeometries.js'
import { make2dRingGeometries } from './2dRingGeometries.js'
import { make2dShapeGeometries } from './2dShapeGeometries.js'
import { make3dCubeGeometries } from './3dCubeGeometries.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */

window.onload = function() {
    
    // 平面2dアニメーション
    make2dPlaneGeometries();

    // サークル2dアニメーション
    make2dCircleGeometries();

    // リング2dアニメーション
    make2dRingGeometries();

    // シェープ2dアニメーション
    make2dShapeGeometries();

    // 立方体3dアニメーション
    make3dCubeGeometries();

};