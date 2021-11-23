let scene;

let camera, cubeCamera;

let control;
let orbit;

let sphere;

let width = window.innerWidth;
let height = 500;

export const makeEnvMapDynamic = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // orbit
    orbit = new THREE.OrbitControls(camera);

    // -----------------------------------------------------
    // レンダラ生成処理
    // -----------------------------------------------------

    // レンダラを生成する
    let renderer = new THREE.WebGLRenderer()

    // 背景色を設定する
    renderer.setClearColor(new THREE.Color(0x000000));
    
    // サイズを設定する
    renderer.setSize(width, height);

    // -----------------------------------------------------
    // テクスチャ立方体生成処理
    // -----------------------------------------------------

    // テクスチャ立方体生成する
    let textureCube = createCubeMap();
    textureCube.format = THREE.RGBFormat;

    // -----------------------------------------------------
    // シェーダー生成処理
    // -----------------------------------------------------

    // シェーダーを生成する
    let shader = THREE.ShaderLib["cube"];
    shader.uniforms["tCube"].value = textureCube;

    // マテリアルを生成する
    let material = new THREE.ShaderMaterial({
        fragmentShader : shader.fragmentShader,
        vertexShader   : shader.vertexShader,
        uniforms       : shader.uniforms,
        depthWrite     : false,
        side           : THREE.DoubleSide
    });

    // -----------------------------------------------------
    // skybox生成処理
    // -----------------------------------------------------

    // skyボックスを生成する
    let skyBox = new THREE.Mesh(new THREE.BoxGeometry(10000, 10000, 10000), material);

    // シーンにskyボックスを追加する
    scene.add(skyBox);

    // -----------------------------------------------------
    // Cubeカメラ生成処理
    // -----------------------------------------------------

    // Cubeカメラを生成する
    cubeCamera = new THREE.CubeCamera(0.1, 20000, 256);

    // シーンにCubeカメラを追加する
    scene.add(cubeCamera);

    // -----------------------------------------------------
    // メッシュ生成処理
    // -----------------------------------------------------

    // ジオメトリを生成する
    let sphereGeometry = new THREE.SphereGeometry(4, 15, 15);
    let boxGeometry = new THREE.BoxGeometry(5, 5, 5);
    let cylinderGeometry = new THREE.CylinderGeometry(2, 4, 10, 20, 20, false);

    // マテリアルを生成する
    let dynamicEnvMaterial = new THREE.MeshBasicMaterial({
        envMap: cubeCamera.renderTarget, 
        side: THREE.DoubleSide
    });

    let envMaterial = new THREE.MeshBasicMaterial({
        envMap : textureCube,
        side   : THREE.DoubleSide
    });

    // 球体メッシュを生成する
    sphere = new THREE.Mesh(sphereGeometry, dynamicEnvMaterial);
    sphere.name = 'sphere';

    // シーンに球体メッシュを追加する
    scene.add(sphere);

    // 円柱メッシュを生成する
    let cylinder = new THREE.Mesh(cylinderGeometry, envMaterial);
    cylinder.name = 'cylinder';

    // シーンに円柱メッシュを追加する
    scene.add(cylinder);

    // 円柱メッシュの位置を設定する
    cylinder.position.set(10, 0, 0);

    // 立方体メッシュを生成する
    let cube = new THREE.Mesh(boxGeometry, envMaterial);
    cube.name = 'cube';
    
    // シーンに立方体を追加する
    scene.add(cube);

    // 立方体の位置を設定する
    cube.position.set(-10, 0, 0);

    // -----------------------------------------------------
    // カメラ設定処理
    // -----------------------------------------------------

    // カメラの位置を設定する
    camera.position.set(0, 5, 33);

    // カメラの方向を設定する
    camera.lookAt(scene.position);

    document.getElementById("envMapDynamic-output").appendChild(renderer.domElement);

    // -----------------------------------------------------
    // コントローラ生成処理
    // -----------------------------------------------------

    // コントローラを生成する
    control = new function() {
        this.rotationSpeed = 0.005;
        this.scale = 1;
    }

    // コントローラを追加する
    addControls(control);

    // レンダリング処理を実行する
    render();

    // -----------------------------------------------------
    // コントローラ追加関数
    // -----------------------------------------------------

    function addControls(controlObject) {

        // // GUIを生成する
        // let gui = new dat.GUI();

        // // rotationSpeed
        // gui.add(controlObject, 'rotationSpeed', -0.1, 0.1);

    }

    // -----------------------------------------------------
    // マップ生成関数
    // -----------------------------------------------------

    function createCubeMap() {

        // パスを設定する
        let path = "../../assets/textures/cubemap/parliament/"

        // フォーマットを設定する
        let format = ".jpg";

        // URLを生成する
        let urls = [
            path + 'posx' + format, path + 'negx' + format,
            path + 'posy' + format, path + 'negy' + format,
            path + 'posz' + format, path + 'negz' + format
        ];

        // ローダーを生成する
        let cubeTextureLoader = new THREE.CubeTextureLoader();

        // テクスチャを読み込む
        let textureCube = cubeTextureLoader.load(urls, THREE.CubeReflectionMapping);

        return textureCube;

    }

    // -----------------------------------------------------
    // レンダリング関数
    // -----------------------------------------------------

    function render() {

        orbit.update();

        sphere.visible = false;
        cubeCamera.updateCubeMap(renderer, scene);
        sphere.visible = true;

        // レンダリングを実行する
        renderer.render(scene, camera);

        scene.getObjectByName('cube').rotation.x += control.rotationSpeed;
        scene.getObjectByName('cube').rotation.y += control.rotationSpeed;
        scene.getObjectByName('cylinder').rotation.x += control.rotationSpeed;
    
        requestAnimationFrame(render);

    }

};
