let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeEnvMapStatic = () => {

    // シーンを生成する
    scene = new THREE.Scene();
    let sceneCube = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
    let cameraCube = new THREE.PerspectiveCamera(45, width/height, 1, 1000);

    // -------------------------------------------
    // レンダラ生成処理
    // -------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを無効にする
    webGLRenderer.shadowMap.enabled = false;

    webGLRenderer.autoClear = false;

    // -------------------------------------------
    // 立方体メッシュ生成処理
    // -------------------------------------------

    // 立方体を生成する
    let textureCube = createCubeMap();

    // シェーダーを生成する
    let shader = THREE.ShaderLib["cube"];

    // シェーダーを設定する
    shader.uniforms["tCube"].value = textureCube;

    // マテリアルを生成する
    let material = new THREE.ShaderMaterial({
        fragmentShader : shader.fragmentShader,
        vertexShader   : shader.vertexShader,
        uniforms       : shader.uniforms,
        depthWrite     : false,
        side           : THREE.BackSide
    });

    // メッシュを生成する
    let cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material);

    // シーンにメッシュを追加する
    sceneCube.add(cubeMesh);

    // -------------------------------------------
    // 球体1メッシュ生成処理
    // -------------------------------------------

    // 球体メッシュを生成する
    let sphere1 = createMesh(new THREE.SphereGeometry(10, 15, 15), "plaster.jpg");

    // 球体のマップを設定する
    sphere1.material.envMap = textureCube;

    // 球体を回転させる
    sphere1.rotation.y = -0.5;

    // 球体の位置を設定する
    sphere1.position.x = 12;
    sphere1.position.y = 5;

    // シーンに球体を追加する
    scene.add(sphere1);

    // -------------------------------------------
    // 球体2メッシュ生成処理
    // -------------------------------------------

    // 球体2メッシュを生成する
    let sphere2 = createMesh(new THREE.SphereGeometry(10, 15, 15), "plaster.jpg", "plaster-normal.jpg");

    sphere2.material.envMap = textureCube;

    // 球体2を回転させる
    sphere2.rotation.y = 0.5;

    // 球体2の位置を設定する
    sphere2.position.x = -12;
    sphere2.position.y = 5;

    // シーンに球体2を追加する
    scene.add(sphere2);

    // -------------------------------------------
    // カメラ設定処理
    // -------------------------------------------

    // カメラの位置を設定する
    camera.position.set(0, 12, 68);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // -------------------------------------------
    // 環境光生成処理
    // -------------------------------------------

    // 環境光を生成する
    let ambiLight = new THREE.AmbientLight(0xffffff);

    // シーンに環境光を追加する
    scene.add(ambiLight);

    // -------------------------------------------
    // 点光源生成処理
    // -------------------------------------------

    // 点光源を生成する
    let light = new THREE.SpotLight();

    // 点光源の位置を設定する
    light.position.set(0, 30, 30);

    // intensity
    light.intensity = 1.2;

    // シーンに点光源を追加する
    scene.add(light);

    // -------------------------------------------
    // 直接光生成処理
    // -------------------------------------------

    // ライトの色を設定する
    let pointColor = "#ff5808";

    // 直接光を生成する
    let directionalLight = new THREE.PointLight(pointColor);

    // intensity
    directionalLight.intensity = 4.5;

    // シーンに直接光を追加する
    scene.add(directionalLight);

    // -------------------------------------------
    // 球体メッシュ生成処理
    // -------------------------------------------

    // 球体ジオメトリを生成する
    let sphereLight = new THREE.SphereGeometry(0.2);

    // 球体マテリアルを生成する
    let sphereLightMaterial = new THREE.MeshBasicMaterial({color: 0xac6c25});

    // 球体メッシュを生成する
    let sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);

    // 球体メッシュのキャストシャドウを有効にする
    sphereLightMesh.castShadow = true;

    // 球体メッシュの位置を設定する
    sphereLightMesh.position.copy(new THREE.Vector3(3, 3, 3));

    // シーンに球体メッシュを追加する
    scene.add(sphereLightMesh);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("envMapStatic-output").appendChild(webGLRenderer.domElement);

    // -------------------------------------------
    // コントローラ生成処理
    // -------------------------------------------

    let step = 0;

    // ローダーを生成する
    let textureLoader = new THREE.TextureLoader();

    // コントローラを生成する
    const controls = new function() {

        this.normalScale = 1;
        this.reflectivity = 1;

        this.changeTexture = "plaster";

        this.rotate = false;

        // テクスチャ変更処理
        this.changeTexture = (e) => {

            // テクスチャを読み込む
            let texture = textureLoader.load("../../assets/textures/general/" + e + "jpg");

            // テクスチャを設定する
            spehre2.material.map = texture;
            sphere1.material.map = texture;

            // bumpを読み込む
            let bump = textureLoader.load("../../assets/textures/general/" + e + "-normal.jpg");

            // テクスチャを設定する
            sphere2.material.normalMap = bump;

        };

        // bump更新処理
        this.updateBump = (e) => {

            sphere2.material.normalScale.set(controls.normalScale, controls.normalScale);
            sphere2.material.reflectivity = controls.reflectivity;

        };

    }

    // -------------------------------------------
    // GUI生成関数
    // -------------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    gui.add(controls, "normalScale", -2, 2).onChange(controls.updateBump);
    gui.add(controls, "reflectivity", 0, 2).onChange(controls.updateBump);
    gui.add(controls, "changeTexture", ['plaster', 'bathroom', 'metal-floor', 'none']).onChange(controls.changeTexture);
    gui.add(controls, "rotate");

    // -------------------------------------------
    // マウスムービング関数
    // -------------------------------------------

    // マウス位置
    let mouseX = 0;
    let mouseY = 0;

    // マウス動作イベントを追加する
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    function onDocumentMouseMove(event) {

        mouseX = (event.clientX - width  / 2);
        mouseY = (event.clientY - height / 2)

    }


    let invert = 1;
    let phase = 0;

    // レンダリング処理を実行する
    render();

    // -------------------------------------------
    // メッシュ生成関数
    // -------------------------------------------

    function createMesh(geom, texture, normal) {

        // ローダーを生成する
        let textureLoader = new THREE.TextureLoader();

        geom.computeVertexNormals();

        if (normal) {

            // テクスチャを読み込む
            let t = textureLoader.load("../../assets/textures/general/" + texture);
            let m = textureLoader.load("../../assets/textures/general/" + normal);

            // マテリアルを生成する
            let mat2 = new THREE.MeshPhongMaterial({
                map :t,
                normalMap: m
            });

            // メッシュを生成する
            let mesh = new THREE.Mesh(geom, mat2);

            return mesh;

        } else {

            // テクスチャを読み込む
            let t = textureLoader.load("../../assets/textures/general/" + texture);
            
            // マテリアルを生成する
            let mat1 = new THREE.MeshPhongMaterial({});

            // メッシュを生成する
            let mesh = new THREE.Mesh(geom, mat1);

            return mesh;

        }

    }

    // -------------------------------------------
    // 立方体マップ生成関数
    // -------------------------------------------

    function createCubeMap() {

        // パスを設定する
        let path = "../../assets/textures/cubemap/parliament/";

        // 拡張子を設定する
        let format = '.jpg';

        // URLを設定する
        let urls = [
            path + 'posx' + format, path + 'negx' + format,
            path + 'posy' + format, path + 'negy' + format,
            path + 'posz' + format, path + 'negz' + format
        ];

        // ローダーを生成する
        let cubeTextureLoader = new THREE.CubeTextureLoader();

        return cubeTextureLoader.load(urls);

    }

    // -------------------------------------------
    // シェーダーマテリアル関数
    // -------------------------------------------

    function createNormalShaderMaterial(diffuseMap, normalMap) {

        // シェーダーを生成する
        let shader = THREE.ShaderLib["normalmap"];
        let uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        // マップを読み込む
        let dT = textureLoader.load(diffuseMap);
        let nT = textureLoader.load(normalMap);

        // ユニフォーム設定
        uniforms["uShininess"].value = 50;
        uniforms["enableDiffuse"].value = true;
        uniforms["uDiffuseColor"].value.setHex(0xffffff);
        
        uniforms["tDiffuse"].value = dT;
        uniforms["tNormal"].value = nT;

        uniforms["uNormalScale"].value.set(1, 1);
        uniforms["uSpecularColor"].calue.setHex(0xffffff);
        uniforms["enableSpecular"].value = true;

        return new THREE.ShaderMaterial({
            fragmentShader : shader.fragmentShader,
            vertexShader   : shader.vertexShader,
            uniforms       : uniforms,
            lights         : true
        });

    }

    // -------------------------------------------
    // レンダリング関数
    // -------------------------------------------

    function render() {

        step += 0.1;

        if (controls.rotate) {

            // 球体を回転させる
            sphere1.rotation.y -= 0.01;
            sphere2.rotation.y += 0.01;

        }

        if (phase > 2 * Math.PI) {

            invert = invert* -1;
            phase -= 2 * Math.PI;

        } else { 

            phase += 0.03;

        }

        // 球体メッシュの位置を設定する
        sphereLightMesh.position.z = 21 * Math.sin(phase);
        sphereLightMesh.position.x = -14 + (14 * Math.cos(phase));

        if (invert < 0) {

            let pivot = 0;

            // 球体メッシュの位置を設定する
            sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;

        }

        // 直接光の位置を設定する
        directionalLight.position.copy(sphereLightMesh.position);

        // カメラの位置を設定する
        camera.position.x = (mouseX * .018);
        camera.position.y = 6 + (mouseY * .018);

        // カメラの方向を設定する
        camera.lookAt(scene.position);
        cameraCube.rotation = camera.rotation;

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(sceneCube, cameraCube);
        webGLRenderer.render(scene, camera);

    }

}
