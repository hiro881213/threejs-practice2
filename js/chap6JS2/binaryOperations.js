let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const makeBinaryOperations = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ----------------------------------
    // レンダラ生成処理
    // ----------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0x999999));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを設定する
    webGLRenderer.shadowMap.enabled = true;

    // ----------------------------------
    // メッシュ生成処理
    // ----------------------------------

    // メッシュを生成する
    let sphere1 = createMesh(new THREE.SphereGeometry(5, 20, 30));
    sphere1.position.x = -2;

    let sphere2 = createMesh(new THREE.SphereGeometry(5, 20, 30));
    sphere2.position.set(3, 0, 0);

    let cube = createMesh(new THREE.BoxGeometry(5, 5, 5));
    cube.position.x = -7;

    let result;

    // シーンにメッシュを追加する
    scene.add(sphere1);
    scene.add(sphere2);
    scene.add(cube);

    // ----------------------------------
    // カメラ設定処理
    // ----------------------------------

    // カメラの位置を設定する
    camera.position.set(0, 20, 20);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("binaryOperations-output").appendChild(webGLRenderer.domElement);

    // ----------------------------------
    // コントローラ生成処理
    // ----------------------------------

    let step = 0;

    // コントローラを生成する
    let controls = new function() {

        // 位置を設定する
        this.sphere1PosX = sphere1.position.x;
        this.sphere1PosY = sphere1.position.y;
        this.sphere1PosZ = sphere1.position.z;

        // スケールを設定する
        this.sphere1Scale = 1;

        // 位置を設定する
        this.sphere2PosX = sphere2.position.x;
        this.sphere2PosY = sphere2.position.y;
        this.sphere2PosZ = sphere2.position.z;

        // スケールを設定する
        this.sphere2Scale = 1;

        // 位置を設定する
        this.cubePosX = cube.position.x;
        this.cubePosY = cube.position.y;
        this.cubePosZ = cube.position.z;

        // スケールを設定する
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;

        // actionCube
        this.actionCube = "subtract";

        // actionSphere
        this.actionSphere = "subtract";

        this.showResult = () => {
            redrawResult();
        };

        this.hideWireframes = false;
        this.rotationResult = false;

    };

    // ----------------------------------
    // GUI生成処理
    // ----------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // sphere1用GUI
    let guiSphere1 = gui.addFolder("Sphere1");

    guiSphere1.add(controls, 'sphere1PosX', -15, 15).onChange(() => {
        sphere1.position.set(controls.sphere1PosX, controls.sphere1PosY,controls.sphere1PosZ);
    });

    guiSphere1.add(controls, 'sphere1PosY', -15, 15).onChange(() => {
        sphere1.position.set(controls.sphere1PosX, controls.sphere1PosY, controls.sphere1PosZ);
    });

    guiSphere1.add(controls, 'sphere1PosZ', -15, 15).onChange(() => {
        sphere1.position.set(controls.sphere1PosX, controls.sphere1PosY, controls.sphere1PosZ);
    });

    guiSphere1.add(controls, 'sphere1Scale', 0, 10).onChange((e) => {
        sphere1.scale.set(e, e, e);
    });

    // sphere2用GUI
    let guiSphere2 = gui.addFolder("Sphere2");

    guiSphere2.add(controls, "sphere2PosX", -15, 15).onChange(() => {
        sphere2.position.set(controls.sphere2PosX, controls.sphere2PosY, controls.sphere2PosZ);
    });

    guiSphere2.add(controls, "sphere2PosY", -15, 15).onChange(() => {
        sphere2.position.set(controls.sphere2PosX, controls.sphere2PosY, controls.sphere2PosZ);
    });

    guiSphere2.add(controls,"sphere2PosZ", -15, 15).onChange(() => {
        sphere2.position.set(controls.sphere2PosX, controls.sphere2PosY, controls.sphere2PosZ);
    });

    guiSphere2.add(controls, "sphere2Scale", 0, 10).onChange((e) => {
        sphere2.scale.set(e, e, e);
    });

    guiSphere2.add(controls, "actionSphere", ["subtract", "intersect", "union", "none"]);

    // Cube
    let guiCube = gui.addFolder("cube");

    guiCube.add(controls, "cubePosX", -15, 15).onChange(() => {
        cube.position.set(controls.cubePosX, controls.cubePosY, controls.cubePosZ);
    });

    guiCube.add(controls, "cubePosY", -15, 15).onChange(() => {
        cube.position.set(controls.cubePosX, controls.cubePosY, controls.cubePosZ);
    });

    guiCube.add(controls, "cubePosZ", -15, 15).onChange(() => {
        cube.position.set(controls.cubePosX, controls.cubePosY, controls.cubePosZ);
    });

    guiCube.add(controls, "scaleX", 0, 10).onChange((e) => {
        cube.scale.x = e;
    });

    guiCube.add(controls, "scaleY", 0, 10).onChange((e) => {
        cube.scale.y = e;
    });

    guiCube.add(controls, "scaleZ", 0, 10).onChange((e) => {
        cube.scale.z = e;
    });

    guiCube.add(controls, "actionCube", ["subtract", "intersect", "union", "none"]);

    gui.add(controls, "showResult");

    gui.add(controls, "rotationResult");

    gui.add(controls, "hideWireframes").onChange(() => {
        
        if (controls.hideWireframes) {

            sphere1.material.visible = false;
            sphere2.material.visible = false;
            cube.material.visible = false;
        
        } else {

            sphere1.material.visible = true;
            sphere2.material.visible = true;
            cube.material.visible = true;

        }
    });

    // レンダリング処理を実行する
    render();

    // ----------------------------------
    // 描画関数
    // ----------------------------------

    let spinner;

    function redrawResult() {

        showSpinner();

        setTimeout(() => {

            // シーンからメッシュを削除する
            scene.remove(result);

            let sphere1BSP = new ThreeBSP(sphere1);
            let sphere2BSP = new ThreeBSP(sphere2);
            let cube2BSP = new ThreeBSP(cube);

            let resultBSP;

            switch(controls.actionSphere) {

                case "subtract":
                    resultBSP = sphere1BSP.subtract(sphere2BSP);
                    break;
                
                case "intersect":
                    resultBSP = sphere1BSP.intersect(sphere2BSP);
                    break;
                
                case "union":
                    resultBSP = sphere1BSP.union(sphere2BSP);
                    break;

                case "none":

            }

            if (!resultBSP) resultBSP = sphere1BSP;

            switch ( controls.actionCube ) {

                case "subtract":
                    resultBSP = resultBSP.subtract(cube2BSP);
                    break;

                case "intersect":
                    resultBSP = resultBSP.intersect(cube2BSP);
                    break;

                case "union":
                    resultBSP = resultBSP.union(cube2BSP);
                    break;
                
                case "none":

            }

            if (controls.actionCube === "none" && controls.actionSphere === "none") {

            } else {

                result = resultBSP.toMesh();
                result.geometry.computeFaceNormals();
                result.geometry.computeVertexNormals();

                // シーンにメッシュを追加する
                scene.add(result);

            }

            hideSpinner(spinner);

        }, 200);

    }

    // ----------------------------------
    // メッシュ生成関数
    // ----------------------------------

    function createMesh(geom) {

        // マテリアルを生成する
        let meshMaterial = new THREE.MeshNormalMaterial();
        meshMaterial.side = THREE.DoubleSide;

        // ワイヤフレームを生成する
        let wireFrameMat = new THREE.MeshBasicMaterial({opacity: 0.5, wireframeLinewidth: 0.5});
        wireFrameMat.wireframe = true;

        // メッシュを生成する
        let mesh = new THREE.Mesh(geom, wireFrameMat);

        return mesh;

    }

    // ----------------------------------
    // showSpinner関数
    // ----------------------------------

    function showSpinner() {
     
        // オプションを定義する
        let opts = {
            lines: 13,
            length: 20,
            width: 10,
            radius: 30,
            corners: 1,
            rotate: 0,
            direction: 1,
            color: '#000',
            speed: 1,
            trail: 60,
            shadow: false,
            hwaccel: false,
            className: 'spinner',
            zIndex: 2e9,
            top: '50%',
            left: '50%'
        };

        // ターゲットを設定する
        let target = document.getElementById('binaryOperations-output');
        spinner = new Spinner(opts).spin(target);

        return spinner;

    }

    // ----------------------------------
    // hideSpinner関数
    // ----------------------------------

    function hideSpinner(spinner) {
        spinner.stop();
    }

    // ----------------------------------
    // レンダリング関数
    // ----------------------------------
    
    function render() {

        if (controls.rotateResult && result) {

            // メッシュを回転させる
            result.rotation.y += 0.04;
            result.rotation.z -= 0.005;

        }

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

};
