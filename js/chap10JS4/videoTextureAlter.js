let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeVideoTextureAlter = () => {
    
    // シーンを生成する
    let scene = new THREE.Scene();

    // カメラを生成する
    let camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -----------------------------------------
    // レンダラ生成処理
    // -----------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを設定する
    webGLRenderer.shadowMap.enabled = true;

    // -----------------------------------------
    // テクスチャ生成処理
    // -----------------------------------------

    // ビデオを読み込む
    let video = document.getElementById("video");

    // テクスチャを生成する
    let texture = new THREE.Texture(video);

    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // フォーマットを設定する
    texture.format = THREE.RGBFormat;

    texture.getnerateMipmaps = false;

    // -----------------------------------------
    // メッシュ生成処理
    // -----------------------------------------

    // 立方体メッシュを生成する
    let cube = createMesh(new THREE.BoxGeometry(22, 16, 0.2), "floor-wood.jpg");

    // 立方体メッシュの位置を設定する
    cube.position.y = 2;

    // シーンに立方体メッシュを追加する
    scene.add(cube);

    // -----------------------------------------
    // カメラ設定処理
    // -----------------------------------------

    // カメラの位置を設定する
    camera.position.set(0, 1, 28);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // -----------------------------------------
    // 環境光生成処理
    // -----------------------------------------

    // 環境光を生成する
    let ambiLight = new THREE.AmbientLight(0x141414);

    // シーンに環境光を追加する
    scene.add(ambiLight);

    // -----------------------------------------
    // 直接光生成処理
    // -----------------------------------------

    // 直接光を生成する
    let light = new THREE.DirectionalLight();

    // 直接光の位置を設定する
    light.position.set(0, 30, 20);

    // シーンに直接光を追加する
    scene.add(light);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("videoTextureAlter-output").appendChild(webGLRenderer.domElement);

    // -----------------------------------------
    // コントローラ生成処理
    // -----------------------------------------

    let step = 0;

    // コントローラを生成する
    let controls = new function() {

        // showVideo
        this.showVideo = false;

        this.rotate = false;

        // キャンバス表示処理
        this.showCanvas = () => {

            if (controls.showVideo) {

                $('#video').show();

            } else {

                $('#video').hide();

            }

        };

    };

    // -----------------------------------------
    // GUI生成処理
    // -----------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // rotate
    gui.add(controls, "rotate");

    // showVideo
    gui.add(controls, "showVideo").onChange(controls.showCanvas);

    // レンダリング処理を実行する
    render();

    // -----------------------------------------
    // メッシュ生成関数
    // -----------------------------------------

    function createMesh(geom) {

        // マテリアルを設定する
        let materialArray = [];
        materialArray.push(new THREE.MeshBasicMaterial({color: 0x0051ba}));
        materialArray.push(new THREE.MeshBasicMaterial({color: 0x0051ba}));
        materialArray.push(new THREE.MeshBasicMaterial({color: 0x0051ba}));
        materialArray.push(new THREE.MeshBasicMaterial({color: 0x0051ba}));
        materialArray.push(new THREE.MeshBasicMaterial({map: texture}));
        materialArray.push(new THREE.MeshBasicMaterial({color: 0xff51ba}));

        let faceMaterial = new THREE.MeshFaceMaterial(materialArray);
        
        // メッシュを生成する
        let mesh = new THREE.Mesh(geom, faceMaterial);

        return mesh;

    }

    // -----------------------------------------
    // レンダリング関数
    // -----------------------------------------

    function render() {

        if (video.readyState === video.HAVE_ENOUGH_DATA) {

            if (texture) texture.needsUpdate = true;

        }

        if (controls.rotate) {

            cube.rotation.x += -0.01;
            cube.rotation.y += -0.01;
            cube.rotation.z += -0.01;

        }

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }


}
