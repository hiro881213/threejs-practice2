let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeCanvasTexture = () => {

    // canvasタグを生成する
    let canvas = document.createElement("canvas");

    // divにcanvasタグを設定する
    $('#canvas-output')[0].appendChild(canvas);

    // canvasの中身を設定する
    $('#canvas-output').literallycanvas({
        imageURLPrefix  : '../../lib/literally/img',
        imageSize       : {width: 350, height: 350},
        primaryColor    : 'white',
        backgroundColor : 'black'
    });

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ------------------------------------------
    // レンダラ生成処理
    // ------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xbbbbbb));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ------------------------------------------
    // 立方体生成処理
    // ------------------------------------------

    // 立方体メッシュを生成する
    let cube = createMesh(new THREE.BoxGeometry(10, 10, 10), "floor-wood.jpg");

    // 立方体メッシュの位置を設定する
    cube.position.x = 0;

    // シーンに立方体メッシュを追加する
    scene.add(cube);

    // ------------------------------------------
    // カメラ設定処理
    // ------------------------------------------

    // カメラの位置を設定する
    camera.position.set(0, 12, 28);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // ------------------------------------------
    // 環境光生成処理
    // ------------------------------------------

    // 環境光を生成する
    let ambiLight = new THREE.AmbientLight(0x141414);

    // シーンに環境光を追加する
    scene.add(ambiLight);

    // ------------------------------------------
    // 直接光生成処理
    // ------------------------------------------

    // 直接光を生成する
    let light = new THREE.DirectionalLight();

    // 直接光の位置を設定する
    light.position.set(0, 30, 20);

    // シーンに直接光を追加する
    scene.add(light);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("canvasTexture-output").appendChild(webGLRenderer.domElement);

    let step = 0;

    // ------------------------------------------
    // コントローラ生成処理
    // ------------------------------------------

    // コントローラを生成する
    let controls = new function() {

        this.showTexture = true;

        // canvas表示処理
        this.showCanvas = () => {

            if (controls.showTexture) {

                $('.fs-container').show();

            } else {

                $('.fs-container').hide();

            }

            // テクスチャを有効にする
            this.applyTexture = () => {

                cube.material.map.needUpdate = true;

            }

        }

    }

    // ------------------------------------------
    // GUI生成処理
    // ------------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // showTexture
    gui.add(controls, "showTexture").onChange(controls.showCanvas);

    // レンダリング処理
    render();

    // ------------------------------------------
    // メッシュ生成関数
    // ------------------------------------------

    function createMesh(geom) {

        // マップを読み込む
        let canvasMap = new THREE.Texture(canvas);

        // マテリアルを生成する
        let mat = new THREE.MeshPhongMaterial();

        // マップを設定する
        mat.map = canvasMap;

        // メッシュを生成する
        let mesh = new THREE.Mesh(geom, mat);

        return mesh;

    }

    // ------------------------------------------
    // レンダリング関数
    // ------------------------------------------

    function render() {

        // 立方体を回転させる
        cube.rotation.y += 0.01;
        cube.rotation.x += 0.01;

        cube.material.map.needsUpdate = true;

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

}
