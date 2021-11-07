import { makeGrouping } from './grouping.js'
import { makeMerging  } from './merging.js'
import { loadSaveJsonObject } from './loadSaveJsonObject.js'
import { loadBlenderJsonObject } from './blenderJsonLoading.js'
import { loadObject } from './loadObj.js'


// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {

    // グーピングアニメーションを生成する
    makeGrouping();
    
    // マージンアニメーションを生成する
    makeMerging();

    // jsonロードアニメーションを生成する
    loadSaveJsonObject();

    // // Blenderロードアニメーションを生成する
    // loadBlenderJsonObject();

    // ロードオブジェクトアニメーションを生成する
    loadObject();

};
