let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeMultiMaterial = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    // レンダラを生成する
    renderer = new THREE.WebGLRenderer();

    // 背景色設定処理
    renderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    renderer.setSize(width, height);

    // シャドウマップを設定する
    renderer.shadowMap.enabled = false;

    // 平面ジオメトリを生成する
    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);

    // 平面マテリアルを生成する
    const planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

    // 平面メッシュを生成する
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // 陰影を設定する
    plane.receiveShadow = true;

    // 平面メッシュを回転させる
    plane.rotation.x = -0.5 * Math.PI;
    
    // 平面メッシュを位置設定する
    plane.position.set(0, -2, 0);

    // 平面メッシュをシーンに追加する
    scene.add(plane);

    // -------------------------------------
    // カメラ位置設定処理
    // -------------------------------------

    camera.position.set(-40,40,40);
    camera.position.set(-30,30,30);

    camera.lookAt(scene.position);

    // -------------------------------------
    // 環境光設定処理
    // -------------------------------------

    // 環境光を生成する
    const ambientLight = new THREE.AmbientLight(0xffffff);
    
    // 環境光をシーンに追加する
    scene.add(ambientLight);

    // -------------------------------------
    // 点光源設定処理
    // -------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置設定をする
    spotLight.position.set(-40, 60, -10);

    // キャストシャドウを設定する
    spotLight.castShadow = true;

    // 点光源をシーンに追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOM設定する
    document.getElementById('multiMaterial-output').appendChild(renderer.domElement);

    // グループを生成する
    let group = new THREE.Group();

    // マテリアルオブジェクトを生成する
    let mats = [];

    mats.push(new THREE.MeshBasicMaterial({color: 0x009e60}));
    mats.push(new THREE.MeshBasicMaterial({color: 0x009e60}));
    mats.push(new THREE.MeshBasicMaterial({color: 0x0051ba}));
    mats.push(new THREE.MeshBasicMaterial({color: 0x0051ba}));
    mats.push(new THREE.MeshBasicMaterial({color: 0xffd500}));
    mats.push(new THREE.MeshBasicMaterial({color: 0xffd500}));
    mats.push(new THREE.MeshBasicMaterial({color: 0xff5800}));
    mats.push(new THREE.MeshBasicMaterial({color: 0xff5800}));
    mats.push(new THREE.MeshBasicMaterial({color: 0xC41E3A}));
    mats.push(new THREE.MeshBasicMaterial({color: 0xC41E3A}));
    mats.push(new THREE.MeshBasicMaterial({color: 0xffffff}));
    mats.push(new THREE.MeshBasicMaterial({color: 0xffffff}));

    let faceMaterial = new THREE.MultiMaterial(mats);

    for ( let x = 0; x < 3; x++ ) {
        for ( let y = 0; y < 3; y++ ) {
            for ( let z = 0; z < 3; z++ ) {
                const cubeGeom = new THREE.BoxGeometry(2.9, 2.9, 2.9);
                const cube = new THREE.Mesh(cubeGeom, faceMaterial);
                cube.position.set(x * 3 - 3, y * 3, z * 3 - 3);

                group.add(cube);
            }
        } 
    }

    // グループをシーンに追加する
    scene.add(group);

    let step = 0;

    let controls = new function() {
        this.rotationSpeed = 0.02;
        this.numberOfObjects = scene.children.length;
    };

    let gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);

    // -------------------------------------
    // レンダラ関数
    // -------------------------------------

    const render = () => {

        // マテリアルグループを回転させる
        group.rotation.y = step += controls.rotationSpeed;

        requestAnimationFrame(render);
        renderer.render(scene, camera);

    };

    render();

};