let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeFlyControls = () => {
    
    // クロックを生成する
    let clock = new THREE.Clock();

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
    webGLRenderer.setClearColor(new THREE.Color(0x000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // -----------------------------------------
    // カメラ設定処理
    // -----------------------------------------

    // カメラの位置を設定する
    camera.position.set(100, 100, 300);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // -----------------------------------------
    // flyControl生成処理
    // -----------------------------------------

    // flyControlを生成する
    let flyControls = new THREE.FlyControls(camera);

    // 動作スピード
    flyControls.movementSpeed = 25;
    flyControls.domElement = document.querySelector("#flyControls-output")

    // rollスピード
    flyControls.rollSpeed = Math.PI/24;

    // autoForward
    flyControls.autoForward = true;

    // dragToLook
    flyControls.dragToLook = false;

    // -----------------------------------------
    // 環境光生成処理
    // -----------------------------------------

    // 環境光を生成する
    const ambientLight = new THREE.AmbientLight(0x383838);
    
    // シーンに環境光に追加する
    scene.add(ambientLight);

    // -----------------------------------------
    // 点光源生成処理
    // -----------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(100, 140, 130);

    // intensity
    spotLight.intensity = 2;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("flyControls-output").appendChild(webGLRenderer.domElement);

    // -----------------------------------------
    // メッシュ生成処理
    // -----------------------------------------

    // メッシュを生成する
    let mesh;

    // ロード処理を実行する
    let load = (object) => {

        // スケールを設定する
        let scale = chroma.scale(['red', 'green', 'blue']);
        setRandomColors(object, scale);

        mesh = object;

        // シーンにメッシュを追加する
        scene.add(mesh);

    };

    // -----------------------------------------
    // テクスチャ生成処理
    // -----------------------------------------

    // テクスチャローダを生成する
    let textureLoader = new THREE.TextureLoader();

    // テクスチャを読み込む
    let texture = textureLoader.load('../../assets/textures/Metro01.JPG');

    // mtlLoader
    let mtlLoader = new THREE.MTLLoader();

    // パスを設定する
    mtlLoader.setPath("../../assets/models/");

    // BaseURL
    mtlLoader.setBaseUrl("../../assets/models/");

    // 読み込み処理
    mtlLoader.load("city.mtl", (materials) => {

        materials.preload();

        let objLoader = new THREE.OBJLoader();

        // マテリアルを設定する
        objLoader.setMaterials(materials);

        // パスを設定する
        objLoader.setPath("../../assets/models/");

        objLoader.load('city.obj', load);

    });

    render();

    // -----------------------------------------
    // 色設定関数1
    // -----------------------------------------

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

    }

    // -----------------------------------------
    // 色設定関数2
    // -----------------------------------------

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

                // 透過性
                material.transparent = true;
                material.opacity = 0.8;

            }

        }

    };

    // -----------------------------------------
    // レンダリング関数
    // -----------------------------------------

    function render() {

        let delta = clock.getDelta();

        // コントローラを更新する
        flyControls.update(delta);

        // レンダラをクリアする
        webGLRenderer.clear();

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

};
