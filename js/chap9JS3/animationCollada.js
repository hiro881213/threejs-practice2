let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeAnimationCollada = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -----------------------------------------------------
    // レンダラ生成処理
    // -----------------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // -----------------------------------------------------
    // カメラ設定処理
    // -----------------------------------------------------

    // カメラの位置を設定する
    camera.position.set(400, 50, 150);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // -----------------------------------------------------
    // 点光源生成処理
    // -----------------------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(300, 500, 100);

    // intensity
    spotLight.intensity = 3;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに追加する
    document.getElementById("AnimationCollada-output").appendChild(webGLRenderer.domElement);

    // -----------------------------------------------------
    // メッシュ生成処理
    // -----------------------------------------------------

    let step = 0;

    // メッシュを生成する
    let meshAnim;

    // クロックを生成する
    let clock = new THREE.Clock();

    // ローダー生成する
    let loader = new THREE.ColladaLoader();

    // ファイルを読み込む
    loader.load("../../assets/models/monster.dae", (collada) => {

        let child = collada.skins[0];

        // 子要素をシーンに追加する
        scene.add(child);

        // アニメーションを生成する
        let animation = new THREE.Animation(child, child.geometry.animation);

        // アニメションを再生する
        animation.play();

        // 子要素のスケールを設定する
        child.scale.set(0.15, 0.15, 0.15);

        // 子要素を回転させる
        child.rotation.x = -0.5 * Math.PI;

        // 子要素の位置を設定する
        child.position.x = -100;
        child.position.y = -60;

    });

    // レンダリング処理を実行する
    render();

    // -----------------------------------------------------
    // レンダリング関数
    // -----------------------------------------------------

    function render() {

        // デルタを生成する
        let delta = clock.getDelta();

        // アニメーションを更新する
        THREE.AnimationHandler.update(delta);

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    };

}
