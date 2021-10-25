import { make3dSphereGeometries } from './3dSphereGeometries.js'
import { make3dCylinderGeometries } from './3dCylinderGeometries.js'
import { make3dTorusGeometries } from './3dTorusGeometries.js'
import { make3dRingGeometries } from './3dRingGeometries.js'
import { make3dTorusKnotGeometries } from './3dTorusKnotGeometries.js'

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

    // 3Dトーラスアニメーション
    make3dTorusGeometries();

    // 3Dリングアニメーション
    make3dRingGeometries();

    // 3Dトーラスアニメーション
    make3dTorusKnotGeometries();

};