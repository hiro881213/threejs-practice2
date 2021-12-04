let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeBlurShaderPass = () => {
    
    // クロマのスケールを設定する
    let scale = chroma.scale(['white', 'blue']);

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ---------------------------------------
    // レンダラ生成処理
    // ---------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xaaaaff));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ---------------------------------------
    // カメラ設定処理
    // ---------------------------------------

    // カメラの位置を設定する
    camera.position.set(30, 30, 30);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // ---------------------------------------
    // 直接光生成処理
    // ---------------------------------------

    // 直接光を生成する
    const dirLight = new THREE.DirectionalLight(0xffffff);

    // 直接光の位置を設定する
    dirLight.position.set(30, 30, 30);

    // intensity
    dirLight.intensity = 0.8;

    // シーンに直接光に追加する
    scene.add(dirLight);

    // ---------------------------------------
    // 点光源生成処理
    // ---------------------------------------

    // 点光源を生成する
    const spotLight = new THREE.SpotLight(0xffffff);

    // 点光源のキャストシャドウを有効にする
    spotLight.castShadow = true;

    // 点光源の位置を設定する
    spotLight.position.set(-30, 30, -100);

    // 点光源の対象の位置を設定する
    spotLight.target.position.x = -10;
    spotLight.target.position.z = -10;

    // 点光源にintensityを設定する
    spotLight.intensity = 0.6;

    // 点光源のmapSizeを設定する
    spotLight.shadow.mapSize.width = 4096;
    spotLight.shadow.mapSize.height = 4096;

    // 点光源のカメラのfovを設定する
    spotLight.shadow.camera.fov = 120;

    // 点光源のカメラのnearを設定する
    spotLight.shadow.camera.near = 1;

    // 点光源のカメラのfarを設定する
    spotLight.shadow.camera.far = 200;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // ---------------------------------------
    // 立方体メッシュ生成処理
    // ---------------------------------------

    // 平面ジオメトリを生成する
    const plane = new THREE.BoxGeometry(1600, 1600, 0.1, 40, 40);

    // テクスチャローダを生成する
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

    // wrap
    cube.material.map.wrapS = THREE.RepeatWrapping;
    cube.material.map.wrapT = THREE.RepeatWrapping;

    // 立方体メッシュを回転させる
    cube.rotation.x = Math.PI/2;

    // 立方体メッシュのマップを設定する
    cube.material.map.repeat.set(80, 80);

    // 立方体メッシュのreceiveShadowを有効にする
    cube.receiveShadow = true;

    // 立方体メッシュの位置を設定する
    cube.position.z = -150;
    cube.position.x = -150;

    // シーンに立方体メッシュを追加する
    scene.add(cube);

    let range = 3;
    let stepX = 8;
    let stepZ = 8;

    for (let i = -25; i < 5; i++) {

        for (let j = -15; j < 15; j++) {

            // 立方体メッシュを生成する
            let cube = new THREE.Mesh(
                new THREE.BoxGeometry(3, 4, 3),
                new THREE.MeshPhongMaterial({
                    color: scale(Math.random()).hex(),
                    opacity: 0.8,
                    transparent: true
                })
            );

            // 立方体メッシュの位置を設定する
            cube.position.x = i * stepX + (Math.random() - 0.5) * range;
            cube.position.z = j * stepZ + (Math.random() - 0.5) * range;
            cube.position.y = (Math.random() - 0.5) * range;

            // 立方体メッシュのキャストシャドウを有効にする
            cube.castShadow = true;

            // シーンに立方体メッシュを追加する
            scene.add(cube);

        }

    }

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("blurShadePass-output").appendChild(webGLRenderer.domElement);

    // ---------------------------------------
    // Blur生成処理
    // ---------------------------------------

    // hBlurを生成する
    const hBlur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
    hBlur.enabled = false;
    hBlur.uniforms.h.value = 1 / height;

    // vBlurを生成する
    const vBlur = new THREE.ShaderPass(THREE.VerticalBlurShader);
    vBlur.enabled = false;
    vBlur.uniforms.v.value = 1 / width;

    // ---------------------------------------
    // Tilt生成処理
    // ---------------------------------------

    // hTiltを生成する
    const hTilt = new THREE.ShaderPass(THREE.HorizontalTiltShiftShader);
    hTilt.enabled = false;
    hTilt.uniforms.h.value = 1 / height;

    // vTiltを生成する
    const vTilt = new THREE.ShaderPass(THREE.VerticalTiltShiftShader);
    vTilt.enabled = false;
    vTilt.uniforms.v.value = 1 / width;

    // ---------------------------------------
    // Tri生成処理
    // ---------------------------------------

    // triを生成する
    const tri = new THREE.ShaderPass(THREE.TriangleBlurShader, "texture");
    tri.enabled = false;

    // ---------------------------------------
    // renderPass生成処理
    // ---------------------------------------

    // renderPassを生成する
    const renderPass = new THREE.RenderPass(scene, camera);

    // ---------------------------------------
    // effectCopy生成処理
    // ---------------------------------------

    // effectCopyを生成する
    const effectCopy = new THREE.ShaderPass(THREE.CopyShder);
    effectCopy.renderToScreen = true;

    // ---------------------------------------
    // Composer生成処理
    // ---------------------------------------

    // コンポーザを生成する
    const composer = new THREE.EffectComposer(webGLRenderer);
    composer.addPass(renderPass);
    composer.addPass(hBlur);
    composer.addPass(vBlur);
    composer.addPass(vTilt);
    composer.addPass(hTilt);
    composer.addPass(tri);
    composer.addPass(effectCopy);

    // ---------------------------------------
    // コントローラ生成処理
    // ---------------------------------------

    // コントローラを生成する
    let controls = new function () {

        this.hBlur = false;
        this.vBlur = false;
        
        this.hTilt = false;
        this.vTilt = false;

        this.triBlur = false;

        this.hTiltR = 0.35;
        this.vTiltR = 0.35;

        this.deltaX = 0.05;
        this.deltaY = 0.05;

        // 更新処理
        this.onChange = () => {

            hBlur.enabled = controls.hBlur;
            vBlur.enabled = controls.vBlur;

            hTilt.enabled = controls.hTilt;
            hTilt.uniforms.r.value = controls.hTiltR;

            vTilt.enabled = controls.vTilt;
            vTilt.uniforms.r.value = controls.vTiltR;

            tri.enabled = cntrols.triBlur;
            tri.uniforms.delta.value = new THREE.Vector2(controls.deltaX, controls.deltaY);

        }

    };

    // ---------------------------------------
    // GUI生成処理
    // ---------------------------------------

    // GUIを生成する
    const gui = new dat.GUI();

    gui.add(controls, 'hBlur').onChange(controls.onChange);
    gui.add(controls, 'vBlur').onChange(controls.onChange);
    gui.add(controls, 'hTilt').onChange(controls.onChange);
    gui.add(controls, 'hTiltR', 0, 1).onChange(controls.onChange);
    gui.add(controls, 'vTilt').onChange(controls.onChange);
    gui.add(controls, 'vTiltR', 0, 1).onChange(controls.onChange);
    gui.add(controls, 'triBlur').onChange(controls.onChange);
    gui.add(controls, 'deltaX', 0, 0.05).step(0.001).onChange(controls.onChange);
    gui.add(controls, 'deltaY', 0, 0.05).step(0.001).onChange(controls.onChange);

    // レンダリング処理を実行する
    render();

    // ---------------------------------------
    // レンダリング関数
    // ---------------------------------------

    function render() {

        // アニメーションを生成する
        requestAnimationFrame(render);
        composer.render();

    }

}
