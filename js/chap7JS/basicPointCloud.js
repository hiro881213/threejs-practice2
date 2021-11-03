let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const makeBasicPointCloud = () => {

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
    webGLRenderer.setClearColor(new THREE.Color(0x000000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);
    
    // --------------------------------------
    // カメラ設定処理
    // --------------------------------------

    // カメラの位置を設定する
    camera.position.set(20, 0, 150);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("basicPointCloud-output").appendChild(webGLRenderer.domElement);

    // クラウドを生成する
    let cloud;

    // --------------------------------------
    // コントローラ生成処理
    // --------------------------------------

    let controls = new function () {

        // サイズ
        this.size = 4;

        // 透過性
        this.transparent = true;
        this.opacity = 0.6;

        // 頂点色
        this.vertexColors = true;

        // 色
        this.color = 0xffffff;

        // サイズ
        this.sizeAttenuation = true;

        // 回転システム
        this.rotateSystem = true;

        // 再描画処理
        this.redraw = () => {

            // パーティクルの場合
            if (scene.getObjectByName("particles")) {

                // シーンからパーティクルを削除する
                scene.remove(scene.getObjectByName("particles"));

            }

            // パーティクルを生成する
            createParticles(controls.size, controls.transparent, controls.opacity, controls.vertexColors, controls.sizeAttenuation, controls.color);

        };

    };

    // // --------------------------------------
    // // GUI生成処理
    // // --------------------------------------

    // // GUIを生成する
    // let gui = new dat.GUI();

    // // サイズ
    // gui.add(controls, 'size', 0, 10).onChange(controls.redraw);

    // // 透過性
    // gui.add(controls, 'transparent').onChange(controls.redraw);
    // gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);

    // // vertexColor
    // gui.add(controls, 'vertexColors').onChange(controls.redraw);

    // // color
    // gui.addColor(controls, 'color').onChange(controls.redraw);

    // // sizeAttenuation
    // gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);

    // // rotateSystem
    // gui.add(controls, 'rotateSystem').onChange(controls.redraw);

    // 再描画処理を実行する
    controls.redraw();

    let step = 0;

    // レンダリング処理を実行する
    render();

    // --------------------------------------
    // パーティクル生成関数
    // --------------------------------------

    function createParticles(size, transparent, opacity, vertexColors, sizeAttenuation, color) {

        // ジオメトリを生成する
        let geom = new THREE.Geometry();

        // マテリアルを生成する
        let material = new THREE.PointsMaterial({
            size: size,
            transparent: transparent,
            opacity: opacity,
            vertexColors: vertexColors,
            sizeAttenuation: sizeAttenuation,
            color: color
        });

        // 範囲を設定する
        let range = 500;

        // パーティクルを生成する
        for ( let i = 0; i < 15000; i++ ) {

            // パーティクルを生成する
            let particle = new THREE.Vector3(
                Math.random()*range - range/2,
                Math.random()*range - range/2,
                Math.random()*range - range/2);

            // ジオメトリにパーティクルに追加する
            geom.vertices.push(particle);

            // 色を定義する
            let color = new THREE.Color(0x00ff00);

            // HSLを設定する
            color.setHSL(color.getHSL().h, color.getHSL().s, Math.random() * color.getHSL().l);

            // ジオメトリに色を設定する
            geom.colors.push(color);

        }

        // クラウドを生成する
        cloud = new THREE.Points(geom, material);

        // クラウド名を設定する
        cloud.name = "particles";

        // シーンにクラウドを追加する
        scene.add(cloud);

    }

    // --------------------------------------
    // レンダリング生成関数
    // --------------------------------------

    function render() {

        // 回転システムが有効な場合
        if (controls.rotateSystem) {

            step += 0.01;

            cloud.rotation.x = step;
            cloud.rotation.z = step;

        }

        // アニメーションを実行する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    };

};
