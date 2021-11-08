let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const loadAwd = () => {
    
    // シーンを生成する　
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ----------------------------------
    // レンダラ生成処理
    // ----------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0x000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ----------------------------------
    // カメラ設定処理
    // ----------------------------------

    // カメラの位置を設定する
    camera.position.set(30, 30, 30);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    let orbit = new THREE.OrbitControls(camera);

    // ----------------------------------
    // 直接光生成処理
    // ----------------------------------

    // 直接光1を生成する
    let dir1 = new THREE.DirectionalLight();

    // 直接光1の位置を設定する
    dir1.position.set(-30, 30, -30);

    // シーンに直接光1を追加する
    scene.add(dir1);

    // 直接光2を生成する
    let dir2 = new THREE.DirectionalLight();
    
    // 直接光2の位置を設定する
    dir2.position.set(-30, 30, 30);
    
    // シーンに直接光2を追加する
    scene.add(dir2);

    // 直接光3を生成する    
    let dir3 = new THREE.DirectionalLight();

    // 直接光3の位置を設定する
    dir3.position.set(30, 30, -30);

    // シーンに直接光3を追加する
    scene.add(dir3);

    // ----------------------------------
    // 点光源生成処理
    // ----------------------------------
    
    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(30, 30, 30);

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("loadObjAwd-output").appendChild(webGLRenderer.domElement);

    // ----------------------------------
    // コントローラ生成処理
    // ----------------------------------

    let step = 0;

    // コントローラを生成する
    let controls = new function() {};

    // ----------------------------------
    // GUI生成処理
    // ----------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // ----------------------------------
    // ローダー生成処理
    // ----------------------------------

    // ローダーを生成する
    let loader = new THREE.AWDLoader();

    // グループを生成する
    let group = new THREE.Object3D();

    // 画像読み込み処理
    loader.load("../../assets/models/awd/PolarBear.awd", (model) => {

        model.traverse((child) => {

            if (child instanceof THREE.Mesh) {

                // マテリアルを生成する
                child.material = new THREE.MeshLambertMaterial({color: 0xaaaaaa});

            }

        });

        // モデルのスケールを設定する
        model.scale.set(0.1, 0.1, 0.1);

        // シーンにモデルを追加する
        scene.add(model);

    });

    // レンダラ処理を実行する
    render();

    // ----------------------------------
    // レンダラ関数
    // ----------------------------------
    
    function render() {

        orbit.update();

        if (group) {

            group.rotation.y += 0.006;
        
        }

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

}
