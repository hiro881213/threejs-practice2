let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeNormalMaterial = () => {
    
    // ------------------------------------------
    // シーン生成処理
    // ------------------------------------------

    scene = new THREE.Scene();

    // ------------------------------------------
    // カメラ生成処理
    // ------------------------------------------
    
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ------------------------------------------
    // レンダラ生成処理
    // ------------------------------------------

    let renderer;
    let webGLRenderer = new THREE.WebGLRenderer();

    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));
    webGLRenderer.setSize(width, height);
    webGLRenderer.shadowMap.enabled = true;

    let canvasRenderer = new THREE.CanvasRenderer();
    canvasRenderer.setSize(width, height);
    renderer = webGLRenderer;

    // ------------------------------------------
    // 平面生成処理
    // ------------------------------------------
    
    // 平面ジオメトリを生成する
    let groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);

    // 平面メッシュを生成する
    let groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({color: 0x777777}));

    // 平面メッシュを回転させる
    groundMesh.rotation.x = -Math.PI / 2;

    // 平面メッシュの位置を設定する
    groundMesh.position.y = -20;

    // シーンに平面メッシュを配置する
    scene.add(groundMesh);

    // ------------------------------------------
    // ジオメトリ生成処理
    // ------------------------------------------
    
    // 球体ジオメトリを生成する
    let sphereGeometry = new THREE.SphereGeometry(14, 20, 20);

    // 立方体ジオメトリを生成する
    let cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
    
    // 平面ジオメトリを生成する
    let planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

    // ------------------------------------------
    // マテリアル生成処理
    // ------------------------------------------

    let meshMaterial = new THREE.MeshNormalMaterial();

    // ------------------------------------------
    // メッシュ生成処理
    // ------------------------------------------

    // 球体メッシュを生成する
    let sphere = new THREE.Mesh(sphereGeometry, meshMaterial);

    // 立方体メッシュを生成する
    let cube = new THREE.Mesh(cubeGeometry, meshMaterial);

    // 平面メッシュを生成する
    let plane = new THREE.Mesh(planeGeometry, meshMaterial);

    // ------------------------------------------
    // 球体位置設定処理
    // ------------------------------------------

    sphere.position.x = 0;
    sphere.position.y = 3;
    sphere.position.z = 2;

    // ------------------------------------------
    // 球体面設定処理
    // ------------------------------------------

    for (let f = 0, fl = sphere.geometry.faces.length; f < fl; f++) {

        // 面を取得する
        let face = sphere.geometry.faces[f];
        let centroid = new THREE.Vector3(0, 0, 0);

        centroid.add(sphere.geometry.vertices[face.a]);
        centroid.add(sphere.geometry.vertices[face.b]);
        centroid.add(sphere.geometry.vertices[face.c]);

        centroid.divideScalar(3);

        let arrow = new THREE.ArrowHelper (
            face.normal,
            centroid,
            2,
            0x3333FF,
            0.5,
            0.5
        );

    }

    // ------------------------------------------
    // メッシュ位置設定処理
    // ------------------------------------------

    // 立方体の位置を設定する
    cube.position.set(sphere.position.x,sphere.position.y,sphere.position.z);

    // 平面の位置を設定する
    plane.position.set(sphere.position.x,sphere.position.y,sphere.position.z);

    // 立方体をシーンに追加する
    scene.add(cube);

    // ------------------------------------------
    // カメラ設定処理
    // ------------------------------------------

    // カメラ位置を設定する
    camera.position.x = -20;
    camera.position.y = 30;
    camera.position.z = 40;

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10,0,0));

    // ------------------------------------------
    // 環境光設定処理
    // ------------------------------------------

    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // ------------------------------------------
    // 点光源設定処理
    // ------------------------------------------

    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(-40, 60, -10);

    // 点光源のキャストシャドウを有効にする
    spotLight.castShadow = true;

    // 点光源をシーンに追加する
    scene.add(spotLight);

    // DOMにTHREEJSオブジェクトを追加する
    document.getElementById("normalMaterial-output").appendChild(renderer.domElement);

    let step = 0;
    let oldContext = null;

    // ------------------------------------------
    // コントローラ設定処理
    // ------------------------------------------

    let controls = new function () {

        // 回転スピードを設定する
        this.rotationSpeed = 0.02;

        // 跳ね返りスピードを設定する
        this.bouncingSpeed = 0.03;

        // 透明性を設定する
        this.opacity = meshMaterial.opacity;
        this.transparent = meshMaterial.transparent;

        this.visible = meshMaterial.visible;
        this.side = "front";

        // ワイヤフレーム設定処理
        this.wireframe = meshMaterial.wireframe;

        // ワイヤフレームの幅を設定する
        this.wireframeLinewidth = meshMaterial.wireframeLinewidth;

        // 選択メッシュを設定する
        this.selectedMesh = "cube";

        // シェーディングを設定する
        this.shading = "flat";

    };

    // ------------------------------------------
    // GUI設定処理
    // ------------------------------------------

    let gui = new dat.GUI();

    let spGui = gui.addFolder("Mesh");

    // 透過性をGUIに追加する
    spGui.add(controls, 'opacity', 0, 1).onChange((e) => {
        meshMaterial.opacity = e;
    });

    spGui.add(controls, 'transparent').onChange((e) => {
        meshMaterial.transparent = e;
    });

    // ワイヤフレームをGUIに追加する
    spGui.add(controls, 'wireframe').onChange((e) => {
        meshMaterial.wireframe = e;
    });

    // ワイヤフレームの幅をGUIに追加する
    spGui.add(controls, 'wireframeLinewidth', 0, 20).onChange((e) => {
        meshMaterial.wireframeLinewidth = e;
    });

    // 表示設定をGUIに追加する
    spGui.add(controls, 'visible').onChange((e) => {
        meshMaterial.visible = e;
    });

    // 撮影位置をGUIに追加する
    spGui.add(controls, 'side', ["front", "back", "double"]).onChange((e) => {

        // 切換設定処理
        switch(e) {

            case "front" :
                meshMaterial.side = THREE.FrontSide;
                break;

            case "back" :
                meshMaterial.side = THREE.BackSide;
                break;

            case "double" :
                meshMaterial.side = THREE.DoubleSide;
                break;

        }

        meshMaterial.needUpdate = true;
        
    });
