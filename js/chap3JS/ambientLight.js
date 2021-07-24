let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeAmbientAnimation = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ------------------------------------
    // レンダラ生成処理
    // ------------------------------------

    // レンダラを生成する
    renderer = new THREE.WebGLRenderer();

    // レンダラの背景色を設定する   
    renderer.setClearColor(new THREE.Color(0xEEEEEE));

    // レンダラのサイズを設定する
    renderer.setSize(width, height);

    //　レンダラの影を有効にする
    renderer.shadowMap.enabled = true;
    
    // ------------------------------------
    // 平面生成処理
    // ------------------------------------

    // 平面ジオメトリを生成する
    let planeGeomtry = new THREE.PlaneGeometry(60,20,1,1);

    // 平面マテリアルを生成する
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

    // 平面メッシュを生成する
    let plane = new THREE.Mesh(planeGeomtry,planeMaterial);
    
    // 平面メッシュの影を有効にする
    plane.receiveShadow = true;

    // ------------------------------------
    // 平面位置設定処理
    // ------------------------------------

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    // ------------------------------------
    // 立方体生成処理
    // ------------------------------------

    // 立方体ジオメトリを生成する
    let cubeGeometry = new  THREE.BoxGeometry(4,4,4);

    // 立方体マテリアルを生成する
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});

    // 立方体メッシュを生成する
    let cube = new THREE.Mesh(cubeGeometry,cubeMaterial);

    // 立方体の影を有効にする
    cube.castShadow = true;

    // ------------------------------------
    // 立方体位置設定処理
    // ------------------------------------

    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;

    scene.add(cube);

    // ------------------------------------
    // 球体生成処理
    // ------------------------------------

    // 球体ジオメトリを生成する
    let sphereGeometry = new THREE.SphereGeometry(4,20,20);

    // 球体マテリアルを生成する
    let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});

    // 球体メッシュを生成する
    let sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);

    // ------------------------------------
    // 球体位置設定処理
    // ------------------------------------

    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;

    // 球体の影を有効にする
    sphere.castShadow = true;

    scene.add(sphere);

    // ------------------------------------
    // カメラ位置設定処理
    // ------------------------------------

    camera.position.x = -25;
    camera.position.y = 30;
    camera.position.z = 25;

    camera.lookAt(new THREE.Vector3(10,0,0));

    // ------------------------------------
    // 環境光生成処理
    // ------------------------------------

    // 環境光の色を設定する
    let ambiColor = "#0c0c0c";
    let ambientLight = new THREE.AmbientLight(ambiColor);

    scene.add(ambientLight);

    // ------------------------------------
    // 点光源生成処理
    // ------------------------------------

    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-20,30,-5);
    spotLight.castShadow = true;

    scene.add(spotLight);

    // ------------------------------------
    // 描画処理
    // ------------------------------------

    document.getElementById('Ambient-output').appendChild(renderer.domElement);

    let step = 0;

    // ------------------------------------
    // コントローラ設定処理
    // ------------------------------------

    let controls = new function() {

        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambiColor;

        this.disabedSpotlight = false;

    };

    // ------------------------------------
    // GUI設定処理
    // ------------------------------------

    // // GUIを生成する
    // let gui = new dat.GUI();

    // // 色設定GUI
    // gui.addColor(controls,'ambientColor').onChange((e) => {
    //     ambientLight.color = new THREE.Color(e);
    // });

    // // 点光源設定調整GUI
    // gui.add(controls, 'disabedSpotlight').onChange((e) => {
    //     spotLight.visible = !e;
    // });

    const render  = () => {

        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10*(Math.cos(step)));
        sphere.position.y = 2 + (10*Math.abs(Math.sin(step)));

        requestAnimationFrame(render);
        renderer.render(scene, camera);

    };

    render();

};