let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const make3dSphereGeometries = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ---------------------------------
    // レンダラ設定処理
    // ---------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ---------------------------------
    // メッシュ生成処理
    // ---------------------------------

    // メッシュを生成する
    let sphere = createMesh(new THREE.SphereGeometry(4, 10, 10))

    // シーンにメッシュを追加する
    scene.add(sphere);

    // ---------------------------------
    // カメラ設定処理
    // ---------------------------------

    // カメラの位置を設定する
    camera.position.set(-20, 30, 40);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("3dSphereGeometries-output").appendChild(webGLRenderer.domElement);

    // ---------------------------------
    // コントローラ生成処理
    // ---------------------------------

    let step = 0;

    // コントローラを生成する
    let controls = new function() {

        // radius
        this.radius = sphere.children[0].geometry.parameters.radius;

        // 幅(セグメント)
        this.widthSegments = sphere.children[0].geometry.parameters.widthSegments;

        // 高さ(セグメント)
        this.heightSegments = sphere.children[0].geometry.parameters.heightSegments;

        // phiStart
        this.phiStart = 0;

        // phiLength
        this.phiLength = Math.PI * 2;

        // thetaStart
        this.thetaStart = 0;

        // thetaLength
        this.thetaLength = Math.PI;

        // 再描画処理
        this.redraw = function() {

            // シーンからメッシュを削除する
            scene.remove(sphere);

            // メッシュを再生成する
            sphere = createMesh(new THREE.SphereGeometry(
                controls.radius,
                controls.widthSegments,
                controls.heightSegments,
                controls.phiStart,
                controls.phiLength,
                controls.thetaStart,
                controls.thetaLength
            ));

            // シーンにメッシュを追加する
            scene.add(sphere);

        };

    };

    // // ---------------------------------
    // // GUI生成処理
    // // ---------------------------------

    // // GUIを生成する
    // let gui = new dat.GUI();

    // // radius
    // gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);

    // // 幅(セグメント)
    // gui.add(controls, 'widthSegments', 0, 20).onChange(controls.redraw);

    // // 高さ(セグメント)
    // gui.add(controls, 'heightSegments', 0, 20).onChange(controls.redraw);

    // // phiStart
    // gui.add(controls, 'phiStart', 0, 2 * Math.PI).onChange(controls.redraw);

    // // phiLength
    // gui.add(controls, 'phiLength', 0, 2 * Math.PI).onChange(controls.redraw);

    // // thetaStart
    // gui.add(controls, 'thetaStart', 0, 2 * Math.PI).onChange(controls.redraw);

    // // thetaLength
    // gui.add(controls, 'thetaLength', 0, 2 * Math.PI).onChange(controls.redraw);

    // レンダリング処理を実行する
    render();

    // ---------------------------------
    // メッシュ生成関数
    // ---------------------------------

    function createMesh(geom) {

        // メッシュを生成する
        let meshMaterial = new THREE.MeshNormalMaterial();

        // メッシュの方向を設定する
        meshMaterial.side = THREE.DoubleSide;

        // ワイヤーフレームを生成する
        let wireFrameMat = new THREE.MeshBasicMaterial();

        // ワイヤーフレームを有効にする
        wireFrameMat.wireframe = true;

        // メッシュを生成する
        let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

        return mesh;

    }

    // ---------------------------------
    // レンダリング関数
    // ---------------------------------

    function render() {

        // メッシュを回転する
        sphere.rotation.y = step += 0.01;

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

};
