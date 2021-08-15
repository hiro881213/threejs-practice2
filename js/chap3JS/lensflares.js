let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeLensFlares = () => {

    // シーンを生成する
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xaaaaaa, 0.010,200);

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ----------------------------------------
    // レンダラ生成処理
    // ----------------------------------------

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

    renderer.setClearColor(new THREE.Color(0xaaaaff));
    renderer.setSize(width,height);
    renderer.shadowMap.enabled = true;

    // ----------------------------------------
    // テクスチャ生成処理
    // ----------------------------------------

    let textureLoader = new THREE.TextureLoader();
    let textureGrass = textureLoader.load("../assets/textures/ground/grasslight-big.jpg");

    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set(4, 4);

    // ----------------------------------------
    // 平面生成処理
    // ----------------------------------------

    let planeGeometry = new THREE.PlaneGeometry(1000,200,20,20);
    let planeMaterial = new THREE.MeshLambertMaterial({map: textureGrass});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    // ----------------------------------------
    // 立方体生成処理
    // ----------------------------------------

    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff3333});
    let cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
    cube.castShadow = true;

    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;

    scene.add(cube);

    // ----------------------------------------
    // 球体生成処理
    // ----------------------------------------

    let sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
    let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.x = 10;
    sphere.position.y = 5;
    sphere.position.z = 10;
    sphere.castShadow = true;

    scene.add(sphere);

    // ----------------------------------------
    // カメラ生成処理
    // ----------------------------------------

    camera.position.x = -20;
    camera.position.y = 15;
    camera.position.z = 45;
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // ----------------------------------------
    // 環境光生成処理
    // ----------------------------------------

    let ambiColor = "#1c1c1c";
    let ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    // ----------------------------------------
    // 点光源生成処理
    // ----------------------------------------

    let spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40, 60, -10);
    spotLight0.lookAt(plane);
    scene.add(spotLight0);

    // ----------------------------------------
    // ターゲットオブジェクト生成処理
    // ----------------------------------------

    let target = new THREE.Object3D();
    target.position.x = 5;
    target.position.y = 0;
    target.position.z = 0;

    // ----------------------------------------
    // スポットライト生成処理
    // ----------------------------------------

    let pointColor = "#ffffff";
    let spotLight = new THREE.DirectionalLight(pointColor);

    spotLight.position.set(30, 10, -50);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 0.1;
    spotLight.shadow.camera.far = 100;
    spotLight.shadow.camera.fov = 50;
    spotLight.target = plane;
    spotLight.distance = 0;
    spotLight.shadow.camera.near = 2;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.left = -100;
    spotLight.shadow.camera.right = 100;
    spotLight.shadow.camera.top = 100;
    spotLight.shadow.camera.bottom = -100;
    spotLight.shadow.mapSize.widht = 2048;
    spotLight.shadow.mapSize.height= 2048;

    scene.add(spotLight);

    document.getElementById('lensFlares-output').appendChild(renderer.domElement);

    let step = 0;

    let invert = 1;
    let phase = 0;

    let controls = new function() {
        this.rotationSpeed = 0.03;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambiColor;
        this.pointColor = pointColor;
        this.intensity = 0.1;
        this.distance = 0;
        this.exponent = 30;
        this.angle = 0.1;
        this.debug = false;
        this.castShadow = true;
        this.onlyShadow = false;
        this.target = "Plane";
    };

    let gui = new dat.GUI();

    gui.addColor(controls, 'ambientColor').onChange(function(e) {
        ambientLight.color = new THREE.Color(e);
    });

    gui.addColor(controls, 'pointColor').onChange(function(e) {
        spotLight.color = new THREE.Color(e);
    });

    gui.add(controls, 'intensity', 0, 5).onChange(function(e) {
        spotLight.intensity = e;
    });

    let textureFlare0 = textureLoader.load("../assets/textures/lensflare/lensflare0.png");
    let textureFlare3 = textureLoader.load("../assets/textures/lensflare/lensflare3.png");

    let flareColor = new THREE.Color(0xffaacc);
    let lensFlare = new THREE.LensFlare(textureFlare0, 350, 0.0, THREE.AdditiveBlending, flareColor);

    lensFlare.add(textureFlare3, 60, 0.6, THREE.AdditiveBlending);
    lensFlare.add(textureFlare3, 70, 0.7, THREE.AdditiveBlending);
    lensFlare.add(textureFlare3, 120,0.9, THREE.AdditiveBlending);
    lensFlare.add(textureFlare3, 70, 1.0, THREE.AdditiveBlending);

    lensFlare.position.copy(spotLight.position);
    scene.add(lensFlare);

    const render = () => {
        
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        step += controls.bouncingSpeed;
        sphere.position.x = 20 + ( 10 * (Math.cos(step)));
        sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));

        requestAnimationFrame(render);
        renderer.render(scene, camera);

    };

    render();

}