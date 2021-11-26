let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const canvasTextureBumpMap = () => {

    // -------------------------------------------
    // キャンバス設定処理
    // -------------------------------------------

    // キャンバスを生成する
    let canvas = document.createElement("canvas");

    // 幅を設定する
    canvas.setAttribute("width", 256);

    // 高さを設定する
    canvas.setAttribute("height", 256);

    // styleを設定する
    canvas.setAttribute("style", "position: absolute; x:0; y:0; bottom:0px;");

    // キャンバスをDOMに設定する
    document.getElementById("canvas-output").appendChild(canvas);

    let ctx = canvas.getContext("2d");
    let date = new Date();

    let pn = new Perlin('rnd' + date.getTime());

    fillWithPerlin(pn, ctx);

    // -------------------------------------------
    // fillWithPerlin関数
    // -------------------------------------------

    function fillWithPerlin(perlin, ctx) {

        for ( let x = 0; x < 512; x++ ) {

            for ( let y = 0; y < 512; y++ ) {

                let base = new THREE.Color(0xffffff);
                let value = perlin.noise(x/10, y/10, 0);

                base.multiplyScalar(value);

                ctx.fillStyle = "#" + base.getHexString();
                ctx.fillRect(x, y, 1, 1);

            }

        }

    }

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ------------------------------------
    // レンダラ生成処理
    // ------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ------------------------------------
    // メッシュ生成処理
    // ------------------------------------

    // 立方体メッシュを生成する
    let cube = createMesh(new THREE.BoxGeometry(12, 12, 12), "floor-wood.jpg");

    // 立方体メッシュの位置を設定する
    cube.position.x = 3;

    // シーンに立方体メッシュを追加する
    scene.add(cube);

    // ------------------------------------
    // カメラ設定処理
    // ------------------------------------

    // カメラの位置を設定する
    camera.position.set(0, 12, 28);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // ------------------------------------
    // 環境光生成処理
    // ------------------------------------

    // 環境光を生成する
    let ambiLight = new THREE.AmbientLight(0x141414);

    // シーンに環境光を追加する
    scene.add(ambiLight);

    // ------------------------------------
    // 直接光生成処理
    // ------------------------------------

    // 直接光を生成する
    let light = new THREE.DirectionalLight();

    // 直接光の位置を設定する
    light.position.set(0, 30, 20);

    // シーンに直接光を追加する
    scene.add(light);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("canvasTexture-output").appendChild(webGLRenderer.domElement);

    // ------------------------------------
    // コントローラ生成処理
    // ------------------------------------

    let step = 0;

    // コントローラを生成する
    let controls = new function() {

        // bumpScale
        this.bumpScale = cube.material.bumpScale;

        this.regenerateMap = () => {

            let date = new Date();
            pn = new Perlin('rnd' + date.getTime);

            fillWithPerlin(pn, ctx);

            cube.material.bumpMap.needsUpdate = true;

        };

        this.updateScale = () => {

            cube.material.bumpScale = controls.bumpScale;

        };

    };

    // ------------------------------------
    // GUI生成処理
    // ------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // regenerateMap
    gui.add(controls, "regenerateMap");

    // bumpScale
    gui.add(controls, "bumpScale", -2, 2).onChange(controls.updateScale);

    // レンダリング処理を実行する
    render();

    // ------------------------------------
    // メッシュ生成関数
    // ------------------------------------

    function createMesh(geom, texture) {

        // ローダーを生成する
        let textureLoader = new THREE.TextureLoader();

        // テクスチャを生成する
        texture = textureLoader.load("../../assets/textures/general/" + texture);

        // マップテクスチャを生成する
        let bumpMap = new THREE.Texture(canvas);

        geom.computeVertexNormals();

        // マテリアルを生成する
        let mat = new THREE.MeshPhongMaterial();

        // マテリアルの色を設定する
        mat.color = new THREE.Color(0x77ff77);

        // bumpマップを設定する
        mat.bumpMap = bumpMap;

        bumpMap.needsUpdate = true;

        // メッシュを生成する
        let mesh = new THREE.Mesh(geom, mat);

        return mesh;

    }

    // ------------------------------------
    // レンダリング関数
    // ------------------------------------

    function render() {

        // 立方体を回転させる
        cube.rotation.y += 0.01;
        cube.rotation.x += 0.01;

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

}
