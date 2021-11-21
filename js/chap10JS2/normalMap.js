let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeNormalMap = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -------------------------------------
    // レンダラ生成処理
    // -------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // -------------------------------------
    // 球体生成処理
    // -------------------------------------

    // 球体1を生成する
    let sphere1 = createMesh(new THREE.BoxGeometry(15, 15, 15), "plaster.jpg");
    
    // 球体1を回転させる
    sphere1.rotation.y = -0.5;

    // 球体1の位置を設定する
    sphere1.position.x = 12;

    // シーンに球体1を追加する
    scene.add(sphere1);

    // 球体2を生成する
    let sphere2 = createMesh(new THREE.BoxGeometry(15,15,15), "plaster.jpg", "plaster-normal.jpg");

    // 球体2を回転させる
    sphere2.rotation.y = 0.5;

    // 球体2の位置を設定する
    sphere2.position.x = 12;

    // シーンに球体2を追加する
    scene.add(sphere2);

    // -------------------------------------
    // 平面生成処理
    // -------------------------------------

    // ローダーを生成する
    let textureLoader = new THREE.TextureLoader();

    // テクスチャを読み込む
    let floorTex = textureLoader.load("../../assets/general/floor-wood.jpg");

    // 平面メッシュを生成する
    let plane = new THREE.Mesh(
        new THREE.BoxGeometry(200, 100, 0.1, 30), 
        new THREE.MeshPhongMaterial({
            color: 0x3c3c3c,
            map  : floorTex
        })
    );

    // 平面メッシュの位置を設定する
    plane.position.y = -7.5;

    // 平面メッシュを回転させる
    plane.rotation.x = -0.5*Math.PI;

    // シーンに平面メッシュを追加する
    scene.add(plane);

    // -------------------------------------
    // カメラ設定処理
    // -------------------------------------

    // カメラの位置を設定する
    camera.position.set(0, 12, 38);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // -------------------------------------
    // 環境光生成処理
    // -------------------------------------

    // 環境光を生成する
    let ambiLight = new THREE.AmbientLight(0x242424);

    // シーンに環境光を追加する
    scene.add(ambiLight);

    // -------------------------------------
    // 点光源生成処理
    // -------------------------------------

    // 点光源を生成する
    let light = new THREE.SpotLight();

    // 点光源の位置を設定する
    light.position.set(0, 30, 30);

    // intensity
    light.intensity = 1.2;

    // シーンに点光源を追加する
    scene.add(light);

    // -------------------------------------
    // 直接光生成処理
    // -------------------------------------

    // 直接光色を生成する
    let pointColor = "#ff5808";

    // 直接光を生成する
    let directionalLight = new THREE.PointLight(pointColor);

    // シーンに直接光を追加する
    scene.add(directionalLight);

    // -------------------------------------
    // 球体メッシュ生成処理
    // -------------------------------------

    // 球体ジオメトリを生成する
    let sphereLight = new THREE.SphereGeometry(0.2);

    // 球体マテリアルを生成する
    let spehreLightMaterial = new THREE.MeshBasicMaterial({color: 0xac6c25});

    // 球体メッシュを生成する
    let sphereLightMesh = new THREE.Mesh(sphereLight, spehreLightMaterial);

    // 球体メッシュのキャストシャドウを有効にする
    sphereLightMesh.castShadow = true;

    // 球体メッシュの位置を設定する
    sphereLightMesh.position.set(3, 3, 3);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("normalMap-output").appendChild(webGLRenderer.domElement);

    // -------------------------------------
    // コントローラ生成処理
    // -------------------------------------

    let step = 0;

    // コントローラを生成する
    let controls = new function() {

        // スケール
        this.normalScale = 1;

        // テクスチャ変更
        this.changeTexture = "plaster";

        // 回転
        this.rotate = false;

        // テクスチャ変更処理
        this.changeTexture = (e) => {

            // jpgを読み込む
            let texture = textureLoader.load("../../assets/textures/general/" + e + ".jpg");

            // メッシュにテクスチャを設定する
            sphere2.material.map = texture;
            sphere1.material.map = texture;

            // bumpを読み込む
            let bump = textureLoader.load("../../assets/textures/general/" + e + "normal.jpg");

            // メッシュにテクスチャを設定する
            sphere2.material.normalMap = bump;

        };

        // bump更新処理
        this.updateBump = (e) => {

            // bumpスケールを設定する
            sphere2.material.normalScale.set(e, e);

        }

    };

    // -------------------------------------
    // GUI生成処理
    // -------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // normalScale
    gui.add(controls, "normalScale", -2, 2).onChange(controls.updateBump);

    // changeTexture
    gui.add(controls, "changeTexture", ['plaster', 'bachroom', 'metal-floor']).onChange(controls.changeTexture);

    // rotate
    gui.add(controls, "rotate");

    // -------------------------------------
    // メッシュ生成関数
    // -------------------------------------

    function createMesh(geom, imageFile, normal) {

        // テクスチャローダーを生成する
        let textureLoader = new THREE.TextureLoader();

        if (normal) {

            let t = textureLoader.load("../../assets/textures/general/" + imageFile);
            let m = textureLoader.load("../../assets/textures/general/" + normal);

            // マテリアルを生成する
            let mat2 = new THREE.MeshPhongMaterial();

            // マテリアルにマップを設定する
            mat2.map = t;
            mat2.normalMap = m;

            // メッシュを生成する
            let mesh = new THREE.Mesh(geom, mat2);

            return mesh;

        } else {

            let t = textureLoader.load("../../assets/textures/general/" + imageFile);

            // マテリアルにマップを設定する
            let mat1 = new THREE.MeshPhongMaterial({map: t});

            // メッシュを生成する
            let mesh = new THREE.Mesh(geom, mat1);

            return mesh;

        }

    };

    // -------------------------------------
    // マテリアル生成関数
    // -------------------------------------

    function createNormalmapShaderMaterial(diffuseMap, normalMap) {

        // シェーダーを生成する
        let shader = THREE.ShaderLib["normalmap"];

        let uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        // テクスチャを読み込む
        let dT = textureLoader.load(diffuseMap);
        let nT = textureLoader.load(normalMap);

        uniforms["uShininess"].value = 50;
        uniforms["enableDiffuse"].value = true;
        uniforms["uDiffuseColor"].value.setHex(0xffffff);
        uniforms["tDiffuse"].value = dT;
        uniforms["tNormal"].value = nT;

        uniforms["uNormalScale"].value.set(1, 1);
        uniforms["uSpecularColor"].value.setHex(0xffffff);
        uniforms["enableSpecular"].value = true;

        return new THREE.ShaderMaterial({
            fragmentShader : shader.fragmentShader,
            vertexShader   : shader.vertexShade,
            uniforms       : uniforms,
            lights         : true


        });

    }

    let invert = 1;
    let phase  = 0;

    // レンダリング処理を実行する
    render();

    // -------------------------------------
    // レンダリング関数
    // -------------------------------------

    function render() {

        step += 0.1;

        if (controls.rotate) {

            sphere1.rotation.y -= 0.01;
            sphere2.rotation.y += 0.01;

        }

        if (phase > 2 * Math.PI) {

            inivert = invert * -1;
            phase -= 2* Math.PI;

        } else {

            phase += 0.03;

        }

        // メッシュの位置を設定する
        sphereLightMesh.position.z = +(21 * (Math.sin(phase)));
        sphereLightMesh.position.x = -14 + (14 * (Math.cos(phase)));

        if (invert < 0) {

            let pivot = 0;
            sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;

        }

        // 直接光の位置を設定する
        directionalLight.position.copy(sphereLightMesh.position);

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    };

}
