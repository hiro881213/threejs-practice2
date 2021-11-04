let scene;
let camera;

let width = window.innerWidth;
let height = 500;
export const makeSnowyScene = () => {
    
    // シーンを生成する
    let scene = new THREE.Scene();

    // カメラを生成する
    let camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -----------------------------------
    // レンダラ生成処理
    // -----------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0x000000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // -----------------------------------
    // カメラ設定処理
    // -----------------------------------

    // カメラの位置を設定する
    camera.position.set(20, 40, 110);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(20, 30, 0));

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("snowyScene-output").appendChild(webGLRenderer.domElement);

    // -----------------------------------
    // コントローラ生成処理
    // -----------------------------------

    let system1;
    let system2;

    // コントローラを生成する
    let controls = new function () {

        // サイズ
        this.size = 10;

        // 透過性
        this.transparent = true;

        // opacity
        this.opacity = true;

        // color
        this.color = 0xffffff;

        // sizeAttenuation
        this.sizeAttenuation = true;

        // 再描画処理
        this.redraw = () => {

            let toRemove = [];

            // 削除対象を取得する
            scene.children.forEach((child) => {

                if (child instanceof THREE.Points) {

                    toRemove.push(child);

                }

            });

            // メッシュ生成処理
            createMultiPoints(controls.size, controls.transparent, controls.opacity, controls.sizeAttenuation, controls.color);

        }

    };

    // -----------------------------------
    // GUI生成処理
    // -----------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // size
    gui.add(controls, 'size', 0, 20).onChange(controls.redraw);

    // transparent
    gui.add(controls, 'transparent').onChange(controls.redraw);

    // opacity
    gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);

    // color
    gui.addColor(controls, 'color').onChange(controls.redraw);

    // sizeAttenuation
    gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);

    // 再描画処理
    controls.redraw();

    // レンダリング処理を実行する
    render();

    // -----------------------------------
    // 頂点生成関数
    // -----------------------------------

    function createPoints(name, texture, size, transparent, opacity, sizeAttenuation, color) {

        // ジオメトリを生成する
        let geom = new THREE.Geometry();

        // 色を生成する
        let mcolor = new THREE.Color(color);
        mcolor.setHSL(mcolor.getHSL().h, mcolor.getHSL().s, (Math.random())* mcolor.getHSL().l );

        // マテリアルを生成する
        let material = new THREE.PointsMaterial({
            size: size,
            transparent: transparent,
            opacity: opacity,
            map: texture,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: sizeAttenuation,
            color: mcolor
        });

        // 範囲を定義する
        const range = 40;

        for (let i = 0; i < 50; i++) {

            let particle = new THREE.Vector3(
                Math.random() * range - range / 2,
                Math.random() * range * 1.5,
                Math.random() * range - range / 2
            );

            particle.velocityY = 0.1 + Math.random() / 5;
            particle.velocityX = (Math.random() - 0.5) / 3;
            particle.velocityZ = (Math.random() - 0.5) / 3;
                
            // 頂点をジオメトリに追加する
            geom.vertices.push(particle);

        }

        // メッシュを生成する
        let system = new THREE.Points(geom, material);
        system.name = name;
        system.sortParticles = true;

        return system;

    };

    // -----------------------------------
    // メッシュ生成関数
    // -----------------------------------

    function createMultiPoints(size, transparent, opacity, sizeAttenuation, color) {

        // テクスチャを読み込む
        let textureLoader = new THREE.TextureLoader();

        let texture1 = textureLoader.load("../../assets/textures/particles/snowflake1.png");
        let texture2 = textureLoader.load("../../assets/textures/particles/snowflake2.png");
        let texture3 = textureLoader.load("../../assets/textures/particles/snowflake3.png");
        let texture4 = textureLoader.load("../../assets/textures/particles/snowflake4.png");

        // シーンにメッシュを追加する
        scene.add(createPoints("system1", texture1, size, transparent, opacity, sizeAttenuation, color));
        scene.add(createPoints("system2", texture2, size, transparent, opacity, sizeAttenuation, color));
        scene.add(createPoints("system3", texture3, size, transparent, opacity, sizeAttenuation, color));
        scene.add(createPoints("system4", texture4, size, transparent, opacity, sizeAttenuation, color));

    };
    
    // -----------------------------------
    // レンダリング関数
    // -----------------------------------

    function render() {

        // シーンのオブジェクトに対して処理を行う
        scene.children.forEach((child) => {

            if ( child instanceof THREE.Points ) {

                let vertices = child.geometry.vertices;

                vertices.forEach(function (v) {
                    v.x = v.x - (v.velocityX);
                    v.y = v.y - (v.velocityY);
                    v.z = v.z - (v.velocityZ);

                    if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
                    if (v.y <= 0) v.y = 60;
                    if (v.z <= -20 || v.z >= 20) v.velocityZ = v.velocityZ * -1;

                });

                child.geometry.verticesNeedUpdate = true;

            }

        });

    }
}