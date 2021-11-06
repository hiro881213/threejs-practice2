let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeGrouping = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ---------------------------------------------------
    // レンダラ生成処理
    // ---------------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを設定する
    webGLRenderer.shadowMap.enabled = true;

    // ---------------------------------------------------
    // カメラ設定処理
    // ---------------------------------------------------

    // カメラの位置を設定する
    camera.position.set(30, 30, 30);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    // ---------------------------------------------------
    // 地上メッシュ生成処理
    // ---------------------------------------------------

    // ジオメトリを生成する
    let ground = new THREE.PlaneGeometry(100, 100, 50, 50);

    // メッシュを生成する
    let groundMesh = new THREE.SceneUtils.createMultiMaterialObject(
        ground,
        [
            new THREE.MeshBasicMaterial({wireframe: true, overdraw: true, color: '#000000'}),
            new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.5})
        ]
    );

    // メッシュを回転させる
    groundMesh.rotation.x = -0.5 * Math.PI;

    // シーンにメッシュを追加する
    scene.add(groundMesh);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("grouping-output").appendChild(webGLRenderer.domElement);

    // ---------------------------------------------------
    // コントローラ生成処理
    // ---------------------------------------------------

    let step = 0.03;
    
    let sphere;
    let cube;
    let group;
    let bboxMesh;

    // コントローラを生成する
    let controls = new function() {

        // 立方体の位置を設定する
        this.cubePosX = 0;
        this.cubePosY = 3;
        this.cubePosZ = 10;

        // 球体の位置を設定する
        this.spherePosX = 10;
        this.spherePosY = 5;
        this.spherePosZ = 0;

        // グループ位置を設定する
        this.groupPosX = 10;
        this.groupPosY = 5;
        this.groupPosZ = 0;

        // グルーピング
        this.grouping = false;

        // 回転
        this.rotate = false;

        // グループスケール
        this.groupScale = 1;
        
        // 立方体スケール
        this.cubeScale = 1;

        // 球体スケール
        this.sphereScale = 1;

        // 再描画処理
        this.redraw = () => {

            // シーンからグループを削除する
            scene.remove(group);

            // 球体を生成する
            sphere = createMesh(new THREE.SphereGeometry(5, 10, 10));

            // 立方体を生成する
            cube = createMesh(new THREE.BoxGeometry(6, 6, 6));

            // 球体の位置を設定する
            sphere.position.set(controls.spherePosX, controls.spherePosY, controls.spherePosZ);

            // 立方体の位置を設定する
            cube.position.set(controls.cubePosX, controls.cubePosY, controls.cubePosZ);

            // グループ生成処理
            group = new THREE.Group();
            group.add(sphere);
            group.add(cube);

            // シーンにグループを追加する
            scene.add(group);

            // グループの位置を調整する
            controls.positionBoundingBox();

            let arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), group.position, 10, 0x0000ff)

        };

        // 位置調整処理
        this.positionBoundingBox = () => {

            // シーンからメッシュを削除する
            scene.remove(bboxMesh);

            // オブジェクトを生成する
            let box = setFromObject(group);

            // 寸法を設定する
            let width  = box.max.x - box.min.x;
            let height = box.max.y - box.min.y;
            let depth  = box.max.z - box.min.z;

            // ジオメトリを生成する
            let bbox = new THREE.BoxGeometry(width, height, depth);

            // メッシュを生成する
            bboxMesh = new THREE.Mesh(
                bbox,
                new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    vertexColors: THREE.VertexColors,
                    wireframeLinewidth: 2,
                    wireframe: true
                }));

            // メッシュの位置を設定する
            bboxMesh.position.set(
                ((box.min.x + box.max.x) / 2),
                ((box.min.y + box.max.y) / 2),
                ((box.min.z + box.max.z) / 2)
            );

        };

    };

    // ---------------------------------------------------
    // GUI生成処理
    // ---------------------------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // 球体フォルダを生成する
    let sphereFolder = gui.addFolder("sphere");

    // 球体位置X
    sphereFolder.add(controls, "spherePosX", -20, 20).onChange((e) => {
        
        // 球体位置を設定する
        sphere.position.x = e;
        controls.positionBoundingBox();

    });

    // 球体位置Z
    sphereFolder.add(controls, "spherePosZ", -20, 20).onChange((e) => {

        // 球体位置を設定する
        sphere.position.z = e;
        controls.positionBoundingBox();

    });

    // 球体位置Y
    sphereFolder.add(controls, "spherePosY", -20, 20).onChange((e) => {

        // 球体位置を設定する
        sphere.position.y = e;
        controls.positionBoundingBox();

    });

    // 球体スケール
    sphereFolder.add(controls, "sphereScale", 0, 3).onChange((e) => {

        sphere.scale.set(e, e, e);
        controls.positionBoundingBox();

    });

    // 立方体フォルダを設定する
    let cubeFolder = gui.addFolder("cube");

    // 立方体位置X
    cubeFolder.add(controls, "cubePosX", -20, 20).onChange((e) => {

        // 立方体位置を設定する
        cube.position.x = e;
        controls.positionBoundingBox();

    });

    // 立方体位置Z
    cubeFolder.add(controls, "cubePosZ", -20, 20).onChange((e) => {

        // 立方体位置を設定する
        cube.position.z = e;
        controls.positionBoundingBox();

    });

    // 立方体位置Y
    cubeFolder.add(controls, "cubePosY", -20, 20).onChange((e) => {

        // 立方体位置を設定する
        cube.position.y = e;
        controls.positionBoundingBox();

    });

    // 立方体スケール
    cubeFolder.add(controls, "cubeScale", 0, 3).onChange((e) => {

        // 立方体のスケールを設定する
        cube.scale.set(e, e, e);
        controls.positionBoundingBox();

    });

    // グループフォルダを生成する
    let groupFolder = gui.addFolder("group");

    // グループ位置X
    groupFolder.add(controls, "groupPosX", -20, 20).onChange((e) => {

        // グループの位置を設定する
        group.position.x = e;
        controls.positionBoundingBox();

    });

    // グループ位置Z
    groupFolder.add(controls, "groupPosZ", -20, 20).onChange((e) => {

        // グループの位置を設定する
        group.position.z = e;
        controls.positionBoundingBox();

    });

    // グループ位置Y
    groupFolder.add(controls, "groupPosY", -20, 20).onChange((e) => {

        // グループの位置を設定する
        group.position.y = e;
        controls.positionBoundingBox();

    });

    // グループスケール
    groupFolder.add(controls, "groupScale", 0, 3).onChange((e) => {

        // グループスケールを設定する
        group.scale.set(e, e, e);   
        controls.positionBoundingBox();

    });

    gui.add(controls, "grouping");
    gui.add(controls, "rotate");

    // 再描画処理
    controls.redraw();

    // レンダリング処理
    render();

    // ---------------------------------------------------
    // メッシュ生成関数
    // ---------------------------------------------------

    function createMesh(geom) {

        // マテリアルを生成する
        let meshMaterial = new THREE.MeshNormalMaterial();
        meshMaterial.side = THREE.DoubleSide;

        // ワイヤーフレームを生成する
        let wireFrameMat = new THREE.MeshBasicMaterial();
        wireFrameMat.wireframe = true;

        // 平面メッシュを生成する
        let plane = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

        return plane;

    }

    // ---------------------------------------------------
    // レンダリング関数
    // ---------------------------------------------------

    function render() {

        if (controls.grouping && controls.rotate) {
            
            group.rotation.y += step;
        
        }

        if (controls.rotate && !controls.grouping) {
            
            sphere.rotation.y += step;
            cube.rotation.y += step;

        }

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

    // ---------------------------------------------------
    // オブジェクト生成関数
    // ---------------------------------------------------

    function setFromObject(object) {

        // ジオメトリを生成する
        let box = new THREE.Box3();

        // ベクターを生成する
        let v1 = new THREE.Vector3();

        object.updateMatrixWorld(true);

        box.makeEmpty();

        object.traverse((node) => {

            if (node.geometry !== undefined && node.geometry.vertices != undefined) {

                let vertices = node.geometry.vertices;

                for (var i = 0, il = vertices.length; i < il; i++) {

                    v1.copy(vertices[i]);
                    v1.applyMatrix4(node.matrixWorld);

                    box.expandByPoint(v1);

                }

            }
        });

        return box;

    }


}
