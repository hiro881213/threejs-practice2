let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeFirstPersonCamera = () => {
    
    // クロックを生成する
    let clock = new THREE.Clock();

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
    // カメラ設定処理
    // ------------------------------------

    // カメラの位置を設定する
    camera.position.set(100, 10, 10);

    // カメラの位置を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // ------------------------------------
    // コントローラ生成処理
    // ------------------------------------

    // コントローラを生成する
    let camControls = new THREE.FirstPersonControls(camera);

    // lookSpeed
    camControls.lookSpeed = 0.4;

    // movementSpedd
    camControls.movementSpeed = 20;

    // noFly
    camControls.noFly = true;

    // lookVertical
    camControls.lookVertical = true;

    // constrainVertical
    camControls.constrainVertical = true;

    // verticalMin
    camControls.verticalMin = 1.0;

    // verticalMax
    camControls.verticalMax = 2.0;

    // lon
    camControls.lon = -150;

    // lat
    camControls.lat = 120;

    // ------------------------------------
    // 環境光生成処理
    // ------------------------------------

    // 環境光を生成する
    const ambientLight = new THREE.AmbientLight(0xffffff);

    // シーンに環境光を追加する
    scene.add(ambientLight);

    // ------------------------------------
    // 点光源生成処理
    // ------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(100, 140, 130);

    // intensity
    spotLight.intensity = 2;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに追加する
    document.getElementById("firstPersonCamera-output").appendChild(webGLRenderer.domElement);

    // ------------------------------------
    // メッシュ生成処理
    // ------------------------------------

    let step = 0;

    // メッシュを定義する
    let mesh;

    // ロードを実行する
    let load = (object) => {

        // スケールを設定する
        let scale = chroma.scale(['red', 'green', 'blue']);

        // ランダム色設定を実行する
        setRandomColors(object, scale);

        // メッシュを設定する
        mesh = object;

        scene.add(mesh);

    }

    // ------------------------------------
    // テクスチャ生成処理
    // ------------------------------------

    // テクスチャローダーを生成する
    let textureLoader = new THREE.TextureLoader();

    // テクスチャを生成する
    let texture = textureLoader.load('../../assets/textures/Metro01.JPG');

    // mtlローダーを生成する
    let mtlLoader = new THREE.MTLLoader();

    // パスを生成する
    mtlLoader.setPath("../../assets/models/");

    // ベースURLを生成する
    mtlLoader.setBaseUrl("../../assets/models/");

    // ファイルを読み込む
    mtlLoader.load('city.mtl', (materials) => {

        // マテリアルを読み込む
        materials.preload();

        // オブジェクトローダーを生成する
        let objLoader = new THREE.OBJLoader();

        // パスを設定する
        objLoader.setMaterials(materials);

        // パスを設定する
        objLoader.setPath("../../assets/models/");

        // ファイルを読み込む
        objLoader.load('city.obj', load);

    });

    // レンダリング処理を実行する
    render();

    // ------------------------------------
    // 色設定関数1
    // ------------------------------------

    function setRandomColors(object, scale) {

        let children = object.children;

        if (children && children.length > 0) {

            children.forEach((e) => {

                setRandomColors(e, scale);

            });

        } else {

            if (object instanceof THREE.Mesh) {

                _setRandomColors(object.material, scale);

            }

        }

    };

    // ------------------------------------
    // 色設定関数2
    // ------------------------------------

    function _setRandomColors(material, scale) {

        if (material instanceof THREE.MultiMaterial) {

            material.materials.forEach((mat) => {

                _setRandomColors(mat, scale);

            });

        } else {

            // マテリアルの色を設定する
            material.color = new THREE.Color(scale(Math.random()).hex());

            if (material.name && material.name.indexOf("building") == 0) {

                // emissive
                material.emissive = new THREE.Color(0x444444);

                // transparent
                material.transparent = true;

                // opacity
                material.opacity = 0.8;

            }

        }

    }

    // ------------------------------------
    // レンダリング関数
    // ------------------------------------

    function render() {

        // デルタを生成する
        let delta = clock.getDelta();

        // コントローラを更新する
        camControls.update(delta);

        // レンダラをクリアする
        webGLRenderer.clear();

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

};
