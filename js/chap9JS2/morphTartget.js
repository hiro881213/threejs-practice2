let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeMorphTraget = () => {
    
    // ミキサーを定義する
    let mixer;

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ----------------------------------------
    // レンダラ生成処理
    // ----------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ----------------------------------------
    // カメラ設定処理
    // ----------------------------------------

    // カメラの位置を設定する
    camera.position.set(250, 250, 250);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(100, 50, 0));

    // ----------------------------------------
    // 点光源生成処理
    // ----------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.DirectionalLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(300, 200, 300);

    // intensity
    spotLight.intensity = 1;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("morphTarget-output").appendChild(webGLRenderer.domElement);

    // ----------------------------------------
    // コントローラ生成処理
    // ----------------------------------------

    let step = 0;

    // コントローラを生成する
    let controls = new function() {
    
        // キーフレーム
        this.keyframe = 0;
    
    };

    // ----------------------------------------
    // GUI生成処理
    // ----------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // キーフレーム
    gui.add(controls, "keyframe", 0, 15).step(1).onChange((e) => {
        
        // キーフレームを表示する
        showFrame(e);

    });

    // ----------------------------------------
    // メッシュ生成処理
    // ----------------------------------------

    // メッシュを生成する
    let mesh;
    let meshAnim;

    // フレームを生成する
    let frames = [];

    let currentMesh;

    let clock = new THREE.Clock();

    // ローダーを生成する
    let loader = new THREE.JSONLoader();
    
    // ファイルを読み込む
    loader.load('../../assets/models/horse.js', (geometry, mat) => {

        // ジオメトリを読み込む
        geometry.computeVertexNormals();

        // マテリアルを設定する
        mat = new THREE.MeshLambertMaterial({
            morphTargets: true,
            vertexColors: THREE.FaceColors
        });

        let mat2 = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            vertexColors: THREE.FaceColors
        });

        // メッシュを生成する
        mesh = new THREE.Mesh(geometry, mat);

        // メッシュの位置を設定する
        mesh.position.x = 200;

        // シーンにメッシュを追加する
        scene.add(mesh);

        currentMesh = mesh.clone();
        currentMesh.position.x = -100;

        // フレームにメッシュを追加する
        frames.push(currentMesh);

        mesh.geometry.morphTargets.forEach((e) => {

            // ジオメトリを生成する
            let geom = new THREE.Geometry();

            // 頂点を設定する
            geom.vertices = e.vertices;

            // 面を設定する
            geom.faces = geometry.faces;

            // メッシュを生成する
            let morpMesh = new THREE.Mesh(geom, mat2);

            // フレームに追加する
            frames.push(morpMesh);

            // 位置を設定する
            morpMesh.position.x = -100;

        });

        mixer = new THREE.AnimationMixer(mesh);

        // クリップを生成する
        let clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);

        // アクションを生成する
        let action = mixer.clipAction(clip);

        // アクションを動作させる
        action.setDuration(1).play();

        showFrame(0);

    }, '../../assets/models');

    // ----------------------------------------
    // フレーム表示関数
    // ----------------------------------------

    function showFrame(e) {

        // シーンからメッシュを削除する
        scene.remove(currentMesh);

        // シーンに対象のメッシュを追加する
        scene.add(frames[e]);

        currentMesh = frames[e];

    };

    // レンダリング処理を実行する
    render();

    // ----------------------------------------
    // レンダリング関数
    // ----------------------------------------

    function render() {

        // デルタを生成する
        let delta = clock.getDelta();

        // レンダラをクリアする
        webGLRenderer.clear();

        if (mixer) {

            // mixerを更新する
            mixer.update(delta)
            
            // メッシュを回転させる
            mesh.rotation.y += 0.01;

        }

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    };

};
