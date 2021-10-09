let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeCombinedMaterial = () => {
    
    // --------------------------------
    // シーン生成処理
    // --------------------------------

    scene = new THREE.Scene();

    // --------------------------------
    // カメラ生成処理
    // --------------------------------

    camera = new THREE.PerspectiveCamera(45, width / height, 30);

    // --------------------------------
    // レンダラ生成処理
    // --------------------------------

    renderer = new THREE.WebGLRenderer();

    // --------------------------------
    // レンダラ設定処理
    // --------------------------------

    renderer.sortObjects = false;

    renderer.setClearColor(new THREE.Color(0x00000));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    // --------------------------------
    // カメラ設定処理
    // --------------------------------

    camera.position.x = -50;
    camera.position.y = 40;
    camera.position.z = 50;

    camera.lookAt(scene.position);

    // 画面描画処理
    document.getElementById("combinedMaterial-output").appendChild(renderer.domElement);

    let step = 0;

    // --------------------------------
    // コントローラ設定処理
    // --------------------------------

    let controls = new function() {

        this.cameraNear = camera.near;
        this.cameraFar = camera.far;
        this.rotationSpeed = 0.02;
        
        // オブジェクト数
        this.numberOfObjects = scene.children.length;

        // カラー
        this.color = 0x00ff00;

        // --------------------------------
        // 立方体削除処理
        // --------------------------------

        this.removeCube = function () {

            // シーン内のオブジェクトを取得する
            let allChildren = scene.children;
            
            // 最後のオブジェクトを取得する
            let lastObject = allChildren[allChildren.length - 1];

            // 最終オブジェクトがTHREEJSオブジェクトの場合
            if ( lastObject instanceof THREE.Group ) {
                scene.remove(lastObject);
                this.numberOfObjects = scene.children.length;
            }

        };

        // --------------------------------
        // 立方体追加処理
        // --------------------------------

        this.addCube = function() {

            // 立方体サイズを設定する
            let cubeSize = Math.ceil(3 + (Math.random() * 3));
            
            // 立方体ジオメトリを生成する
            let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

            // 立方体マテリアルを生成する
            let cubeMaterial = new THREE.MeshDepthMaterial();
            
            let colorMaterial = new THREE.MeshBasicMaterial({
                color: controls.color,
                transparent: true,
                blending: THREE.MultiplyBlending
            });

            // メッシュを生成する
            let cube = new THREE.SceneUtils.createMultiMaterialObject(cubeGeometry, [colorMaterial, cubeMaterial]);
            cube.children[1].scale.set(0.99, 0.99, 0.99);
            cube.castShadow = true;

            // 立方体位置を設定する
            cube.position.x = -60 + Math.round((Math.random() * 100));
            cube.position.y = Math.round((Math.random() * 10));
            cube.position.z = -100 + Math.round((Math.random() * 150));

            // シーンに立方体を追加する
            scene.add(cube);

            // オブジェクト数を更新する
            this.numberOfObjects = scene.children.length;

        };

        this.outputObjects = function() {
            console.log(scene.children);
        }
    };        
    
    // --------------------------------
    // GUI設定処理
    // --------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    gui.addColor(controls, 'color');
    
    // 立方体回転速度GUI
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    
    // 立方体追加GUI
    gui.add(controls, 'addCube');
    
    // 立方体削除GUI
    gui.add(controls, 'removeCube');
    
    // カメラNear用GUI
    gui.add(controls, 'cameraNear', 0, 50).onChange(function(e) {
        camera.near = e;

        // カメラを更新する
        camera.updateProjectionMatrix();
    });

    // カメラFar用GUI
    gui.add(controls, 'cameraFar', 100, 300).onChange(function(e) {
        camera.near = e;
        camera.updateProjectionMatrix();
    });

    let i = 0;

    // 立方体を作成する
    while (i < 10) {
        controls.addCube();
        i++;
    }

    // --------------------------------
    // レンダラ処理
    // --------------------------------

    function render () {

        scene.traverse(function(e) {
            
            // メッシュの場合
            if (e instanceof THREE.Mesh ) {
                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }

        });

        requestAnimationFrame(render);
        renderer.render(scene, camera);

    };

    render();

}