/*
    spGui.add(controls, 'shading', ["flat", "smooth"]).onChange((e) => {

        switch(e) {

            case "flat" :
                meshMaterial.shading = THREE.FlatShading;
                break;
            
            case "smooth" :
                meshMaterial.shading = THREE.SmoothShading;
                break;
        }

        let oldPos = sphere.position.clone();
        
        // 球体をシーンから削除する
        scene.remove(sphere);

        // 平面をシーンから削除する
        scene.remove(plane);

        // 立方体をシーンから削除する
        scene.remove(cube);

        // 球体を再生成する
        sphere = new THREE.Mesh(sphere.geometry.clone(), meshMaterial);

        // 立方体を再生成する
        cube = new THREE.Mesh(cube.geometry.clone(), meshMaterial);

        // 平面を再生成する
        plane = new THREE.Mesh(plane.geometry.clone(), meshMaterial);

        // 球体の位置を設定する
        sphere.position.set(oldPos);

        // 立方体の位置を設定する
        cube.position.set(oldPos);

        // 平面の位置を設定する
        plane.position.set(oldPos);

        switch(controls.selectedMesh) {

            case "cube":
                scene.add(cube);
                break;

            case "sphere":
                scene.add(sphere);
                break;

            case "plane":
                scene.add(plane);
                break;

        }

        meshMaterial.needUpdate = true;

    });
*/
    spGui.add(controls, 'selectedMesh', ['cube', 'sphere', 'plane']).onChange((e) => {

        scene.remove(plane);
        scene.remove(cube);
        scene.remove(sphere);

        switch(e) {

            case "cube":
                scene.add(cube);
                break;

            case "sphere":
                scene.add(sphere);
                break;

            case "plane":
                scene.add(plane);
                break;

        }

    });

    const render = () => {

        // 立方体を回転させる
        cube.rotation.y = step += 0.01;

        // 平面を回転させる
        plane.rotation.y = step;

        // 球体を回転させる
        sphere.rotation.y = step;

        requestAnimationFrame(render);
        renderer.render(scene, camera);

    };

    render();

};