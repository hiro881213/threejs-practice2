let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeMaterialProperties = () => {
    
    'use strict';

    Physijs.scripts.worker = '../../lib/physijs_worker.js';
    Physijs.scripts.ammo   = '../../lib/ammo';

    // スケールを生成する
    let scale = chroma.scale(['white', 'blue', 'red', 'yellow']);

    let initScene;
    let render;
    let ground_material;
    let renderer;
    let render_stats;
    let ground;
    let light;

    // ----------------------------------------
    // シーン生成関数
    // ----------------------------------------

    initScene = () =>{

        // ----------------------------------------
        // レンダラ生成処理
        // ----------------------------------------

        // レンダラを生成する
        renderer = new THREE.WebGLRenderer({antialias: true});

        // サイズを設定する
        renderer.setSize(width, height);

        // 背景色を設定する
        renderer.setClearColor(new THREE.Color(0x000000));

        // THREEJSオブジェクトをDOMに設定する
        document.getElementById("materialProperties-output").appendChild(renderer.domElement);

        // ----------------------------------------
        // シーン生成処理
        // ----------------------------------------

        // シーンを生成する
        scene = new Physijs.Scene;
        scene.setGravity(new THREE.Vector3(0, -90, 0));

        // ----------------------------------------
        // カメラ生成処理
        // ----------------------------------------

        // カメラを生成する
        camera = new THREE.PerspectiveCamera(35, width/height, 1, 1000);

        // カメラの位置を設定する
        camera.position.set(80, 60, 80);

        // カメラの方向を設定する
        camera.lookAt(scene.position);

        // シーンにカメラを追加する
        camera.add(camera);

        // ----------------------------------------
        // 点光源生成処理
        // ----------------------------------------

        // 点光源を生成する
        light = new THREE.SpotLight(0xFFFFFF);

        // 点光源の位置を設定する
        light.position.set(20, 100, 50);

        // シーンに点光源を追加する
        scene.add(light);

        // ----------------------------------------
        // グランド生成処理
        // ----------------------------------------

        // テクスチャローダを生成する
        const textureLoader = new THREE.TextureLoader();

        // マテリアルを生成する
        ground_material = Physijs.createMaterial(
            new THREE.MeshPhongMaterial({
                map: textureLoader.load("../../assets/textures/general/floor-wood.jpg"),
            }), 
            0.9, 0.6
        );

        // wrapを設定する
        ground_material.map.wrapS = THREE.RepeatWrapping;
        ground_material.map.wrapT = THREE.RepeatWrapping;

        // repeatを設定する
        ground_material.map.repeat.set(4, 8);

        // グランドメッシュを生成する
        ground = new Physijs.BoxMesh(
            new THREE.BoxGeometry(60, 1, 130),
            ground_material,
            0
        );

        ground_material.receiveShadow = true;

        // ----------------------------------------
        // 左罫線生成処理
        // ----------------------------------------

        // 左罫線を生成する
        const borderLeft = new Physijs.BoxMesh(
            new THREE.BoxGeometry(2, 6, 130),
            ground_material,
            0
        );

        // 左罫線の位置を設定する
        borderLeft.position.x = -31;
        borderLeft.position.y = 2;
        
        // グランドに左罫線を追加する
        ground.add(borderLeft);

        // ----------------------------------------
        // 右罫線生成処理
        // ----------------------------------------

        // 右罫線を生成する
        const borderRight = new Physijs.BoxMesh(
            new THREE.BoxGeometry(2, 6, 130),
            ground_material,
            0
        );

        // 右罫線の位置を設定する
        borderRight.position.x = 31;
        borderRight.position.y = 2;

        // グランドに右罫線を追加する
        ground.add(borderRight);

        // ----------------------------------------
        // 下罫線生成処理
        // ----------------------------------------

        // 下罫線を生成する
        const borderBottom = new Physijs.BoxMesh(
            new THREE.BoxGeometry(64, 6, 2),
            ground_material,
            0
        );

        // 下罫線の位置を設定する
        borderBottom.position.z = 65;
        borderBottom.position.y = 2;

        // グランドに下罫線を追加する
        ground.add(borderBottom);

        // ----------------------------------------
        // 上罫線生成処理
        // ----------------------------------------

        // 上罫線を生成する
        const borderTop = new Physijs.BoxMesh(
            new THREE.BoxGeometry(64, 6, 2),
            ground_material,
            0
        );

        // 上罫線の位置を設定する
        borderTop.position.z = -65;
        borderTop.position.y = 2;

        // グランドに上罫線を追加する
        ground.add(borderTop);

        // シーンにグランドを追加する
        scene.add(ground);

        let meshes = [];

        // ----------------------------------------
        // コントローラ生成処理
        // ----------------------------------------

        // コントローラを生成する
        let controls = new function() {

            this.cubeRestitution = 0.4;
            this.cubeFriction = 0.4;

            this.sphereRestitution = 0.9;
            this.sphereFriction = 0.1;

            // クリアメッシュ処理
            this.clearMeshes = () => {

                // メッシュ削除処理
                meshes.forEach((e) => {

                    scene.remove(e);

                });

                meshes = [];

            };

            // 球体追加処理
            this.addSpheres = () => {

                // 球体メッシュカラーを設定する
                let colorSphere = scale(Math.random()).hex();

                for ( let i = 0; i < 5; i++ ) {

                    // 球体メッシュを生成する
                    let sphere = new Physijs.SphereMesh(
                        new THREE.SphereGeometry(2, 20),
                        Physijs.createMaterial(
                            new THREE.MeshPhongMaterial({
                                color :colorSphere,
                                opacity: 0.8,
                                transparent: true
                            }),
                            controls.sphereFriction,
                            controls.sphereRestitution
                        )
                    );

                    // 球体メッシュの位置を設定する
                    sphere.position.set(
                        Math.random() * 50 -25,
                        20 + Math.random() * 5,
                        Math.random() * 50 - 25
                    );

                    meshes.push(sphere);

                    // シーンに球体メッシュを追加する
                    scene.add(sphere);

                }

            };

            // 立方体追加処理
            this.addCubes = () => {

                // カラーボックスを生成する
                let colorBox = scale(Math.random()).hex();

                for ( let i = 0; i < 5; i++ ) {

                    // 立方体メッシュを生成する
                    let box = new Physijs.BoxMesh(
                        new THREE.BoxGeometry(4, 4, 4),
                        Physijs.createMaterial(
                            new THREE.MeshPhongMaterial({
                                color: colorBox,
                                opacity: 0.8,
                                transparent: true
                            }),
                            controls.cubeFriction,
                            controls.cubeRestitution
                        )
                    );

                    // 立方体メッシュの位置を設定する
                    box.position.set(
                        Math.random() * 50 -25,
                        20 + Math.random() * 5,
                        Math.random() * 50 -25
                    );

                    // 立方体メッシュを回転させる
                    box.rotation.set(
                        Math.random() * Math.PI * 2,
                        Math.random() * Math.PI * 2,
                        Math.random() * Math.PI * 2
                    );

                    meshes.push(box);

                    // シーンに立方体メッシュを追加する
                    scene.add(box);

                }

            };

        };

        // ----------------------------------------
        // GUI生成処理
        // ----------------------------------------

        // GUIを生成する
        let gui = new dat.GUI();

        gui.add(controls, 'cubeRestitution', 0, 1);
        gui.add(controls, 'cubeFriction', 0, 1);

        gui.add(controls, 'sphereRestitution', 0, 1);
        gui.add(controls, 'sphereFriction', 0, 1);

        gui.add(controls, 'addCubes');
        gui.add(controls, 'addSpheres');
        gui.add(controls, 'clearMeshes');

        // アニメーションを生成する
        requestAnimationFrame(render);
        scene.simulate();

    };

    let stepX;
    let direction = 1;
        
    // ----------------------------------------
    // レンダリング関数
    // ----------------------------------------

    render = () => {

        // アニメーションを生成する
        requestAnimationFrame(render);
        renderer.render(scene, camera);

        render_stats.update();

        // グランドを回転させる
        ground.rotation.x += 0.002 * direction;

        if ( ground.rotation.x < -0.4 ) direction = 1;
        if ( ground.rotation.x > 0.4  ) direction = -1;

        ground.__dirtyRotation = true;
        scene.simulate(undefined, 1);


    };

    // シーン初期化処理を実行する
    initScene();

}
