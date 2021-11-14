let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeMorphTragetManually = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // --------------------------------------------
    // レンダラ生成処理
    // --------------------------------------------

    // レンダラを生成する
    let renderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    renderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    renderer.setSize(width, height);

    // --------------------------------------------
    // 平面メッシュ生成処理
    // --------------------------------------------

    // 平面ジオメトリを生成する
    let planeGeometry = new THREE.PlaneGeometry(20, 20, 1, 1);

    // 平面マテリアルを生成する
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

    // 平面メッシュを生成する
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // 平面を回転させる
    plane.rotation.x = -0.5 * Math.PI;

    // 平面の位置を設定する
    plane.position.set(0, 0, 0);

    // シーンに平面を追加する
    scene.add(plane);

    // --------------------------------------------
    // 立方体メッシュ生成処理
    // --------------------------------------------

    // 立方体ジオメトリを生成する
    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);

    // 立方体マテリアルを生成する
    let cubeMaterial = new THREE.MeshLambertMaterial({morphTargets: true, color: 0xff0000});

    // ジオメトリを生成する
    let cubeTarget1 = new THREE.BoxGeometry(2, 10, 2);
    let cubeTarget2 = new THREE.BoxGeometry(8, 2, 8);

    // ジオメトリを設定する
    cubeGeometry.morphTargets[0] = {name: 't1', vertices: cubeTarget2.vertices};
    cubeGeometry.morphTargets[1] = {name: 't2', vertices: cubeTarget1.vertices};

    // 立方体メッシュを生成する
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // 立方体メッシュの位置を設定する
    cube.position.set(0, 3, 0);

    // シーンに立方体を追加する
    scene.add(cube);

    // --------------------------------------------
    // カメラ設定処理
    // --------------------------------------------

    // カメラの位置を設定する
    camera.position.set(-15, 15, 15);

    // カメラの方向を設定する
    camera.lookAt(scene.position);

    // --------------------------------------------
    // 環境光生成処理
    // --------------------------------------------

    // 環境光を生成する
    let ambientLight = new THREE.AmbientLight(0x0c0c0c);

    // シーンに環境光を追加する
    scene.add(ambientLight);

    // THREEJSオブジェクトをDOMに追加する
    document.getElementById("morphTargetManually-output").appendChild(renderer.domElement);

    // --------------------------------------------
    // コントローラ生成処理
    // --------------------------------------------

    // コントローラを生成する
    let controls = new function() {

        this.influence1 = 0.01;
        this.influence2 = 0.01;

        // 更新処理
        this.update = () => {

            cube.morphTargetInfluences[0] = controls.influence1;
            cube.morphTargetInfluences[1] = controls.influence2;

        };

    };
    
    // --------------------------------------------
    // GUI生成処理
    // --------------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    gui.add(controls, 'influence1', 0, 1).onChange(controls.update);
    gui.add(controls, 'influence2', 0, 1).onChange(controls.update);

    // レンダリング処理を実行する
    render();

    // --------------------------------------------
    // レンダリング関数
    // --------------------------------------------

    function render() {

        // アニメーションを生成する
        renderer.render(scene, camera);
        requestAnimationFrame(render);

    }

};