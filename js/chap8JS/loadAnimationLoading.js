import { makeGrouping } from './grouping.js'

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
    
};
