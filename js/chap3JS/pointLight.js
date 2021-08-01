let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makePointLight = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ----------------------------
    // レンダラ生成処理
    // ----------------------------

    // レンダラを生成する
    renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(width,height);
    renderer.shadowMap.enabled = true;

    // ----------------------------
    // 平面生成処理
    // ----------------------------

    // 平面ジオメトリを生成する
    let planeGeometry = new THREE.PlaneGeometry(60, 20, 20, 20);

    // 平面マテリアルを生成する
    let planeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});

    // 平面メッシュを生成する
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // 平面の影を有効にする
    plane.receiveShadow = true;

    // ----------------------------
    // 平面位置設定処理
    // ----------------------------

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    // ----------------------------
    // 立方体生成処理
    // ----------------------------

    // 立方体ジオメトリを生成する
    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);

    // 立方体マテリアルを生成する
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff7777});

    // 立方体メッシュを生成する
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // 立方体の影を設定する
    cube.castShadow = true;

    // ----------------------------
    // 立方体位置設定処理
    // ----------------------------

    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;

    scene.add(cube);

    // ----------------------------
    // 球体生成処理
    // ----------------------------

    // 球体ジオメトリを生成する
    let sphereGeometry = new THREE.SphereGeometry(4,20,20);

    // 球体マテリアルを生成する
    let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});

    // 球体メッシュを生成する
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // ----------------------------
    // 球体位置設定処理
    // ----------------------------

    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;

    sphere.castShadow = true;

    scene.add(sphere);

    // ----------------------------
    // カメラ位置設定処理
    // ----------------------------

    camera.position.x = -25;
    camera.position.y = 30;
    camera.position.z = 25;

    camera.lookAt(new THREE.Vector3(10,0,0));

    // ----------------------------
    // 環境光設定処理
    // ----------------------------

    // 環境光の色を設定する
    let ambiColor = "#0c0c0c";
    let ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    // ----------------------------
    // スポットライト設定処理
    // ----------------------------

    // スポットライトを生成する
    let spotLight = new THREE.SpotLight(0xffffff);
    
    // スポットライトの位置を設定する
    spotLight.position.set(-40,60,-10);

    // スポットライトの影を有効にする
    spotLight.castShadow = true;

    // ----------------------------
    // ポイントライト設定処理
    // ----------------------------

    // ポイントライトの色を設定する
    let pointColor = '#ccffcc';
    let pointLight = new THREE.PointLight(pointColor);

    scene.add(pointLight);

    // ----------------------------
    // 球体光源処理
    // ----------------------------

    // 球体ライトジオメトリを生成する
    let sphereLight = new THREE.SphereGeometry(0.2);

    // 球体ライトマテリアルを生成する
    let sphereLightMaterial = new THREE.MeshBasicMaterial({color: 0xa6c25});

    // 球体ライトメッシュを生成する
    let sphereLightMesh = new THREE.Mesh(sphereLight,sphereLightMaterial);

    scene.add(sphereLightMesh);

    // DOMに3DCGを反映する
    document.getElementById('Point-output').appendChild(renderer.domElement);

    let step = 0;
    let invert = 1;
    let phase = 0;

    let controls = new function() {
        this.rotationSpeed = 0.03;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambiColor;
        this.pointColor = pointColor;
        this.intensity = 1;
        this.distance = 100;
        this.decay = 1;
    }

    // ----------------------------
    // GUI生成処理
    // ----------------------------

    // // GUIを生成する
    // let gui = new dat.GUI();

    // // 環境光設定コントローラ
    // gui.addColor(controls, 'ambientColor').onChange((e) => {
    //     ambientLight.color = new THREE.Color(e);
    // });

    // // 点光源設定コントローラ
    // gui.addColor(controls, 'pointColor').onChange((e) => {
    //     pointLight.color = new THREE.Color(e);
    // });

    // // intensity設定コントローラ
    // gui.add(controls, 'intensity', 0, 3).onChange((e) => {
    //     pointLight.intensity = e;
    // });

    // // distance設定コントローラ
    // gui.add(controls, 'distance', 0,100).onChange((e) => {
    //     pointLight.distance = e;
    // });

    // // decay設定コントローラ
    // gui.add(controls, 'decay', 1, 100).onChange((e) => {
    //     pointLight.decay = e;
    // });

    // ----------------------------
    // レンダリング処理
    // ----------------------------

    const render = () => {

        // 立方体位置設定処理
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // 球体アニメーション設定
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10*(Math.cos(step)));
        sphere.position.y = 2 + (10*Math.abs(Math.sin(step)));

        if (phase > 2*Math.PI) {
            invert = invert*(-1);
            phase -= 2*Math.PI;
        } else {
            phase += controls.rotationSpeed;
        }

        sphereLightMesh.position.z = +(7*(Math.sin(phase)));
        sphereLightMesh.position.x = +(14*(Math.cos(phase)));
        sphereLightMesh.position.y = 5;

        if (invert < 0) {
            let pivot = 14;
            sphereLightMesh.position.x = (invert*(sphereLightMesh.position.x - pivot)) + pivot;
        }

        pointLight.position.copy(sphereLightMesh.position);

        requestAnimationFrame(render);
        renderer.render(scene,camera);


    }

    render();

};