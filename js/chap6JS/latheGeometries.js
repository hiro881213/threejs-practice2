let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const makeLatheGeometries = () => {

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

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // -----------------------------------
    // カメラ設定処理
    // -----------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 50);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // THREEJSオブジェクトをDOMに追加する
    document.getElementById("latheGeometries-output").appendChild(webGLRenderer.domElement);

    // -----------------------------------
    // コントローラ生成処理
    // -----------------------------------

    let step = 0;

    // メッシュグループを生成する
    let spGroup;

    // latheメッシュを生成する
    let latheMesh;

    // コントローラを生成する
    let controls = new function () {

        // セグメント
        this.segments = 12;

        // phiStart
        this.phiStart = 0;

        // phiLength
        this.phiLength = 2 * Math.PI;

        // 再描画処理
        this.redraw = function () {

            // シーンからシーングループを削除する
            scene.remove(spGroup);

            // シーンからlatheメッシュを削除する
            scene.remove(latheMesh);

            // 頂点を生成する
            generatePoints(controls.segments, controls.phiStart, controls.phiLength);

        };

    };

    // 頂点描画処理
    generatePoints(controls.segments, controls.phiStart, controls.phiLength);

    // // -----------------------------------
    // // GUI生成処理
    // // -----------------------------------

    // // GUIを生成する
    // let gui = new dat.GUI();

    // // セグメント
    // gui.add(controls, 'segments', 0, 50).step(1).onChange(controls.redraw);

    // // phiStart
    // gui.add(controls, 'phiStart', 0, 2 * Math.PI).onChange(controls.redraw);

    // // phiLength
    // gui.add(controls, 'phiLength', 0, 2 * Math.PI).onChange(controls.redraw);

    // レンダラ処理を実行する
    render();

    // -----------------------------------
    // 頂点生成関数
    // -----------------------------------

    function generatePoints (segments, phiStart, phiLength) {

        // 頂点を生成する
        let points = [];

        // 高さを生成する
        let height = 5;

        let count = 30;

        // 頂点を生成する
        for (let i = 0; i < count; i++) {

            points.push(new THREE.Vector2((Math.sin(i * 0.2) + Math.cos(i * 0.3)) * height + 12, (i - count) + count/2));

        }

        // グループを生成する
        spGroup = new THREE.Group();

        // グループを回転させる
        spGroup.rotation.y = -Math.PI / 2;

        // マテリアルを生成する
        let material = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: false});

        points.forEach((point) => {

            // ジオメトリを生成する
            let spGeom = new THREE.SphereGeometry(0.2);

            // メッシュを生成する
            let spMesh = new THREE.Mesh(spGeom, material);

            // メッシュの位置を設定する
            spMesh.position.set(point.x, point.y, 0);

            // グループにメッシュを追加する
            spGroup.add(spMesh);

        });

        // シーンにグループを追加する
        scene.add(spGroup);

        // latheジオメトリを生成する
        let latheGeometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);

        // latheメッシュを生成する
        latheMesh = createMesh(latheGeometry);

        // シーンにlatheメッシュを追加する
        scene.add(latheMesh);

    };

    // -----------------------------------
    // メッシュ生成関数
    // -----------------------------------

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

    // -----------------------------------
    // レンダリング関数
    // -----------------------------------

    function render() {

        // グループを回転させる
        spGroup.rotation.x = step;

        // latheメッシュを回転させる
        latheMesh.rotation.x = step += 0.01;

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    };

}
