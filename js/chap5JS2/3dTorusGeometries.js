let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const make3dTorusGeometries = () => {
    
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

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ---------------------------------
    // メッシュ生成処理
    // ---------------------------------

    // メッシュを生成する
    let torus = createMesh(new THREE.TorusGeometry(10, 10, 8, 6, Math.PI * 2));

    // シーンにメッシュを追加する
    scene.add(torus);

    // ---------------------------------
    // カメラ設定処理
    // ---------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 50);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // THREEJSをDOMに設定する
    document.getElementById("3dTorusGeometries-output").appendChild(webGLRenderer.domElement);

    // ---------------------------------
    // コントローラ生成処理
    // ---------------------------------

    let step = 0;

    // コントローラを生成する
    let controls = new function() {

        // radius
        this.radius = torus.children[0].geometry.parameters.radius;

        // tube
        this.tube = torus.children[0].geometry.parameters.tube;

        // radialセグメント
        this.radialSegments = torus.children[0].geometry.parameters.radialSegments;

        // tubularセグメント
        this.tubularSegments = torus.children[0].geometry.parameters.tubularSegments;

        // arc
        this.arc = torus.children[0].geometry.parameters.arc;

        // 再描画処理
        this.redraw = function() {

            // シーンにメッシュを削除する
            scene.remove(torus);

            // メッシュを再生成する
            torus = createMesh(new THREE.TorusGeometry(
                controls.radius, 
                controls.tube, 
                Math.round(controls.radialSegments), 
                Math.round(controls.tubularSegments), 
                controls.arc));
            
            // シーンにメッシュを追加する
            scene.add(torus);

        }

    };

    // ---------------------------------
    // GUI生成処理
    // ---------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // radius
    gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);

    // tube
    gui.add(controls, 'tube', 0, 40).onChange(controls.redraw);

    // radialSegments
    gui.add(controls, 'radialSegments', 0, 40).onChange(controls.redraw);

    // tubularセグメント
    gui.add(controls, 'tubularSegments', 1, 20).onChange(controls.redraw);

    // arc
    gui.add(controls, 'arc', 0, Math.PI * 2).onChange(controls.redraw);

    // レンダリング処理
    render();


    // ---------------------------------
    // メッシュ生成関数
    // ---------------------------------

    function createMesh(geom) {

        // マテリアルを生成する
        let meshMaterial = new THREE.MeshNormalMaterial();

        // マテリアルの方向を設定する
        meshMaterial.side = THREE.side = THREE.DoubleSide;

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
        torus.rotation.y = step += 0.01;

        // アニメーション処理
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

}
