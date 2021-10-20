let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makePhongMaterial = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // --------------------------------------
    // レンダラ設定処理
    // --------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // キャストシャドウを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // カンバスレンダラを生成する
    let canvasRenderer = new THREE.CanvasRenderer();

    // カンバスレンダラのサイズを設定する
    canvasRenderer.setSize(width, height);

    renderer = webGLRenderer;

    // --------------------------------------
    // 地面設定処理
    // --------------------------------------

    // 平面ジオメトリを生成する
    const groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);

    // 平面メッシュを生成する
    const groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({color: 0x555555}));
    
    // 平面メッシュを回転させる
    groundMesh.rotation.x = -Math.PI/2;

    // 平面メッシュの位置を設定する
    groundMesh.position.y = -20;

    // シーンに平面メッシュを追加する
    scene.add(groundMesh);

    // --------------------------------------
    // 各種メッシュ設定処理
    // --------------------------------------

    // 球体ジオメトリを生成する
    const sphereGeometry = new THREE.SphereGeometry(14, 20, 20);

    // 立方体ジオメトリを生成する
    const cubeGeometry = new THREE.BoxGeometry(15, 15, 15);

    // 平面ジオメトリを生成する
    const planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

    // マテリアルを生成する
    let meshMaterial = new THREE.MeshPhongMaterial({color: 0x7777ff});

    // 球体メッシュを生成する
    let sphere = new THREE.Mesh(sphereGeometry, meshMaterial);

    // 立方体メッシュを生成する
    let cube = new THREE.Mesh(cubeGeometry, meshMaterial);

    // 平面メッシュを生成する
    let plane = new THREE.Mesh(planeGeometry, meshMaterial);

    // 球体メッシュの位置を設定する
    sphere.position.set(0, 3, 2);

    // 立方体メッシュの位置を設定する
    cube.position.set(0, 3, 2);

    // 平面メッシュの位置を設定する
    plane.position.set(0, 3, 2);

    // シーンに立方体メッシュを追加する
    scene.add(cube);

    // --------------------------------------
    // カメラ設定処理
    // --------------------------------------

    // カメラの位置を設定する
    camera.position.set(-20, 30, 40);
    
    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // --------------------------------------
    // 環境光設定処理
    // --------------------------------------

    // 環境光を生成する
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);

    // 環境光をシーンに追加する
    scene.add(ambientLight);

    // --------------------------------------
    // 点光源設定処理
    // --------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(0, 30, 60);

    // キャストシャドウを設定する
    spotLight.castShadow = true;

    // インテンシティを設定する
    spotLight.intensity = 0.6;

    // 点光源をシーンに追加する
    scene.add(spotLight);

    // THREE.JSをDOMに追加する
    document.getElementById("meshPhongMaterial-output").appendChild(renderer.domElement);

    let step = 0;

    // --------------------------------------
    // コントローラ設定処理
    // --------------------------------------

    // コントローラを定義する
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

        // スペキュラー
        this.specular = meshMaterial.specular.getHex();

        // 輝度
        this.shininess = meshMaterial.shininess;

        // 方向
        this.side = "front";

        // シェーディング
        this.shading = "smooth"

        // 色
        this.color = meshMaterial.color.getStyle();

        // メッシュ選択
        this.selectedMesh = "cube";

    };

    // // --------------------------------------
    // // GUI設定処理
    // // --------------------------------------

    // // GUIを生成する
    // let gui = new dat.GUI();

    // let spGui = gui.addFolder("Mesh");

    // // 透過性
    // spGui.add(controls, 'opacity', 0, 1).onChange((e) => {
    //     meshMaterial.opacity = e;
    // });

    // spGui.add(controls, 'transparent').onChange((e) => {
    //     meshMaterial.transparent = e;
    // });

    // // 表示非表示
    // spGui.add(controls, 'visible').onChange((e) => {
    //     meshMaterial.visible = e;
    // });

    // // エミッシブ
    // spGui.addColor(controls, 'emissive').onChange((e) => {
    //     meshMaterial.emissive = new THREE.Color(e);
    // });

    // // スペキュラ
    // spGui.addColor(controls, 'specular').onChange((e) => {
    //     meshMaterial.specular = new THREE.Color(e);
    // });

    // // 輝度
    // spGui.add(controls, 'shininess', 0, 200).onChange((e) =>{
    //     meshMaterial.shininess = e;
    // });

    // // 方向
    // spGui.add(controls, 'side', ["front", "back", "double"]).onChange((e) => {

    //     switch (e) {

    //         case "front":
    //             meshMaterial.side = THREE.FrantSide;
    //             break;
            
    //         case "back":
    //             meshMaterial.side = THREE.BackSide;
    //             break;

    //         case "double":
    //             meshMaterial.side = THREE.DoubleSide;
    //             break;

    //     }

    //     meshMaterial.needsUpdate = true;

    // });

    // // シェーディング
    // spGui.add(controls, 'shading', ["flat", "smooth"]).onChange((e) => {

    //     switch (e) {
    //         case "flat":
    //             meshMaterial.shading = THREE.FlatShading;
    //             break;
            
    //         case "smooth":
    //             meshMaterial.shading = THREE.SmoothShading;
    //             break;
    //     }

    //     meshMaterial.needsUpdate = true;

    // });

    // // 色
    // spGui.addColor(controls, 'color').onChange((e) => {
    //     meshMaterial.color.setStyle(e);
    // });

    // // メッシュ選択
    // spGui.add(controls, 'selectedMesh', ["cube", "sphere", "plane"]).onChange((e) => {

    //     // シーンから平面を削除する
    //     scene.remove(plane);

    //     // シーンから立方体を削除する
    //     scene.remove(cube);

    //     // シーンから球体を削除する
    //     scene.remove(sphere);

    //     switch (e) {
    //         case "cube":

    //             // シーンに立方体を追加する
    //             scene.add(cube);
    //             break;
            
    //         case "sphere":
    //             scene.add(sphere);
    //             break;

    //         case "plane":
    //             scene.add(plane);
    //             break;
    //     }

    // });

    // --------------------------------------
    // レンダラ関数
    // --------------------------------------

    const render = () => {

        // 立方体を回転させる
        cube.rotation.y = step+= 0.01;

        // 平面を回転させる
        plane.rotation.y = step;

        // 球体を回転させる
        sphere.rotation.y = step;

        requestAnimationFrame(render);
        renderer.render(scene, camera);

    };

    render();

}
