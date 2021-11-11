let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeTrackballControls = () => {
    
    // クロックを生成する
    let clock = new THREE.Clock();

    // シーンを生成する
    let scene = new THREE.Scene();

    // カメラを生成する
    let camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // --------------------------------------------
    // レンダラ生成処理
    // --------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する　
    webGLRenderer.setClearColor(new THREE.Color(0x000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // --------------------------------------------
    // カメラ設定処理
    // --------------------------------------------

    // カメラの位置を設定する
    camera.position.set(100, 100, 300);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // --------------------------------------------
    // コントローラ生成処理
    // --------------------------------------------

    // コントローラを生成する
    let trackballControls = new THREE.TrackballControls(camera);

    // 回転スピードを設定する
    trackballControls.rotateSpeed = 1.0;

    // zoomスピードを設定する
    trackballControls.zoomSpeed = 1.0;

    // panスピードを設定する
    trackballControls.panSpeed = 1.0;

    // staticmovingを設定する
    trackballControls.staticMoving = true;

    // --------------------------------------------
    // 環境光生成処理
    // --------------------------------------------

    // 環境光を生成する
    let ambientLight = new THREE.AmbientLight(0x383838);
    
    // シーンに環境光を追加する
    scene.add(ambientLight);

    // --------------------------------------------
    // 点光源生成処理
    // --------------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(300, 300, 300);

    // intensityを設定する
    spotLight.intensity = 1;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("trackballControls-output").appendChild(webGLRenderer.domElement);

    // --------------------------------------------
    // ローディング生成処理
    // --------------------------------------------

    // メッシュを生成する
    let mesh;

    // ローダを生成する
    let load = (object) => {

        // スケールを生成する
        let scale = chroma.scale(['red', 'green', 'blue']);

        // カラーを設定する
        setRandomColors(object, scale);

        // シーンにメッシュを追加する
        mesh = object;
        scene.add(mesh);

    };

    // --------------------------------------------
    // テクスチャ生成処理
    // --------------------------------------------

    // テクスチャを生成する
    let textureLoader = new THREE.TextureLoader();

    // テクスチャを読み込む
    let texture = textureLoader.load('../../assets/textures/metro01.JPG');

    // --------------------------------------------
    // モデル生成処理
    // --------------------------------------------

    // MTLローダを生成する
    let mtlLoader = new THREE.MTLLoader();

    // パスを設定する
    mtlLoader.setPath("../../assets/models/");

    // ファイルを読み込む
    mtlLoader.load('city.mtl', (material) => {

        // マテリアルを読み込む
        material.preload();

        // ローダを生成する
        let objLoader = new THREE.OBJLoader();

        // パスを設定する
        objLoader.setPath("../../assets/models/");

        // ファイルを読み込む
        objLoader.load('city.obj', load);
    });
    
    function setCamControls(){};

    
    // レンダリング処理を実行する
    render();

    // --------------------------------------------
    // カラー設定関数
    // --------------------------------------------

    function setRandomColors(object, scale) {

        let children = object.children;

        if (children && children.length > 0) {

            children.forEach((e) => {

                setRandomColors(e, scale);
                
            });

        } else {
                
            if (object instanceof THREE.Mesh) {
                
                _setRandomColors(object.material, scale);
                
            }
            
        }

    };

    // --------------------------------------------
    // カラー設定関数2
    // --------------------------------------------

    function _setRandomColors(material, scale) {

        if (material instanceof THREE.MultiMaterial) {

            material.materials.forEach((mat) => {

                _setRandomColors(mat, scale);

            });

        } else {

            // 色を設定する
            material.color = new THREE.Color(scale(Math.random()).hex());

            if (material.name && material.name.indexOf("building") == 0) {

                // emissive
                material.emissive = new THREE.Color(0x444444);

                // 透過性
                material.transparent = true;
                material.opacity = 0.8;

            }

        }

    };

    // --------------------------------------------
    // レンダリング関数
    // --------------------------------------------

    function render() {

        let delta = clock.getDelta();

        trackballControls.update(delta);

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

};
