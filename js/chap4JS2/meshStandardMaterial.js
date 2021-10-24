let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeStandardMaterial = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    // ---------------------------------
    // レンダラ生成処理
    // ---------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // 画面サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを設定する
    webGLRenderer.shadowMap.enabled = true;

    // ---------------------------------
    // メッシュ生成処理
    // ---------------------------------

    // 地面ジオメトリを生成する
    let groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);

    // 地面メッシュを生成する
    let groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({color: 0x555555}));

    // 地面メッシュを回転させる
    groundMesh.rotation.x = -Math.PI / 2;

    // 地面メッシュの位置を設定する
    groundMesh.position.y = -20;

    // シーンに地面メッシュを追加する
    scene.add(groundMesh);

    // トーラスジオメトリを生成する
    let geometry = new THREE.TorusKnotGeometry(10, 3, 200, 20);

    // トーラスマテリアルを生成する
    let meshMaterial = new THREE.MeshStandardMaterial({color: 0x7777ff});

    // トーラスメッシュを生成する
    let mesh = new THREE.Mesh(geometry, meshMaterial);

    // トーラスメッシュの位置を設定する
    mesh.position.set(0, 3, 2);

    // シーンにトーラスメッシュを追加する
    scene.add(mesh);

    // ---------------------------------
    // カメラ設定処理
    // ---------------------------------

    // カメラの位置を設定する
    camera.position.set(-20, 30, 40);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // ---------------------------------
    // 点光源設定処理
    // ---------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);
    
    // 点光源の位置を設定する
    spotLight.position.set(0, 30, 60);
    
    // 点光源のキャストシャドウを有効にする
    spotLight.castShadow = true;
    spotLight.intensity = 0.6;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("meshStandardMaterial-output").appendChild(webGLRenderer.domElement);

    // ---------------------------------
    // コントローラ設定処理
    // ---------------------------------

    let step = 0;

    let controls = new function() {

        // 回転スピード
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;

        // 透過性
        this.opacity = meshMaterial.opacity;
        this.transparent = meshMaterial.transparent;

        // オーバードロー
        this.overdraw = meshMaterial.overdraw;

        // 表示非表示
        this.visible = meshMaterial.visible;

        this.roughness = meshMaterial.roughness;

        this.metalness = meshMaterial.metalness;

        // 方向
        this.side = "front";

        // シェーディング
        this.shading = "smooth";

        // 色
        this.color = meshMaterial.color.getStyle();

        // 選択
        this.selectedMesh = "cube";

    }

    // ---------------------------------
    // GUI設定処理
    // ---------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    let spGui = gui.addFolder("Mesh");

    // 透過性
    spGui.add(controls, "opacity", 0, 1).onChange((e) =>{
        meshMaterial.opacity = e;
    });

    spGui.add(controls, "transparent").onChange((e) => {
        meshMaterial.transparent = e;
    });

    // 表示非表示
    spGui.add(controls, "visible").onChange((e) => {
        meshMaterial.visible = e;
    });

    spGui.add(controls, 'roughness', 0, 1.0).onChange(function (e) {
        meshMaterial.roughness = e
    });

    spGui.add(controls, "metalness", 0, 1.0).onChange((e) => {
        meshMaterial.metalness = e;
    });

    // 方向
    spGui.add(controls, "side", ["front", "back", "double"]).onChange((e) => {

        switch(e) {
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

    // シェーディング
    spGui.add(controls, 'shading', ["flat", "smooth"]).onChange(function (e) {
        switch (e) {
            case "flat":
                meshMaterial.shading = THREE.FlatShading;
                break;
            case "smooth":
                meshMaterial.shading = THREE.SmoothShading;
                break;
        }
        meshMaterial.needsUpdate = true;

    });

    // 色
    spGui.addColor(controls, "color").onChange((e) => {
        meshMaterial.color.setStyle(e);
    });

    // ---------------------------------
    // レンダラ設定処理
    // ---------------------------------

    const render = () => {

        // メッシュを回転させる
        mesh.rotation.y = step += 0.01;
        
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    };

    render();

};
