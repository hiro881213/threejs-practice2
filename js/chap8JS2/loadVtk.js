let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const loadVtk = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // --------------------------------------------------
    // レンダラ生成処理
    // --------------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0x000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // --------------------------------------------------
    // カメラ設定処理
    // --------------------------------------------------

    // カメラの位置を設定する
    camera.position.set(10, 10, 10);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // --------------------------------------------------
    // 点光源生成処理
    // --------------------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(20, 20, 20);

    // シーンに点光源を設定する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("loadVtk-output").appendChild(webGLRenderer.domElement);

    // --------------------------------------------------
    // コントローラ生成処理
    // --------------------------------------------------

    let step = 0;

    let controls = new function() {};

    // --------------------------------------------------
    // GUI生成処理
    // --------------------------------------------------
    
    // GUIを生成する
    let gui = new dat.GUI();

    // --------------------------------------------------
    // ローダー生成処理
    // --------------------------------------------------

    // ローダーを生成する
    let loader = new THREE.VTKLoader();

    // グループを生成する
    let group = new THREE.Object3D();

    // データを読み取る
    loader.load("../../assets/models/moai_fixed.vtk", (geometry) => {

        // ジオメトリ設定処理
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        // マテリアルを生成する
        let mat = new THREE.MeshLambertMaterial({color: 0xaaffaa});

        // メッシュを生成する
        group = new THREE.Mesh(geometry, mat);

        // メッシュのスケールを設定する
        group.scale.set(9, 9, 9);

        // シーンにグループを追加する
        scene.add(group);

    });

    // レンダリング処理を実行する
    render();

    // --------------------------------------------------
    // レンダリング関数
    // --------------------------------------------------

    function render() {

        if (group) {

            // グループを回転させる
            group.rotation.y += 0.006;

        }

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

}