let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const makeParametricGeometries = () => {
    
    // ------------------------------------
    // klein関数生成処理
    // ------------------------------------

    let klein = (u, v) => {

        u *= Math.PI;
        v *= 2 * Math.PI;

        u = u * 2;
        let x, y, z;

        if (u < Math.PI) {

            x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
            z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
        
        } else {
        
            x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
            z = -8 * Math.sin(u);
        
        }

        y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

        return new THREE.Vector3(x, y, z);

    };

    // ------------------------------------
    // radialWave関数生成処理
    // ------------------------------------

    let radialWave = (u, v) => {

        let r = 50;

        let x = Math.sin(u) * r;
        let z = Math.sin(v/2) * 2 * r;
        let y = (Math.sin(u * 4 * Math.PI) + Math.cos(v * 2 * Math.PI)) * 2.8;

        return new THREE.Vector3(x, y, z);

    };

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

    // シャドウマップを設定する
    webGLRenderer.shadowMap.enabled = true;

    // ------------------------------------
    // カメラ設定処理
    // ------------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 50, 50);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, -20, 0));

    // ------------------------------------
    // 点光源生成処理
    // ------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.DirectionalLight();

    // 点光源を位置を設定する
    spotLight.position.set(new THREE.Vector3(-20, 250, -50));
    spotLight.target.position.set(30, -40, -20);

    // 点光源のintensityを設定する
    spotLight.intensity = 0.3;

    // シーンに点光源を追加する
    scene.add(spotLight);

    document.getElementById("parametricGeometries-output").appendChild(webGLRenderer.domElement);

    // ------------------------------------
    // コントローラ生成処理
    // ------------------------------------

    let step = 0;
    let parametricMesh;

    // コントローラを生成する
    let controls = new function() {

        this.func = 'radialWave';
        this.slices = 120;
        this.stacks = 120;

        // 再描画処理
        this.redraw = () => {

            // シーンからメッシュを削除する
            scene.remove(parametricMesh);
            let func;

            if (controls.func === 'radialWave') {
                func = radialWave;
            } else {
                func = klein;
            }

            // メッシュを生成する
            parametricMesh = createMesh(new THREE.ParametricGeometry(func, controls.slices, controls.stacks));

            // シーンにメッシュを追加する
            scene.add(parametricMesh);

        };

    };

    // // ------------------------------------
    // // GUI生成処理
    // // ------------------------------------

    // // GUIを生成する
    // let gui = new dat.GUI();

    // // func
    // gui.add(controls, 'func', ['klein', 'radialWave']).onChange(controls.redraw);

    // // slices
    // gui.add(controls, 'slices', 10, 200).step(5).onChange(controls.redraw);

    // // stacks
    // gui.add(controls, 'stacks', 10, 200).step(5).onChange(controls.redraw);

    // 再描画処理
    controls.redraw();

    // レンダリング処理
    render();

    // ------------------------------------
    // メッシュ生成関数
    // ------------------------------------

    function createMesh(geom) {

        // ジオメトリを生成する
        geom.applyMatrix(new THREE.Matrix4().makeTranslation(-25, 0, -25));

        // マテリアルを生成する
        let meshMaterial = new THREE.MeshPhongMaterial({
            specular: 0xaaaaff,
            color: 0x3399ff,
            shininess: 40
        });

        // マテリアルの方向を設定する
        meshMaterial.side = THREE.DoubleSide;

        // メッシュを生成する
        let plane = THREE.SceneUtils.createMultiMaterialObject(geom,[meshMaterial]);

        return plane;

    }

    // ------------------------------------
    // レンダリング関数
    // ------------------------------------

    function render() {
        
        // メッシュを回転させる
        parametricMesh.rotation.y = step += 0.01;
        parametricMesh.rotation.x = step;

        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

}
