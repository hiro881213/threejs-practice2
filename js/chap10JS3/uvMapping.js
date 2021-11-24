let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeUvMapping = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // --------------------------------------------
    // レンダラ生成処理
    // --------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    //　背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xffffff));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // --------------------------------------------
    // カメラ設定処理
    // --------------------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 50);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("uvMapping-output").appendChild(webGLRenderer.domElement);

    // --------------------------------------------
    // コントローラ生成処理
    // --------------------------------------------

    let step = 0;

    // ローダを生成する
    let textureLoader = new THREE.TextureLoader();

    // コントローラを生成する
    let controls = new function() {

        // 立方体1生成処理
        this.loadCube1 = () =>{

            // ローダを生成する
            let loader = new THREE.OBJLoader();

            // ファイルを読み込む
            loader.load("../../assets/models/UVCube1.obj", (geometry) =>{

                // メッシュを削除する
                if (mesh) scene.remove(mesh);

                // マテリアルを生成する
                let material = new THREE.MeshBasicMaterial({color: 0xffffff});

                // テクスチャを生成する
                let texture = textureLoader.load("../../assets/textures/ash_uvgrid01.jpg");

                // マップを設定する
                material.map = texture;

                // ジオメトリにマップを設定する
                geometry.children[0].material = material;

                // メッシュを生成する
                mesh = geometry;

                // スケールを設定する
                geometry.scale.set(15, 15, 15);

                // シーンにメッシュを追加する
                scene.add(geometry);

            });

        };

        // 立方体2生成処理
        this.loadCube2 = () => {

            loader.load('../../assets/models/UVCube2.obj', (geometry) => {

                // メッシュを削除する
                if (mesh) scene.remove(mesh);

                // マテリアルを生成する
                let material = new THREE.MeshBasicMaterial({color: 0xffffff});

                // テクスチャを生成する
                let texture = textureLoader.load("../../assets/textures/ash_uvgrid01.jpg");

                // マップを設定する
                material.map = texture;

                // メッシュを生成する
                mesh = geometry;

                // メッシュのスケールを設定する
                geometry.scale.set(15, 15, 15);

                // メッシュを回転させる
                geometry.rotation.x = -0.3;

                // シーンにメッシュを追加する
                scene.add(geometry);

            });

        };

    };

    // --------------------------------------------
    // GUI生成処理
    // --------------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // loadCube1
    gui.add(controls, 'loadCube1');

    // loadCube2
    gui.add(controls, 'loadCube2');

    let mesh;

    // 立方体1読み込む処理
    controls.loadCube1();

    // レンダリング処理を実行する
    render();

    // --------------------------------------------
    // レンダリング関数
    // --------------------------------------------

    function render() {

        if (mesh) {

            // メッシュを回転させる
            mesh.rotation.y += 0.006;
            mesh.rotation.x += 0.006;

        }

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }






}
