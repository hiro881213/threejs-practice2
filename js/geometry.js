let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeGeometry = () => {

    const initStats = () => {
        let stats = new Stats();

        stats.setMode(0);
        document.getElementById("Geometry-stats").appendChild(stats.domElement);

        return stats;

    };


    /**
     * 
     * ジオメトリ生成処理
     * 
     * @param {} scene 
     */
    const addGeometries = (scene) => {

        // ジオメトリリストを生成する
        let geoms = [];

        // 円柱
        geoms.push(new THREE.CylinderGeometry(1,4,4));

        // 立方体
        geoms.push(new THREE.BoxGeometry(2,2,2));

        // 球体
        geoms.push(new THREE.SphereGeometry(2));

        //
        geoms.push(new THREE.IcosahedronGeometry(4))

        const points =[
            new THREE.Vector3( 2, 2, 2),
            new THREE.Vector3( 2, 2,-2),
            new THREE.Vector3(-2, 2,-2),
            new THREE.Vector3(-2, 2, 2),
            new THREE.Vector3( 2,-2, 2),
            new THREE.Vector3( 2,-2,-2),
            new THREE.Vector3(-2,-2,-2),
            new THREE.Vector3(-2,-2, 2)
        ];

        geoms.push(new THREE.ConvexGeometry(points));

        let pts = [];
        const detail = 0.1;
        const radius = 3;

        for (var angle = 0.0; angle < Math.PI; angle += detail)
                pts.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));

        geoms.push(new THREE.LatheGeometry(pts, 12));

        // 正八面体
        geoms.push(new THREE.OctahedronGeometry(3));

        // パラメタリック曲面を作成する
        geoms.push(new THREE.ParametricGeometry(THREE.ParametricGeometries.mobius3d,20,10));

        // 正四面体を作成する
        geoms.push(new THREE.TetrahedronGeometry(3));

        // トーラスを作成する
        geoms.push(new THREE.TorusKnotGeometry(3,1,10,10));
        
        geoms.push(new THREE.TorusKnotGeometry(3,0.5,50,20));

        let j = 0;

        for (let i = 0; i < geoms.length; i++) {
            const cubeMaterial = new THREE.MeshLambertMaterial({wireframe: true,color: Math.random()* 0xffffff});

            const materials =[
                new THREE.MeshPhongMaterial({color: Math.random()*0xffffff, shading: THREE.FlatShading}),
                new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
            ];

            let mesh = THREE.SceneUtils.createMultiMaterialObject(geoms[i],materials);
            
            // traverse
            // メッシュの内部一つ一つに関数を設定できる
            mesh.traverse(function (e) {
                e.castShadow = true
            });

            mesh.position.x = -24 + ((i%4)* 12);
            mesh.position.y = 4;
            mesh.position.z = -8 + ( j * 12);

            if ((i + 1) % 4 == 0) j++;
            scene.add(mesh);
        }

    };

    /**
     * レンダリング処理
     */
    const render = () => {
        stats.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };

    let stats = initStats();

    // シーン生成処理
    scene = new THREE.Scene();

    // カメラ生成処理
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    // レンダラ生成処理
    renderer = new THREE.WebGLRenderer();

    // レンダラ設定
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    // 平面作成
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
    camera.position.x = -50;
    camera.position.y = 30;
    camera.position.z = 20;

    camera.lookAt(new THREE.Vector3(-10,0,0));

    // 環境光生成処理
    const ambientLight = new THREE.AmbientLight(0x090909);

    scene.add(ambientLight);

    // スポットライト生成処理
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-25,25,32);
    spotLight.castShadow = true;

    scene.add(spotLight);
    
    // ジオメトリ生成処理
    addGeometries(scene);

    document.getElementById('Geometry-output').appendChild(renderer.domElement);

    let step = 0;

    // レンダリング処理
    render();

};