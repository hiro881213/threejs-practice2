import { makeGrouping } from './grouping.js'
import { makeMerging  } from './merging.js'

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

};
