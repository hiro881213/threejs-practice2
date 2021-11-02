let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const makeParticleWebGL = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -------------------------------------
    // レンダラ生成処理
    // -------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0x000000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // -------------------------------------
    // カメラ設定処理
    // -------------------------------------

    // カメラの位置を設定する
    camera.position.set(0, 0, 150);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("particlesWebGL-output").appendChild(webGLRenderer.domElement);

    // パーティクル生成処理を実行する
    createParticle();

    // レンダリング処理を実行する
    render();

    // -------------------------------------
    // パーティクル生成関数
    // -------------------------------------

    function createParticle() {

        // ジオメトリを生成する
        let geom = new THREE.Geometry();

        // マテリアルを生成する
        let material = new THREE.PointsMaterial({size: 4, vertexColors: true, color: 0xffffff});

        // パーティクルを生成する
        for ( let x = -5; x < 5; x++ ) {

            for ( let y = -5; y < 5; y++ ) {

                let particle = new THREE.Vector3(x*10, y*10, 0);

                // ジオメトリにパーティクルを追加する
                geom.vertices.push(particle);

                // ジオメトリに色を追加する
                geom.colors.push(new THREE.Color(Math.random() * 0x00ffff));

            }

        }

        // メッシュを生成する
        let cloud = new THREE.Points(geom, material);

        // シーンにメッシュを追加する
        scene.add(cloud);

    };

    // -------------------------------------
    // レンダリング関数
    // -------------------------------------

    function render() {

        // アニメーション生成処理
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    };

};
