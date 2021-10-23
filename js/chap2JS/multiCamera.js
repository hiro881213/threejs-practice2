let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeMultiCamera = () => {

    const render = () => {

        requestAnimationFrame(render);
        renderer.render(scene,camera);

    };

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ---------------------------------------
    // カメラ位置設定処理
    // ---------------------------------------

    camera.position.x = 120;
    camera.position.y = 60;
    camera.position.z = 180;

    // ---------------------------------------
    // レンダラ生成処理
    // ---------------------------------------

    // レンダラを生成する
    renderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    renderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    renderer.setSize(width,height);

    // ---------------------------------------
    // 平面生成処理
    // ---------------------------------------

    // ジオメトリを生成する
    let planeGeometry = new THREE.PlaneGeometry(180,180);

    // マテリアルを生成する
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

    // メッシュを生成する
    let plane = new THREE.Mesh(planeGeometry,planeMaterial);

    // ---------------------------------------
    // 平面位置設定処理
    // ---------------------------------------

    // 平面の回転軸を設定する
    plane.rotation.x = -0.5*Math.PI;
    
    // 平面の位置を設定する
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    // ---------------------------------------
    // 立方体生成処理
    // ---------------------------------------

    // 立方体ジオメトリを生成する
    let cubeGeometry = new THREE.BoxGeometry(4,4,4);

    for (let j = 0; j < (planeGeometry.parameters.height/5); j++) {

        for (let i = 0; i < planeGeometry.parameters.width/5; i++) {
            
            let rnd = Math.random() * 0.75 + 0.25;
            
            // マテリアルを生成する
            let cubeMaterial = new THREE.MeshLambertMaterial();

            // マテリアルの色を設定する
            cubeMaterial.color = new THREE.Color(rnd,0,0);

            // メッシュを生成する
            let cube = new THREE.Mesh(cubeGeometry,cubeMaterial);

            // メッシュを位置設定する
            cube.position.z = -((planeGeometry.parameters.height)/2) + 2 + (j * 5);
            cube.position.x = -((planeGeometry.parameters.width)/2)  + 2 + (i * 5);
            cube.position.y = 2; 

            scene.add(cube);

        }

    }

    // ---------------------------------------
    // 直接光生成処理
    // ---------------------------------------

    // 直接光を生成する
    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    
    // 直接光の位置を設定する
    directionalLight.position.set(-20, 40, 60);

    scene.add(directionalLight);

    // ---------------------------------------
    // 環境光生成処理
    // ---------------------------------------

    let ambientLight = new THREE.AmbientLight(0x292929);
    scene.add(ambientLight);

    document.getElementById('MultiCamera-output').appendChild(renderer.domElement);

    // ---------------------------------------
    // コントローラ設定処理
    // ---------------------------------------

    let controls = new function() {
        
        this.perspective = "Perspective";

        this.switchCamera = function () {
            
            // パースペクティブカメラを利用している場合
            if (camera instanceof THREE.PerspectiveCamera) {
                camera = new THREE.OrthographicCamera(width / -16, width / 16, height / 16, height / -16, -200, 500);

                camera.position.x = 120;
                camera.position.y = 60;
                camera.position.z = 180;

                camera.lookAt(scene.position);

                this.perspective = "Orthographic";

            } else {

                camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
                camera.position.x = 120;
                camera.position.y = 60;
                camera.position.z = 180;
                
                camera.lookAt(scene.position);
                this.perspective = "Perspective";
            }

        };

    };

    // ---------------------------------------
    // GUI生成処理
    // ---------------------------------------

    // let gui = new dat.GUI();

    // gui.add(controls, 'switchCamera');
    // gui.add(controls, 'perspective');

    camera.lookAt(scene.position);
    render();

}