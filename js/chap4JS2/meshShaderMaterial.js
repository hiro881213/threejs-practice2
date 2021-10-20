let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeShaderMaterial = () => {
    
    // マテリアル生成関数
    const createMaterial = (vertexshader, fragmentShader) => {

        let vertShader = document.getElementById(vertexshader).innerHTML;
        let fragShader = document.getElementById(fragmentShader).innerHTML;

        let uniforms = {
            time:  { type: 'f', value: 0.2 },
            scale: { type: 'f', value: 0.2 },
            alpha: { type: 'f', value: 0.6 },
            resolution: { type: "v2", value: new THREE.Vector2()}
        };

        uniforms.resolution.value.x = width;
        uniforms.resolution.value.y = height;

        let meshMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertShader,
            fragmentShader: fragShader,
            transparent: true
        });

        return meshMaterial;

    };

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ----------------------------
    // レンダラ設定処理
    // ----------------------------
    
    // レンダラを生成する
    renderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    renderer.setClearColor(new THREE.Color(0x000000));

    // サイズを設定する
    renderer.setSize(width, height);

    // シャドウマップを設定する
    renderer.shadowMap.enabled = true;

    // ----------------------------
    // ジオメトリ生成処理
    // ----------------------------

    let cubeGeometry = new THREE.BoxGeometry(20, 20, 20);

    // ----------------------------
    // マテリアル生成処理
    // ----------------------------

    let meshMaterial1 = createMaterial("vertex-shader", "fragment-shader-1");
    let meshMaterial2 = createMaterial("vertex-shader", "fragment-shader-2");
    let meshMaterial3 = createMaterial("vertex-shader", "fragment-shader-3");
    let meshMaterial4 = createMaterial("vertex-shader", "fragment-shader-4");
    let meshMaterial5 = createMaterial("vertex-shader", "fragment-shader-5");
    let meshMaterial6 = createMaterial("vertex-shader", "fragment-shader-6");

    // マテリアルを各面に配置する
    let material = new THREE.MeshFaceMaterial([
        meshMaterial1,
        meshMaterial2,
        meshMaterial3,
        meshMaterial4,
        meshMaterial5,
        meshMaterial6
    ]);

    // 立方体メッシュを生成する
    let cube = new THREE.Mesh(cubeGeometry, material);

    // 立方体をシーンに追加する
    scene.add(cube);

    // ----------------------------
    // カメラ設定処理
    // ----------------------------

    // カメラの位置を設定する
    camera.position.set(30, 30, 30);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // ----------------------------
    // 環境光設定処理
    // ----------------------------

    // 環境光を生成する 
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);

    // 環境光をシーンに追加する
    scene.add(ambientLight);

    // ----------------------------
    // 点光源設定処理
    // ----------------------------

    // 点光源を生成する
    const spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(-40, 60, -10);

    // キャストシャドウを設定する
    spotLight.castShadow = true;

    // 点光源をシーンに追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに追加する
    document.getElementById("meshShaderMaterial-output").appendChild(renderer.domElement);

    let step = 0;
    let oldContext = null;

    // ----------------------------
    // コントローラ設定処理
    // ----------------------------

    let controls = new function() {

        // 回転
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;

        // 透過性
        this.opacity = meshMaterial1.opacity;
        this.transparent = meshMaterial1.transparent;

        // 表示非表示
        this.visible = meshMaterial1.visible;

        // 方向
        this.side = "front";

        // ワイヤーフレーム
        this.wireframe = meshMaterial1.wireframe;
        this.wireframeLinewidth = meshMaterial1.wireframeLinewidth;

        // 選択メッシュ
        this.selectedMesh = "cube";

        // シャドウ
        this.shadow = "flat";

    };

    // ----------------------------
    // レンダラ設定処理
    // ----------------------------

    const render = () => {

        cube.rotation.y = step += 0.01;
        cube.rotation.x = step;
        cube.rotation.z = step;

        cube.material.materials.forEach((e) => {
            e.uniforms.time.value += 0.01;
        });

        requestAnimationFrame(render);
        renderer.render(scene, camera);

    };

    render();

};