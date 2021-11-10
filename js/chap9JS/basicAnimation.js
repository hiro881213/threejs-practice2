let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeBasicAnimation = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -------------------------------------
    // レンダラ生成処理
    // -------------------------------------

    // レンダラを生成する
    let renderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    renderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    renderer.setSize(width, height);

    // -------------------------------------
    // 平面メッシュ生成処理
    // -------------------------------------

    // ジオメトリを生成する
    let planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);

    // マテリアルを生成する
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

    // メッシュを生成する
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // メッシュを回転させる
    plane.rotation.x = -0.5 * Math.PI;

    // メッシュの位置を設定する
    plane.position.set(15, 0, 0);

    // シーンにメッシュを追加する
    scene.add(plane);

    // -------------------------------------
    // 立方体メッシュ生成処理
    // -------------------------------------

    // 立方体ジオメトリを生成する
    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);

    // 立方体マテリアルを生成する
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});

    // 立方体メッシュを生成する
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // 立方体の位置を設定する
    cube.position.set(-9, 3, 0);

    // シーンに立方体を追加する
    scene.add(cube);

    // -------------------------------------
    // 球体メッシュ生成処理
    // -------------------------------------

    // 球体ジオメトリを生成する
    let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);

    // 球体マテリアルを生成する
    let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});

    // 球体メッシュを生成する
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // 球体メッシュの位置を設定する
    sphere.position.set(20, 0, 2);

    // シーンに球体メッシュを追加する
    scene.add(sphere);

    // -------------------------------------
    // シリンダーメッシュ生成処理
    // -------------------------------------

    // シリンダージオメトリを生成する
    let cylinderGeometry = new THREE.CylinderGeometry(2, 2, 20);

    // シリンダーマテリアルを生成する
    let cylinderMaterial = new THREE.MeshLambertMaterial({color: 0x77ff77});

    // シリンダーメッシュを生成する
    let cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

    // シーンにシリンダーを追加する
    scene.add(cylinder);

    // -------------------------------------
    // カメラ設定処理
    // -------------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 30);

    // カメラの方向を設定する
    camera.lookAt(scene.position);

    // -------------------------------------
    // 環境光生成処理
    // -------------------------------------

    // 環境光を生成する
    let ambientLight = new THREE.AmbientLight(0x0c0c0c);

    // 環境光を追加する
    scene.add(ambientLight);

    // -------------------------------------
    // 点光源生成処理
    // -------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(-40, 60, -10);

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("basicAnimation-output").appendChild(renderer.domElement);

    // -------------------------------------
    // コントローラ生成処理
    // -------------------------------------

    let step = 0;

    let scalingStep = 0;

    // コントローラを生成する
    let controls = new function() {

        // 回転速度
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.scalingSpeed = 0.03;

    }

    // // -------------------------------------
    // // GUI生成処理
    // // -------------------------------------

    // // GUIを生成する
    // let gui = new dat.GUI();

    // gui.add(controls, 'rotationSpeed', 0, 0.5);
    // gui.add(controls, 'bouncingSpeed', 0, 0.5);
    // gui.add(controls, 'scalingSpeed' , 0, 0.5);

    // レンダリング処理を実行する
    render();

    // -------------------------------------
    // レンダリング関数
    // -------------------------------------

    function render() {

        // 立方体を回転させる
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // 球体設定する
        step += controls.bouncingSpeed;

        // 球体の位置を設定する
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        // シリンダーのスケールを設定する
        scalingStep += controls.scalingSpeed;

        let scaleX = Math.abs(Math.sin(scalingStep/4));
        let scaleY = Math.abs(Math.cos(scalingStep/5));
        let scaleZ = Math.abs(Math.sin(scalingStep/7));

        cylinder.scale.set(scaleX, scaleY, scaleZ);

        // アニメーションを設定する
        renderer.render(scene, camera);
        requestAnimationFrame(render);

    };

};
