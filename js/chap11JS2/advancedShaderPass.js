let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeAdvancedShaderPass = () => {

    // スケールを生成する
    const scale = chroma.scale(['white', 'blue']);

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ----------------------------------------------
    // レンダラ生成処理
    // ----------------------------------------------

    // レンダラを生成する
    const webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xaaaaff));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // アンチレイリアスを設定する
    webGLRenderer.antialias = false;

    // ----------------------------------------------
    // カメラ設定処理
    // ----------------------------------------------

    // カメラの位置を設定する
    camera.position.set(30, 30, 30);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // ----------------------------------------------
    // 直接光生成処理
    // ----------------------------------------------

    // 直接光を生成する
    const dirLight = new THREE.DirectionalLight(0xffffff);

    // 直接光の位置を設定する
    dirLight.position.set(30, 30, 30);

    // intensity
    dirLight.intensity = 0.8;

    // シーンに直接光を追加する
    scene.add(dirLight);

    // ----------------------------------------------
    // 点光源生成処理
    // ----------------------------------------------

    // 点光源を生成する
    const spotLight = new THREE.SpotLight(0xffffff);

    // キャストシャドウを有効にする
    spotLight.castChadow = true;

    // 点光源の位置を設定する
    spotLight.position.set(-30, 30, -100);

    // 点光源の対象の位置を設定する
    spotLight.target.position.x = -10;
    spotLight.target.position.z = -10;

    // intensity
    spotLight.intensity = 0.6;

    // mapサイズを設定する
    spotLight.shadow.mapSize.width = 4096;
    spotLight.shadow.mapSize.height = 4096;

    // fovを設定する
    spotLight.shadow.camera.fov = 120;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // ----------------------------------------------
    // 立方体メッシュ生成処理
    // ----------------------------------------------

    // 平面ジオメトリを生成する
    const plane = new THREE.BoxGeometry(1600, 1600, 0.1, 40, 40);

    // テクスチャローダーを生成する
    const textureLoader = new THREE.TextureLoader();

    // 立方体メッシュを生成する
    const cube = new THREE.Mesh(
        plane,
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: textureLoader.load("../../assets/textures/general/floor-wood.jpg"),
            normalScale: new THREE.Vector2(0.6, 0.6)
        })
    );

    // wrapを設定する
    cube.material.map.wrapS = THREE.RepeatWrapping;
    cube.material.map.wrapT = THREE.RepeatWrapping;

    // 立方体メッシュを回転させる
    cube.rotation.x = Math.PI/2;

    // 立方体メッシュのマップを設定する
    cube.material.map.repeat.set(80, 80);

    // receiveShadow
    cube.receiveShadow = true;

    // 立方体メッシュの位置を設定する
    cube.position.z = -150;
    cube.position.x = -150;

    // シーンに立方体メッシュを追加する
    scene.add(cube);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("advancedShadePass-output").appendChild(webGLRenderer.domElement);

    // ----------------------------------------------
    // Bleachフィルタ生成処理
    // ----------------------------------------------

    // Bleachフィルタを生成する
    const bleachFilter = new THREE.ShaderPass(THREE.BleachBypassShader);
    bleachFilter.enabled = false;

    // ----------------------------------------------
    // edgeシェーダー生成処理
    // ----------------------------------------------

    // edgeシェーダーを生成する
    const edgeShader = new THREE.ShaderPass(THREE.EdgeShader);
    edgeShader.enabled = false;

    // ----------------------------------------------
    // FXAAシェーダー生成処理
    // ----------------------------------------------

    // FXAAシェーダーを生成する
    const FXAAShader = new THREE.ShaderPass(THREE.FXAAShader);
    FXAAShader.enabled = false;

    // ----------------------------------------------
    // フォーカスシェーダー生成処理
    // ----------------------------------------------

    // フォーカスシェーダーを生成する
    const focusShader = new THREE.ShaderPass(THREE.FocusShader);
    focusShader.enabled = false;

    // ----------------------------------------------
    // レンダーパス生成処理
    // ----------------------------------------------

    // レンダーパスを生成する
    const renderPass = new THREE.RenderPass(scene, camera);

    // ----------------------------------------------
    // エフェクトコピー生成処理
    // ----------------------------------------------

    // エフェクトコピーを生成する
    const effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    effectCopy.renderToScreen = true;
    
    // ----------------------------------------------
    // コンポーザ生成処理
    // ----------------------------------------------

    // コンポーザを生成する
    const composer = new THREE.EffectComposer(webGLRenderer);

    // パスを設定する
    composer.addPass(renderPass);
    composer.addPass(bleachFilter);
    composer.addPass(edgeShader);
    composer.addPass(FXAAShader);
    composer.addPass(focusShader);
    composer.addPass(effectCopy);

    // ----------------------------------------------
    // コントローラ生成処理
    // ----------------------------------------------

    // コントローラを生成する
    let controls = new function () {

        this.bleachOpacity = 1;
        this.bleach = false;
        this.edgeDetect = false;
        this.edgeAspect = 512;
        this.FXAA = false;

        this.focus = false;
        this.sampleDistance = 0.94;
        this.waveFactor = 0.00125;

        this.screenWidth = width;
        this.screenHeight = height;

        // 変更処理
        this.onChange = () => {

            bleachFilter.enabled = controls.bleach;
            bleachFilter.uniforms.opacity.value = controls.bleachOpacity;

            edgeShader.enabled = controls.edgeDetect;
            edgeShader.uniforms.aspect.value = new THREE.Vector2(controls.edgeAspect, controls.edgeAspect);

            FXAAShader.enabled = controls.FXAA;
            FXAAShader.uniforms.resolution.value = new THREE.Vector2(1/width, 1/height);

            focusShader.enabled = controls.focus;
            focusShader.uniforms.screenWidth.value = controls.screenWidth;
            focusShader.uniforms.screenHeight.value = controls.screenHeight;
            focusShader.uniforms.waveFactor.value = controls.waveFactor;
            focusShader.uniforms.sampleDistance.value = controls.sampleDistance;

        };

    };

    // ----------------------------------------------
    // GUI生成処理
    // ----------------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    gui.add(controls, "bleach").onChange(controls.onChange);
    gui.add(controls, "bleachOpacity", 0, 2).onChange(controls.onChange);
    gui.add(controls, "edgeDetect").onChange(controls.onChange);
    gui.add(controls, "edgeAspect", 128, 2048).step(128).onChange(controls.onChange);
    gui.add(controls, "FXAA").onChange(controls.onChange);
    gui.add(controls, "focus").onChange(controls.onChange);
    gui.add(controls, "sampleDistance", 0, 2).step(0.01).onChange(controls.onChange);
    gui.add(controls, "waveFactor", 0, 0.005).step(0.0001).onChange(controls.onChange);

    // レンダリング処理を実行する
    render();

    // ----------------------------------------------
    // レンダリング関数
    // ----------------------------------------------

    function render() {

        // アニメーションを生成する
        requestAnimationFrame(render);
        composer.render()

    };

}
