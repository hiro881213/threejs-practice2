import { loadPdb } from './loadPdb.js'
import { loadPly } from './loadPly.js'
import { loadAwd } from './loadAwd.js'
import { loadAssimp } from './loadAssimp.js'
import { loadVrml } from './loadVrml.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {
    
    // PDBアニメーションを生成する
    loadPdb();

    // // PLYアニメーションを生成する
    // loadPly();

    // AWDアニメーションを生成する
    loadAwd();

//     // ASSIMPアニメーションを生成する
//     loadAssimp();

    // VRMLアニメーションを生成する
    loadVrml();

}
