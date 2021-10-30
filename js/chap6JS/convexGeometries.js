let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const makeConvexGeometries = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ----------------------------------
    // レンダラ設定処理
    // ----------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ----------------------------------
    // カメラ設定処理
    // ----------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 50);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("convexGeometries-output").appendChild(webGLRenderer.domElement);

    // ----------------------------------
    // コントローラ生成処理
    // ----------------------------------

    let step = 0;

    let spGroup;

    let hullMesh;

    // 頂点生成処理
    generatePoints();

    // コントローラを生成する
    let controls = new function () {

        // 再描画処理
        this.redraw = function () {

            // シーンからオブジェクトを削除する
            scene.remove(spGroup);
            scene.remove(hullMesh);
            
            // 頂点を再生成する
            generatePoints();
            
        };

    };

    // ----------------------------------
    // GUI生成処理
    // ----------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // 再描画処理
    gui.add(controls, 'redraw');

    // レンダラ処理を実行する
    render();

    // ----------------------------------
    // 頂点生成関数
    // ----------------------------------

    function generatePoints() {

        // 頂点を生成する
        let points = [];

        // 頂点を配置する
        for (let i = 0; i < 20; i++) {

            let randomX = -15 + Math.round(Math.random() * 30);
            let randomY = -15 + Math.round(Math.random() * 30);
            let randomZ = -15 + Math.round(Math.random() * 30);

            points.push(new THREE.Vector3(randomX, randomY, randomZ));

        }

        // グループを生成する
        spGroup = new THREE.Group();

        // マテリアルを生成する
        let material = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: false});

        // 頂点を設置する
        points.forEach((point) => {

            // ジオメトリを生成する
            let spGeom = new THREE.SphereGeometry(0.2);

            // メッシュを生成する
            let spMesh = new THREE.Mesh(spGeom, material);

            // メッシュの位置を設定する
            spMesh.position.copy(point);

            // メッシュグループを設定する
            spGroup.add(spMesh);

        });

        // シーンにメッシュグループを追加する
        scene.add(spGroup);

        // ジオメトリを生成する
        let hullGeometry = new THREE.ConvexGeometry(points);
        
        // メッシュを生成する
        hullMesh = createMesh(hullGeometry);

        // シーンにメッシュを追加する
        scene.add(hullMesh);

    };

    // ----------------------------------
    // メッシュ生成関数
    // ----------------------------------

    function createMesh(geom) {

        // マテリアルを生成する
        let meshMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.2});
        meshMaterial.side = THREE.DoubleSide;

        // ワイヤーフレームを生成する
        let wireFrameMat = new THREE.MeshBasicMaterial();
        wireFrameMat.wireframe = true;

        // メッシュを生成する
        let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

        return mesh;

    };

    // ----------------------------------
    // レンダラ生成関数
    // ----------------------------------

    function render() {

        // メッシュグループを回転させる
        spGroup.rotation.y = step;
        hullMesh.rotation.y = step += 0.01;

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    };


}
