let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const loadPdb = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // --------------------------------------
    // レンダラ生成処理
    // --------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0x000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // --------------------------------------
    // カメラ設定処理
    // --------------------------------------

    // カメラの位置を設定する
    camera.position.set(6, 6, 6);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // --------------------------------------
    // 直接光生成処理
    // --------------------------------------

    // 直接光を生成する
    let dir1 = new THREE.DirectionalLight(0.4);

    // 直接光の位置を設定する
    dir1.position.set(-30, 30, -30);

    // シーンに直接光を追加する
    scene.add(dir1);

    // 直接光2を生成する
    let dir2 = new THREE.DirectionalLight(0.4);

    // 直接光2の位置を設定する
    dir2.position.set(-30, 30, 30);

    // シーンに直接光2を追加する
    scene.add(dir2);

    // 直接光3を生成する
    let dir3 = new THREE.DirectionalLight(0.4);

    // 直接光3の位置を設定する
    dir3.position.set(30, 30, -30);

    // シーンに直接光3を追加する
    scene.add(dir3);

    // --------------------------------------
    // 点光源生成処理
    // --------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(30, 30, 30);

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("loadObjMtl-output").appendChild(webGLRenderer.domElement);

    // --------------------------------------
    // コントローラ生成処理
    // --------------------------------------

    let step = 0;

    let controls = new function () {};

    // --------------------------------------
    // GUI生成処理
    // --------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    let mesh;

    // --------------------------------------
    // ローダー生成処理
    // --------------------------------------

    // ローダーを生成する
    let loader = new THREE.PDBLoader();

    // グループを生成する
    let group = new THREE.Group();

    // ファイルを読み込む
    loader.load("../../assets/models/aspirin.pdb", (geometry, geometryBonds) => {

        let i = 0;

        // メッシュを生成する
        geometry.vertices.forEach((position) => {

            // 球体ジオメトリを生成する
            let sphere = new THREE.SphereGeometry(0.2);

            // マテリアルを生成する
            let material = new THREE.MeshPhongMaterial({color: geometry.colors[i++]});

            // メッシュを生成する
            let mesh = new THREE.Mesh(sphere, material);

            // メッシュの位置を設定する
            mesh.position.copy(position);

            // グループにメッシュを追加する
            group.add(mesh);

        });

        for (let j = 0; j < geometryBonds.vertices.length; j += 2) {

            // パスを取得する
            let path = new THREE.CatmullRomCurve3([geometryBonds.vertices[j], geometryBonds.vertices[j + 1]]);

            // tubeを生成する
            let tube = new THREE.TubeGeometry(path, 1, 0.04);

            // マテリアルを生成する
            let material = new THREE.MeshPhongMaterial({color: 0xcccccc});

            // メッシュを生成する
            let mesh = new THREE.Mesh(tube, material);

            // グループにメッシュを追加する
            group.add(mesh);

        }

        // シーンにグループを追加する
        scene.add(group);

    });

    // レンダリング処理を実行する
    render();

    // --------------------------------------
    // レンダリング関数
    // --------------------------------------

    function render() {

        if (group) {

            // グループを回転させる
            group.rotation.y += 0.006;
            group.rotation.x += 0.006;

        }

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }


}