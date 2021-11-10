let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeSelectingObject = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ---------------------------------
    // レンダラ生成処理
    // ---------------------------------

    // レンダラを生成する
    let renderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    renderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    renderer.setSize(width, height);

    // ---------------------------------
    // マウス操作処理
    // ---------------------------------

    //　プロジェクターを生成する
    let projector = new THREE.Projector();

    // マウスダウンイベントを設定する
    document.addEventListener('mousedown', onDocumentMouseDown, false);

    // マウスムーブイベントを設定する
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    // ---------------------------------
    // 平面メッシュ生成処理
    // ---------------------------------

    // 平面ジオメトリを生成する
    let planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);

    // 平面マテリアルを生成する
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

    // 平面メッシュを生成する
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // 平面を回転させる
    plane.rotation.x = -0.5 * Math.PI;

    // 平面の位置を設定する
    plane.position.set(15, 0, 0);

    // シーンに平面を追加する
    scene.add(plane);

    // ---------------------------------
    // 立方体メッシュ生成処理
    // ---------------------------------

    // 立方体ジオメトリを生成する
    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);

    // 立方体マテリアルを生成する
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});

    // 立方体メッシュを生成する
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // 立方体の位置を設定する
    cube.position.set(-9, 3, 0);

    // シーンに立方体を追加する
    scene.add(cube);

    // ---------------------------------
    // 球体メッシュ生成処理
    // ---------------------------------

    // 球体ジオメトリを生成する
    let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);

    // 球体マテリアルを生成する
    let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});

    // 球体メッシュを生成する
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // 球体の位置を設定する
    sphere.position.set(20, 0, 2);

    // シーンに球体を追加する
    scene.add(sphere);

    // ---------------------------------
    // シリンダーメッシュ生成処理
    // ---------------------------------

    // シリンダージオメトリを生成する
    let cylinderGeometry = new THREE.CylinderGeometry(2, 2, 20);

    // シリンダーマテリアルを生成する
    let cylinderMaterial = new THREE.MeshLambertMaterial({color: 0x77ff77});

    // シリンダーメッシュを生成する
    let cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

    // シリンダーメッシュの位置を設定する
    cylinder.position.set(0, 0, 1);

    // シーンにシリンダーを追加する
    scene.add(cylinder);

    // ---------------------------------
    // カメラ設定処理
    // ---------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 30);

    // カメラの方向を設定する
    camera.lookAt(scene.position);

    // ---------------------------------
    // 環境光生成処理
    // ---------------------------------

    // 環境光を生成する
    let ambientLight = new THREE.AmbientLight(0x0c0c0c);

    // シーンに環境光を追加する
    scene.add(ambientLight);

    // ---------------------------------
    // 点光源生成処理
    // ---------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(-40, 60, -10);

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("selectingObject-output").appendChild(renderer.domElement);

    // ---------------------------------
    // コントローラ生成処理
    // ---------------------------------
    
    let step = 0;

    let scalingStep = 0;

    // コントローラを生成する
    let controls = new function() {

        // 回転スピード
        this.rotationSpeed = 0.02;

        // 跳ね返りスピード
        this.bouncingSpeed = 0.03;

        // スケーリングスピード
        this.scalingSpeed = 0.03;

        // showRay
        this.showRay = false;

    }

    // ---------------------------------
    // GUI生成処理
    // ---------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // 回転スピード
    gui.add(controls, 'rotationSpeed', 0, 0.5);

    // 跳ね返りスピード
    gui.add(controls, 'bouncingSpeed', 0, 0.5);

    // スケーリングスピード
    gui.add(controls, 'scalingSpeed', 0, 0.5);

    // showRay
    gui.add(controls, 'showRay').onChange((e) => {
        if (tube) scene.remove(tube);
    });

    // レンダリング処理を実行する
    render();

    // ---------------------------------
    // レンダリング関数
    // ---------------------------------

    function render() {
        
        // 立方体を回転させる
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // 球体アニメーション
        step += controls.bouncingSpeed;

        // 球体の位置を設定する
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + ( 10* Math.abs(Math.sin(step)));

        // シリンダー設定処理
        scalingStep += controls.scalingSpeed;

        let scaleX = Math.abs(Math.sin(scalingStep/4));
        let scaleY = Math.abs(Math.cos(scalingStep/5));
        let scaleZ = Math.abs(Math.sin(scalingStep/7));

        // シリンダーのスケールを設定する
        cylinder.scale.set(scaleX, scaleY, scaleZ);

        // アニメーションを生成する
        renderer.render(scene, camera);
        requestAnimationFrame(render);

    };

    // ---------------------------------
    // マウスダウン関数
    // ---------------------------------

    let tube;

    function onDocumentMouseDown(event) {

        let vector = new THREE.Vector3(
            (event.clientX/width)*2 - 2,
            -(event.clientY/height)*2 + 1,
            0.5
        );

        vector = vector.unproject(camera);

        let raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

        let intersects = raycaster.intersectObjects([sphere, cylinder, cube]);

        if (intersects.length > 0) {

            intersects[0].object.material.transparent = true;
            intersects[0].object.material.opacity = 0.1;

        }

    }

    // ---------------------------------
    // マウスムーブ関数
    // ---------------------------------

    function onDocumentMouseMove(event) {

        let vector = new THREE.Vector3(
            (event.clientX/width) * 2 -1,
            -(event.clientY/height) * 2 + 1,
            0.5);

        vector = vector.unproject(camera);

        let raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

        let intersects = raycaster.intersectObjects([sphere, cylinder, cube]);

        if (intersects.length > 0) {

            let points = [];
            points.push(new THREE.Vector3(-30, 39.8, 30));
            points.push(intersects[0].point);

            // マテリアルを生成する
            let mat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.6});
            
            // tubeジオメトリを生成する
            let tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 60, 0.001);

            if (tube) scene.remove(tube);
            
            if (controls.showRay) {
                
                // tubeメッシュを生成する
                tube = new THREE.Mesh(tubeGeometry, mat);
                
                // シーンにtubeメッシュを追加する
                scene.add(tube);

            }

        }

    };

};
