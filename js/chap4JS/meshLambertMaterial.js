let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeLambertMaterial = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    // -----------------------------------------
    // レンダラ生成処理
    // -----------------------------------------

    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を生成する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));
    
    // 画面サイズを生成する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // -----------------------------------------
    // キャンパスレンダラ生成処理
    // -----------------------------------------

    let canvasRenderer = new THREE.CanvasRenderer();

    // キャンバスサイズを設定する
    canvasRenderer.setSize(width, height);

    renderer = webGLRenderer;

    // -----------------------------------------
    // メッシュ生成処理
    // -----------------------------------------

    // 平面ジオメトリを生成する
    let groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);

    // 平面メッシュを生成する
    let groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({color: 0x555555}));
    
    // 平面メッシュを回転させる
    groundMesh.rotation.x = -Math.PI / 2;
    
    // 平面メッシュの位置を設定する
    groundMesh.position.y = -20;

    // 平面メッシュをシーンに追加する
    scene.add(groundMesh);

    // 球体ジオメトリを生成する
    const sphereGeometry = new THREE.SphereGeometry(14, 20, 20);

    // 立方体ジオメトリを生成する
    const cubeGeometry = new THREE.BoxGeometry(15, 15, 15);

    // 平面ジオメトリを生成する
    const planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

    // マテリアルを生成する
    const meshMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});

    // 球体メッシュを生成する
    let sphere = new THREE.Mesh(sphereGeometry, meshMaterial);

    // 立方体メッシュを生成する
    let cube = new THREE.Mesh(cubeGeometry, meshMaterial);

    // 平面メッシュを生成する
    let plane = new THREE.Mesh(planeGeometry, meshMaterial);

    // // 球体メッシュの位置を設定する
    // sphere.position.set(0, 3, 2);

    // // 立方体メッシュの位置を設定する
    // cube.position.set(0, 3, 2);

    // // 平面メッシュの位置を設定する
    // plane.position.set(0, 3, 2);

    sphere.position.x = 0;
    sphere.position.y = 3;
    sphere.position.z = 2;
    sphere.position.set(0,3,2);
    cube.position.set(0,3,2);
    plane.position.set(0,3,2);

    // 立方体メッシュをシーンに追加する
    scene.add(cube);

    // -----------------------------------------
    // カメラ設定処理
    // -----------------------------------------

    camera.position.x = -20;
    camera.position.y = 30;
    camera.position.z = 40;
    camera.lookAt(new THREE.Vector3(10,0,0));

    // -----------------------------------------
    // 環境光設定処理
    // -----------------------------------------

    // 環境光を生成する
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // -----------------------------------------
    // 点光源設定処理
    // -----------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(-30, 60, 60);

    // 点光源のキャストシャドウを設定する
    spotLight.castShadow = true;

    // 点光源をシーンに追加する
    scene.add(spotLight);

    // THREE.JSオブジェクトをDOMに追加する
    document.getElementById('lambertMaterial-output').appendChild(renderer.domElement);

    let step = 0;

    // -----------------------------------------
    // コントローラ設定処理
    // -----------------------------------------

    let controls = new function () {

        // 回転速度
        this.rotationSpeed = 0.02;

        // 跳ね返り
        this.bouncingSpeed = 0.03;

        // 透過性
        this.opacity = meshMaterial.opacity;
        this.transparent = meshMaterial.transparent;

        // オーバードロー
        this.overdraw = meshMaterial.overdraw;

        // 表示非表示
        this.visible = meshMaterial.visible;

        // エミッシブ
        this.emissive = meshMaterial.emissive.getHex();

        // 方向
        this.side = "front";

        // 表面色
        this.color = meshMaterial.color.getStyle();

        // メッシュ選択
        this.selectedMesh = "cube";

    };

    // -----------------------------------------
    // GUI生成処理
    // -----------------------------------------

    let gui = new dat.GUI();

    let spGui = gui.addFolder("Mesh");

    // 透過性設定
    spGui.add(controls, 'opacity', 0, 1).onChange((e) => {
        meshMaterial.opacity = e;
    });

    spGui.add(controls, 'transparent').onChange((e) => {
        meshMaterial.transparent = e;
    });

    // 表示非表示
    spGui.add(controls, 'visible').onChange((e) => {
        meshMaterial.visible = e;
    });

    // エミッシブ
    spGui.addColor(controls, 'emissive').onChange((e) => {
        meshMaterial.emissive = new THREE.Color(e);
    });

    // 方向
    spGui.add(controls, 'side', ["front", "back", "double"]).onChange((e) => {

        switch (e) {
            case "front":
                meshMaterial.side = THREE.FrontSide;
                break;
            
            case "back":
                meshMaterial.side = THREE.BackSide;
                break;
            
            case "double":
                meshMaterial.side = THREE.DoubleSide;
                break;
        }

        meshMaterial.needsUpdate = true;

    });

    // 色
    spGui.addColor(controls, 'color').onChange((e) => {
        meshMaterial.color.setStyle(e);
    });

    // 選択メッシュ
    spGui.add(controls, 'selectedMesh', ["cube", "sphere", "plane"]).onChange((e) => {

        // 平面をシーンから削除する
        scene.remove(plane);

        // 立方体をシーンから削除する
        scene.remove(cube);

        // 球体をシーンから削除する
        scene.remove(sphere);

        switch (e) {

            case "cube":

                // 立方体をシーンに追加する
                scene.add(cube);
                break;
            
            case "sphere":
                
                // 球体をシーンに追加する
                scene.add(sphere);
                break;

            case "plane":

                // 平面をシーンに追加する
                scene.add(plane);
                break;

            }

    });

    // -----------------------------------------
    // レンダラ関数
    // -----------------------------------------

    const render = () => {

        // 球体を回転する
        cube.rotation.y = step += 0.01;

        // 平面を回転する
        plane.rotation.y = step;

        // 球体を回転する
        sphere.rotation.y = step;

        requestAnimationFrame(render);
        renderer.render(scene, camera);

    };

    render();

};