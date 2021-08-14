let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeSpotLight = () => {

    // ライト動作フラグ
    let stopMovingLight = false;

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ------------------------------------
    // レンダラ生成処理
    // ------------------------------------

    renderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    renderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    renderer.setSize(width, height);

    // シャドウマップを有効にする
    renderer.shadowMap.enabled = true;

    // シャドウマップタイプを設定する
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // ------------------------------------
    // 平面生成処理
    // ------------------------------------

    // 平面ジオメトリを生成する
    let planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);

    // 平面マテリアルを生成する
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

    // 平面メッシュを生成する
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // 平面の影を有効にする
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
    let cubeGeometry = new THREE.BoxGeometry(4,4,4);

    // 立方体マテリアルを生成する
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff3333});

    // 立方体メッシュを生成する
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

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
    let sphereGemetry = new THREE.SphereGeometry(4,20,20);

    // 球体マテリアルを生成する
    let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});

    // 球体メッシュを生成する
    let sphere = new THREE.Mesh(sphereGemetry,sphereMaterial);

    // ------------------------------------
    // 球体位置設定処理
    // ------------------------------------

    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;

    // 影を有効にする
    sphere.castShadow = true;

    scene.add(sphere);

    // ------------------------------------
    // カメラ位置設定処理
    // ------------------------------------

    camera.position.x = -35;
    camera.position.y = 30;
    camera.position.z = 25;

    camera.lookAt(new THREE.Vector3(10,0,0));

    // ------------------------------------
    // 環境光生成処理
    // ------------------------------------

    // 環境光色を設定する
    let ambiColor = "#1c1c1c";
    let ambientLight = new THREE.AmbientLight(ambiColor)

    scene.add(ambientLight);

    // ------------------------------------
    // スポットライト1生成処理
    // ------------------------------------

    // スポットライトを生成する
    let spotLight0 = new THREE.SpotLight(0xcccccc);

    // スポットライトの位置設定する
    spotLight0.position.set(-40, 30, -10);

    // スポットライトの視点を設定する
    spotLight0.lookAt(plane);

    scene.add(spotLight0);

    let target = new THREE.Object3D();
//    target.position = new THREE.Vector3(5, 0, 0);


    // ------------------------------------
    // スポットライト2生成処理
    // ------------------------------------

    // スポットライトの色を設定する
    let pointColor = "#FFFFFF";

    // スポットライトを生成する
    let spotLight = new THREE.SpotLight(pointColor);

    // スポットライトの位置を設定する
    spotLight.position.set(-40, 60, -10);

    // スポットライトの影を有効にする
    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 2;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 30;
    spotLight.target = plane;
    spotLight.decay = 1;
    spotLight.distance = 0;
    spotLight.angle = 0.4;

    scene.add(spotLight);

    // ------------------------------------
    // camera helper生成処理
    // ------------------------------------

    // カメラヘルパーを生成する
    let cameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
    cameraHelper.visible = false;
    scene.add(cameraHelper);

    // ------------------------------------
    // スフィアライトを生成する
    // ------------------------------------

    // 球体ライトを生成する
    let sphereLight = new THREE.SphereGeometry(0.2);

    // 球体ライトマテリアルを生成する
    let sphereLightMaterial = new THREE.MeshBasicMaterial({color: 0xac6c25});
    
    // 球体ライトメッシュを生成する
    let sphereLightMesh = new THREE.Mesh(sphereLight,sphereLightMaterial);

    // 球体ライトのキャストシャドウを有効にする
    sphereLightMesh.castShadow = true;

    // 球体ライトの位置を設定する
    sphereLightMesh.position.set(new THREE.Vector3(3,20,3));
    scene.add(sphereLightMesh);

    // 画面表示を実行する
    document.getElementById("Spot-output").appendChild(renderer.domElement);

    let step = 0;
    let invert = 1;
    let phase = 0;

    // ------------------------------------
    // コントローラ設定処理
    // ------------------------------------

    let controls = new function() {
        this.rotationSpeed = 0.03;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambiColor;
        this.pointColor = pointColor;
        this.intensity = 1;
        this.decay = 1;
        this.distance = 0;
        this.penumbra = 30;
        this.angle = 0.1;
        this.debug = false;
        this.castShadow = true;
        this.target = "plane";
        this.stopMovingLight = false;
    }

    // // ------------------------------------
    // // GUI設定処理
    // // ------------------------------------

    // let gui = new dat.GUI();

    // // 環境光設定GUI
    // gui.addColor(controls, 'ambientColor').onChange(function(e) {
    //     ambientLight.color = new THREE.Color(e);
    // });

    // // 点光源設定GUI
    // gui.addColor(controls,'pointColor').onChange(function(e) {
    //     spotLight.color = new THREE.Color(e);
    // });

    // // アングル設定GUI
    // gui.add(controls, 'angle',0, Math.PI*2).onChange(function(e) {
    //     spotLight.angle = e;
    // });

    // // intensity設定GUI
    // gui.add(controls, 'intensity', 0, 5).onChange(function(e) {
    //     spotLight.intensity = e;
    // });

    // // decay設定GUI
    // gui.add(controls,'decay', 1, 100).onChange(function(e) {
    //     spotLight.decay = e;
    // });

    // // distance設定GUI
    // gui.add(controls, 'distance', 0, 200).onChange(function(e) {
    //     spotLight.distance = e;
    // });

    // // penumbra設定GUI
    // gui.add(controls, 'penumbra', 0, 100).onChange(function(e) {
    //     spotLight.penumbra = e;
    // });

    // // debug設定GUI
    // gui.add(controls, 'debug').onChange(function(e) {
    //     cameraHelper.visible = e;
    // });

    // // castShadow設定GUI
    // gui.add(controls, 'castShadow').onChange(function(e) {
    //     spotLight.castShadow = e;
    // });

    // // 編集対象選択設定GUI
    // gui.add(controls, 'target',['Plane', 'Sphere', 'Cube']).onChange(function(e) {
    //     switch(e) {
    //         case "Plane": 
    //             spotLight.target = plane;
    //             break;
            
    //         case "Sphere":
    //             spotLight.target = sphere;
    //             break;

    //         case "Cube":
    //             spotLight.target = cube;
    //             break;
    //     }
    // });

    // // stopMovingLight設定GUI
    // gui.add(controls, 'stopMovingLight').onChange(function(e) {
    //     stopMovingLight = e;
    // });

    // レンダリング関数
    const render = () => {

        // 立方体回転設定処理
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // バウンド処理
        step += controls.bouncingSpeed;
        
        // 球体位置設定処理
        sphere.position.x = 20 + ( 10 * (Math.cos(step)));
        sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));

        // ライト動作設定処理
        if ( !stopMovingLight ) {

            if ( phase > 2 * Math.PI ) {
                invert = invert * -1;
                phase -= 2 * Math.PI;
            } else {
                phase += controls.rotationSpeed;
            }

            // 球体ライト位置設定処理
            sphereLightMesh.position.z = +(7 * (Math.sin(phase)));
            sphereLightMesh.position.x = +(14* (Math.cos(phase)));
            sphereLightMesh.position.y = 10;

            if ( invert < 0 ) {
                let pivot = 14;
                sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
            }

            spotLight.position.copy(sphereLightMesh.position);

        }

        requestAnimationFrame(render);
        renderer.render(scene,camera);

    };

    render();

};