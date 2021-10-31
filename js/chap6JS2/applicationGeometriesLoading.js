import { makeExtrudeSvgGeometries } from './extudeSvgGeometries.js'
import { makeParametricGeometries } from './parametricGeometries.js'
import { makeTextGeometries }       from './textGeometries.js'
import { makeBinaryOperations }     from './binaryOperations.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */

window.onload = function() {
    
    // extrudeSvgアニメーションを生成する
    makeExtrudeSvgGeometries();

    // parametricアニメーションを生成する
    makeParametricGeometries();

    // textアニメーションを生成する
    makeTextGeometries();

    // バイナリーオペレーションアニメーションを生成する
    makeBinaryOperations();

}