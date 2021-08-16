let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeBasicMaterial = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    // ------------------------------------------
    // レンダラ設定処理
    // ------------------------------------------
    
    let webGLRenderer = new THREE.WebGLRenderer();
    
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));
    webGLRenderer.setSize(width,height);
    webGLRenderer.shadowMap.enabled = true;

    let canvasRenderer = new THREE.CanvasRenderer();
    canvasRenderer.setSize(width, height);
    renderer = webGLRenderer;

    // ------------------------------------------
    // 平面生成処理
    // ------------------------------------------

    let groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
    let groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({color: 0x777777}));

    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -20;

    scene.add(groundMesh);

    // ------------------------------------------
    // ジオメトリ生成処理
    // ------------------------------------------

    let sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
    let cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
    let planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

    // ------------------------------------------
    // マテリアル設定処理
    // ------------------------------------------

    let meshMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff});
    let clippingPlane = new THREE.PlaneGeometry(new THREE.Vector3(0, 0, -1));
    meshMaterial.clippingPlanes = [clippingPlane];

    // ------------------------------------------
    // メッシュ生成処理
    // ------------------------------------------

    let sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
    let cube = new THREE.Mesh(cubeGeometry, meshMaterial);
    let plane = new THREE.Mesh(planeGeometry, meshMaterial);

    // ------------------------------------------
    // メッシュ位置設定処理
    // ------------------------------------------

    sphere.position.x = 0;
    sphere.position.y = 3;
    sphere.position.z = 2;

    cube.position.set(0,3,2);
    plane.position.set(0,3,2);

    scene.add(cube);

    camera.position.x = -20;
    camera.position.y = 50;
    camera.position.z = 40;
    camera.lookAt(new THREE.Vector3(10,0,0));

    let ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // ------------------------------------------
    // 点光源生成処理
    // ------------------------------------------

    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    document.getElementById("meshBasicMaterial-output").appendChild(renderer.domElement);

    let step = 0;
    let oldContext = null;

    let controls = new function() {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;

        this.opacity = meshMaterial.opacity;
        this.transparent = meshMaterial.transparent;
        this.overdraw = meshMaterial.overdraw;
        this.visible = meshMaterial.visible;
        this.side = "front";

        this.color = meshMaterial.color.getStyle();

        this.wireframe = meshMaterial.wireframe;
        this.wireframeLinewidth = meshMaterial.wireframeLinewidth;
        this.wireFrameLineJoin = meshMaterial.wireframeLinejoin;

        this.clippingEnabled = false;
        this.clippingPlaneZ = 0;

        this.selectedMesh = "cube";

        this.switchRenderer = function() {

            document.getElementById("meshBasicMaterial-output").removeChild(renderer.domElement);

            if (renderer instanceof THREE.WebGLRenderer ) {

                renderer = canvasRenderer;
                document.getElementById("meshBasicMaterial-output").appendChild(renderer.domElement);

            } else {

                renderer = webGLRenderer;
                document.getElementById("meshBasicMaterial-output").appendChild(renderer.domElement);

            }

        }

    };

    let gui = new dat.GUI();

    let spGui = gui.addFolder("Mesh");
    
    spGui.add(controls, 'opacity', 0, 1).onChange(function(e) {
        meshMaterial.opacity = e;
    });

    spGui.add(controls, 'transparent').onChange(function(e) {
        meshMaterial.transparent = e;
    });

    spGui.add(controls, 'wireframe').onChange(function(e) {
        meshMaterial.wireframe = e;
    });

    spGui.add(controls, 'wireframeLinewidth', 0, 20).onChange(function (e) {
        meshMaterial.wireframeLinewidth = e
    });

    spGui.add(controls, 'visible').onChange(function(e) {
        meshMaterial.visible = e;
    });

    spGui.add(controls, 'side', ["front", "back", "double"]).onChange(function(e) {

        switch (e) {
            case "front" :
                meshMaterial.side = THREE.FrontSide;
                break;
            
            case "back" :
                meshMaterial.side = THREE.BackSide;
                break;
            
            case "double" : 
                meshMaterial.side = THREE.DoubleSide;
                break;
        }

        meshMaterial.needsUpdate = true;

    });

    spGui.addColor(controls, 'color').onChange(function(e) {
        meshMaterial.color.setStyle(e)
    });

    spGui.add(controls, 'clippingEnabled').onChange(function(e) {
        webGLRenderer.localClippingEnabled = e;
    });

    spGui.add(controls, 'clippingPlaneZ', -5.0, 5.0).onChange(function(e) {
        meshMaterial.clippingPlanes[0].constant = e;
    });

    spGui.add(controls, 'selectedMesh', ["cube", "sphere", "plane"]).onChange(function(e) {

        scene.remove(plane);
        scene.remove(cube);
        scene.remove(sphere);

        switch (e) {
            case "cube" :
                scene.add(cube);
                break;
            
            case "sphere" :
                scene.add(sphere);
                break;

            case "plane" :
                scene.add(plane);
                break;

        }

        scene.add(e);

    });

    gui.add(controls, 'switchRenderer');
    
    let cvGui = gui.addFolder("Canvas renderer");
    
    cvGui.add(controls, 'overdraw').onChange(function(e) {
        meshMaterial.overdraw = e;
    });

    cvGui.add(controls, 'wireFrameLineJoin', ['round', 'bevel', 'miter']).onChange(function(e) {
        meshMaterial.wireframeLinejoin = e;
    });

    const render = () => {

        cube.rotation.y = step += 0.01;
        plane.rotation.y = step;
        sphere.rotation.y = step;

        requestAnimationFrame(render);
        renderer.render(scene, camera);

    }

    render();

}