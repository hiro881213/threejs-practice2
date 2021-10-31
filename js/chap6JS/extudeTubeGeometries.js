let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const makeExtrudeTubeGeometries = () => {

    // シーンを生成する　
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // --------------------------------
    // レンダラ生成処理
    // --------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // --------------------------------
    // カメラ設定処理
    // --------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 50);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("extrudeTubeGeometries-output").appendChild(webGLRenderer.domElement);

    // --------------------------------
    // コントローラ生成処理
    // --------------------------------

    let step = 0;

    // メッシュグループ
    let spGroup;

    // チューブメッシュ
    let tubeMesh;

    // コントローラを生成する
    let controls = new function () {

        // 頂点数
        this.numberOfPoints = 5;

        // セグメント
        this.segments = 64;

        // radius
        this.radius = 1;

        // radiusセグメント
        this.radiusSegments = 8;

        // closed
        this.closed = false;

        // taper
        this.taper = 'no taper';

        // 頂点群
        this.points = [];

        // 頂点を生成する
        this.newPoints = function () {

            let points = [];

            for (let i = 0; i < controls.numberOfPoints; i++) {

                let randomX = -20 + Math.round(Math.random() * 50);
                let randomY = -15 + Math.round(Math.random() * 40);
                let randomZ = -20 + Math.round(Math.random() * 40);

                points.push(new THREE.Vector3(randomX, randomY, randomZ));

            }

            controls.points = points;
            controls.redraw();

        };

        // 再描画処理
        this.redraw = function () {

            let taper = controls.taper === 'sinusoidal' ? THREE.TubeGeometry.SinusoidalTaper : THREE.TubeGeometry.NoTaper;

            // シーンからグループを削除する
            scene.remove(spGroup);

            // シーンからTubeメッシュを削除する
            scene.remove(tubeMesh);

            // ポイント生成処理
            generatePoints(controls.points, controls.segments, controls.radius, controls.radiusSegments, controls.closed, taper);

        };

    };

    // --------------------------------
    // GUI生成処理
    // --------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // new Point
    gui.add(controls, 'newPoints');

    // 頂点数
    gui.add(controls, 'numberOfPoints', 2, 15).step(1).onChange(controls.newPoints);

    // セグメント
    gui.add(controls, 'segments', 0, 200).step(1).onChange(controls.redraw);

    // radius
    gui.add(controls, 'radius', 0, 10).onChange(controls.redraw);

    // radiusセグメント
    gui.add(controls, 'radiusSegments', 0, 100).step(1).onChange(controls.redraw);

    // closed
    gui.add(controls, 'closed').onChange(controls.redraw);

    // taper
    gui.add(controls, 'taper', ['no taper', 'sinusoidal']).onChange(controls.redraw);

    controls.newPoints();

    // レンダリング処理
    render();

    // --------------------------------
    // 頂点生成関数
    // --------------------------------

    function generatePoints(points, segments, radius, radiusSegments, closed, taper) {

        // グループを生成する
        spGroup = new THREE.Object3D();

        // マテリアルを生成する
        let material = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: false});

        // メッシュを生成する
        points.forEach((point) => {

            // ジオメトリを生成する
            let spGeom = new THREE.SphereGeometry(0.2);

            // メッシュを生成する
            let spMesh = new THREE.Mesh(spGeom, material);

            // メッシュの位置を設定する　
            spMesh.position.copy(point);

            // グループにメッシュに追加する
            spGroup.add(spMesh);

        });

        // シーンにグループを追加する
        scene.add(spGroup);

        // tubeジオメトリを生成する
        let tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, radius, radiusSegments, closed, taper);

        // tubeメッシュを生成する
        tubeMesh = createMesh(tubeGeometry);

        // tubeメッシュを追加する
        scene.add(tubeMesh);

    };

    // --------------------------------
    // メッシュ生成関数
    // --------------------------------

    function createMesh(geom) {

        // マテリアルを生成する
        let meshMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.2});

        // ワイヤフレームを生成する
        let wireFrameMat = new THREE.MeshBasicMaterial();
        wireFrameMat.wireframe = true;

        // メッシュを生成する
        let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

        return mesh;

    };

    // --------------------------------
    // レンダリング関数
    // --------------------------------

    function render() {

        // メッシュグループを回転させる
        spGroup.rotation.y = step;

        // tubeメッシュを回転させる
        tubeMesh.rotation.y = step += 0.01;

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
        
    };

}
