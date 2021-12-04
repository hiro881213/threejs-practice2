let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeCustomShaderPass = () => {
    
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
    // 球体メッシュ生成処理
    // -------------------------------------------

    // 球体メッシュを生成する
    const sphere = createMesh(new THREE.SphereGeometry(10, 40, 40));

    // シーンに球体メッシュを追加する
    scene.add(sphere);

    // -------------------------------------------
    // カメラ設定処理
    // -------------------------------------------

    // カメラの位置を設定する
    camera.position.set(-10, 15, 25);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // -------------------------------------------
    // OrbitControls生成処理
    // -------------------------------------------

    // orbitControlsを生成する
    const orbitControls = new THREE.OrbitControls(camera);

    // autoRotate
    orbitControls.autoRotate = false;

    // クロックを生成する
    let clock = new THREE.Clock();

    // -------------------------------------------
    // 環境光生成処理
    // -------------------------------------------

    // 環境光を生成する
    const ambi = new THREE.AmbientLight(0x181818);

    // シーンに環境光を追加する
    scene.add(ambi);

    // -------------------------------------------
    // 点光源生成処理
    // -------------------------------------------

    // 点光源を生成する
    const spotLight = new THREE.DirectionalLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(550, 100, 550);

    // intensity
    spotLight.intensity = 0.6;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("customShadePass-output").appendChild(webGLRenderer.domElement);

    // -------------------------------------------
    // レンダーパス生成処理
    // -------------------------------------------

    // レンダーパスを生成する
    const renderPass = new THREE.RenderPass(scene, camera);

    // -------------------------------------------
    // エフェクトコピー生成処理
    // -------------------------------------------

    // エフェクトコピーを生成する
    const effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    effectCopy.renderToScreen = true;

    // -------------------------------------------
    // シェーダーパス生成処理
    // -------------------------------------------

    // シェーダーパスを生成する
    const shaderPass = new THREE.ShaderPass(THREE.CustomGrayScaleShader);
    shaderPass.enabled = false;

    // -------------------------------------------
    // ビットパス生成処理
    // -------------------------------------------

    // ビットパスを生成する
    const bitPass = new THREE.ShaderPass(THREE.CustomBitShader);
    bitPass.enabled = false;

    // -------------------------------------------
    // コンポーザー生成処理
    // -------------------------------------------

    // コンポーザを生成する
    let composer = new THREE.EffectComposer(webGLRenderer);

    composer.addPass(renderPass);
    composer.addPass(shaderPass);
    composer.addPass(bitPass);
    composer.addPass(effectCopy);

    // -------------------------------------------
    // コントローラ生成処理
    // -------------------------------------------

    // コントローラを生成する
    let controls = new function() {

        this.grayScale = false;
        this.rPower = 0.2126;
        this.gPower = 0.7152;
        this.bPower = 0.0722;

        this.bitShader = false;
        this.bitSize = 8;

        // エフェクト更新処理
        this.updateEffectFilm = () => {

            shaderPass.enabled = controls.grayScale;
            shaderPass.uniforms.rPower.value = controls.rPower;
            shaderPass.uniforms.gPower.value = controls.gPower;
            shaderPass.uniforms.bPower.value = controls.bPower;

        };

        // bit更新処理
        this.updateBit = () => {

            bitPass.enabled = controls.bitShader;
            bitPass.uniforms.bitSize.value = controls.bitSize;

        };

    };

    // -------------------------------------------
    // GUI生成処理
    // -------------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    let grayMenu = gui.addFolder('gray scale');
    grayMenu.add(controls, 'grayScale').onChange(controls.updateEffectFilm);
    grayMenu.add(controls, 'rPower', 0, 1).onChange(controls.updateEffectFilm);
    grayMenu.add(controls, 'gPower', 0, 1).onChange(controls.updateEffectFilm);
    grayMenu.add(controls, 'bPower', 0, 1).onChange(controls.updateEffectFilm);

    let bitMenu = gui.addFolder('bit');
    bitMenu.add(controls, 'bitShader').onChange(controls.updateBit);
    bitMenu.add(controls, 'bitSize', 2, 24).step(1).onChange(controls.updateBit);

    let step = 0;

    // レンダリング処理を実行する
    render();

    // -------------------------------------------
    // メッシュ生成関数
    // -------------------------------------------

    function createMesh(geom) {

        // ローダーを生成する
        const textureLoader = new THREE.TextureLoader();

        // 平面テクスチャを読み込む
        const planetTexture = textureLoader.load("../../assets/textures/planets/Earth.png");
        const specularTexture = textureLoader.load("../../assets/textures/planets/EarthSpec.png");
        const normalTexture = textureLoader.load("../../assets/textures/planets/EarthNomal.png");
    
        // マテリアルを生成する
        const planetMaterial = new THREE.MeshPhongMaterial();
        planetMaterial.specularMap = specularTexture;
        planetMaterial.specular = new THREE.Color(0x4444aa);

        planetMaterial.normalMap = normalTexture;
        planetMaterial.map = planetTexture;
        
        // メッシュを生成する
        const mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);

        return mesh;

    }

    // -------------------------------------------
    // レンダリング関数
    // -------------------------------------------

    function render() {

        // デルタを生成する
        let delta = clock.getDelta();

        // orbitコントロールを更新する
        orbitControls.update(delta);

        // 球体メッシュを回転させる
        sphere.rotation.y += 0.002;

        // アニメーションを生成する
        requestAnimationFrame(render);
        composer.render(delta);

    };

}
