let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeGltf = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ------------------------------------------------------
    // レンダラ生成処理
    // ------------------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xdddddd));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ------------------------------------------------------
    // カメラ設定処理
    // ------------------------------------------------------

    // カメラの位置を設定する
    camera.position.set(-50, 40, 60);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // ------------------------------------------------------
    // 点光源生成処理
    // ------------------------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(-50, 70, 60);

    // intensity
    spotLight.intensity = 1;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("AnimationGltfs-output").appendChild(webGLRenderer.domElement);

    // ------------------------------------------------------
    // メッシュ生成処理
    // ------------------------------------------------------

    let mesh;
    let clock = new THREE.Clock();

    // ローダを生成する
    let loader = new THREE.glTFLoader();
    loader.load('../../assets/models/gltf/Cesium_Air.gltf',(scene) => {console.log(scene);});

    // レンダリング処理を実行する
    render();

    // ------------------------------------------------------
    // レンダリング関数
    // ------------------------------------------------------

    function render() {

        // デルタを生成する
        let delta = clock.getDelta();

        if (mesh) {

            mesh.updateAnimation(delta*1000);
        
        }

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

}
