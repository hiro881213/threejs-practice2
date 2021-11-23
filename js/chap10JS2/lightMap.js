let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeLightMap = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -------------------------------------------
    // レンダラ生成処理
    // -------------------------------------------

    // レンダラを生成する
    let renderer;
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    renderer = webGLRenderer;

    // -------------------------------------------
    // 平面メッシュ生成処理
    // -------------------------------------------

    // 平面ジオメトリを生成する
    let groundGeom = new THREE.PlaneGeometry(95, 95, 1, 1);

    // テクスチャローダーを生成する
    let textureLoader = new THREE.TextureLoader();

    // テクスチャを読み込む
    const lm = textureLoader.load('../../assets/textures/lightmap/lm-1.png');
    const wood = textureLoader.load('../../assets/textures/general/floor-wood.jpg');

    // マテリアルを生成する
    const groundMaterial = new THREE.MeshStandardMaterial({
        color    : 0x777777,
        lightMap : lm,
        map      : wood
    });

    groundGeom.faceVertexUvs[1] = groundGeom.faceVertexUvs[0];

    // メッシュを生成する
    let groundMesh = new THREE.Mesh(groundGeom, groundMaterial);

    // メッシュを回転させる
    groundMesh.rotation.x = -Math.PI/2;

    // メッシュの位置を設定する
    groundMesh.position.y = 0;

    // シーンにメッシュを追加する
    scene.add(groundMesh);

    // -------------------------------------------
    // 立方体メッシュ生成処理
    // -------------------------------------------

    // 立方体ジオメトリを生成する
    const cubeGeometry = new THREE.BoxGeometry(12, 12, 12);
    const cubeGeometry2 = new THREE.BoxGeometry(6, 6, 6);

    // マテリアルを生成する
    let meshMaterial = new THREE.MeshBasicMaterial();

    // マップを読み込む
    meshMaterial.map = textureLoader.load('../../assets/textures/general/stone.jpg');

    // メッシュを生成する
    let cube = new THREE.Mesh(cubeGeometry, meshMaterial);
    let cube2 = new THREE.Mesh(cubeGeometry2, meshMaterial);

    // メッシュの位置を設定する
    cube.position.set(0.9, 6, -12);
    cube2.position.set(-13.2, 3, -6);

    // シーンにメッシュを追加する
    scene.add(cube);
    scene.add(cube2);

    // -------------------------------------------
    // カメラ設定処理
    // -------------------------------------------

    // カメラの位置を設定する
    camera.position.set(-20, 20, 30);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // -------------------------------------------
    // 環境光生成処理
    // -------------------------------------------

    // 環境光を生成する
    const ambientLight = new THREE.AmbientLight(0xcccccc);

    // シーンに環境光を設定する
    scene.add(ambientLight);

    // THREEJSオブジェクトをDOMに追加する
    document.getElementById("lightMap-output").appendChild(renderer.domElement);

    // レンダリング処理を実行する
    render();

    // -------------------------------------------
    // レンダリング関数
    // -------------------------------------------

    function render() {

        // アニメーションを生成する
        requestAnimationFrame(render);
        renderer.render(scene, camera);

    }

}   
