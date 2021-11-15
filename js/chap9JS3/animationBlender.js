let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeAnimationBlender = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ---------------------------------------------
    // レンダラ生成処理
    // ---------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ---------------------------------------------
    // カメラ設定処理
    // ---------------------------------------------

    // カメラの位置を設定する
    camera.position.set(0, 0, 4);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // ---------------------------------------------
    // 点光源生成処理
    // ---------------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(0, 50, 30);

    // intensity
    spotLight.intensity = 2;

    // シーンに点光源に追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("AnimationBlender-output").appendChild(webGLRenderer.domElement);

    // ---------------------------------------------
    // コントローラ生成処理
    // ---------------------------------------------

    let step =0;
    
    let mesh, helper;
    let mixer, bonesClip;

    // クロックを生成する
    let clock = new THREE.Clock();

    // コントローラを生成する
    let controls = new function () {
        this.showHelper = false;
    };

    // ---------------------------------------------
    // GUI生成処理
    // ---------------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // showHelper
    gui.add(controls, 'showHelper', 0, 0.5).onChange((state) => {

        helper.visible = state;

    });

    // ---------------------------------------------
    // メッシュ生成処理
    // ---------------------------------------------

    // ローダーを生成する
    let loader = new THREE.JSONLoader();

    // ファイルを読み込む
    loader.load('../../assets/models/hand-2.js', (geometry, mat) => {

        // マテリアルを生成する
        mat = new THREE.MeshLambertMaterial({color: 0xF0C8C9, skinning: true});

        // メッシュを生成する
        mesh = new THREE.SkinnedMesh(geometry, mat);

        // メッシュを回転させる
        mesh.rotation.x = 0.5 * Math.PI;
        mesh.rotation.z = 0.7 * Math.PI;

        // シーンにメッシュを追加する
        scene.add(mesh);

        // ヘルパーを生成する
        helper = new THREE.SkeletonHelper(mesh);

        // ライン幅を設定する
        helper.material.linewidth = 2;

        // ヘルパーを表示する
        helper.visible = false;

        // シーンにヘルパーを追加する
        scene.add(helper);

        // mixerを生成する
        mixer = new THREE.AnimationMixer(mesh);

        // アニメーションを生成する
        bonesClip = geometry.animations[0];

        let action = mixer.clipAction(bonesClip);
        action.play();

    }, '../../assets/models');

    // レンダリング処理を実行する
    render();

    // ---------------------------------------------
    // レンダリング関数
    // ---------------------------------------------

    function render() {

        // デルタを生成する
        let delta = clock.getDelta();

        if (mixer) {

            mixer.update(delta);
            helper.update();

        }

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }


};
