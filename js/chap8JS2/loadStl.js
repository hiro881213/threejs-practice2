let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const loadStl = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -----------------------------------------------
    // レンダラ生成処理
    // -----------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0x000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // -----------------------------------------------
    // カメラ設定処理
    // -----------------------------------------------

    // カメラの位置を設定する
    camera.position.set(150, 150, 150);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 40, 0));

    // -----------------------------------------------
    // 点光源生成処理
    // -----------------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(150, 150, 150);

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("loadStl-output").appendChild(webGLRenderer.domElement);

    // -----------------------------------------------
    // コントローラ生成処理
    // -----------------------------------------------

    let step = 0;

    // コントローラを生成する
    let controls = new function () {};

    // -----------------------------------------------
    // GUI生成処理
    // -----------------------------------------------

    let gui = new dat.GUI();

    // -----------------------------------------------
    // ローダー生成処理
    // -----------------------------------------------

    // ローダーを生成する
    let loader = new THREE.STLLoader();

    // グループを生成する
    let group = new THREE.Object3D();

    // 読み込み処理を実行する
    loader.load("../../assets/models/SolidHead_2_lowPoly_42k.stl", (geometry) => {

        // マテリアルを生成する
        let mat = new THREE.MeshLambertMaterial({color: 0x7777ff});

        // グループを生成する
        group = new THREE.Mesh(geometry, mat);

        // グループを回転させる
        group.rotation.x = -0.5 * Math.PI;

        // グループのスケールを設定する
        group.scale.set(0.6, 0.6, 0.6);

        // シーンにグループを追加する
        scene.add(group);

    });

    // レンダリング処理を実行する
    render();

    // -----------------------------------------------
    // レンダリング関数
    // -----------------------------------------------

    function render() {

        if (group) {

            // グループを回転させる
            group.rotation.z += 0.006;

        }

        // アニメーションを実行する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

}
