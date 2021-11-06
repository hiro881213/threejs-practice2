let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeMerging = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ------------------------------------
    // レンダラ生成処理
    // ------------------------------------

    // レンダラを生成する
    let renderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    renderer.setClearColor(new THREE.Color(0x000000));

    // サイズを設定する
    renderer.setSize(width, height);

    // シャドウマップを有効にする
    renderer.shadowMap.enabled = true;

    // ------------------------------------
    // カメラ設定処理
    // ------------------------------------

    // カメラの位置を設定する
    camera.position.set(0, 40, 50);

    // カメラの方向を設定する
    camera.lookAt(scene.position);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("merging-output").appendChild(renderer.domElement);

    // ------------------------------------
    // コントローラ生成処理
    // ------------------------------------

    let step = 0;

    // マテリアルを生成する
    let cubeMaterial = new THREE.MeshNormalMaterial({
        transparent: true,
        opacity: 0.5
    });

    // コントローラを生成する
    let controls = new function() {

        // cameraNear
        this.cameraNear = camera.near;

        // cameraFar
        this.cameraFar = camera.far;

        // rotationSpeed
        this.rotationSpeed = 0.02;

        // comnined
        this.combined = true;

        // numberOfObjects
        this.numberOfObjects = 500;
        // this.addCube = addCube();

        this.outputObjects = () => {
            console.log(scene.children);
        }

        // 再描画処理
        this.redraw = () => {

            // 削除リストを生成する
            let toRemove = [];

            // 削除リストに対象をセットする
            scene.traverse((e) => {
                
                // メッシュの場合削除リストに追加する
                if (e instanceof THREE.Mesh) toRemove.push(e);

            });

            toRemove.forEach((e) => {

                // シーンからメッシュを削除する
                scene.remove(e);

            });

            if (controls.combined) {
                
                // ジオメトリを生成する
                let geometry = new THREE.Geometry();

                // メッシュを結合する
                for (let i = 0; i < controls.numberOfObjects; i++) {

                    // メッシュを生成する
                    let cubeMesh = addcube();
                    cubeMesh.updateMatrix();

                    // メッシュをマージする
                    geometry.merge(cubeMesh.geometry, cubeMesh.matrix);

                }

                // シーンにメッシュを追加する
                scene.add(new THREE.Mesh(geometry, cubeMaterial));
            }
            // } else {

            //     for (let i = 0; i < controls.numberOfObjects; i++) {

            //         // シーンにメッシュを追加する
            //         scene.add(controls.addcube);

            //     }

            // }

        };

    };

    // ------------------------------------
    // GUI生成処理
    // ------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // numberOfObjects
    gui.add(controls, 'numberOfObjects', 0, 20000);

    // combined
    gui.add(controls, 'combined').onChange(controls.redraw);

    // redraw
    gui.add(controls, 'redraw');

    // 再描画処理を実行する
    controls.redraw();

    let rotation = 0;

    // レンダリングを実行する
    render();


    // ------------------------------------
    // 立方体生成関数
    // ------------------------------------

    function addcube() {
        
        // 立方体サイズを定義する
        let cubeSize = 1.0;

        // 立方体ジオメトリを生成する
        let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

        // 立方体メッシュを生成する
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        // キャストシャドウを有効にする
        cube.castShadow  = true;

        // 立方体の位置を設定する
        cube.position.set(
            -60 + Math.round(Math.random() * 100),
            Math.round((Math.random() * 10)),
            -150 + Math.round(Math.random() * 175)
        );

        return cube;

    };

    // ------------------------------------
    // レンダリング生成関数
    // ------------------------------------

    function render() {

        // 回転    
        rotation += 0.005;

        // カメラの位置を設定する
        camera.position.x = Math.sin(rotation) * 50;
        camera.position.z = Math.cos(rotation) * 50;

        camera.lookAt(scene.position);

        // アニメーションを生成する
        requestAnimationFrame(render);
        renderer.render(scene, camera);

    }

};
