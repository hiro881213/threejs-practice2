let scene;
let camera;
let fonts = {};

let width = window.innerWidth;
let height = 500;

export const makeTextGeometries = () => {

    // -----------------------------------------
    // フォント読み込み処理
    // -----------------------------------------

    // フォントローダーを生成する
    let fontLoader = new THREE.FontLoader();

    fontLoader.load("../../assets/fonts/helvetiker_regular.typeface.js", function(helvetiker) {
        
        fonts['helvetiker'] = helvetiker;

        fontLoader.load("../../assets/fonts/optimer_regular.typeface.js", function(optimer) {
        
            fonts['optimer'] = optimer;
            init();
        
        });
    
    });

    // -----------------------------------------
    // init関数
    // -----------------------------------------

    function init() {

        // シーンを生成する
        scene = new THREE.Scene();

        // カメラを生成する
        camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

        // -----------------------------------------
        // レンダラ設定処理
        // -----------------------------------------

        // レンダラを生成する
        let webGLRenderer = new THREE.WebGLRenderer();

        // 背景色を設定する
        webGLRenderer.setClearColor(new THREE.Color(0xeeeeee));

        // サイズを設定する
        webGLRenderer.setSize(width, height);

        // シャドウマップを設定する
        webGLRenderer.shadowMap.enabled = true;

        // -----------------------------------------
        // カメラ設定処理
        // -----------------------------------------

        // カメラの位置を設定する
        camera.position.set(100, 300, 600);

        // カメラの方向を設定する
        camera.lookAt(new THREE.Vector3(400, 0, -300));

        // -----------------------------------------
        // ライティング生成処理
        // -----------------------------------------

        let dirLight = new THREE.DirectionalLight();
        dirLight.position.set(25, 23, 15);
        scene.add(dirLight);

        let dirLight2 = new THREE.DirectionalLight();
        dirLight2.position.set(-25, 23, 15);
        scene.add(dirLight2);

        // THREEJSオブジェクトをDOMに設定する
        document.getElementById('textGeometries-output').appendChild(webGLRenderer.domElement);

        // -----------------------------------------
        // コントローラ生成処理
        // -----------------------------------------

        let step = 0;

        let text1;
        let text2;

        let controls = new function() {

            // size
            this.size = 90;

            // 高さ
            this.height = 90;

            // bevelThickness
            this.bevelThickness = 2;

            // bevelSize
            this.bevelSize = 0.5;

            // enabled
            this.bevelEnabled = true;

            // bevelセグメント
            this.bevelSegments = 3;

            // bevelEnabled
            this.bevelEnabled = true;

            // curveセグメント
            this.curveSegments = 12;

            // steps
            this.steps = 1;

            // font
            this.font = "helvetiker";

            // weight
            this.weight = "normal";

            // 描画処理
            this.asGeom = () => {

                // シーンからテキストを削除する
                scene.remove(text1);
                scene.remove(text2);

                let options = {
                    size: controls.size,
                    height: controls.height,
                    weight: controls.weight,
                    font: fonts[controls.font],
                    bevelThickness: controls.bevelThickness,
                    bevelSize: controls.bevelSize,
                    bevelSegments: controls.bevelSegments,
                    bevelEnabled: controls.bevelEnabled,
                    curveSegments: controls.curveSegments,
                    steps: controls.steps
                };

                // テキストメッシュを生成する
                text1 = createMesh(new THREE.TextGeometry("Learning", options));
                text1.position.z = -100;
                text1.position.y = 100;

                scene.add(text1);

                text2 = createMesh(new THREE.TextGeometry("Three.js", options));
                scene.add(text2);

            };

        };

        // 描画処理を実行する
        controls.asGeom();

        // -----------------------------------------
        // GUI生成処理
        // -----------------------------------------

        // GUIを生成する
        let gui = new dat.GUI();

        // size
        gui.add(controls, 'size', 0, 200).onChange(controls.asGeom);

        // height
        gui.add(controls, 'height', 0, 200).onChange(controls.asGeom);

        // フォント
        gui.add(controls, 'font', ['optimer', 'helvetiker']).onChange(controls.asGeom);

        // bevelThickness
        gui.add(controls, 'bevelThickness', 0, 10).onChange(controls.asGeom);

        // bevelSize
        gui.add(controls, 'bevelSize', 0, 10).onChange(controls.asGeom);

        // bevelEnabled
        gui.add(controls, 'bevelSegments', 0, 30).step(1).onChange(controls.asGeom);

        // curveSegments
        gui.add(controls, 'curveSegments', 1, 30).step(1).onChange(controls.asGeom);

        // steps
        gui.add(controls, 'steps', 1, 5).step(1).onChange(controls.asGeom);

        // レンダリング処理
        render();

        // -----------------------------------------
        // メッシュ生成関数
        // -----------------------------------------

        function createMesh(geom) {

            // マテリアルを生成する
            let meshMaterial = new THREE.MeshPhongMaterial({
                specular: 0xffffff,
                color: 0xff6666,
                shininess: 100
            });

            // メッシュを生成する
            let plane = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);

            return plane;

        };

        // -----------------------------------------
        // レンダリング関数
        // -----------------------------------------

        function render() {

            // アニメーションを生成する
            requestAnimationFrame(render);
            webGLRenderer.render(scene, camera);

        }

    }

};  
