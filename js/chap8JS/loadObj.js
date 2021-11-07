let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const loadObject = () => {
    
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
    webGLRenderer.setClearColor(new THREE.Color(0xaaaaff));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ---------------------------------------------
    // カメラ設定処理
    // ---------------------------------------------

    // カメラの位置を設定する
    camera.position.set(130, 40, 50);

    // カメラの方向を設定する
    camera.lookAt(scene.position);

    // シーンにカメラを追加する
    scene.add(camera);

    // ---------------------------------------------
    // 点光源生成処理
    // ---------------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.DirectionalLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(30, 40, 50);

    // intensity
    spotLight.intensity = 1;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトにDOMを設定する
    document.getElementById("loadObject-output").appendChild(webGLRenderer.domElement);

    // ---------------------------------------------
    // コントローラ生成処理
    // ---------------------------------------------

    let step = 0;

    // コントローラを生成する
    let controls = new function () {};

    // ---------------------------------------------
    // GUI生成処理
    // ---------------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // メッシュを生成する
    let mesh;

    // ---------------------------------------------
    // ローダー生成処理
    // ---------------------------------------------

    // ローダーを生成する
    let loader = new THREE.OBJLoader();

    // オブジェクトを読み込む
    loader.load("../../assets/models/pinecone.obj", (loadedMesh) => {

        // マテリアルを生成する
        let material = new THREE.MeshLambertMaterial({color: 0x5CA21});

        // メッシュを生成する
        loadedMesh.children.forEach((child) => {

            // マテリアルを設定する
            child.material = material;

            // ジオメトリを設定する
            child.geometry.computeFaceNormals();
            child.geometry.computeVertexNormals();

        });

        // メッシュを生成する
        mesh = loadedMesh;

        // メッシュのスケールを設定する
        loadedMesh.scale.set(100, 100, 100);

        // メッシュを回転させる
        loadedMesh.rotation.x = -0.3;

        // シーンにメッシュを追加する
        scene.add(loadedMesh);

    });

    // レンダリング処理を実行する
    render();

    // ---------------------------------------------
    // レンダリング関数
    // ---------------------------------------------

    function render() {

        if (mesh) {

            // メッシュを回転させる
            mesh.rotation.y += 0.006;
            mesh.rotation.x += 0.006;

        }

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

}
