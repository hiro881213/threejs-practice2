let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const loadBlenderJsonObject = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ----------------------------------------
    // レンダラ生成処理
    // ----------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを設定する
    webGLRenderer.shadowMap.enabled = true;

    // ----------------------------------------
    // カメラ設定処理
    // ----------------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 50);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 10, 0));

    // ----------------------------------------
    // 点光源生成処理
    // ----------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(0, 50, 30);

    // intensityを設定する
    spotLight.intensity = 2;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("loadBlenderJson-output").appendChild(webGLRenderer.domElement);

    // ----------------------------------------
    // コントローラ生成処理
    // ----------------------------------------

    let step = 0;

    let controls = new function() {};

    // ----------------------------------------
    // GUI生成処理
    // ----------------------------------------

    let gui = new dat.GUI();

    let mesh;

    // ----------------------------------------
    // ローダー処理
    // ----------------------------------------

    // ローダーを読み込む
    let loader = new THREE.JSONLoader();

    // JSファイルを読み込む
    loader.load('../../assets/models/misc_chair01.js', (geometry, mat) => {

        // メッシュを生成する
        mesh = new THREE.Mesh(geometry, mat[0]);

        // メッシュのスケールを実行する
        mesh.scale.set(15, 15, 15);

        // シーンにメッシュを追加する
        scene.add(mesh);

    });

    // レンダリング処理を実行する
    render();

    // ----------------------------------------
    // レンダリング関数
    // ----------------------------------------

    function render() {

        if (mesh) {

            // メッシュを回転させる
            mesh.rotation.y += 0.02;
        
        }

        // アニメーションを実行する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

};