let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const make3dConeGeometries = () => {
    
    // シーンを生成する
    let scene = new THREE.Scene();

    // カメラを生成する
    let camera = new THREE.PerspectiveCamera(45, width/ height, 0.1, 1000);

    // ------------------------------------------
    // レンダラ生成処理
    // ------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを設定する
    webGLRenderer.shadowMap.enabled = true;

    // ------------------------------------------
    // メッシュ生成処理
    // ------------------------------------------

    // メッシュを生成する
    let cone = createMesh(new THREE.ConeGeometry(20, 20));

    // シーンにメッシュを追加する
    scene.add(cone);

    // ------------------------------------------
    // カメラ設定処理
    // ------------------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 50);
    
    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // THREEJSオブジェクトをDOMに追加する
    document.getElementById("3dConeGeometries-output").appendChild(webGLRenderer.domElement);

    // ------------------------------------------
    // コントローラ生成処理
    // ------------------------------------------

    let step = 0;

    let controls = new function () {

        // radius
        this.radius = 20;

        // height
        this.height = 20;

        // radialセグメント
        this.radialSegments = 8;

        // heightセグメント
        this.heightSegments = 8;

        // openEnd
        this.openEnded = false;

        // thetaStart
        this.thetaStart = 0;

        // thetaLength
        this.thetaLength = 2 * Math.PI;

        // 再描画処理
        this.redraw = function () {

            // シーンにメッシュを削除する
            scene.remove(cone);

            // メッシュを生成する
            cone = createMesh(new THREE.ConeGeometry(controls.radius, controls.height, controls.radialSegments, controls.heightSegments, controls.openEnded, controls.thetaStart, controls.thetaLength));

            // シーンにメッシュを追加する
            scene.add(cone);

        };

    };

    // ------------------------------------------
    // GUI生成処理
    // ------------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // radius
    gui.add(controls, 'radius', -40, 40).onChange(controls.redraw);

    // height
    gui.add(controls, 'height', 0, 40).onChange(controls.redraw);

    // radialセグメント
    gui.add(controls, 'radialSegments', 1, 20).step(1).onChange(controls.redraw);

    // heightセグメント
    gui.add(controls, 'heightSegments', 1, 20).step(1).onChange(controls.redraw);

    // openEnd
    gui.add(controls, 'openEnded').onChange(controls.redraw);

    // thetaStart
    gui.add(controls, 'thetaStart', 0, 2 * Math.PI).onChange(controls.redraw);

    // thetaLegth
    gui.add(controls, 'thetaLength', 0, 2 * Math.PI).onChange(controls.redraw);

    // レンダリング処理
    render();

    // ------------------------------------------
    // メッシュ生成関数
    // ------------------------------------------

    function createMesh(geom) {

        // マテリアルを生成する
        let meshMaterial = new THREE.MeshNormalMaterial();
        meshMaterial.side = THREE.DoubleSide;

        // ワイヤーフレームを生成する
        let wireFrameMat = new THREE.MeshBasicMaterial();
        wireFrameMat.wireframe = true;

        // メッシュを生成する
        let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

        return mesh;

    };

    // ------------------------------------------
    // メッシュ生成関数
    // ------------------------------------------

    function render() {

        // メッシュを回転させる
        cone.rotation.y = step += 0.01;

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    };

}
