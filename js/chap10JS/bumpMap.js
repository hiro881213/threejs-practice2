let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeBumpMap = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -----------------------------------------
    // レンダラ生成処理
    // -----------------------------------------

    // レンダラを生成する
    let webGLRenrerer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenrerer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenrerer.setSize(width, height);

    // シャドウマップを有効する
    webGLRenrerer.shadowMap.enabled = true;

    // -----------------------------------------
    // 球体生成処理
    // -----------------------------------------

    // 球体1を生成する
    let sphere1 = createMesh(new THREE.BoxGeometry(15, 15, 2), "stone.jpg");

    // 球体1を回転させる
    sphere1.rotation.y = -0.5;

    // 球体1の位置を設定する
    sphere1.position.x = 12;

    // シーンに球体1を追加する
    scene.add(sphere1);

    // 球体2を生成する
    let sphere2 = createMesh(new THREE.BoxGeometry(15, 15, 2), "stone.jpg", "stone-bump.jpg");

    // 球体2を回転させる
    sphere2.rotation.y = 0.5;

    // 球体2の位置を設定する
    sphere2.position.x = -12;

    // シーンに球体2を追加する
    scene.add(sphere2);

    // -----------------------------------------
    // 平面生成処理
    // -----------------------------------------

    // ローダを生成する
    let textureLoader = new THREE.TextureLoader();

    // テクスチャを読み込む
    let floorTex = textureLoader.load("../../assets/textures/general/floor-wood.jpg");

    // メッシュを生成する
    let plane = new THREE.Mesh(
        new THREE.BoxGeometry(200, 100, 0.1, 30), 
        new THREE.MeshPhongMaterial({
            color: 0x3c3c3c,
            map: floorTex
        })
    );

    // 平面の位置を設定する
    plane.position.y = -7.5;

    // 平面を回転させる
    plane.rotation.x = -0.5 * Math.PI;

    // シーンに平面を追加する
    scene.add(plane);

    // -----------------------------------------
    // カメラ設定処理
    // -----------------------------------------

    // カメラの位置を設定する
    camera.position.set(0, 12, 28);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0,));

    // -----------------------------------------
    // 環境光生成処理
    // -----------------------------------------

    // 環境光を生成する
    let ambiLight = new THREE.AmbientLight(0x242424);

    // シーンに環境光を追加する
    scene.add(ambiLight);

    // -----------------------------------------
    // 点光源生成処理
    // -----------------------------------------

    // 点光源を生成する
    let light = new THREE.SpotLight();

    // 点光源の位置を設定する
    light.position.set(0, 30, 30);

    // intensity
    light.intensity = 1.2;

    // シーンに点光源を追加する
    scene.add(light);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("bumpMap-output").appendChild(webGLRenrerer.domElement);

    // -----------------------------------------
    // コントローラ生成処理
    // -----------------------------------------

    let step = 0;

    // ローダを生成する
    let textureLoader2 = new THREE.TextureLoader();

    // コントローラを生成する
    let controls = new function() {

        // bumpファイルスケール
        this.bumpScale = 0.2;

        // テクスチャ変更
        this.changeTexture = "weave";

        // 回転
        this.rotate = false;

        // テクスチャ変更処理
        this.changeTexture = (e) => {

            let texture = textureLoader2.load("../../assets/textures/general/" + e + ".jpg");

            // メッシュにテクスチャを設定する
            sphere2.material.map = texture;
            sphere1.material.map = texture;

            // bumpファイルを読み込む
            let bump = textureLoader2.load("../../assets/textures/general/" + e + "-bump.jpg");

            // bumpマップを設定する
            sphere2.material.bumpMap = bump;

        };

        // bump更新処理
        this.updateBump = (e) => {

            // bumpスケールを設定する
            sphere2.material.bumoScale = e;

        }

    }

    // -----------------------------------------
    // GUI生成処理
    // -----------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // bumpスケール
    gui.add(controls, "bumpScale", -2, 2).onChange(controls.updateBump);

    // changeテクスチャ
    gui.add(controls, "changeTexture", ['stone', 'weave']).onChange(controls.changeTexture);

    // rotate
    gui.add(controls, 'rotate');

    // レンダリング処理を実行する
    render();

    // -----------------------------------------
    // メッシュ生成関数
    // -----------------------------------------

    function createMesh(geom, imageFile, bump) {

        // ローダを生成する
        let textureLoader = new THREE.TextureLoader();

        // テクスチャを読み込む
        let texture = textureLoader.load("../../assets/textures/general/" + imageFile);

        // ジオメトリを生成する
        geom.computeVertexNormals();

        // マテリアルを生成する
        let mat = new THREE.MeshPhongMaterial();

        // マテリアルにテクスチャを設定する
        mat.map = texture;

        if (bump) {

            // bumpファイルを読み込む
            let bumpF = textureLoader.load("../../assets/textures/general/" + bump);

            // bumpマップを設定する
            mat.bumpMap = bumpF;

            // bumpスケールを設定する
            mat.bumpScale = 0.2;

        }

        // メッシュを生成する
        let mesh = new THREE.Mesh(geom, mat);

        return mesh;

    }

    // -----------------------------------------
    // レンダリング関数
    // -----------------------------------------

    function render() {

        if (controls.rotate) {
            
            // 球体を回転させる
            sphere1.rotation.y -= 0.01;
            sphere2.rotation.y -= 0.01;

        }

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenrerer.render(scene, camera);

    }





}
