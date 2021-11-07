let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const loadCollada = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // --------------------------------------
    // レンダラ生成処理
    // --------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xcccccc));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // --------------------------------------
    // カメラ設定処理
    // --------------------------------------

    // カメラの位置を設定する
    camera.position.set(150, 150, 150);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 20, 0));

    // --------------------------------------
    // 点光源生成処理
    // --------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(150, 150, 150);

    // intensity
    spotLight.intensity = 2;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("loadCollada-output").appendChild(webGLRenderer.domElement);

    // --------------------------------------
    // ローダー生成処理
    // --------------------------------------

    // ローダーを生成する
    let loader = new THREE.ColladaLoader();

    // メッシュを生成する
    let mesh;

    loader.load("../../assets/models/dae/Truck_dae.dae", (result) => {

        // メッシュをコピーする
        mesh = result.scene.children[0].children[0].clone();

        // スケールを設定する
        mesh.scale.set(4, 4, 4);

        // シーンにメッシュを追加する
        scene.add(mesh);

    });

    render();

    function render() {

        // アニメーションを生成する
        // requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

}
