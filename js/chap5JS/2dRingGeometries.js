let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const make2dRingGeometries = () => {

    // ------------------------------------------
    // メッシュ生成処理
    // ------------------------------------------

    const createMesh = (geom) => {

        // マテリアルを生成する
        let meshMaterial = new THREE.MeshNormalMaterial();

        // マテリアルの方向を設定する
        meshMaterial.side = THREE.DoubleSide;

        // ワイヤーフレームを生成する
        let wireFrameMat = new THREE.MeshBasicMaterial();

        // ワイヤーフレームを有効にする
        wireFrameMat.wireframe = true;

        // メッシュを生成する
        let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

        return mesh;

    };


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
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ------------------------------------------
    // メッシュ生成処理
    // ------------------------------------------

    // メッシュを生成する
    let torus = createMesh(new THREE.RingGeometry());

    // シーンにメッシュを追加する
    scene.add(torus);

    // ------------------------------------------
    // カメラ設定処理
    // ------------------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 50);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("2dRingGeometries-output").appendChild(webGLRenderer.domElement);

    // ------------------------------------------
    // コントローラ設定処理
    // ------------------------------------------

    let step = 0;

    let controls = new function() {

        // 内部Radius
        this.innerRadius = 0;
        
        // 外部Radius
        this.outerRadius = 36;

        // シータセグメント
        this.thetaSegments = 8;

        // Phiセグメント
        this.phiSegments = 8;

        // シータスタート
        this.thetaStart = 0;

        // シータレングス
        this.thetaLength = Math.PI * 2;

        // 再描画
        this.redraw = function() {
            
            // シーンからメッシュを削除する
            scene.remove(torus);

            // メッシュを生成する
            torus = createMesh(new THREE.RingGeometry(
                controls.innerRadius,
                controls.outerRadius,
                controls.thetaSegments,
                controls.phiSegments,
                controls.thetaStart,
                controls.thetaLength
            ));

            // シーンにメッシュを追加する
            scene.add(torus);

        };

    };

    // ------------------------------------------
    // GUI設定処理
    // ------------------------------------------

    // // GUIを生成する
    // let gui = new dat.GUI();

    // // 内部Radius
    // gui.add(controls, 'innerRadius', 0, 40).onChange(controls.redraw);

    // // 外部Radius
    // gui.add(controls, 'outerRadius', 0, 100).onChange(controls.redraw);

    // // シータセグメント
    // gui.add(controls, 'thetaSegments', 1, 40).step(1).onChange(controls.redraw);

    // // phiセグメント
    // gui.add(controls, 'phiSegments', 1, 20).step(1).onChange(controls.redraw);

    // // シータスタート
    // gui.add(controls, 'thetaStart', 0, Math.PI * 2).onChange(controls.redraw);

    // // シータレングス
    // gui.add(controls, 'thetaLength', 0, Math.PI * 2).onChange(controls.redraw);

    // ------------------------------------------
    // レンダラ設定処理
    // ------------------------------------------

    const render = () => {

        // メッシュを回転させる
        torus.rotation.y = step += 0.01;

        // アニメーションを実施する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    };

    render();

};
