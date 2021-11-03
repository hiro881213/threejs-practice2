let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const makeRainyScene = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -----------------------------------------
    // レンダラ生成処理
    // -----------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0x000000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // -----------------------------------------
    // カメラ設定処理
    // -----------------------------------------

    // カメラの位置を設定する
    camera.position.set(20, 40, 110);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(20, 30, 0));

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("rainyScene-output").appendChild(webGLRenderer.domElement);

    // クラウドを定義する
    let cloud;

    // -----------------------------------------
    // コントローラ生成処理
    // -----------------------------------------

    let controls = new function () {

        // サイズ
        this.size = 3;

        // 透過性
        this.transparent = true;

        // opacity
        this.opacity = 0.6;

        // 色
        this.color = 0xffffff;

        // sizeAttenuation
        this.sizeAttenuation = true;

        // 再描画処理
        this.redraw = () => {

            // シーンからパーティクルを削除する
            scene.remove(scene.getObjectByName("particles1"));

            // パーティクルを生成する
            createPoints(controls.size, controls.transparent, controls.opacity, controls.sizeAttenuation, controls.color);

        };

    };

    // -----------------------------------------
    // GUI生成処理
    // -----------------------------------------

    let gui = new dat.GUI();

    // size
    gui.add(controls, 'size', 0, 20).onChange(controls.redraw);

    // transparent
    gui.add(controls, 'transparent').onChange(controls.redraw);

    // opacity
    gui.add(controls, 'opacity').onChange(controls.redraw);

    // color
    gui.addColor(controls, 'color').onChange(controls.redraw);

    // sizeAttenuation
    gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);

    // 再描画処理
    controls.redraw();

    // レンダリング処理を実行する
    render();

    // -----------------------------------------
    // パーティクル生成関数
    // -----------------------------------------

    function createPoints(size, transparent, opacity, sizeAttenuation, color) {
        
        // テキストローダーを生成する
        let textureLoader = new THREE.TextureLoader();

        // テクスチャを取得する
        let texture = textureLoader.load('../assets/textures/particles/raindrop-1.png');

        // ジオメトリを生成する
        let geom = new THREE.Geometry();

        // マテリアルを生成する
        let material = new THREE.PointsMaterial({
            size: size,
            transparent: transparent,
            opacity: opacity,
            depthWrite: false,
            map: texture,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: sizeAttenuation,
            color: color
        });

        // 範囲を指定する
        let range = 40;

        // パーティクルを生成する
        for (let i = 0; i < 1500; i++) {

            let particle = new THREE.Vector3(
                Math.random() * range - range/2,
                Math.random() * range * 1.5,
                Math.random() * range - range / 2
            );

            particle.velocityX = (Math.random() - 0.5) / 3;
            particle.velocityY = 0.1 + Math.random() / 5;

            geom.vertices.push(particle);

        }

        // メッシュを生成する
        cloud = new THREE.Points(geom, material);

        cloud.sortParticles = true;
        cloud.name = "particles1";

        // シーンにクラウドを追加する
        scene.add(cloud);

    }

    // -----------------------------------------
    // レンダリング関数
    // -----------------------------------------

    function render() {

        // 頂点を取得する
        let vertices = cloud.geometry.vertices;
        vertices.forEach((v) => {
            
            v.y = v.y - (v.velocityY);
            v.x = v.x - (v.velocityX);

            if (v.y <= 0) v.y = 60;
            if (v.x <= 20 || v.x >= 20) v.velocityX = v.velocityX * -1;

        });

        cloud.geometry.verticesNeedUpdate = true;

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

};
