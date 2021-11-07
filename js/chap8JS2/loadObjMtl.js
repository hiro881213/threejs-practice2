let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const loadObjMtl = () => {

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

    // シャドウマップを設定する
    webGLRenderer.shadowMap.enabled = true;

    // ---------------------------------------
    // カメラ設定処理
    // ---------------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 50);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 10, 0));

    // ---------------------------------------
    // 点光源生成処理
    // ---------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(0, 40, 30);

    // intensity
    spotLight.intensity = 2;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("loadObjMtl-output").appendChild(webGLRenderer.domElement);

    // ---------------------------------------
    // コントローラ生成処理
    // ---------------------------------------

    let step = 0;

    // コントローラを生成する
    let controls = new function () {};

    // ---------------------------------------
    // GUI生成処理
    // ---------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // メッシュを生成する
    let mesh;

    // ---------------------------------------
    // MTLオブジェクトメッシュ生成処理
    // ---------------------------------------

    // ローダーを生成する
    let mtlLoader = new THREE.MTLLoader();

    // パスを設定する
    mtlLoader.setPath("../../assets/models/");

    // ファイルを読み込む
    mtlLoader.load('butterfly.mtl', (materials) => {

        // マテリアルを読み込む
        materials.preload();

        // オブジェクトを読み込む
        let objLoader = new THREE.OBJLoader();

        // マテリアルを設定する
        objLoader.setMaterials(materials);

        // パスを設定する
        objLoader.setPath("../../assets/models/");

        // 読み込み処理を実行する
        objLoader.load('butterfly.obj', (object) => {

            // wingSetting
            let wing2 = object.children[5];
            let wing1 = object.children[4];

            // wing1を設定する
            wing1.material.opacity = 0.6;
            wing1.material.transparent = true;
            wing1.material.depthTest = false;
            wing1.material.side = THREE.DoubleSide;

            // wing2を設定する
            wing2.material.opacity = 0.6;
            wing2.material.depthTest = false;
            wing2.material.transparent = true;
            wing2.material.side = THREE.DoubleSide;

            // オブジェクトの設定を行う
            object.scale.set(140, 140, 140);

            // メッシュを設定する
            mesh = object;

            // シーンにメッシュを追加する
            scene.add(mesh);

            // メッシュを回転させる
            object.rotation.x = 0.2;
            object.rotation.y = -1.3;

        });

    });

    // レンダリング処理を実行する
    render();

    function render() {

        // if (mesh) {

        //     // メッシュを回転させる
        //     mesh.rotation.y += 0.006;

        // }

        // アニメーションを生成する
        // requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

};
