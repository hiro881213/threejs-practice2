let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const make2dPlaneGeometries = () => {

    // ---------------------------------------
    // メッシュ生成処理
    // ---------------------------------------

    const createMesh = (geom) => {

        // マテリアルを生成する
        let meshMaterial = new THREE.MeshNormalMaterial();
        
        // 方向を設定する
        meshMaterial.side = THREE.DoubleSide;

        // ワイヤーフレームを生成する
        let wireFrameMat = new THREE.MeshBasicMaterial();

        // ワイヤーフレームを有効にする
        wireFrameMat.wireframe = true;

        // メッシュを生成する
        const plane = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

        return plane;

    };

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
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ---------------------------------------
    // メッシュ生成処理
    // ---------------------------------------

    // メッシュを生成する
    let plane = createMesh(new THREE.PlaneGeometry(10, 14, 4, 4));

    // シーンにメッシュを追加する
    scene.add(plane);

    // ---------------------------------------
    // カメラ設定処理
    // ---------------------------------------

    // カメラの位置を設定する
    camera.position.set(-20, 30, 40);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // ---------------------------------------
    // 点光源生成処理
    // ---------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(-40, 60, -10);

    // シーンに点光源を設定する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに追加する
    document.getElementById("2dPlaneGeometries-output").appendChild(webGLRenderer.domElement);

    // ---------------------------------------
    // コントローラ生成処理
    // ---------------------------------------

    // コントローラを生成する
    let controls = new function() {

        // 幅
        this.width = plane.children[0].geometry.parameters.width;

        // 高さ
        this.height = plane.children[0].geometry.parameters.height;

        // 幅(セグメント)
        this.widthSegments = plane.children[0].geometry.parameters.widthSegments;

        // 高さ(セグメント)
        this.heightSegments = plane.children[0].geometry.parameters.heightSegments;

        // 再描画
        this.redraw = function() {

            // シーンから平面を削除する
            scene.remove(plane);

            // 平面を生成する
            plane = createMesh(new THREE.PlaneGeometry(
                controls.width,
                controls.height,
                Math.round(controls.widthSegments),
                Math.round(controls.heightSegments)));

            // シーンに平面を追加する
            scene.add(plane);

        };

    };

    // // ---------------------------------------
    // // GUI生成処理
    // // ---------------------------------------

    // // GUIを生成する
    // let gui = new dat.GUI();

    // // 幅
    // gui.add(controls, 'width', 0, 40).onChange(controls.redraw);

    // // 高さ
    // gui.add(controls, 'height', 0, 40).onChange(controls.redraw);

    // // 幅(セグメント)
    // gui.add(controls, 'widthSegments', 0, 10).onChange(controls.redraw);

    // // 高さ(セグメント)
    // gui.add(controls, 'heightSegments', 0, 10).onChange(controls.redraw);

    // ---------------------------------------
    // レンダリング処理
    // ---------------------------------------

    let step = 0;

    const render = () => {

        // 平面を回転させる
        plane.rotation.y = step += 0.01;

        // レンダリング処理
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    };

    // レンダリング処理を実行する
    render();

};