let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeDepthMaterial = () => {

    // ---------------------------------------
    // シーン生成処理
    // ---------------------------------------

    scene = new THREE.Scene();
    scene.overrideMaterial = new THREE.MeshDepthMaterial();

    // ---------------------------------------
    // カメラ生成処理
    // ---------------------------------------

    camera = new THREE.PerspectiveCamera(45, width / height, 30, 170);

    // ---------------------------------------
    // レンダラ生成処理
    // ---------------------------------------

    renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    camera.position.x = -50;
    camera.position.y = 40;
    camera.position.z = 50;
    camera.lookAt(scene.position);

    document.getElementById('depthMaterial-output').appendChild(renderer.domElement);

    let step = 0;

    let controls = new function() {
        
        this.cameraNear = camera.near;
        this.cameraFar = camera.far;
        
        this.rotationSpeed = 0.02;
        
        this.numberOfObjects = scene.children.length;
    
        this.removeCube = function() {
            let allChildren = scene.children;
            let lastObject = allChildren[allChildren.length - 1];

            if (lastObject instanceof THREE.Mesh) {
                scene.remove(lastObject);
                this.numberOfObjects = scene.children.length;
            }
        };

        this.addCube = function() {

            let cubeSize = Math.ceil(3 + (Math.random() * 3));
            let cubeGeometry = new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize);

            let cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
            cubeMaterial = new THREE.MeshDepthMaterial();

            let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;

            cube.position.x = -60 + Math.round((Math.random() * 100));
            cube.position.y = Math.round((Math.random() * 10));
            cube.position.z = -100 + Math.round((Math.random() * 150));

            scene.add(cube);
            this.numberOfObjects = scene.children.length;

        };

        this.outputObjects = function() {
            console.log(scene.children);
        }

    };

    // let gui = new dat.GUI();

    // gui.add(controls, 'rotationSpeed', 0, 0.5);
    // gui.add(controls, 'addCube');
    // gui.add(controls, 'removeCube');
    // gui.add(controls, 'cameraNear', 0, 50).onChange(function(e) {
    //     camera.near = e;
    //     camera.updateProjectionMatrix();
    // });

    // gui.add(controls, 'cameraFar', 100, 300).onChange(function(e) {
    //     camera.far = e;
    //     camera.updateProjectionMatrix();
    // });

    let i = 0;
    
    while ( i < 10 ) {
        controls.addCube();
        i++;
    }

    const render = () => {
        scene.traverse(function(e) {
            if (e instanceof THREE.Mesh) {

                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;

            }
        });

        requestAnimationFrame(render);
        renderer.render(scene, camera);

    }


    render();

};