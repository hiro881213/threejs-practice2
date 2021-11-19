import { makeBasicTextureDds } from './basicTextureDds.js'
import { makeBasicTexturePvr } from './basicTexturePvr.js'
import { makeBasicTextureTga } from './basicTextureTga.js'
import { makeBasicTexture    } from './basicTexture.js'
import { makeBumpMap         } from './bumpMap.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {

    // DDSテクスチャアニメーションを生成する
    makeBasicTextureDds();

    // PVRテクスチャアニメーションを生成する
    makeBasicTexturePvr();

    // // TGAテクスチャアニメーションを生成する
    // makeBasicTextureTga()

    // // ベーシックテクスチャアニメーションを生成する
    // makeBasicTexture();

    // // BUMPマップアニメーションを生成する
    // makeBumpMap();

};
