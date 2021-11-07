let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const loadCtm = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ---------------------------------------------
    // レンダラ生成処理
    // ---------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0x000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ---------------------------------------------
    // カメラ設定処理
    // ---------------------------------------------

    // カメラの位置を設定する
    camera.position.set(10, 10, 10);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // ---------------------------------------------
    // 点光源生成処理
    // ---------------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(20, 20, 20);

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("loadCtm-output").appendChild(webGLRenderer.domElement);

    // ---------------------------------------------
    // GUI生成処理
    // ---------------------------------------------

    let step = 0;

    // GUIを生成する
    let gui = new dat.GUI();

    // ローダーを生成する
    let loader = new THREE.CTMLoader();

    // グループを生成する
    let group = new THREE.Object3D();

    // 読み込み処理を実行する
    loader.load("../../assets/models/auditt_wheel.ctm", (geometry) => {

        // マテリアルを生成する
        let mat = new THREE.MeshLambertMaterial({color: 0xff8888});

        // メッシュを生成する
        group = new THREE.Mesh(geometry, mat);

        // スケールを設定する
        group.scale.set(20, 20, 20);

        // シーンにメッシュを追加する
        scene.add(group)

    }, {});

    // レンダリング処理を実行する
    render();

    // ---------------------------------------------
    // レンダリング関数
    // ---------------------------------------------

    function render() {

        if (group) {

            // メッシュを回転させる
            group.rotation.y += 0.006;
            group.rotation.x += 0.009;

        }

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

};
