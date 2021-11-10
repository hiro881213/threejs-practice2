import { makeBasicAnimation  } from './basicAnimation.js'
import { makeSelectingObject } from './selectingObject.js'
import { makeAnimationTween  } from './animationTween.js'

// ------------------------------------------------
// グローバル変数
// ------------------------------------------------

const swiper = new Swiper(".swiper-container");

/*
 * オンロード関数
 */
window.onload = function() {
    
    // ベーシックアニメーションを生成する
    makeBasicAnimation();

    // セレクトオブジェクトアニメーションを生成する
    makeSelectingObject();

    // トゥーンアニメーションを生成する
    makeAnimationTween();
};