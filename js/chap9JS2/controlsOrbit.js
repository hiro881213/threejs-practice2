let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeControlsOrbit = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -------------------------------------------
    // レンダラ生成処理
    // -------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0x000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // -------------------------------------------
    // 球体生成処理
    // -------------------------------------------

    //  球体メッシュを生成する
    let sphere = createMesh(new THREE.SphereGeometry(20, 40, 40));

    // シーンに球体メッシュを追加する
    scene.add(sphere);

    // -------------------------------------------
    // カメラ設定処理
    // -------------------------------------------

    // カメラの位置を設定する
    camera.position.set(-20, 30, 40);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // -------------------------------------------
    // コントローラ生成処理
    // -------------------------------------------

    // コントローラを生成する
    let orbitControls = new THREE.OrbitControls(camera);

    // autoRotate
    orbitControls.autoRotate = true;

    // クロックを生成する
    let clock = new THREE.Clock();

    // -------------------------------------------
    // 環境光生成処理
    // -------------------------------------------

    // 環境光を生成する
    let ambiLight = new THREE.AmbientLight(0x111111);

    // シーンに環境光を追加する
    scene.add(ambiLight);

    // -------------------------------------------
    // 点光源生成処理
    // -------------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.DirectionalLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(-20, 30, 40);

    // intensity
    spotLight.intensity = 1.5;

    // シーンを点光源に追加する
    scene.add(spotLight);

    // THREEJSオブジェクトを設定する
    document.getElementById("controlsOrbit-output").appendChild(webGLRenderer.domElement);

    let step = 0;

    // レンダリング処理を実行する
    render();

    // -------------------------------------------
    // メッシュ生成関数
    // -------------------------------------------

    function createMesh(geom) {

        // テクスチャローダーを生成する
        let textureLoader = new THREE.TextureLoader();

        // テクスチャを生成する
        let planetTexture = textureLoader.load("../../assets/textures/planets/mars_1k_color.jpg");
        let normalTexture = textureLoader.load("../../assets/textures/planets/mars_1k_normal.jpg");

        // マテリアルを生成する
        let planetMaterial = new THREE.MeshPhongMaterial({map: planetTexture, bumpMap: normalTexture});

        let wireFrameMat = new THREE.MeshBasicMaterial();
        wireFrameMat.wireframe = true;

        // メッシュを生成する
        let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);

        return mesh;

    };

    // -------------------------------------------
    // レンダリング関数
    // -------------------------------------------

    function render() {

        // デルタを生成する
        let delta = clock.getDelta();

        // コントローラを更新する
        orbitControls.update(delta);

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

}
