let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeBasicScene = () => {
    
    'use strict';

    // スケールを生成する
    const scale = chroma.scale(['green','white']);

    Physijs.scripts.worker = '../../lib/physi.js';
    Physijs.scripts.ammo  = '../../lib/ammo.js'

    let initScene;
    let render;
    let renderer;
    let render_stats;
    let light;
    
    // シーン初期化処理
    initScene = () => {

        // -----------------------------------------
        // レンダラ生成処理
        // -----------------------------------------

        // レンダラを生成する
        renderer = new THREE.WebGLRenderer({anitialias: true});

        // サイズを設定する
        renderer.setSize(width, height);

        // 背景色を設定する
        renderer.setClearColor(new THREE.Color(0x000000));

        // THREEJSオブジェクトをDOMに設定する
        document.getElementById("basicScene-output").appendChild(renderer.domElement);

        // -----------------------------------------
        // statsレンダラ生成処理
        // -----------------------------------------

        // statsレンダラを生成する
        render_stats = new Stats();

        // statsの位置を設定する
        render_stats.domElement.style.position = 'absolute';
        render_stats.domElement.style.top = '1px';
        render_stats.domElement.style.zIndex = 100;

        document.getElementById("basicScene-output").appendChild(render_stats.domElement);

        // -----------------------------------------
        // シーン生成処理
        // -----------------------------------------

        // シーンを生成する
        scene = new Physijs.Scene();

        scene.setGravity(new THREE.Vector3(0, -50, 0));

        // -----------------------------------------
        // カメラ生成処理
        // -----------------------------------------

        // カメラを生成する
        camera = new THREE.PerspectiveCamera(35, width/height, 1, 1000);

        // カメラの位置を設定する
        camera.position.set(50, 30, 50);

        // カメラの方向を設定する
        camera.lookAt(new THREE.Vector3(10, 0, 10));

        // シーンにカメラを追加する
        scene.add(camera);

        // -----------------------------------------
        // 点光源生成処理
        // -----------------------------------------

        // 点光源を生成する
        light = new THREE.SpotLight(0xFFFFFF);

        // 点光源の位置を設定する
        light.position.set(20, 100, 50);

        // シーンに点光源を追加する
        scene.add(light);

        // グランド生成処理を実行する
        createGround();

        // 頂点を生成する
        let points = getPoints();
        let stones = [];

        // アニメーション生成処理
        requestAnimationFrame(render);

        // -----------------------------------------
        // コントローラ生成処理
        // -----------------------------------------

        // コントローラを生成する
        let controls = new function() {

            this.gravityX = 0;
            this.gravityY = -50;
            this.gravityZ = 0;

            // シーンリセット処理
            this.resetScene = () => {

                scene.setGravity(new THREE.Vector3(controls.gravityX, controls.gravityY, controls.gravityZ));

                stones.forEach((st) => {

                    scene.remove(st);

                });

                stones = [];

                points.forEach((point) => {

                    // ストーンジオメトリを生成する
                    let stoneGeom = new THREE.BoxGeometry(0.6, 6, 2);

                    // ストーンを生成する
                    const stone = new Physijs.BoxMesh(
                        stoneGeom, 
                        Physijs.createMaterial(new THREE.MeshPhongMaterial({
                            color: scale(Math.random()).hex(),
                            transparent: true,
                            opacity: 0.8
                        }))
                    );

                    // ストーンの位置を設定する
                    stone.position.copy(point);

                    // ストーンの方向を設定する
                    stone.lookAt(scene.position);

                    // ストーンの回転を有効にする
                    stone.__dirtyRotation = true;

                    stone.position.y = 3.5;

                    // シーンにストーンを追加する
                    scene.add(stone);
                    stones.push(stone);

                });

                stones[0].rotation.x = 0.2;
                stones[0].__dirtyRotation = true;

            };

        };

        // -----------------------------------------
        // GUI生成処理
        // -----------------------------------------

        // GUIを生成する
        const gui = new dat.GUI();

        gui.add(controls, 'gravityX', -100, 100);
        gui.add(controls, 'gravityY', -100, 100);
        gui.add(controls, 'gravityZ', -100, 100);
        gui.add(controls, 'resetScene');

        controls.resetScene();

    };

    let stepX;

    // -----------------------------------------
    // レンダリング関数
    // -----------------------------------------

    render = () => {

        requestAnimationFrame(render);
        renderer.render(scene, camera);
        render_stats.update();

        scene.simulate(undefined, 1);

    };

    // -----------------------------------------
    // 頂点取得関数
    // -----------------------------------------

    function getPoints() {

        let points = [];
        let r = 27;
        let cX = 0;
        let cY = 0;

        let circleOffset = 0;

        for (let i = 0; i < 1000; i += 6 + circleOffset) {

            circleOffset = 4.5 * (i / 360);

            let x = (r / 1440) * (1440 - i) * Math.cos(i * (Math.PI / 180)) + cX;
            let z = (r / 1440) * (1440 - i) * Math.sin(i * (Math.PI / 180)) + cY;
            let y = 0;

            // 頂点を追加する
            points.push(new THREE.Vector3(x, y, z));

        }

        return points;

    }

    // -----------------------------------------
    // グランド生成関数
    // -----------------------------------------

    function createGround() {

        // テクスチャを生成する
        let textureLoader = new THREE.TextureLoader();

        // マテリアルを生成する
        let groundMaterial = Physijs.createMaterial(
            new THREE.MeshPhongMaterial({
                map: textureLoader.load("../../assets/textures/general/wood-2.jpg"), 
            }), 0.9,0.3
        );

        // グランドメッシュを生成する
        let ground = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 1, 60), groundMaterial, 0);

        // 左罫線を生成する
        let borderLeft = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 3, 60),groundMaterial, 0);
        
        // 左罫線の位置を設定する
        borderLeft.position.x = -31;
        borderLeft.position.y = 2;

        // 左罫線をグランドメッシュに追加する
        ground.add(borderLeft);

        // 右罫線を生成する
        let borderRight = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 3, 60), groundMaterial, 0);

        // 右罫線の位置を設定する
        borderRight.position.x = 31;
        borderRight.position.y = 2;

        // 右罫線をグランドメッシュに追加する
        ground.add(borderRight);

        // 下罫線を生成する
        let borderBottom = new Physijs.BoxMesh(new THREE.BoxGeometry(64, 3, 2), groundMaterial, 0);

        // 下罫線の位置を設定する
        borderBottom.position.z = 30;
        borderBottom.position.y = 2;

        // 下罫線をグランドメッシュに追加する
        ground.add(borderBottom);

        // 上罫線を生成する
        let borderTop = new Physijs.BoxMesh(new THREE.BoxGeometry(64, 3, 2), groundMaterial, 0);

        // 上罫線の位置を設定する
        borderTop.position.z = -30;
        borderTop.position.y = 2

        // 上罫線をグランドメッシュに追加する
        ground.add(borderTop);

    };

    initScene();

}
