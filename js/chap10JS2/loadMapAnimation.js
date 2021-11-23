import { makeNormalMap     } from './normalMap.js'
import { makeLightMap      } from './lightMap.js'
import { makeEnvMapDynamic } from './envMapDynamic.js'
import { makeEnvMapStatic  } from './envMapStatic.js'
import { makeSpecularMap   } from './specularMap.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {
    
    // // ノーマルマップアニメーションを生成する
    // makeNormalMap();
    
    // // ライトマップアニメーションを生成する
    // makeLightMap();

    // 動的環境マップアニメーションを生成する
    makeEnvMapDynamic();

    // // 静的環境マップアニメーションを生成する
    // makeEnvMapStatic();

    // // specularマップアニメーション
    // makeSpecularMap();

}
