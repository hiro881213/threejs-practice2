let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeDirectionalLight = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    // ----------------------------------------------
    // 平面生成処理
    // ----------------------------------------------

    // 平面ジオメトリを生成する
    let planeGeometry = new THREE.PlaneGeometry(600,200,20,20);

    // 平面マテリアルを生成する
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

    // 平面メッシュを生成する
    let plane = new THREE.Mesh(planeGeometry,planeMaterial);

    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    
    plane.position.x = 15;
    plane.position.y = -5;
    plane.position.z = 0;

    scene.add(plane);

    // ----------------------------------------------
    // 立方体生成処理
    // ----------------------------------------------

    let cubeGeometry = new THREE.BoxGeometry(4,4,4);
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff3333});
    let cube = new THREE.Mesh(cubeGeometry,cubeMaterial);

    cube.castShadow = true;

    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;

    scene.add(cube);

    // ----------------------------------------------
    // 球体生成処理
    // ----------------------------------------------

    let sphereGeometry = new THREE.SphereGeometry(4,20,20);
    let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;

    sphere.castShadow = true;

    scene.add(sphere);

    // ----------------------------------------------
    // カメラ位置設定処理
    // ----------------------------------------------

    camera.position.x = -35;
    camera.position.y = 30;
    camera.position.z = 25;

    camera.lookAt(new THREE.Vector3(10,0,0));

    // ----------------------------------------------
    // 環境光設定処理
    // ----------------------------------------------

    let ambiColor = "#1c1c1c";
    let ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    // ----------------------------------------------
    // ターゲットオブジェクト生成処理
    // ----------------------------------------------

    var target = new THREE.Object3D();
    target.position.x = 5;
    target.position.y = 0;
    target.position.z = 0;

    // target.position = new THREE.Vector3(5, 0, 0);

    // ----------------------------------------------
    // 直接光生成処理
    // ----------------------------------------------

    let pointColor = "#ff5808";
    let directionalLight = new THREE.DirectionalLight(pointColor);

    directionalLight.position.set(-40,60,-10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 2;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;

    directionalLight.distance = 0;
    directionalLight.intensity = 0.5;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.mapSize.width  = 1024;

    scene.add(directionalLight);

    let cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    cameraHelper.visible = false;

    scene.add(cameraHelper);

    // ----------------------------------------------
    // 球体ライト生成処理
    // ----------------------------------------------

    let sphereLight = new THREE.SphereGeometry(0.2);
    let sphereLightMaterial = new THREE.MeshBasicMaterial({color: 0xac6c25});
    let sphereLightMesh = new THREE.Mesh(sphereLight,sphereLightMaterial);
    sphereLightMesh.castShadow = true;

    sphereLightMesh.position.x = 3;
    sphereLightMesh.position.y = 20;
    sphereLightMesh.position.z = 3;
    // sphereLightMesh.position = new THREE.Vector3(3,20,3);

    scene.add(sphereLightMesh);

    document.getElementById("Direct-output").appendChild(renderer.domElement);

    // ----------------------------------------------
    // コントローラ生成処理
    // ----------------------------------------------

    let step = 0;
    let invert = 1;
    let phase = 0;

    let controls = new function () {
        this.rotationSpeed = 0.03;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambiColor;
        this.pointColor = pointColor;
        this.intensity = 0.5;
        this.distance = 0;
        this.penumbra = 30;
        this.angle = 0.1;
        this.debug = false;
        this.castShadow = true;
        this.target = "plane";
    }

    // // ----------------------------------------------
    // // GUI生成処理
    // // ----------------------------------------------

    // let gui = new dat.GUI();

    // gui.addColor(controls, 'ambientColor').onChange(function(e) {
    //     ambientLight.color = new THREE.Color(e);
    // });

    // gui.addColor(controls, 'pointColor').onChange(function(e) {
    //     directionalLight.color = new THREE.Color(e);
    // });

    // gui.add(controls, 'intensity', 0, 5).onChange(function(e) {
    //     directionalLight.intensity = e;
    // });

    // gui.add(controls, 'distance', 0, 200).onChange(function(e) {
    //     directionalLight.distance = e;
    // });

    // gui.add(controls, 'debug').onChange(function(e) {
    //     cameraHelper.visible = e;
    // });

    // gui.add(controls, 'castShadow').onChange(function(e) {
    //     directionalLight.castShadow = e;
    // });

    // gui.add(controls, 'target', ['plane','Sphere', 'Cube']).onChange(function(e) {
    //     switch(e) {
    //         case "Plane" :
    //             directionalLight.target = plane;
    //             break;
            
    //         case "Sphere":
    //             directionalLight.target = sphere;
    //             break;
            
    //         case "Cube":
    //             directionalLight.target = cube;
    //             break;
    //     }
    // });

    const render = () => {
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        step += controls.bouncingSpeed;
        // -----------------------------------------
        // 球体位置設定処理
        // -----------------------------------------

        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        // -----------------------------------------
        // 球体光位置設定処理
        // -----------------------------------------

        sphereLightMesh.position.z = -8;
        sphereLightMesh.position.y = +(27 * (Math.sin(step / 3)));
        sphereLightMesh.position.x = 10 + (26 * (Math.cos(step / 3)));

        // -----------------------------------------
        // 直接光位置設定処理
        // -----------------------------------------

        directionalLight.position.copy(sphereLightMesh.position);

        requestAnimationFrame(render);
        renderer.render(scene,camera);

    }

    render();

};