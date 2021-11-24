let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeUvMappingManual = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ------------------------------------------
    // レンダラ生成処理
    // ------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xffffff));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ------------------------------------------
    // カメラ設定処理
    // ------------------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 50);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // THREEJSオブジェクトにDOMを追加する
    document.getElementById("uvMappingManual-output").appendChild(webGLRenderer.domElement);

    // ------------------------------------------
    // メッシュ生成処理
    // ------------------------------------------

    let step = 0;

    // ローダーを生成する
    let textureLoader = new THREE.TextureLoader();

    // テクスチャを読み込む
    let texture = textureLoader.load("../../assets/textures/ash_uvgrid01.jpg");

    // マテリアルを生成する
    let mat = new THREE.MeshBasicMaterial({map: texture});

    // ジオメトリを生成する
    let geom = new THREE.BoxGeometry(24, 24, 24);

    // メッシュを生成する
    let mesh = new THREE.Mesh(geom, mat);

    // メッシュを回転させる
    mesh.rotation.set(0.5*Math.PI, 0.2*Math.PI, 0.2*Math.PI);

    // シーンにメッシュを追加する
    scene.add(mesh);

    // ------------------------------------------
    // コントローラ生成処理
    // ------------------------------------------

    // コントローラを生成する
    let controls = new function() {

        this.uv1 = geom.faceVertexUvs[0][0][0].x;
        this.uv2 = geom.faceVertexUvs[0][0][0].y;
        this.uv3 = geom.faceVertexUvs[0][0][1].x;
        this.uv4 = geom.faceVertexUvs[0][0][1].y;
        this.uv5 = geom.faceVertexUvs[0][0][2].x;
        this.uv6 = geom.faceVertexUvs[0][0][2].y;

    };

    // ------------------------------------------
    // GUI生成処理
    // ------------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // uv1
    gui.add(controls, "uv1", 0, 1).onChange((e) => {

        geom.faceVertexUvs[0][0][0].x = e;
        geom.uvsNeedUpdate = true;

    });

    // uv2
    gui.add(controls, "uv2", 0, 1).onChange((e) => {

        geom.faceVertexUvs[0][0][0].y = e;
        geom.uvsNeedUpdate = true;

    });

    // uv3
    gui.add(controls, "uv3", 0, 1).onChange((e) => {

        geom.faceVertexUvs[0][0][1].x = e;
        geom.uvsNeedUpdate = true;

    });

    // uv4
    gui.add(controls, "uv4", 0, 1).onChange((e) => {

        geom.faceVertexUvs[0][0][1].y = e;
        geom.uvsNeedUpdate = true;

    });

    // uv5
    gui.add(controls, "uv5", 0, 1).onChange((e) => {

        geom.faceVertexUvs[0][0][2].x = e;
        geom.uvsNeedUpdate = true;

    });

    // uv6
    gui.add(controls, "uv6", 0, 1).onChange((e) => {

        geom.faceVertexUvs[0][0][2].y = e;
        geom.uvsNeedUpdate = true;

    });

    // レンダリング処理を実行する
    render();

    // ------------------------------------------
    // レンダリング関数
    // ------------------------------------------

    function render() {

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

}
