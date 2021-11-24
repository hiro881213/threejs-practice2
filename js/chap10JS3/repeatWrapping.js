let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeRepeatWrapping = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -------------------------------------------
    // レンダラ生成処理
    // -------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // -------------------------------------------
    // 球体メッシュ生成処理
    // -------------------------------------------
    
    // 球体メッシュを生成する
    let sphere = createMesh(new THREE.SphereGeometry(5, 20, 20), "floor-wood.jpg");

    // シーンに球体メッシュを追加する
    scene.add(sphere);

    // 球体メッシュの位置を設定する
    sphere.position.x = 7;

    // -------------------------------------------
    // 立方体メッシュ生成処理
    // -------------------------------------------
    
    // 立方体メッシュを生成する
    let cube = createMesh(new THREE.BoxGeometry(6, 6, 6), "brick-wall.jpg");

    // シーンに立方体メッシュを追加する
    scene.add(cube);

    // -------------------------------------------
    // カメラ設定処理
    // -------------------------------------------

    // カメラの位置を設定する
    camera.position.set(0, 12, 20);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // -------------------------------------------
    // 環境光生成処理
    // -------------------------------------------

    // 環境光を生成する
    let ambiLight = new THREE.AmbientLight(0x141414);

    // シーンに環境光を追加する
    scene.add(ambiLight);

    // -------------------------------------------
    // 直接光生成処理
    // -------------------------------------------

    // 直接光を生成する
    let light = new THREE.DirectionalLight();

    // 直接光の位置を設定する
    light.position.set(0, 30, 20);

    // シーンに直接光を追加する
    scene.add(light);

    // THREEJSオブジェクトのDOMを設定する
    document.getElementById("repeatWrapping-output").appendChild(webGLRenderer.domElement);

    // -------------------------------------------
    // コントローラ生成処理
    // -------------------------------------------

    let step = 0;

    // コントロールを生成する
    let controls = new function() {

        this.repeatX = 1;
        this.repeatY = 1;

        this.repeatWrapping = true;
        this.wrapping = 'repeat';

        // 更新処理
        this.updateRepeat = (e) => {

            let wrapping;

            // map設定を実行する
            cube.material.map.repeat.set(controls.repeatX, controls.repeatY);
            sphere.material.map.repeat.set(controls.repeatX, controls.repeatY);

            // wrapping処理
            if (controls. wrapping === 'repeat') {
                wrapping = THREE.RepeatWrapping;
            } else if (controls.wrapping === 'mirrored repeat') {
                wrapping = THREE.MirroredRepeatWrapping;
            } else if (controls.wrapping === 'clamp to edge') {
                wrapping = THREE.ClampToEdgeWrapping;
            }

            // map設定処理
            cube.material.map.wrapS = wrapping;
            cube.material.map.wrapT = wrapping;

            sphere.material.map.wrapS = wrapping;
            sphere.material.map.wrapT = wrapping;

            cube.material.map.needsUpdate = true;
            sphere.material.map.needsUpdate = true;

        };

    };

    // -------------------------------------------
    // GUI生成処理
    // -------------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // repeat
    gui.add(controls, "repeatX", -4, 4).onChange(controls.updateRepeat);
    gui.add(controls, "repeatY", -4, 4).onChange(controls.updateRepeat);

    // wrapping
    gui.add(controls, "wrapping", ['repeat', 'mirrored repeat','clamp to edge']).onChange(controls.updateRepeat);

    // レンダリング処理を実行する
    render();

    // -------------------------------------------
    // メッシュ生成関数
    // -------------------------------------------

    function createMesh(geom, texture) {

        // ローダーを生成する
        let textureLoader = new THREE.TextureLoader();

        // テクスチャを生成する
        texture = textureLoader.load("../../assets/textures/general/" + texture);

        // wrapを設定する
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        geom.computeVertexNormals();

        // マテリアルを生成する
        let mat = new THREE.MeshPhongMaterial();

        // マップを設定する
        mat.map = texture;

        // メッシュを生成する
        let mesh = new THREE.Mesh(geom, mat);

        return mesh;

    }

    // -------------------------------------------
    // レンダリング関数
    // -------------------------------------------

    function render() {

        step += 0.01;

        // 立方体を回転する
        cube.rotation.y = step;
        cube.rotation.x = step;

        // 球体を回転する
        sphere.rotation.y = step;
        sphere.rotation.x = step;

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }



};
