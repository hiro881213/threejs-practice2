let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makePostProcessingMasks = () => {
    
    // ------------------------------------------
    // シーン生成処理
    // ------------------------------------------

    // シーンを生成する
    let sceneEarth = new THREE.Scene();
    let sceneMars = new THREE.Scene();
    let sceneBG = new THREE.Scene();

    // ------------------------------------------
    // カメラ生成処理
    // ------------------------------------------

    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
    let cameraBG = new THREE.OrthographicCamera(-(width), width, height, -(height), -10000, 10000);
    cameraBG.position.z = 50;

    // ------------------------------------------
    // レンダラ生成処理
    // ------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0x000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ------------------------------------------
    // 球体メッシュ生成処理
    // ------------------------------------------

    // 球体メッシュを生成する
    let sphere = createEarthMesh(new THREE.SphereGeometry(10, 40, 40));

    // 球体メッシュの位置を設定する
    sphere.position.x = -10;

    // 球体メッシュ2を生成する
    let sphere2 = createMarshMesh(new THREE.SphereGeometry(5, 40, 40));

    // 球体メッシュをシーンに追加する
    sceneEarth.add(sphere);
    sceneMars.add(sphere2);

    // ------------------------------------------
    // カメラ設定処理
    // ------------------------------------------

    // カメラの位置を設定する
    camera.position.set(-10, 15, 25);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // ------------------------------------------
    // OrbitControls生成処理
    // ------------------------------------------

    // orbitControlsを生成する
    let orbitControls = new THREE.OrbitControls(camera);

    // autoRotate
    orbitControls.autoRotate = false;

    // クロックを生成する
    let clock = new THREE.Clock();

    // ------------------------------------------
    // 環境光生成処理
    // ------------------------------------------

    // 環境光を生成する
    let ambi = new THREE.AmbientLight(0x181818);
    let ambi2 = new THREE.AmbientLight(0x181818);

    // シーンに環境光を追加する
    sceneEarth.add(ambi);
    sceneMars.add(ambi2);

    // ------------------------------------------
    // 点光源生成処理
    // ------------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.DirectionalLight(0xffffff);
    spotLight.position.set(550, 100, 550);
    spotLight.intensity = 0.6;

    let spotLight2 = new THREE.DirectionalLight(0xffffff);
    spotLight2.position.set(550, 100, 550);
    spotLight2.intensity = 0.6;

    // シーンに点光源を追加する
    sceneEarth.add(spotLight);
    sceneMars.add(spotLight2);

    // ------------------------------------------
    // 平面メッシュ生成処理
    // ------------------------------------------

    // ローダーを生成する
    let textureLoader = new THREE.TextureLoader();

    // マテリアルを生成する
    let materialColor = new THREE.MeshBasicMaterial({
        map: textureLoader.load("../../assets/textures/starry-deep-outer-space-galaxy.jpg"),
        depthTest: false
    });

    // 平面メッシュを生成する
    let bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), materialColor);

    // 平面メッシュの位置を設定する
    bgPlane.position.z = -100;

    // スケールを設定する
    bgPlane.scale.set(width*2, height*2, 1);

    // シーンに平面メッシュを追加する
    sceneBG.add(bgPlane);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("postProcessingMasks-output").appendChild(webGLRenderer.domElement);

    // ------------------------------------------
    // パス生成処理
    // ------------------------------------------

    // bgパスを生成する
    let bgPass = new THREE.RenderPass(sceneBG, cameraBG);

    // renderパスを生成する
    let renderPass = new THREE.RenderPass(sceneEarth, camera);

    // renderパスをクリアをOFFにする
    renderPass.clear = false;

    // renderパス2を生成する
    let renderPass2 = new THREE.RenderPass(sceneMars, camera);

    // renderパス2をクリアをOFFにする
    renderPass2.clear = false;

    // effectコピーを生成する
    let effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    effectCopy.renderToScreen = true;

    // ------------------------------------------
    // マスク生成処理
    // ------------------------------------------

    // クリアマスクを生成する
    let clearMask = new THREE.ClearMaskPass();

    // アースマスクを生成する
    let earthMask = new THREE.MaskPass(sceneEarth, camera);

    // マーズマスクを生成する
    let marsMask = new THREE.MaskPass(sceneMars, camera);

    // ------------------------------------------
    // エフェクト生成処理
    // ------------------------------------------

    // セピアエフェクトを生成する
    let effectSepia = new THREE.ShaderPass(THREE.SepiaShader);
    effectSepia.uniforms['amount'].value = 0.8;

    // 色彩エフェクトを生成する
    let effectColorify = new THREE.ShaderPass(THREE.ColorifyShader);
    effectColorify.uniforms['color'].value.setRGB(0.5, 0.5, 1);

    // ------------------------------------------
    // コンポーザー生成処理
    // ------------------------------------------

    // コンポーザを生成する
    let composer = new THREE.EffectComposer(webGLRenderer);

    // レンダーターゲットを設定する
    composer.renderTarget1.stencilBuffer = true;
    composer.renderTarget2.stencilBuffer = true;

    // パスを設定する
    composer.addPass(bgPass);
    composer.addPass(renderPass);
    composer.addPass(renderPass2);
    composer.addPass(marsMask);
    composer.addPass(effectColorify);
    composer.addPass(clearMask);
    composer.addPass(earthMask);
    composer.addPass(effectSepia);
    composer.addPass(clearMask);
    composer.addPass(effectCopy);

    // レンダリング処理を実行する
    render();

    // ------------------------------------------
    // マーズメッシュ生成関数
    // ------------------------------------------

    function createMarshMesh(geom) {

        // ローダーを生成する
        let textureLoader = new THREE.TextureLoader();

        // テクスチャを読み込む
        const planetTexture = textureLoader.load("../../assets/textures/planets/Mars_2k-050104.png");
        const normalTexture = textureLoader.load("../../assets/textures/planets/Mars-normalmap_2k.png");

        // マテリアルを生成する
        let planetMaterial = new THREE.MeshPhongMaterial();

        // マップを設定する
        planetMaterial.normalMap = normalTexture;
        planetMaterial.map = planetTexture;

        // メッシュを生成する
        const mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);

        return mesh;

    }

    // ------------------------------------------
    // アースメッシュ生成関数
    // ------------------------------------------

    function createEarthMesh(geom) {

        // テクスチャローダーを生成する
        let textureLoader = new THREE.TextureLoader();

        // テクスチャを読み込む
        const planetTexture = textureLoader.load("../../assets/textures/planets/Earth.png");
        const specularTexture = textureLoader.load("../../assets/textures/planets/EarthSpec.png");
        const normalTexture = textureLoader.load("../../assets/textures/planets/EarthNormal.png");

        // マテリアルを生成する
        let planetMaterial = new THREE.MeshPhongMaterial();

        // マップを設定する
        planetMaterial.specularMap = specularTexture;
        
        // specularを設定する
        planetMaterial.specular = new THREE.Color(0x4444aa);

        planetMaterial.normalMap = normalTexture;
        planetMaterial.map = planetTexture;

        // メッシュを生成する
        const mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);

        return mesh;

    }

    // ------------------------------------------
    // レンダリング関数
    // ------------------------------------------

    function render() {

        webGLRenderer.autoClear = false;

        // デルタを生成する
        let delta = clock.getDelta();

        // orbitコントローラを更新する
        orbitControls.update(delta);

        // 球体メッシュを回転させる
        sphere.rotation.y += 0.002;
        sphere2.rotation.y += 0.002;

        // アニメーションを生成する
        requestAnimationFrame(render);
        composer.render(delta);

    }

};
