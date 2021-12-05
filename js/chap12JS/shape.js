let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeShapes = () => {

    'use strict';

    Physijs.scripts.worker = '../../lib/physijs_worker.js'
    Physijs.scripts.ammo = '../../lib/ammo.js'

    let scale = chroma.scale(['blue', 'white']);

    let initScene;
    let render;
    let applyForce;
    let setMousePosition;
    let mouse_position;
    let groundMaterial;
    let box_material;
    let projector;
    let renderer;
    let render_stats;
    let physics_stats;
    let ground;
    let light;
    let box;
    let boxes = [];

    // シーン初期化処理
    initScene = () => {

        // -------------------------------------------
        // レンダラ生成処理
        // -------------------------------------------

        // レンダラを生成する
        renderer = new THREE.WebGLRenderer({antialias: true});

        // サイズを設定する
        renderer.setSize(width, height);

        // 背景色を設定する
        renderer.setClearColor(new THREE.Color(0x000000));

        // シャドウマップを有効にする
        renderer.shadowMap.enabled = true;

        // THREEJSオブジェクトをDOMに設定する
        document.getElementById("shapes-output").appendChild(renderer.domElement);

        // -------------------------------------------
        // stats生成処理
        // -------------------------------------------

        // レンダラスタッツを生成する
        render_stats = new Stats();

        // レンダラスタッツの位置を設定する
        render_stats.domElement.style.position = 'absolute';
        render_stats.domElement.style.top = '1px';
        render_stats.domElement.style.left = '1px';
        render_stats.domElement.style.zIndex = 100;

        document.getElementById("shapes-output").appendChild(render_stats.domElement);

        // -------------------------------------------
        // シーン生成処理
        // -------------------------------------------

        // シーンを生成する
        scene = new Physijs.Scene({
            reportSize: 10, 
            fixedTimeStep: 1/60
        });

        scene.setGravity(new THREE.Vector3(0, -20, 0));

        // -------------------------------------------
        // カメラ生成処理
        // -------------------------------------------

        // カメラを生成する
        camera = new THREE.PerspectiveCamera(
            35,
            width/height,
            1,
            1000
        );

        // カメラの位置を設定する
        camera.position.set(105, 85, 85);

        // カメラの方向を設定する
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // シーンにカメラを追加する
        scene.add(camera);

        // -------------------------------------------
        // 環境光生成処理
        // -------------------------------------------

        // 環境光を生成する
        let ambi = new THREE.AmbientLight(0x222222);
        
        // シーンに環境光を追加する
        scene.add(ambi);

        // -------------------------------------------
        // 点光源生成処理
        // -------------------------------------------

        // 点光源を生成する
        light = new THREE.SpotLight(0xFFFFFF);

        // 点光源の位置を設定する
        light.position.set(40, 50, 100);

        // キャストシャドウを有効にする
        light.castShadow = true;

        // カメラを設定する
        light.shadow.camera.near = 10;
        light.shadow.camera.far = 200;

        // intensity
        light.intensity = 1.5;

        let meshes = [];

        // シーンに点光源を追加する
        scene.add(light);

        // -------------------------------------------
        // コントローラ生成処理
        // -------------------------------------------

        // コントローラを生成する
        let controls = new function() {

            // 球体メッシュ追加処理
            this.addSphereMesh = () => {

                // 球体メッシュを生成する
                let sphere = new Physijs.SphereMesh(
                    new THREE.SphereGeometry(3, 20), 
                    getMaterial()
                );

                // シェーディング処理を実行する
                setPosAndShade(sphere);

                meshes.push(sphere);

                // シーンに球体メッシュを追加する
                scene.add(sphere);

            };

            // 立方体メッシュ追加処理
            this. addBoxMesh = () => {

                // 立方体メッシュを生成する
                let cube = new Physijs.BoxMesh(
                    new THREE.BoxGeometry(4, 2, 6),
                    getMaterial()
                );

                setPosAndShade(cube);

                meshes.push(cube);
                scene.add(cube);

            };

            // シリンダーメッシュ追加処理
            this.addCylinderMesh = () => {

                let cylinder = new Physijs.CylinderMesh(
                    new THREE.CylinderGeometry(2, 2, 6),
                    getMaterial()
                );

                setPosAndShade(cylinder);

                meshes.push(cylinder);
                scene.add(cylinder);

            };

            // コーンメッシュ追加処理
            this.addConeMesh = () => {

                // コーンメッシュを生成する
                let cone = new Physijs.ConeMesh(
                    new THREE.CylinderGeometry(0, 3, 7, 20, 10),
                    getMaterial()
                );

                setPosAndShade();

                meshes.push(cone);
                scene.add(cone);

            };

            // 平面メッシュ追加処理
            this.addPlaneMesh = () => {

                // 平面メッシュを生成する
                let plane = new Physijs.PlaneMesh(
                    new THREE.PlaneGeometry(5, 5, 10, 10),
                    getMaterial()
                );

                setPosAndShade(plane);

                meshes.push(plane);
                scene.add(plane);

            };

            // カプセルメッシュ追加処理
            this.addCapsuleMesh = () => {

                // ジオメトリを生成する
                let merged = new THREE.Geometry();
                let cyl = new THREE.CylinederGeometry(2, 2, 6);
                let top = new THREE.SphereGeometry(2);
                let bot = new THREE.SphereGeometry(2);

                // マトリックスを生成する
                let matrix = new THREE.Matrix4();
                matrix.makeTranslation(0, 3, 0);
                top.applyMatrix(matrix);

                let matrix2 = new THREE.Matrix4();
                matrix2.makeTranslation(0, -3, 0);
                bot.applyMatrix(matrix2);

                // マージ処理を実行する
                merged.merge(top);
                merged.merge(bot);
                merged.merge(cyl);

                // カプセルメッシュを生成する
                let capsule = new Physijs.CapsuleMesh(
                    merged,
                    getMaterial()
                );

                setPosAndShade(capsule);

                meshes.push(capsule);
                scene.add(capsule);

            };

            // 凸メッシュ追加処理
            this.addConvexMesh = () => {

                let convex = new Physijs.ConvexMesh(
                    new THREE.TorusKnotGeometry(0.5, 0.3, 64, 8, 2, 3, 10),
                    getMaterial()
                );

                setPosAndShade(convex);

                meshes.push(convex);
                scene.add(convex);

            };

            // メッシュクリア処理
            this.clearMeshes = () => {

                meshes.forEach((e) => {

                    // シーンからメッシュを削除する
                    scene.remove(e);

                });

                meshes = [];

            };

        };

        // -------------------------------------------
        // GUI生成処理
        // -------------------------------------------

        // GUIを生成する
        let gui = new dat.GUI();

        gui.add(controls, 'addPlaneMesh');
        gui.add(controls, 'addBoxMesh');
        gui.add(controls, 'addSphereMesh');
        gui.add(controls, 'addCylinderMesh');
        gui.add(controls, 'addConeMesh');
        gui.add(controls, 'addCapsuleMesh');
        gui.add(controls, 'addConvexMesh');
        gui.add(controls, 'clearMeshes');

        let date = new Date();
        let pn = new Perlin('rnd' + date.getTime());
        let map = createHeightMap(pn);

        scene.add(map);

        // アニメーションを生成する
        requestAnimationFrame(render);
        scene.simulate();

    };

    // -------------------------------------------
    // 高さマップ生成関数
    // -------------------------------------------

    function createHeightMap(pn) {

        // テクスチャローダを生成する
        let textureLoader = new THREE.TextureLoader();

        // マテリアルを生成する
        const groundMaterial = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({
                map: textureLoader.load('../../assets/textures/ground/grasslight-big.jpg')
            }),
            0.3,
            0.8
        );

        // グランドジオメトリを生成する
        const groundGeometry = new THREE.PlaneGeometry(120, 100, 100, 100);

        for (let i = 0; i < groundGeometry.vertices.length; i++) {

            let vertex = groundGeometry.vertices[i];
            let value = pn.noise(vertex.x/10, vertex.y/10, 0);
            vertex.z = value * 10;

        }

        groundGeometry.computeFaceNormals();
        groundGeometry.computeVertexNormals();

        // グランドメッシュを生成する
        let ground = new Physijs.HeightfieldMesh(
            groundGeometry,
            groundMaterial,
            0,
            100,
            100
        );

        // グランドメッシュを回転させる
        ground.rotation.x = Math.PI / -2;
        ground.rotation.y = 0.4;
        ground.receiveShadow = true;

        return ground;

    };

    // -------------------------------------------
    // 形状生成関数
    // -------------------------------------------

    function createShape() {

        // 頂点を生成する
        let points = [];

        for ( let i = 0; i < 30; i++) {

            let randomX = -5 + Math.round(Math.random() * 10);
            let randomY = -5 + Math.round(Math.random() * 10);
            let randomZ = -5 + Math.round(Math.random() * 10);

            points.push(new THREE.Vector3(randomX, randomY, randomZ));

        }

        let hullGeometry = new THREE.ConvexGeometry(points);
        
        return hullGeometry;

    };

    // -------------------------------------------
    // ジオメトリ位置設定関数
    // -------------------------------------------

    function setPosAndShade(obj) {

        // オブジェクトの位置を設定する
        obj.position.set(
            Math.random() * 20 - 45,
            40,
            Math.random() * 20 -5
        );

        // オブジェクトを回転させる
        obj.rotation.set(
            Math.random() * 2 * Math.PI,
            Math.random() * 2 * Math.PI,
            Math.random() * 2 * Math.PI);

        // オブジェクトのキャストシャドウを有効にする
        obj.castShadow = true;

    }

    // -------------------------------------------
    // マテリアル生成関数
    // -------------------------------------------

    function getMaterial() {

        const material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({
                color: scale(Math.random()).hex()
            }), 0.5, 0.7
        );

    }

    // -------------------------------------------
    // グランド生成関数
    // -------------------------------------------

    function createGround() {

        const length = 120;
        const width = 120;

        // テクスチャローダーを生成する
        const textureLoader = new THREE.TextureLoader();

        // マテリアルを生成する
        groundMaterial = Physijs.createMaterial(
            new THREE.MeshPhongMaterial({
                map: textureLoader.load('../../assets/textures/general/floor-wood.jpg')
            }), 1, 0.7
        );

        // グランドメッシュを生成する
        ground = new Physijs.BoxMesh(
            new THREE.BoxGeometry(length, 1, width),
            groundMaterial,
            0
        );

        ground.receiveShadow = true;

        // ----------------------------------------------
        // 左罫線生成処理
        // ----------------------------------------------

        // 左罫線を生成する
        const borderLeft = new Physijs.BoxMesh(
            new THREE.BoxGeometry(2, 6, width),
            groundMaterial,
            0
        );

        // 左罫線の位置を設定する
        borderLeft.position.x = -1 * length / 2 - 1
        borderLeft.position.y = 2;

        borderLeft.receiveShadow = true;

        // グランドに左罫線を追加する
        ground.add(borderLeft);

        // ----------------------------------------------
        // 右罫線生成処理
        // ----------------------------------------------

        // 右罫線を生成する
        const borderRight = new Physijs.BoxMesh(
            new THREE.BoxGeometry(2, 6, width),
            groundMaterial,
            0
        );

        // 右罫線の位置を設定する
        borderRight.position.x = length / 2 + 1;
        borderRight.position.y = 2;

        borderRight.receiveShadow = true;

        // グランドに右罫線を追加する
        ground.add(borderRight);

        // ----------------------------------------------
        // 下罫線生成処理
        // ----------------------------------------------

        // 下罫線を生成する
        const borderBottom = new Physijs.BoxMesh(
            new THREE.BoxGeometry(width - 1, 6, 2),
            groundMaterial,
            0
        );

        // 下罫線の位置を設定する
        borderBottom.position.z = width / 2;
        borderBottom.position.y = 1.5;

        borderBottom.receiveShadow = true;

        // グランドに下罫線を追加する
        ground.add(borderBottom);

        // ----------------------------------------------
        // 上罫線生成処理
        // ----------------------------------------------

        // 上罫線を生成する
        const borderTop = new Physijs.BoxMesh(
            new THREE.BoxGeometry(width, 6, 2),
            groundMaterial,
            0
        );

        // 上罫線の位置を設定する
        borderTop.position.z = -width / 2;
        borderTop.position.y = 2;

        borderTop.receiveShadow = true;

        // グランドの位置を設定する
        ground.position.x = 0;
        ground.position.z = 0;

        // グランドに上罫線を追加する
        ground.add(borderTop);

        // シーンにグランドを追加する
        scene.add(ground);

    };

    // -------------------------------------------
    // レンダリング関数
    // -------------------------------------------

    render = () => {

        // アニメーションを生成する
        requestAnimationFrame(render);
        renderer.render(scene, camera);

        render_stats.update();
        
        scene.simulate(undefined, 2);

    };

    // シーン初期化処理を実行する
    initScene();

};
