let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const make3dTorusKnotGeometries = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ---------------------------------
    // レンダラ生成処理
    // ---------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを生成する
    webGLRenderer.shadowMap.enabled = true;

    // ---------------------------------
    // レンダラ生成処理
    // ---------------------------------

    // メッシュを生成する
    let knot = new createMesh(new THREE.TorusKnotGeometry(10, 1, 64, 8, 2, 3, 1));

    // シーンにメッシュを追加する
    scene.add(knot);

    // ---------------------------------
    // カメラ設定処理
    // ---------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 50);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("3dTorusKnotGeometries-output").appendChild(webGLRenderer.domElement)

    // ---------------------------------
    // コントローラ設定処理
    // ---------------------------------

    let step = 0;

    // コントローラを生成する
    let controls = new function() {

        // radius
        this.radius = knot.children[0].geometry.parameters.radius;

        // tube
        this.tube = 0.3;

        // radialセグメント
        this.radialSegments = 100;

        // tubularセグメント
        this.tubularSegments = 20;

        this.p = knot.children[0].geometry.parameters.p;
        this.q = knot.children[0].geometry.parameters.q;

        // 再描画処理
        this.redraw = function() {

            // シーンを削除する
            scene.remove(knot);

            // メッシュを再生成する
            knot = createMesh(new THREE.TorusKnotGeometry(
                controls.radius,
                controls.tube,
                Math.round(controls.radialSegments),
                Math.round(controls.tubularSegments),
                Math.round(controls.p),
                Math.round(controls.q)
            ));

            // シーンにメッシュを追加する
            scene.add(knot);

        }

    };

    // // ---------------------------------
    // // GUI設定処理
    // // ---------------------------------

    // // GUIを生成する
    // let gui = new dat.GUI();

    // // radius
    // gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);

    // // tube
    // gui.add(controls, 'tube', 0, 40).onChange(controls.redraw);

    // // radialセグメント
    // gui.add(controls, 'radialSegments', 0, 400).step(1).onChange(controls.redraw);

    // // tubularセグメント
    // gui.add(controls, 'tubularSegments', 1, 20).step(1).onChange(controls.redraw);

    // // p
    // gui.add(controls, 'p', 1, 10).step(1).onChange(controls.redraw);

    // // q
    // gui.add(controls,'q', 1, 15).step(1).onChange(controls.redraw);

    render();

    // ---------------------------------
    // メッシュ生成関数
    // ---------------------------------

    function createMesh(geom) {

        // マテリアルを生成する
        let meshMaterial = new THREE.MeshNormalMaterial({});

        // マテリアルの方向を設定する
        meshMaterial.side = THREE.DoubleSide;

        // メッシュを生成する
        let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);

        return mesh;

    }

    // ---------------------------------
    // レンダラ関数
    // ---------------------------------

    function render() {

        // メッシュを回転させる
        knot.rotation.y = step += 0.01;

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

}