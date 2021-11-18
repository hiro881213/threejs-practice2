let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeBasicTextureTga = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -------------------------------------
    // レンダラ生成処理
    // -------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // -------------------------------------
    // ポリゴン生成処理
    // -------------------------------------

    // ポリゴンを生成する
    let polyhedron = createMesh(new THREE.IcosahedronGeometry(5, 0));

    // ポリゴンの位置を設定する
    polyhedron.position.x = 12;

    // シーンにポリゴンを追加する
    scene.add(polyhedron);

    // -------------------------------------
    // 球体生成処理
    // -------------------------------------

    // 球体を生成する
    let sphere = createMesh(new THREE.SphereGeometry(5, 20, 20));

    // シーンに球体を生成する
    scene.add(sphere);

    // -------------------------------------
    // 立方体生成処理
    // -------------------------------------

    // 立方体を生成する
    let cube = createMesh(new THREE.BoxGeometry(5, 5, 5));

    // 立方体の位置を設定する
    cube.position.x = -12;

    // シーンに立方体を追加する
    scene.add(cube);

    // -------------------------------------
    // カメラ設定処理
    // -------------------------------------

    // カメラの位置を設定する
    camera.position.set(0, 12, 28);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0,));

    // -------------------------------------
    // 環境光生成処理
    // -------------------------------------

    // 環境光を生成する
    let ambiLight = new THREE.AmbientLight(0x141414);

    // シーンに環境光を追加する
    scene.add(ambiLight);

    // -------------------------------------
    // 直接光生成処理
    // -------------------------------------

    // 直接光を生成する
    let light = new THREE.DirectionalLight();

    // 直接光の位置を設定する
    light.position.set(0, 30, 20);

    // シーンに直接光を追加する
    scene.add(light);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("basicTextureTga-output").appendChild(webGLRenderer.domElement);

    let step = 0;

    // レンダリング処理を実行する
    render();

    // -------------------------------------
    // メッシュ生成関数
    // -------------------------------------

    function createMesh(geom, imageFile) {

        // ローダーを生成する
        let loader = new THREE.TGALoader();

        // テクスチャを生成する
        let texture = loader.load('../../assets/textures/crate_color8.tga');

        // マテリアルを生成する
        let mat = new THREE.MeshPhongMaterial();

        // マテリアルにテクスチャを設定する
        mat.map = texture;

        // メッシュを生成する
        let mesh = new THREE.Mesh(geom, mat);

        return mesh;

    }

    // -------------------------------------
    // レンダリング関数
    // -------------------------------------

    function render() {

        // ポリゴンを回転させる
        polyhedron.rotation.y = step += 0.01;
        polyhedron.rotation.x = step;

        // 立方体を回転させる
        cube.rotation.y = step;
        cube.rotation.x = step;

        // 球体を回転させる
        sphere.rotation.y = step;
        sphere.rotation.x = step;

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

}
