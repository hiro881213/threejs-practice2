let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const make3dCylinderGeometries = () => {
    
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
    let cylinder = createMesh(new THREE.CylinderGeometry(20, 20, 20));

    // シーンにメッシュを追加する
    scene.add(cylinder);

    // ---------------------------------------
    // カメラ設定処理
    // ---------------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 50);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // THREEJSのDOMを設定する
    document.getElementById("3dCylinderGeometries-output").appendChild(webGLRenderer.domElement);

    // ---------------------------------------
    // コントローラ生成処理
    // ---------------------------------------

    let step = 0;

    // コントローラを生成する
    let controls = new function() {

        // radius top
        this.radiusTop = 20;

        // radius bottom
        this.radiusBottom = 20;

        // 高さ
        this.height = 20;

        // radialセグメント
        this.radialSegments = 8;

        // heightセグメント
        this.heightSegments = 8;

        // open end
        this.openEnded = false;

        // thetaStart
        this.thetaStart = 0;

        // thetaLength
        this.thetaLength = 2 * Math.PI;

        // 再描画処理
        this.redraw = function() {

            // メッシュを削除する
            scene.remove(cylinder);

            // メッシュを生成する
            cylinder = createMesh(new THREE.CylinderGeometry(
                controls.radiusTop,
                controls.radiusBottom,
                controls.height,
                controls.radialSegments,
                controls.heightSegments,
                controls.openEnded,
                controls.thetaStart,
                controls.thetaLength));

            // シーンにメッシュを追加する
            scene.add(cylinder);

        };

    };

    // // ---------------------------------------
    // // GUI生成処理
    // // ---------------------------------------

    // // GUIを生成する
    // let gui = new dat.GUI();

    // // radiusTop
    // gui.add(controls, 'radiusTop', -40, 40).onChange(controls.redraw);

    // // radiusBottom
    // gui.add(controls, 'radiusBottom', -40, 40).onChange(controls.redraw);

    // // 高さ
    // gui.add(controls, 'height', 0, 40).onChange(controls.redraw);

    // // radialSegments
    // gui.add(controls, 'radialSegments', 1, 20).step(1).onChange(controls.redraw);

    // // heightSegments
    // gui.add(controls, 'heightSegments', 1, 20).step(1).onChange(controls.redraw);

    // //  openend
    // gui.add(controls, 'openEnded').onChange(controls.redraw);

    // // thetaStart
    // gui.add(controls, 'thetaStart', 0, 2 * Math.PI).onChange(controls.redraw);

    // // thetaLength
    // gui.add(controls, 'thetaLength', 0, 2 * Math.PI).onChange(controls.redraw);

    // レンダリング処理を実行する
    render();

    // ---------------------------------------
    // メッシュ生成関数
    // ---------------------------------------

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

    // ---------------------------------------
    // レンダリング関数
    // ---------------------------------------

    function render() {

        // メッシュを回転する
        cylinder.rotation.y = step += 0.01;

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

};