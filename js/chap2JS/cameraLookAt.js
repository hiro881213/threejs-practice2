let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeCameraLookAt = () => {
    
    const render = () => {

        step+= 0.02;

        if (camera instanceof THREE.Camera) {
            let x = 10 + ( 100 * (Math.sin(step)));
            camera.lookAt(new THREE.Vector3(x,10,0));

            // 球体メッシュの位置を変更する
            lookAtMesh.position.copy(new THREE.Vector3(x, 10,0));

        }

        requestAnimationFrame(render);
        renderer.render(scene,camera);

    };

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // カメラ位置を生成する
    camera.position.x = 120;
    camera.position.y = 60;
    camera.position.z = 180;

    // レンダラを生成する
    let renderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    renderer.setClearColor(new THREE.Color(0xEEEEEE));

    // レンダラのサイズを設定する
    renderer.setSize(width,height);

    // -------------------------------------
    // 平面生成
    // -------------------------------------
    
    // 平面ジオメトリを生成する
    let planeGeometry = new THREE.PlaneGeometry(180,180);
    
    // 平面マテリアルを生成する
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

    // 平面メッシュを生成する
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // -------------------------------------
    // 平面表示設定処理
    // -------------------------------------
    
    plane.rotation.x = -0.5* Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    // -------------------------------------
    // 立方体生成処理
    // -------------------------------------
    
    // 立方体ジオメトリを生成する
    let cubeGeometry = new THREE.BoxGeometry(4,4,4);
    
    // 立方体マテリアルを生成する
    let cubeMaterial = new THREE.MeshLambertMaterial({color:0x00ee22});
    
    for(let j = 0; j < (planeGeometry.parameters.height/5); j++) {
        for (let i = 0; i < planeGeometry.parameters.width / 5; i++) {
            
            // 立方体のメッシュを生成する
            let cube = new THREE.Mesh(cubeGeometry,cubeMaterial);

            // 立方体の位置設定を行う
            cube.position.z = -((planeGeometry.parameters.height)/2) + 2 + (j * 5); 
            cube.position.x = -((planeGeometry.parameters.width)/2)  + 2 + (i * 5);
            cube.position.y = 2;

            scene.add(cube);
            
        }
    }
    
    // -------------------------------------
    // 球体生成処理
    // -------------------------------------
    
    let lookAtGeom = new THREE.SphereGeometry(2);
    let lookAtMesh = new THREE.Mesh(lookAtGeom, new THREE.MeshLambertMaterial({color: 0xff0000}));
    scene.add(lookAtMesh);

    // -------------------------------------
    // 平行光源生成処理
    // -------------------------------------

    // 平行光を生成する
    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(-20, 40, 60);
    scene.add(directionalLight);

    // -------------------------------------
    // 環境光生成処理
    // -------------------------------------
    
    let ambientLight = new THREE.AmbientLight(0x292929);
    scene.add(ambientLight);

    document.getElementById("CameraLookAt-output").appendChild(renderer.domElement);

    // -------------------------------------
    // コントローラ生成処理
    // -------------------------------------

    let step = 0;

    let controls = new function() {
        this.perspective = "Perspective";
        this.switchCamera = () => {

            // PerspectiveCameraの場合
            if (camera instanceof THREE.PerspectiveCamera) {
                
                camera = new THREE.OrthographicCamera(width / (-16), width / 16, height / 16, height / (-16), -200, 500);
                camera.position.x = 120;
                camera.position.y = 60;
                camera.position.z = 180;

                camera.lookAt(scene.position);
                this.perspective = "Orthographic";

            // OrthographicCameraの場合
            } else {

                camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
                camera.position.x = 120;
                camera.position.y = 60;
                camera.position.z = 180;

                camera.lookAt(scene.position);
                this.perspective = "Perspective";

            }

        };

    };

    // -------------------------------------
    // GUI生成処理
    // -------------------------------------

    let gui = new dat.GUI();
    
    gui.add(controls, 'switchCamera');
    gui.add(controls, 'perspective');

    // レンダリング処理
    render();

};