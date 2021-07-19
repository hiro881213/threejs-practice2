let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

/**
 * プロップメッシュ生成処理
 */
export const makePropMesh = () => {
    
    const render = () => {
        
        cube.visible = controls.visible;

        // 回転軸を設定する
        cube.rotation.x = controls.rotationX;
        cube.rotation.y = controls.rotationY;
        cube.rotation.z = controls.rotationZ;

        cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);

        requestAnimationFrame(render);
        renderer.render(scene,camera);

    };

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // レンダラを生成する
    renderer = new THREE.WebGLRenderer();

    // ------------------------------------
    // レンダラパラメータ設定
    // ------------------------------------

    // 背景色を設定する
    renderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    renderer.setSize(width, height);

    // シャドウを許可する
    renderer.shadowMap.enabled = true;

    // ------------------------------------
    // 平面生成処理
    // ------------------------------------

    // ジオメトリを生成する
    let planeGeometry = new THREE.PlaneGeometry(60,40,1,1);
    
    // マテリアルを生成する
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

    // メッシュを生成する
    let plane = new THREE.Mesh(planeGeometry,planeMaterial);

    // 平面の影を許可する
    plane.receiveShadow = true;

    // ------------------------------------
    // 平面位置設定処理
    // ------------------------------------

    // 回転処理
    plane.rotation.x = -0.5* Math.PI;
    
    // 位置設定処理
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    // ------------------------------------
    // カメラ位置設定処理
    // ------------------------------------

    // 位置設定処理
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;

    camera.lookAt(scene.position);

    // ------------------------------------
    // ライト生成処理
    // ------------------------------------

    // ライトを生成する
    let ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // 点光源を生成する
    const spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置設定処理
    spotLight.position.set(-20,30,10);

    // 影を許可する
    spotLight.castShadow = true;
    scene.add(spotLight);

    // グラフィックを描画する
    document.getElementById("MeshProp-output").appendChild(renderer.domElement);

    // ------------------------------------
    // コントローラ設定処理
    // ------------------------------------

    let controls = new function() {
        
        // スケールを初期化する
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;

        // 位置を初期化する
        this.positionX = 0;
        this.positionY = 4;
        this.positionZ = 0;

        // 回転軸を初期化する
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.scale = 1;

        // 透明度を初期化する
        this.translateX = 0;
        this.translateY = 0;
        this.translateZ = 0;

        this.visible = true;

        // 変形用関数を生成する
        this.translate = function() {

            cube.translateX(controls.translateX);
            cube.translateY(controls.translateY);
            cube.translateZ(controls.translateZ);

            controls.positionX = cube.position.x;
            controls.positionY = cube.position.y;
            controls.positionZ = cube.position.z;

        }

    }

    // ----------------------------------------------
    // 立方体生成処理
    // ----------------------------------------------

    // マテリアルを生成する
    let material = new THREE.MeshLambertMaterial({color: 0x44ff44});

    // ジオメトリを生成する
    let geom = new THREE.BoxGeometry(5,8,3);

    // メッシュを生成する
    let cube = new THREE.Mesh(geom,material);

    // 立方体の位置を設定する
    cube.position.y = 4;

    // 立方体の影を設定する
    cube.castShadow = true;
    scene.add(cube);

    // ----------------------------------------------
    // GUI設定処理
    // ----------------------------------------------

    // let gui = new dat.GUI();

    // // GUIにscaleを追加する
    // let guiScale = gui.addFolder('scale');
    // guiScale.add(controls, 'scaleX', 0, 5);
    // guiScale.add(controls, 'scaleY', 0, 5);
    // guiScale.add(controls, 'scaleZ', 0, 5);

    // // GUIにpositionを追加する
    // let guiPosition = gui.addFolder('position');
    // let contX = guiPosition.add(controls, 'positionX', -10, 10);
    // let contY = guiPosition.add(controls, 'positionY', -4,  20);
    // let contZ = guiPosition.add(controls, 'positionZ', -10, 10);

    // // contXを変更時の処理を定義する
    // contX.listen();
    // contX.onChange(function(value){
    //     cube.position.x = controls.positionX;
    // });

    // // contYを変更時の処理を定義する
    // contY.listen();
    // contY.onChange(function(value) {
    //     cube.position.y = controls.positionY;
    // });

    // // contZを変更時の処理を定義する
    // contZ.listen();
    // contZ.onChange(function() {
    //     cube.position.z = controls.positionZ;
    // });

    // // GUIにrotationを追加する
    // let guiRotation = gui.addFolder('rotation');

    // guiRotation.add(controls, 'rotationX', -4, 4);
    // guiRotation.add(controls, 'rotationY', -4, 4);
    // guiRotation.add(controls, 'rotationZ', -4, 4);

    // // GUIにtranslateを追加する
    // let guiTranslate = gui.addFolder('translate')

    // guiTranslate.add(controls, 'translateX', -10, 10);
    // guiTranslate.add(controls, 'translateY', -10, 10);
    // guiTranslate.add(controls, 'translateZ', -10, 10);
    // guiTranslate.add(controls, 'translate');

    // gui.add(controls,'visible');

    render();

};