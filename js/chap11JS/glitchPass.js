let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeGlitchPass = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ------------------------------------
    // レンダラ生成処理
    // ------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0x000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ------------------------------------
    // 球体メッシュ生成処理
    // ------------------------------------

    // 球体メッシュを生成する
    const sphere = createMesh(new THREE.SphereGeometry(10, 40, 40));

    // シーンに球体メッシュを追加する
    scene.add(sphere);

    // ------------------------------------
    // カメラ設定処理
    // ------------------------------------

    // カメラの位置を設定する
    camera.position.set(-10, 15, 25);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // ------------------------------------
    // OrbitControls生成処理
    // ------------------------------------

    // OrbitControlsを生成する
    let orbitControls = new THREE.OrbitControls(camera);

    // autoRotate
    orbitControls.autoRotate = false;

    // クロックを生成する
    let clock = new THREE.Clock();

    // ------------------------------------
    // 環境光生成処理
    // ------------------------------------

    // 環境光を生成する
    const ambi = new THREE.AmbientLight(0x181818);

    // シーンに環境光を追加する
    scene.add(ambi);

    // ------------------------------------
    // 点光源生成処理
    // ------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.DirectionalLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(550, 100, 550);

    // intensity
    spotLight.intensity = 0.6;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("glichPass-output").appendChild(webGLRenderer.domElement);

    // ------------------------------------
    // コンポーザ生成処理
    // ------------------------------------

    // レンダーパスを生成する
    let renderPass = new THREE.RenderPass(scene, camera);

    // effectGlitch
    let effectGlitch = new THREE.GlitchPass(64);
    effectGlitch.renderToScreen = true;

    // コンポーザーを生成する
    let composer = new THREE.EffectComposer(webGLRenderer);

    // パスを追加する
    composer.addPass(renderPass);
    composer.addPass(effectGlitch);

    // ------------------------------------
    // コントローラ生成処理
    // ------------------------------------

    // コントローラを生成する
    let controls = new function() {

        this.goWild = false;
        
        // エフェクト更新処理
        this.updateEffect = () => {

            effectGlitch.goWild = controls.goWild;

        };

    };

    // ------------------------------------
    // GUI生成処理
    // ------------------------------------

    // // GUIを生成する
    // let gui = new dat.GUI();

    // // goWild
    // gui.add(controls, "goWild").onChange(controls.updateEffect);

    let step = 0;

    // レンダリング処理を実行する
    render();

    // ------------------------------------
    // メッシュ生成関数
    // ------------------------------------

    function createMesh(geom) {

        // ローダを生成する
        let textureLoader = new THREE.TextureLoader();

        // テクスチャを生成する
        let planetTexture   = textureLoader.load("../../assets/textures/planets/Earth.png");
        let specularTexture = textureLoader.load("../../assets/textures/planets/EarthSpec.png");
        let normalTexture   = textureLoader.load("../../assets/textures/planets/EarthNormal.png");

        // マテリアルを生成する
        let planetMaterial = new THREE.MeshPhongMaterial();

        planetMaterial.specularMap = specularTexture;
        planetMaterial.specular = new THREE.Color(0x4444aa);

        planetMaterial.normalMap = normalTexture;
        planetMaterial.map = planetTexture;

        // メッシュを生成する
        const mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetTexture]);

        return mesh;

    } 

    // ------------------------------------
    // レンダリング関数
    // ------------------------------------

    function render() {

        // デルタを生成する
        let delta = clock.getDelta();

        // orbitControlsを更新する
        orbitControls.update(delta);

        // 球体メッシュを回転する
        sphere.rotation.y += 0.002;

        // アニメーションを生成する
        requestAnimationFrame(render);
        composer.render(delta);

    }

};
