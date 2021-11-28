let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makePostProcessingSimple = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

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
    let sphere = createMesh(new THREE.SphereGeometry(10, 40, 40));

    // シーンに球体メッシュを追加する
    scene.add(sphere);

    // ------------------------------------------
    // カメラ設定処理
    // ------------------------------------------

    // カメラの位置を設定する
    camera.position.set(-10, 15, 25);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // ------------------------------------------
    // Orbitコントローラ生成処理
    // ------------------------------------------

    // Orbitコントローラを生成する
    let orbitControls = new THREE.OrbitControls(camera);
    orbitControls.autoRotate = false;

    let clock = new THREE.Clock();

    // ------------------------------------------
    // 環境光生成処理
    // ------------------------------------------

    // 環境光を生成する
    let ambi = new THREE.AmbientLight(0x686868);

    // シーンに環境光を追加する
    scene.add(ambi);

    // ------------------------------------------
    // 点光源生成処理
    // ------------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.DirectionalLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(550, 100, 550);

    // intensity
    spotLight.intensity = 0.6;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトにDOMに設定する
    document.getElementById("postProcessingSimple-output").appendChild(webGLRenderer.domElement);

    // ------------------------------------------
    // コンポーザー生成処理
    // ------------------------------------------

    // レンダーパスを生成する
    let renderPass = new THREE.RenderPass(scene,camera);

    // エフェクトコピーを生成する
    let effectCopy = new THREE.ShaderPass(THREE.CopyShader);

    effectCopy.renderToScreen = true;

    // bloomPassを生成する
    let bloomPass = new THREE.BloomPass(3, 25, 5.0, 256);

    // エフェクトフィルムを生成する
    let effectFilm = new THREE.FilmPass(0.8, 0.325, 256, false);
    effectFilm.renderToScreen = true;

    let dotScreenPass = new THREE.DotScreenPass();

    // コンポーザーを生成する
    let composer = new THREE.EffectComposer(webGLRenderer);

    // コンポーザにパスを追加する
    composer.addPass(renderPass);
    composer.addPass(effectCopy);

    // レンダーシーンを生成する
    let renderScene = new THREE.TexturePass(composer.renderTarget2);

    // ------------------------------------------
    // コンポーザー1生成処理
    // ------------------------------------------

    // コンポーザー1を生成する
    let composer1 = new THREE.EffectComposer(webGLRenderer);
    
    composer1.addPass(renderScene);
    composer1.addPass(dotScreenPass);
    composer1.addPass(effectCopy);

    // ------------------------------------------
    // コンポーザー2生成処理
    // ------------------------------------------

    // コンポーザー2を生成する
    let composer2 = new THREE.EffectComposer(webGLRenderer);

    composer2.addPass(renderScene);
    composer2.addPass(effectCopy);

    // ------------------------------------------
    // コンポーザー3生成処理
    // ------------------------------------------

    // コンポーザー3を生成する
    let composer3 = new THREE.EffectComposer(webGLRenderer);

    composer3.addPass(renderScene);
    composer3.addPass(bloomPass);
    composer3.addPass(effectCopy);

    // ------------------------------------------
    // コンポーザー4生成処理
    // ------------------------------------------

    // コンポーザー4を生成する
    let composer4 = new THREE.EffectComposer(webGLRenderer);

    composer4.addPass(renderScene);
    composer4.addPass(effectFilm);

    // ------------------------------------------
    // コントローラ生成処理
    // ------------------------------------------

    // コントローラを生成する
    let controls = new function() {

        this.scanlinesCount = 256;
        this.grayscale = false;
        this.scanlinesIntensity = 0.3;
        this.noiseIntensity = 0.8;

        this.strength = 3;
        this.kernelSize = 25;
        this.sigma = 5.0;
        this.resolution = 256;

        this.centerX = 0.5;
        this.centerY = 0.5;
        this.angle = 1.57;
        this.scale = 1;

        // エフェクトフィルム更新処理
        this.updateEffectFilm = () => {

            effectFilm.uniforms.grayscale.value = controls.grayscale;
            effectFilm.uniforms.nIntensity.value = controls.noiseIntensity;
            effectFilm.uniforms.sIntensity.value = controls.scanlinesIntensity;
            effectFilm.uniforms.sCount.value = controls.scanlinesCount;

        };

        // ドット更新処理
        this.updateDotScreen = () => {

            let dotScreenPass = new THREE.DotScreenPass(
                new THREE.Vector2(controls.centerX, controls.centerY),
                controls.angle,
                controls.scale
            );

            // コンポーザー設定処理
            composer1 = new THREE.EffectComposer(webGLRenderer);

            composer1.addPass(renderScene);
            composer1.addPass(dotScreenPass);
            composer1.addPass(effectCopy);

        }

        // EffectBloom更新処理
        this.updateEffectBloom = () => {

            // bloomPassを設定する
            bloomPass = new THREE.BloomPass(
                controls.strength,
                controls.kernelSize,
                controls.sigma,
                controls.resolution
            );

            // コンポーザーを生成する
            composer3 = new THREE.EffectComposer(webGLRenderer);

            composer3.addPass(renderScene);
            composer3.addPass(bloomPass);
            composer3.addPass(effectCopy);

        };

    };

    // ------------------------------------------
    // GUI生成処理
    // ------------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // bpFolderフォルダ生成
    let bpFolder = gui.addFolder("BloomPass");
    
    bpFolder.add(controls, "strength", 1, 10).onChange(controls.updateEffectBloom);
    bpFolder.add(controls, "kernelSize", 1, 100).onChange(controls.updateEffectBloom);
    bpFolder.add(controls, "sigma", 1, 10).onChange(controls.updateEffectBloom);
    bpFolder.add(controls, "resolution", 0, 1024).onChange(controls.updateEffectBloom);

    // fpFolderフォルダ生成
    let fpFolder = gui.addFolder("FilmPass");
    
    fpFolder.add(controls, "scanlinesIntensity", 0, 1).onChange(controls.updateEffectFilm);
    fpFolder.add(controls, "noiseIntensity", 0, 3).onChange(controls.updateEffectFilm);
    fpFolder.add(controls, "grayscale").onChange(controls.updateEffectFilm);
    fpFolder.add(controls, "scanlinesCount", 0, 2048).step(1).onChange(controls.updateEffectFilm);

    // dsFolderフォルダ生成
    let dsFolder = gui.addFolder("DotScreenPass");

    dsFolder.add(controls, "centerX", 0, 1).onChange(controls.updateDotScreen);
    dsFolder.add(controls, "centerY", 0, 1).onChange(controls.updateDotScreen);
    dsFolder.add(controls, "angle", 0, 3.14).onChange(controls.updateDotScreen);
    dsFolder.add(controls, "scale", 0, 10).onChange(controls.updateDotScreen);

    let step = 0;
    
    const halfWidth = width/2;
    const halfHeight = height/2;    

    // レンダリング処理を実行する
    render();

    // ------------------------------------------
    // メッシュ生成関数
    // ------------------------------------------

    function createMesh(geom) {

        // ローダーを生成する
        let textureLoader = new THREE.TextureLoader();

        //　テクスチャを生成する
        let planetTexture = textureLoader.load("../../assets/textures/planets/Earth.png");
        let specularTexture = textureLoader.load("../../assets/textures/planets/EarthSpec.png");
        let normalTexture = textureLoader.load("../../assets/textures/planets/EarthNormal.png");

        // マテリアルを生成する
        let planetMaterial = new THREE.MeshPhongMaterial();
        planetMaterial.specularMap = specularTexture;
        planetMaterial.specular = new THREE.Color(0x4444aa);

        planetMaterial.normalMap = normalTexture;
        planetMaterial.map = planetTexture;

        let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);

        return mesh;

    }

    // ------------------------------------------
    // レンダリング関数
    // ------------------------------------------

    function render() {

        // デルタを生成する
        let delta = clock.getDelta();
        orbitControls.update(delta);

        // 球体メッシュを回転させる
        sphere.rotation.y += 0.002;

        // アニメーションを生成する
        requestAnimationFrame(render);

        webGLRenderer.autoClear = false;
        webGLRenderer.clear();

        webGLRenderer.setViewport(0, 0, 2*halfWidth, 2*halfHeight);
        composer.render(delta);

        webGLRenderer.setViewport(0, 0, halfWidth, halfHeight);
        composer1.render(delta);

        webGLRenderer.setViewport(halfWidth, 0, halfWidth, halfHeight);
        composer2.render(delta);

        webGLRenderer.setViewport(0, halfHeight, halfWidth, halfHeight);
        composer3.render(delta);

        webGLRenderer.setViewport(halfWidth, halfHeight, halfWidth, halfHeight);
        composer4.render(delta);

    };

};
