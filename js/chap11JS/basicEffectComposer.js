let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeBasicEffectComposer = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ----------------------------------------------
    // レンダラ生成処理
    // ----------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0x000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ----------------------------------------------
    // 球体メッシュ生成処理
    // ----------------------------------------------

    // 球体メッシュを生成する
    const sphere = createMesh(new THREE.SphereGeometry(10, 40, 40));

    // シーンに球体メッシュを追加する
    scene.add(sphere);

    // ----------------------------------------------
    // カメラ設定処理
    // ----------------------------------------------

    // カメラの位置を設定する
    camera.position.set(-10, 15, 25);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // ----------------------------------------------
    // orbitコントローラ生成処理
    // ----------------------------------------------

    // コントローラを生成する
    let orbitControls = new THREE.OrbitControls(camera);

    // autoRotate
    orbitControls.autoRotate = false;

    let clock = new THREE.Clock();

    // ----------------------------------------------
    // 環境光生成処理
    // ----------------------------------------------

    // 環境光を生成する
    const ambi = new THREE.AmbientLight(0x181818);

    // シーンに環境光を追加する
    scene.add(ambi);

    // ----------------------------------------------
    // 点光源生成処理
    // ----------------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.DirectionalLight(0xffffff);

    // 点光源の位置を生成する
    spotLight.position.set(550, 100, 550);

    // intensity
    spotLight.intensity = 0.6;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトにDOMを設定する
    document.getElementById("basicEffectComposer-output").appendChild(webGLRenderer.domElement);

    // ----------------------------------------------
    // コンポーザー生成処理
    // ----------------------------------------------

    // レンダーパスを生成する
    let renderPass = new THREE.RenderPass(scene, camera);

    // フィルムパスを生成する
    let effectFilm = new THREE.FilmPass(0.8, 0.325, 256, false);

    effectFilm.renderToScreen = true;

    // コンポーザを生成する
    let composer = new THREE.EffectComposer(webGLRenderer);

    // パスを設定する
    composer.addPass(renderPass);
    composer.addPass(effectFilm);

    // ----------------------------------------------
    // コントローラ生成処理
    // ----------------------------------------------

    let controls = new function() {

        this.scanlinesCount = 256;
        this.grayscale = false;
        this.scanlinesIntensity = 0.3;
        this.noiseIntensity = 0.8;

        // エフェクト更新処理
        this.updateEffectFilm = () => {

            effectFilm.uniforms.grayscale.value = controls.grayscale;
            effectFilm.uniforms.nIntensity.value = controls.noiseIntensity;
            effectFilm.uniforms.sIntensity.value = controls.scanlinesIntensity;
            effectFilm.uniforms.sCount.value = controls.scanlinesCount;

        };

    };

    // ----------------------------------------------
    // GUI生成処理
    // ----------------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    gui.add(controls, "scanlinesIntensity", 0, 1).onChange(controls.updateEffectFilm);
    gui.add(controls, "noiseIntensity", 0, 3).onChange(controls.updateEffectFilm);
    gui.add(controls, "grayscale").onChange(controls.updateEffectFilm);
    gui.add(controls, "scanlinesCount", 0, 2048).step(1).onChange(controls.updateEffectFilm);

    let step = 0;

    // レンダリング処理を実行する
    render();

    // ----------------------------------------------
    // メッシュ生成関数
    // ----------------------------------------------

    function createMesh(geom) {

        // ローダーを生成する
        let textureLoader = new THREE.TextureLoader();

        // プラネットテクスチャを生成する
        let planetTexture = textureLoader.load("../../assets/textures/planets/Earth.png");
        let specularTexture = textureLoader.load("../../assets/textures/planets/EarthSpec.png");
        let normalTexture = textureLoader.load("../../assets/textures/planets/EarthNormal.png")

        // マテリアルを生成する
        let planetMaterial = new THREE.MeshPhongMaterial();

        planetMaterial.specularMap = specularTexture;
        planetMaterial.specular = new THREE.Color(0x4444aa);

        planetMaterial.normalMap = normalTexture;
        planetMaterial.map = planetTexture;

        const mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);

        return mesh;

    }

    // ----------------------------------------------
    // レンダリング関数
    // ----------------------------------------------

    function render() {

    // デルタを生成する
    let delta = clock.getDelta();

    // orbitコントローラを更新する
    orbitControls.update(delta);

    // 球体メッシュを回転させる
    sphere.rotation.y += 0.002;

    // アニメーションを生成する
    requestAnimationFrame(render);
    composer.render(delta);

    };

};
