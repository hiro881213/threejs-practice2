let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const make2dCircleGeometries = () => {

    // -------------------------------------------
    // メッシュ生成処理
    // -------------------------------------------

    const createMesh = (geom) => {

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

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -------------------------------------------
    // レンダラ生成処理
    // -------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを設定する
    webGLRenderer.shadowMap.enabled = true;

    // -------------------------------------------
    // メッシュ生成処理
    // -------------------------------------------

    // サークルを生成する
    let circle = createMesh(new THREE.CircleGeometry(4, 10, 0.3*Math.PI*2, 0.3*Math.PI*2));

    // シーンにサークルを追加する
    scene.add(circle);

    // -------------------------------------------
    // カメラ設定処理
    // -------------------------------------------

    // カメラ位置を設定する
    camera.position.set(-40, 60, -10);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // -------------------------------------------
    // 点光源生成処理
    // -------------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(-40, 60, -10);

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("2dCircleGeometries-output").appendChild(webGLRenderer.domElement);

    // -------------------------------------------
    // コントローラ設定処理
    // -------------------------------------------

    let step = 0;

    let controls = new function() {

        this.radius = 4;

        this.thetaStart = 0.3 * Math.PI * 2;
        this.thetaLength = 0.3 * Math.PI * 2;

        // セグメント数
        this.segments = 10;

        // 再描画処理
        this.redraw = function() {

            // シーンにサークルを削除する
            scene.remove(circle);

            // サークルメッシュを再生成する
            circle = createMesh(new THREE.CircleGeometry(
                controls.radius,
                controls.segments,
                controls.thetaStart,
                controls.thetaLength
            ));

            // シーンにサークルを追加する
            scene.add(circle);

        };

    };

    // -------------------------------------------
    // GUI設定処理
    // -------------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // radius
    gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);

    // セグメント
    gui.add(controls, 'segments', 0, 40).onChange(controls.redraw);

    // thetaStart
    gui.add(controls, 'thetaStart', 0, 2*Math.PI).onChange(controls.redraw);

    // thetaLegth
    gui.add(controls, 'thetaLength', 0, 2*Math.PI).onChange(controls.redraw);

    // -------------------------------------------
    // レンダラ設定処理
    // -------------------------------------------

    const render = () => {

        // サークルを回転させる
        circle.rotation.y = step += 0.01;

        // アニメーション設定する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    };

    render();

};
