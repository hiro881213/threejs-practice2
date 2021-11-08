let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const loadPly = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // --------------------------------
    // レンダラ生成処理
    // --------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0x000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // --------------------------------
    // カメラ設定処理
    // --------------------------------

    // カメラの位置を設定する
    camera.position.set(10, 10, 10);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, -2, 0));

    // --------------------------------
    // 点光源生成処理
    // --------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(20, 20, 20);

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに追加する
    document.getElementById("loadObjPly-output").appendChild(webGLRenderer.domElement);

    // --------------------------------
    // コントローラ生成処理
    // --------------------------------

    let step = 0;

    // コントローラを生成する
    let controls = new function() {};

    // --------------------------------
    // GUI生成処理
    // --------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // --------------------------------
    // ローダー生成処理
    // --------------------------------

    // ローダーを生成する
    let loader = new THREE.PLYLoader();

    // グループを生成する
    let group = new THREE.Group();

    // ロード処理を実行する
    loader.load("../../assets/models/test.ply", (geometry) => {

        // マテリアルを生成する
        let material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.4,
            opacity: 0.6,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            map: generateSprite()
        });

        // メッシュを生成する
        group = new THREE.Points(geometry, material);
        group.sortParticles = true;

        // シーンにメッシュを追加する
        scene.add(group);

    });

    // レンダラ処理を実行する
    render();

    // --------------------------------
    // スピリット生成関数
    // --------------------------------

    function generateSprite() {

        // カンバスタグを生成する
        let canvas = document.createElement('canvas');

        // カンバスタグのサイズを設定する
        canvas.width = 16;
        canvas.height = 16;

        // コンテキストを生成する
        let context = canvas.getContext('2d');

        // gradient
        let gradient = context.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(0, 255, 255, 1)');
        gradient.addColorStop(0.4, 'rgba(0, 0, 64, 1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // テクスチャを生成する
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        return texture;

    };

    // --------------------------------
    // レンダリング関数
    // --------------------------------

    function render() {

        if (group) {

            // メッシュを回転する
            group.rotation.y += 0.006;

        }

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }
};
