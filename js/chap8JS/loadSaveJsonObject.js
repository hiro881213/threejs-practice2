let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const loadSaveJsonObject = () => {
    
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
    let knot = createMesh(new THREE.TorusKnotGeometry(10, 1, 64,8, 2, 3));

    // シーンにメッシュを追加する
    scene.add(knot);

    // ------------------------------------------
    // カメラ設定処理
    // ------------------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 50);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(-20, 0, 0));

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("loadSaveJsonObject-output").appendChild(webGLRenderer.domElement);

    // ------------------------------------------
    // コントローラ設定処理
    // ------------------------------------------

    let step = 0;

    let loadedMesh;

    // コントローラを生成する
    let controls = new function() {

        // radius
        this.radius = knot.geometry.parameters.radius;

        // tube
        this.tube = 0.3;

        // radialSegments
        this.radialSegments = knot.geometry.parameters.radialSegments;

        // tubulaSegments
        this.tubularSegments = knot.geometry.parameters.tubularSegments;
        
        // p
        this.p = knot.geometry.parameters.p;

        // q
        this.q = knot.geometry.parameters.q;

        // 再描画処理
        this.redraw = () => {

            // シーンからメッシュを削除する
            scene.remove(knot);

            // メッシュを生成する
            knot = createMesh(new THREE.TorusKnotGeometry(controls.radius, controls.tube, Math.round(controls.radialSegments), Math.round(controls.tubularSegments), Math.round(controls.p), Math.round(controls.q)));

            // シーンにメッシュを追加する
            scene.add(knot);

        }

        // セーブ処理
        this.save = () => {

            let result = knot.toJSON();
            localStorage.setItem("json", JSON.stringify(result));

        };

        // 読み込み処理
        this.load = () => {

            // シーンからメッシュを削除する
            scene.remove(loadedMesh);

            // JSONを取得する
            let json = localStorage.getItem("json");

            if (json) {

                // ジオメトリを生成する
                let loadedGeometry = JSON.parse(json);

                // ローダーを生成する
                let loader = new THREE.ObjectLoader();

                // メッシュを生成する
                loadedMesh = loader.parse(loadedGeometry);

                // メッシュの位置を設定する
                loadedMesh.position.x -= 50;

                // シーンにメッシュを追加する
                scene.add(loadedMesh);


            }

        };

    };

    // ------------------------------------------
    // GUI生成処理
    // ------------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    let ioGui = gui.addFolder('Save & Load');

    ioGui.add(controls, 'save').onChange(controls.save);
    ioGui.add(controls, 'load').onChange(controls.redraw);

    let meshGui = gui.addFolder('mesh');
    meshGui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
    meshGui.add(controls, 'tube', 0, 40).onChange(controls.redraw);
    meshGui.add(controls, 'radialSegments', 0, 40).step(1).onChange(controls.redraw);
    meshGui.add(controls, 'tubularSegments', 1, 20).step(1).onChange(controls.redraw);    meshGui.add(controls, 'p', 1, 10).step(1).onChange(controls.redraw);
    meshGui.add(controls, 'q', 1, 15).step(1).onChange(controls.redraw);

    // レンダリング処理を実行する
    render();

    // ------------------------------------------
    // メッシュ生成処理
    // ------------------------------------------

    function createMesh(geom) {

        // マテリアルを生成する
        let meshMaterial = new THREE.MeshBasicMaterial({
            vertexColors: THREE.VertexColors,
            wireframe: true,
            wireframeLinewidth: 2,
            color: 0xaaaaaa
        });

        meshMaterial.side = THREE.DoubleSide;

        // メッシュを生成する
        let mesh = new THREE.Mesh(geom, meshMaterial);

        return mesh;

    };

    // ------------------------------------------
    // レンダリング処理
    // ------------------------------------------

    function render() {

        // メッシュを回転させる
        knot.rotation.y = step += 0.01;

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }
}
