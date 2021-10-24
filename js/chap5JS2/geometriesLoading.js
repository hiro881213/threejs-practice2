import { make3dSphereGeometries } from './3dSphereGeometries.js'
import { make3dCylinderGeometries } from './3dCylinderGeometries.js'


// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */

window.onload = function() {
    
    // 3D球体アニメーション
    make3dSphereGeometries();

    // 3D円柱アニメーション
    make3dCylinderGeometries();

};