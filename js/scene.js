let stats;
let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

/**
 * シーン３D生成処理
 */
export const makeScene = () => {
    /**
     * シーン設定処理
     */
    const initStats = () => {
        let stats = new Stats();
        document.getElementById('Scene-stats').appendChild(stats.domElement);
        return stats;
    };

    /**
     * レンダラ設定
     */
    const render = () => {
        stats.update();

        // 立方体の回転処理
        scene.traverse(function(obj) {
            
            if (obj instanceof THREE.Mesh && obj != plane) {

                obj.rotation.x += controls.rotationSpeed;
                obj.rotation.y += controls.rotationSpeed;
                obj.rotation.z += controls.rotationSpeed;

            }

        });

        requestAnimationFrame(render);
        renderer.render(scene, camera);

    };

    // フレームレートを表示する
    stats = initStats();

    // シーンを初期化する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    scene.add(camera)

    // レンダラを生成する
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(width,height);
    renderer.shadowMap.enabled = true;

    // 平面を生成する
    const planeGeometry = new THREE.PlaneGeometry(60,40,1,1);
    const planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    const plane = new THREE.Mesh(planeGeometry,planeMaterial);
    plane.receiveShadow = true;

    // 平面の位置設定
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    // カメラの位置設定
    camera.position.x = -30;
    camera.position.y =  40;
    camera.position.z =  30
    camera.lookAt(scene.position);

    // 環境光設定
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // 点光源設定
    const spotLight = new THREE.SpotLight(0xfffffff);
    spotLight.position.set(-20,30,-5)
    spotLight.castShadow = true;
    scene.add(spotLight);

    document.getElementById('Scene-output').appendChild(renderer.domElement);

    let step =0;

    const controls = new function() {

        this.rotationSpeed = 0.02;
        this.numberOfObjects = scene.children.length;

        // cube削除処理
        this.removeCube = function() {
            const allChildren = scene.children;
            const lastObject = allChildren[allChildren.length - 1];

            if (lastObject instanceof THREE.Mesh) {
                scene.remove(lastObject);
                this.numberOfObjects = scene.children.length;
            }

        };

        // Cube追加処理
        this.addCube = function () {

            var cubeSize = Math.ceil((Math.random() * 3));
            var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            var cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;
            cube.name = "cube-" + scene.children.length;

            // position the cube randomly in the scene
            cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
            cube.position.y = Math.round((Math.random() * 5));
            cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

            // add the cube to the scene
            scene.add(cube);
            this.numberOfObjects = scene.children.length;
        };


        this.outputObjects = function() {
            console.log(scene.children);
        }

    };

    const gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0,0.5);
    gui.add(controls, 'addCube');
    gui.add(controls, 'removeCube');
    gui.add(controls, 'outputObjects');
    gui.add(controls, 'numberOfObjects').listen();

    render();

};