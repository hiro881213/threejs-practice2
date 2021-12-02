let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeSimpleShaderPass = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -----------------------------------------
    // レンダラ生成処理
    // -----------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.clearColor(new THREE.Color(0xaaaaff));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // -----------------------------------------
    // カメラ設定処理
    // -----------------------------------------

    // カメラの位置を設定する
    camera.position.set(20, 30, 40);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(-15, -10, -25));

    // -----------------------------------------
    // 点光源生成処理
    // -----------------------------------------

    // 点光源を生成する
    const spotLight = new THREE.SpotLight(0xffffff);

    // 点光源のキャストシャドウを有効にする
    spotLight.castShadow = true;

    // 点光源の位置を設定する
    spotLight.position.set(0, 60, 50);

    // 点光源のintensityを設定する
    spotLight.intensity = 1;

    // mapのwidthを設定する
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;

    // カメラを設定する
    spotLight.shadow.camera.fov = 120;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 1000;

    // -----------------------------------------
    // 環境光生成処理
    // -----------------------------------------

    // 環境光を生成する
    const ambiLight = new THREE.AmbientLight(0x444444);

    // シーンに環境光を追加する
    scene.add(ambiLight);

    // シーンに点光源を追加する
    scene.add(spotLight);

    // -----------------------------------------
    // 立方体メッシュ生成処理
    // -----------------------------------------

    // 立方体ジオメトリを生成する
    let plane = new THREE.BoxGeometry(1600, 1600, 0.1, 40, 40);

    // テクスチャローダを生成する
    let textureLoader = new THREE.TextureLoader();

    // 立方体メッシュを生成する
    let cube = new THREE.Mesh(
        plane,
        new MeshPhongMaterial({
            color: 0xffffff,
            map: textureLoader.load("../../assets/textures/general/plaster-diffuse.jpg"),
            normalMap: textureLoader.load("../../assets/textures/general/plaster-normal.jpg"),
            normalScale: new THREE.Vector2(0.6, 0.6)
        })
    );

    cube.material.map.wrapS = THREE.RepeatWrapping;
    cube.material.map.wrapT = THREE.RepeatWrapping;

    cube.material.normalMap.wrapS = THREE.RepeatWrapping;
    cube.material.normalMap.wrapT = THREE.RepeatWrapping;

    cube.receiveShadow = true;

    // 立方体メッシュの位置を設定する
    cube.position.z = 150;
    cube.position.x = -150;

    // シーンに立方体メッシュを追加する
    cube.add(cube);

    // -----------------------------------------
    // 立方体1メッシュ生成処理
    // -----------------------------------------

    // 立方体1メッシュを生成する
    let cube1 = new THREE.Mesh(
        new THREE.BoxGeometry(30, 10, 2), 
        new THREE.MeshPhongMaterial({color: 0xff0000})
    );

    // 立方体1の位置を設定する
    cube1.position.set(-15, 5, 15);
    
    // キャストシャドウを有効にする
    cube1.castShadow = true;

    // シーンに立方体1を追加する
    scene.add(cube1);

    // -----------------------------------------
    // 立方体2メッシュ生成処理
    // -----------------------------------------

    // 立方体2メッシュを生成する
    let cube2 = cube1.clone();

    // 立方体2メッシュのマテリアルを生成する
    cube2.material = cube1.material.clone();

    // 立方体2メッシュの色を設定する
    cube2.material.color = new THREE.Color(0x00ff00);

    // 立方体2メッシュの位置を設定する
    cube2.position.z = 5;
    cube2.position.x = -20;

    // シーンに立方体2メッシュを追加する
    scene.add(cube2);

    // -----------------------------------------
    // 立方体3メッシュ生成処理
    // -----------------------------------------

    // 立方体3メッシュを生成する
    let cube3 = cube1.clone();

    // 立方体3メッシュのマテリアルを生成する
    cube3.material = cube1.material.clone();

    // 立方体3メッシュの色を設定する
    cube3.material.color = new THREE.Color(0x00ff00);

    // 立方体3メッシュの位置を設定する
    cube3.position.z = -8;
    cube3.position.x = -25;

    // シーンに立方体3を追加する
    scene.add(cube3);

    let mesh;

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("simpleShadePass-output").appendChild(webGLRenderer.domElement);

    // ローダーを生成する
    let mtlLoader = new THREE.MTLoader();

    // パスを生成する
    mtlLoader.setPath("../../assets/models/sol/");

    // ベースURLを生成する
    mtlLoader.setBaseUrl("../../assets/models/sol/");

    // ファイルを読み込む
    mtlLoader.load("LibertStatue.mtl", (materials) => {

        materials.preload();

        // OBJローダを生成する
        let objLoader = new THREE.OBJLoader();

        // マテリアルを設定する
        objLoader.setMaterials(materials);

        // パスを設定する
        objLoader.setPath("../../assets/models/");

        // ファイル読み込みを実行する
        objLoader.load("sol/LibertStatue.obj", (object) => {

            let geom = object.children[0].geometry;

            object.children.forEach((e) => {

                e.castShadow = true;

            });

            // オブジェクトのスケールを設定する
            object.scale.set(20, 20, 20);

            mesh = object;
            mesh.position.x = 15;
            mesh.position.z = 5;

            // シーンにメッシュを追加する
            scene.add(mesh);

        });

    });

    // -----------------------------------------
    // ミラー生成処理
    // -----------------------------------------

    // ミラーを生成する
    let mirror = new THREE.ShaderPass(THREE.MirrorShader);
    mirror.enabled = false;

    // -----------------------------------------
    // ヒュー生成処理
    // -----------------------------------------

    // ヒューを生成する
    let hue = new THREE.ShaderPass(THREE.HueSaturationShader);
    hue.enabled = false;

    // -----------------------------------------
    // ビグネット生成処理
    // -----------------------------------------

    // ビグネットを生成する
    let vignette = new THREE.ShaderPass(THREE.VignetteShader);
    vignette.enabled = false;

    // -----------------------------------------
    // カラーコレクション生成処理
    // -----------------------------------------

    // カラーコレクションを生成する
    let colorCorrection = new THREE.ShaderPass(THREE.ColorCorrectionShader);
    colorCorrection.enabled = false;

    // -----------------------------------------
    // RGBシフト生成処理
    // -----------------------------------------

    let rgbShift = new THREE.ShaderPass(THREE.RGBShiftShader);
    rgbShift.enabled = false;

    // -----------------------------------------
    // ブライトネス生成処理
    // -----------------------------------------

    // ブライトネスを生成する
    let brightness = new THREE.ShaderPass(THREE.BrightnessContrastShader);

    // ブライトネスを設定する
    brightness.uniforms.brightness.value = 0;

    // コントラストを設定する
    brightness.uniforms.contrast.value = 0;

    brightness.uniforms.enabled = false;

    // -----------------------------------------
    // colorify生成処理
    // -----------------------------------------

    // colorifyを生成する
    let colorify = new THREE.ShderPass(THREE.ColorifyShader);

    // 色を設定する
    colorify.uniforms.color.value = new THREE.Color(0xffffff);
    colorify.enabled = false;

    // -----------------------------------------
    // セピア生成処理
    // -----------------------------------------

    // セピアを生成する
    let sepia = new THREE.ShaderPass(THREE.SepiaShader);

    // セピア量を設定する
    sepia.uniforms.amount.value = 1;
    sepia.enabled = false;

    // -----------------------------------------
    // kal生成処理
    // -----------------------------------------

    let kal = new THREE.ShaderPass(THREE.KaleidoShader);
    kal.enabled = false;

    // -----------------------------------------
    // lum生成処理
    // -----------------------------------------

    let lum = new THREE.ShaderPass(THREE.LuminosityShader);
    lum.enabled = false;

    // -----------------------------------------
    // techni生成処理
    // -----------------------------------------

    let techni = new THREE.ShaderPass(THREE.TechnicolorShader);
    techni.enabled = false;

    // -----------------------------------------
    // unpack生成処理
    // -----------------------------------------

    let unpack = new THREE.ShaderPass(THREE.UnpackDepthRGBShader);
    unpack.enabled = false;

    // レンダーパスを生成する
    let renderPass = new THREE.RenderPass(scene, camera);

    // エフェクトコピーを生成する
    let effectCopy = new THREE.ShaderPass(THREE.CopyShder);
    effectCopy.renderToScreen = true;

    // -----------------------------------------
    // コンポーザ生成処理
    // -----------------------------------------

    // コンポーザを生成する
    let composer = new THREE.EffectComposer(webGLRenderer);

    composer.addPass(renderPass);
    composer.addPass(brightness);
    composer.addPass(sepia);
    composer.addPass(mirror);
    composer.addPass(colorify);
    composer.addPass(colorCorrection);
    composer.addPass(rgbShift);
    composer.addPass(vignette);
    composer.addPass(hue);
    composer.addPass(kal);
    composer.addPass(lum);
    composer.addPass(techni);
    composer.addPass(unpack);
    composer.addPass(effectCopy);

    // -----------------------------------------
    // コントローラ生成処理
    // -----------------------------------------

    // コントローラを生成する
    let controls = new function () {

        this.brightness = 0.01;
        this.contrast = 0.01;
        this.select = "none";
        this.color = 0xffffff;
        this.amount = 1;
        this.powRGB_R = 2;
        this.mulRGB_R = 1;
        this.powRGB_G = 2;
        this.mulRGB_G = 1;
        this.powRGB_B = 2;
        this.mulRGB_B = 1;
        this.rgbAmount = 0.005;
        this.angle = 0.0;
        this.side = 1;
        this.offset = 1;
        this.darkness = 1;
        this.hue = 0.01;
        this.saturation = 0.01;
        this.kalAngle = 0;
        this.kalSides = 6;
        this.rotate = false;

        this.switchShader = () => {

            switch (controls.select) {
                case 'none': {
                    enableShader();
                    break;
                }
                case 'colorify': {
                    enableShader(colorify);
                    break;
                }
                case 'brightness': {
                    enableShader(brightness);
                    break;
                }


            }


        }


    }
    



}