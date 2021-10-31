let scene;
let camera;
let orbit;

let width = window.innerWidth;
let height = 500;

export const makeExtrudeSvgGeometries = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -----------------------------------
    // レンダラ生成処理
    // -----------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを設定する
    webGLRenderer.shadowMap.enabled = true;

    // -----------------------------------
    // メッシュ生成処理
    // -----------------------------------

    // メッシュを生成する
    let shape = createMesh(new THREE.ShapeGeometry(drawShape()));

    // シーンにメッシュを追加する
    scene.add(shape);

    // -----------------------------------
    // カメラ設定処理
    // -----------------------------------

    // カメラの位置を設定する
    camera.position.set(-80, 80, 80);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(60, -60, 0));

    // -----------------------------------
    // 点光源生成処理
    // -----------------------------------

    // 点光源を生成する
    let spotLight = new THREE.DirectionalLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(new THREE.Vector3(70, 170, 70));

    // intensityを設定する
    spotLight.intensity = 0.7;

    // targetを設定する
    spotLight.target = shape;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("extudeSvgGeometries-output").append(webGLRenderer.domElement);

    // -----------------------------------
    // コントローラ生成処理
    // -----------------------------------

    orbit = new THREE.OrbitControls(camera, webGLRenderer.domElement);

    let step = 0;

    // コントローラを生成する
    let controls = new function() {

        // amount
        this.amount = 2;

        // bevelThickness
        this.bevelThickness = 2;

        // bevelSize
        this.bevelSize = 0.5;

        // bevelEnabled
        this.bevelEnabled = true;

        // bevelSegments
        this.bevelSegments = 3;

        // curveセグメント
        this.curveSegments = 12;

        // steps
        this.steps = 1;

        // 描画処理
        this.asGeom = () => {

            // シーンからメッシュを削除する
            scene.remove(shape);

            // options
            let options = {
                amount: controls.amount,
                bevelThickness: controls.bevelThickness,
                bevelSize: controls.bevelSize,
                bevelSegments: controls.bevelSegments,
                bevelEnabled: controls.bevelEnabled,
                curveSegments: controls.curveSegments,
                steps: controls.steps
            };

            // メッシュを生成する
            shape = createMesh(new THREE.ExtrudeGeometry(drawShape(), options));

            // シーンにメッシュを追加する
            scene.add(shape);

        };

    };

    // // -----------------------------------
    // // GUI生成処理
    // // -----------------------------------

    // // GUIを生成する
    // let gui = new dat.GUI();

    // // amount
    // gui.add(controls, 'amount', 0, 20).onChange(controls.asGeom);

    // // bevelThickness
    // gui.add(controls, 'bevelThickness', 0, 10).onChange(controls.asGeom);

    // // bevelSize
    // gui.add(controls, 'bevelSize', 0, 10).onChange(controls.asGeom);

    // // bevelセグメント
    // gui.add(controls, 'bevelSegments', 0, 30).step(1).onChange(controls.asGeom);

    // // bevelEnabled
    // gui.add(controls, 'bevelEnabled').onChange(controls.asGeom);

    // // curveSegments
    // gui.add(controls, 'curveSegments', 1, 30).step(1).onChange(controls.asGeom);

    // // steps
    // gui.add(controls, 'steps', 1, 5).step(1).onChange(controls.asGeom);

    // 描画処理
    controls.asGeom();

    // レンダリング処理
    render();

    // -----------------------------------
    // 形状生成関数
    // -----------------------------------

    function drawShape() {

        // SVGを読み込む
        let svgString = document.querySelector('#batman-path').getAttribute("d");

        // 形状を生成する
        let shape = transformSVGPathExposed(svgString);

        return shape;

    };

    // -----------------------------------
    // メッシュ生成関数
    // -----------------------------------

    function createMesh(geom) {

        // ジオメトリを生成する
        geom.applyMatrix(new THREE.Matrix4().makeTranslation(-390, -74, 0));

        // マテリアルを生成する
        let meshMaterial = new THREE.MeshPhongMaterial({color: 0x333333,shininess: 100});

        // メッシュを生成する
        let mesh = new THREE.Mesh(geom, meshMaterial);

        // メッシュのスケールを設定する
        mesh.scale.x = 0.1;
        mesh.scale.y = 0.1;

        // メッシュを回転させる
        mesh.rotation.z = Math.PI;
        mesh.rotation.x = -1.1;

        return mesh;

    };

    // -----------------------------------
    // レンダリング関数
    // -----------------------------------

    function render() {

        // 形状を回転させる
        shape.rotation.y = step += 0.005;

        orbit.update();

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    };

};
