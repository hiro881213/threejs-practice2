let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeAnimationTween = () => {
    
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
    webGLRenderer.setClearColor(new THREE.Color(0x000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // --------------------------------------
    // カメラ設定処理
    // --------------------------------------

    // カメラの位置を設定する
    camera.position.set(10, 10, 10);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, -2, 0));

    // --------------------------------------
    // 点光源生成処理
    // --------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(20, 20, 20);

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("animetionTween-output").appendChild(webGLRenderer.domElement);

    // --------------------------------------
    // コントローラ生成処理
    // --------------------------------------

    let step = 0;

    let controls = new function () {};

    // --------------------------------------
    // tween生成処理
    // --------------------------------------

    let pointCloud;
    let loadedGeometry;

    let posSrc = {pos: 1};

    // tweenを生成する
    var tween = new TWEEN.Tween(posSrc).to({pos: 0}, 5000);
    tween.easing(TWEEN.Easing.Sinusoidal.InOut);

    // tweenBackを生成する
    var tweenBack = new TWEEN.Tween(posSrc).to({pos: 1}, 5000);
    tweenBack.easing(TWEEN.Easing.Sinusoidal.InOut);

    tween.chain(tweenBack);
    tweenBack.chain(tween);

    // --------------------------------------
    // onUpdate関数
    // --------------------------------------

    let onUpdate = () => {

        let count = 0;
        let pos = 1;

        loadedGeometry.vertices.forEach((e) => {

            let newY = ((e.y + 3.22544)*pos) - 3.22544;
            pointCloud.geometry.vertices[count++].set(e.x, newY, e.z);

        });

        pointCloud.geometry.verticesNeedUpdate = true;

    }

    // tweenを更新する
    tween.onUpdate(onUpdate);
    tweenBack.onUpdate(onUpdate);

    // --------------------------------------
    // GUI生成処理
    // --------------------------------------

    let gui = new dat.GUI();

    // --------------------------------------
    // 画像読み込み処理
    // --------------------------------------

    let loader = new THREE.PLYLoader();

    // 画像を読み込む
    loader.load("../../assets/models/test.ply", (geometry) => {

        // ジオメトリを取得する
        loadedGeometry = geometry.clone();

        // マテリアルを生成する
        let material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.4,
            opacity: 0.6,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            map: generateSprite()
        })

        // メッシュを生成する
        pointCloud = new THREE.Points(geometry, material);
        pointCloud.sortParticle = true;

        tween.start();

        // シーンにメッシュを追加する
        scene.add(pointCloud);

        // メッシュを生成する
        pointCloud = new THREE.Points(geometry, material);
        pointCloud.sortParticles = true;

        tween.start();

        scene.add(pointCloud);

    });


    // レンダリング処理を実行する　
    render();

    // --------------------------------------
    // スピリット生成関数
    // --------------------------------------

    function generateSprite() {

        // canvasタグを生成する
        let canvas = document.createElement('canvas');

        // canvasのサイズを設定する
        canvas.width = 16;
        canvas.height = 16;

        let context = canvas.getContext('2d');

        let gradient = context.createRadialGradient(canvas.width/2,canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(0, 255, 255, 1)');
        gradient.addColorStop(0.4, 'rgba(0, 0, 64, 1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // テクスチャを設定する
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        return texture;

    }

    // --------------------------------------
    // レンダリング関数
    // --------------------------------------
    
    function render() {
         
        TWEEN.update();

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

};
