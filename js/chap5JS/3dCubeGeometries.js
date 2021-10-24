let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const make3dCubeGeometries = () => {
    
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
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ------------------------------------
    // メッシュ生成処理
    // ------------------------------------

    // メッシュを生成する
    let cube = createMesh(new THREE.BoxGeometry(10, 10, 10, 1, 1, 1));

    // シーンにメッシュを追加する
    scene.add(cube);

    // ------------------------------------
    // カメラ設定処理
    // ------------------------------------

    // カメラの位置を設定する
    camera.position.set(-20, 30, 40);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // ------------------------------------
    // 点光源設定処理
    // ------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(-40, 60, -10);

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("3dCubeGeometries-output").appendChild(webGLRenderer.domElement);

    // ------------------------------------
    // コントローラ生成処理
    // ------------------------------------

    let step = 0;

    let controls = new function() {

        // 幅
        this.width = cube.children[0].geometry.parameters.width;

        // 高さ
        this.height = cube.children[0].geometry.parameters.height;

        // 深さ
        this.depth = cube.children[0].geometry.parameters.depth;

        // 幅(セグメント)
        this.widthSegments = cube.children[0].geometry.parameters.widthSegments;

        // 高さ(セグメント)
        this.heightSegments = cube.children[0].geometry.parameters.heightSegments;

        // 深さ(セグメント)
        this.depthSegments = cube.children[0].geometry.parameters.depthSegments;

        //再描画処理
        this.redraw = function() {

            // シーンからメッシュを削除する
            scene.remove(cube);

            // メッシュを再生成する
            cube = createMesh(new THREE.BoxGeometry(
                controls.width, 
                controls.height,
                controls.depth,
                Math.round(controls.widthSegments),
                Math.round(controls.heightSegments),
                Math.round(controls.depthSegments)));

            // シーンにメッシュを追加する
            scene.add(cube);

        };

    };

    // ------------------------------------
    // GUI生成処理
    // ------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // 幅
    gui.add(controls, 'width', 0, 40).onChange(controls.redraw);

    // 高さ
    gui.add(controls, 'height', 0, 40).onChange(controls.redraw);

    // 深さ
    gui.add(controls, 'depth', 0, 40).onChange(controls.redraw);

    // 幅(セグメント)
    gui.add(controls, 'widthSegments', 0, 10).onChange(controls.redraw);

    // 高さ(セグメント)
    gui.add(controls, 'heightSegments', 0, 10).onChange(controls.redraw);

    // 深さ(セグメント)
    gui.add(controls, 'depthSegments', 0, 10).onChange(controls.redraw);

    // レンダリング処理を実行する
    render();

    // ------------------------------------
    // メッシュ生成関数
    // ------------------------------------

    function createMesh(geom) {

        // マテリアルを生成する
        let meshMaterial = new THREE.MeshNormalMaterial();

        // 方向を設定する
        meshMaterial.side = THREE.DoubleSide;

        // ワイヤーフレームを生成する
        let wireFrameMat = new THREE.MeshBasicMaterial();

        // ワイヤーフレームを有効にする
        wireFrameMat.wireframe = true;

        // メッシュを生成する
        let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

        return mesh;

    }

    // ------------------------------------
    // レンダラ関数
    // ------------------------------------

    function render() {

        // メッシュを回転する
        cube.rotation.y = step += 0.01;

        // アニメーションを実行する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

}
