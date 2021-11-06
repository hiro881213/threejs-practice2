let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeCreateParticleSystem = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // --------------------------------------
    // レンダラ生成処理
    // --------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0x0000000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // --------------------------------------
    // カメラ設定処理
    // --------------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 50);
    
    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("createParticleSystem-output").appendChild(webGLRenderer.domElement);

    let step = 0;
    let knot;

    // --------------------------------------
    // コントローラ生成処理
    // --------------------------------------

    let controls = new function () {

        // radius
        this.radius = 13;

        // tube
        this.tube = 1.7;
        
        // radialSegments
        this.radialSegments = 156;

        // tubularSegments
        this.tubularSegments = 12;

        // p
        this.p = 5;

        // q
        this.q = 4;

        // asParticles
        this.asParticles = false;

        // rotate
        this.rotate = false;

        // 再描画処理
        this.redraw = () => {

            // knotを削除する
            if (knot) scene.remove(knot);

            // ジオメトリを生成する
            let geom = new THREE.TorusKnotGeometry(controls.radius, controls.tube, Math.round(controls.radialSegments), Math.round(controls.tubularSegments), Math.round(controls.p), Math.round(controls.q));

            if (controls.asParticles) {

                // 頂点生成処理を実行する
                knot = createPoints(geom);

            } else {

                // メッシュ生成処理を実行する
                knot = createMesh(geom);

            }

            // シーンにメッシュを追加する
            scene.add(knot);

        };

    };

    // --------------------------------------
    // GUI生成処理
    // --------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // radius
    gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);

    // tube
    gui.add(controls, 'tube', 0, 40).onChange(controls.redraw);

    // radialSegments
    gui.add(controls, 'radialSegments', 0, 400).step(1).onChange(controls.redraw);

    // tubularSegments
    gui.add(controls, 'tubularSegments', 1, 20).step(1).onChange(controls.redraw);

    // p
    gui.add(controls, 'p', 1, 10).step(1).onChange(controls.redraw);

    // q
    gui.add(controls, 'q', 1, 15).step(1).onChange(controls.redraw);

    // asParticles
    gui.add(controls, 'asParticles').onChange(controls.redraw);

    // rotate
    gui.add(controls, 'rotate').onChange(controls.redraw);

    // 再描画処理を実行する
    controls.redraw();

    // レンダリング処理を実行する
    render();

    // --------------------------------------
    // スピリット生成関数
    // --------------------------------------

    function generateSpirite() {

        // カンバスエレメントを生成する
        let canvas = document.createElement('canvas');

        // カンバスのサイズを設定する
        canvas.width = 16;
        canvas.height = 16;

        // コンテクストを定義する
        let context = canvas.getContext('2d');

        // グラディエント生成処理
        let gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(0, 255, 255, 1)');
        gradient.addColorStop(0.4, 'rgba(0, 0, 64, 1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

        // スタイルを設定する
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // テクスチャ生成処理
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        return texture;

    };

    // --------------------------------------
    // 頂点生成関数
    // --------------------------------------

    function createPoints(geom) {

        // マテリアルを生成する
        let material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 3, 
            transparent: true,
            blending: THREE.AdditiveBlending,
            map: generateSpirite(),
            depthWrite: false
        });

        // クラウドを生成する
        let cloud = new THREE.Points(geom, material);
        cloud.sortParticles = true;

        return cloud;

    }

    // --------------------------------------
    // メッシュ生成関数
    // --------------------------------------

    function createMesh(geom) {

        // マテリアルを生成する
        let meshMaterial = new THREE.MeshNormalMaterial({});
        meshMaterial.side = THREE.DoubleSide;

        // メッシュを生成する
        let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);

        return mesh;

    }

    // --------------------------------------
    // レンダリング生成関数
    // --------------------------------------

    function render() {

        if (controls.rotate) {

            // メッシュを回転させる
            knot.rotation.y = step += 0.01;
        
        }

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

};
