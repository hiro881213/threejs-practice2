let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeHemiSphere = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // シーンにfogを設定する
    scene.fog = new THREE.Fog(0xaaaaaa,0.010,200);
    
    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000); 

    // レンダラを生成する
    renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0xaaaaff));
    renderer.setSize(width,height);

    renderer.shadowMap.enabled = true;

    // テクスチャ生成処理
    let textureLoader = new THREE.TextureLoader();
    let textureGrass = textureLoader.load('../assets/textures/ground/grasslight-big.jpg');

    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set(4,4);

    // ----------------------------------------
    // 平面生成処理
    // ----------------------------------------

    let planeGeometry = new THREE.PlaneGeometry(1000,200,20,20);
    let planeMaterial = new THREE.MeshLambertMaterial({ map: textureGrass });
    let plane = new THREE.Mesh(planeGeometry,planeMaterial);

    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    // ----------------------------------------
    // 立方体生成処理
    // ----------------------------------------

    let cubeGeometry = new THREE.BoxGeometry(4,4,4);
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

    let sphereGeometry = new THREE.SphereGeometry(4,25,25);
    let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
    let sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);

    sphere.position.x = 10;
    sphere.position.y = 5;
    sphere.position.z = 10;

    sphere.castShadow = true;

    scene.add(sphere);

    // ----------------------------------------
    // カメラ設定処理
    // ----------------------------------------

    camera.position.x = -20;
    camera.position.y = 15;
    camera.position.z = 45;

    camera.lookAt(new THREE.Vector3(10,0,0));

    // ----------------------------------------
    // 点光源設定処理
    // ----------------------------------------

    let spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40, 60, -10);
    spotLight0.lookAt(plane);

    scene.add(spotLight0);

    // ----------------------------------------
    // target設定処理
    // ----------------------------------------

    let target = new THREE.Object3D();
    target.position.x = 5;
    target.position.y = 0;
    target.position.z = 0;

    // ----------------------------------------
    // hemi光源設定処理
    // ----------------------------------------

    let hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
    hemiLight.position.set(0, 500, 0);
    
    scene.add(hemiLight);

    // ----------------------------------------
    // 直接光設定処理
    // ----------------------------------------

    let pointColor = '#ffffff';
    let dirLight = new THREE.DirectionalLight(pointColor);

    dirLight.position.set(30, 10, -50);
    dirLight.castShadow = true;
    dirLight.target = plane;

    dirLight.shadow.camera.near  = 0.1;
    dirLight.shadow.camera.far   = 200;
    dirLight.shadow.camera.left  = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top   = 50;
    dirLight.shadow.camera.bottom= -50;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height= 2048;

    scene.add(dirLight);

    document.getElementById("hemiSphere-output").appendChild(renderer.domElement);

    let step   = 0;
    let invert = 1;
    let phase  = 0;

    let controls = new function() {

        this.rotationSpeed = 0.03;
        this.bouncingSpeed = 0.03;

        this.hemisphere = true;
        this.color = 0x00ff00;
        this.skyColor = 0x0000ff;
        this.intensity = 0.6;

    };

    let gui = new dat.GUI();

    gui.add(controls, 'hemisphere').onChange(function(e) {
        if (!e) {
            hemiLight.intensity = 0;
        } else {
            hemiLight.intensity = controls.intensity;
        }
    });

    gui.addColor(controls, 'color').onChange(function(e) {
        hemiLight.groundColor = new THREE.Color(e);
    });

    gui.addColor(controls, 'skyColor').onChange(function(e) {
        hemiLight.color = new THREE.Color(e);
    });

    gui.add(controls,'intensity', 0, 5).onChange(function(e) {
        hemiLight.intensity = e;
    });

    const render = () => {

        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        step += controls.bouncingSpeed;
        
        sphere.position.x = 20 + ( 10 * Math.cos(step));
        sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));

        requestAnimationFrame(render);
        renderer.render(scene, camera);

    };

    render();

};