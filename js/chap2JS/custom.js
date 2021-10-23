let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;


/**
 * カスタムジオメトリ生成関数
 */
export const makeCustomGeometry = () => {
    function addCube() {}
    /**
     * レンダラ処理
     */
    const render = () => {
        mesh.children.forEach(function(e) {
            for (let i = 0; i < 8; i++) {
                e.geometry.vertices[i].set(controlPoints[i].x, controlPoints[i].y, controlPoints[i].z);
                // e.geometry.vertices[i].set(controlPoints[i].x, controlPoints[i].y, controlPoints[i].z);
            }


            // ジオメトリの更新するよう指定する
            e.geometry.verticesNeedUpdate = true;

            // ジオメトリの法線ベクトルを算出する
            // →ライティングに利用される
            e.geometry.computeFaceNormals();

        });

        requestAnimationFrame(render);
        renderer.render(scene,camera);

    }

    // シーン生成処理
    scene = new THREE.Scene();

    // カメラ生成処理
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // レンダラ生成処理
    renderer = new THREE.WebGLRenderer();

    // レンダラ設定処理
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(width,height);
    renderer.shadowMap.enabled = true;

    // 平面生成処理
    const planeGeometry = new THREE.PlaneGeometry(60,40,1,1);
    const planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

    let plane = new THREE.Mesh(planeGeometry,planeMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5*Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    // カメラの位置設定処理
    camera.position.x = -20;
    camera.position.y = 25;
    camera.position.z = 20;

    // Vector3
    //  三次元ベクトルを表す。
    camera.lookAt(new THREE.Vector3(5,0,0));

    // スポットライト生成処理
    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-20,30,5);
    spotLight.castShadow = true;

    scene.add(spotLight);

    document.getElementById("Custom-output").appendChild(renderer.domElement);

    // 頂点を定義する
    const vertices = [
        new THREE.Vector3(1,3,1),
        new THREE.Vector3(1,3,-1),
        new THREE.Vector3(1,-1,1),
        new THREE.Vector3(1,-1,-1),
        new THREE.Vector3(-1,3,-1),
        new THREE.Vector3(-1,3,1),
        new THREE.Vector3(-1,-1,-1),
        new THREE.Vector3(-1,-1,1)
    ];

    // 面を定義する
    const faces = [
        new THREE.Face3(0,2,1),
        new THREE.Face3(2,3,1),
        new THREE.Face3(4,6,5),
        new THREE.Face3(6,7,5),
        new THREE.Face3(4,5,1),
        new THREE.Face3(5,0,1),
        new THREE.Face3(7,6,2),
        new THREE.Face3(6,3,2),
        new THREE.Face3(5,7,0),
        new THREE.Face3(7,2,0),
        new THREE.Face3(1,3,4),
        new THREE.Face3(3,6,4)
    ];

    let geom = new THREE.Geometry();
    geom.vertices = vertices;
    geom.faces = faces;

    // 法線ベクトルを算出する
    geom.computeFaceNormals();

    // マテリアルを定義する
    const materials =[
        new THREE.MeshLambertMaterial({opacity:0.6, color: 0x44f44, transparent: true}),
        // ワイヤフレーム用のマテリアル
        new THREE.MeshBasicMaterial({color: 0x000000, wireframe:true})
    ];

    // メッシュ生成処理
    // createMultiMaterialObject
    //   複数のマテリアルをメッシュに適用できるようにする
    // マテリアルそれぞれを適用したメッシュを格納した変数を定義している
    let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials);
    
    // メッシュグループ内全てのメッシュに対して影を設定する
    mesh.children.forEach(function(e) {
        e.castShadow = true;
    });

    scene.add(mesh);

    const addControl = (x,y,z) => {

        let controls = new function() {
            this.x = x;
            this.y = y;
            this.z = z;
        };
        return controls;
    };

    let controlPoints = [];
    controlPoints.push(addControl(3,5,3));
    controlPoints.push(addControl(3,5,0));
    controlPoints.push(addControl(3,0,3));
    controlPoints.push(addControl(3,0,0));
    controlPoints.push(addControl(0,5,0));
    controlPoints.push(addControl(0,5,3));
    controlPoints.push(addControl(0,0,0));
    controlPoints.push(addControl(0,0,3));

    // // GUI生成処理
    // let gui = new dat.GUI();

    // gui.add(new function() {

    //     // クローンボタン押下処理
    //     this.clone = function(){

    //         // ジオメトリを複製する
    //         let clonedGeometry = mesh.children[0].geometry.clone();
            
    //         // マテリアルを生成する
    //         let materials = [
    //             new THREE.MeshLambertMaterial({opacity:0.6, color: 0xff44ff,transparent:true}),
    //             new THREE.MeshBasicMaterial({color: 0x000000,wireframe: true})
    //         ];

    //         let mesh2 = THREE.SceneUtils.createMultiMaterialObject(clonedGeometry,materials);

    //         mesh2.children.forEach(function(e) {
    //             e.castShadow = true;
    //         });

    //         // コピーしたメッシュを移動させる
    //         mesh2.translateX(5);
    //         mesh2.translateZ(5);

    //         // コピーしたメッシュに名前をつける
    //         mesh2.name = "clone";

    //         // 既存のコピーメッシュをシーンから削除する
    //         scene.remove(scene.getObjectByName("clone"));

    //         scene.add(mesh2);

    //     }

    // },'clone');

    // for (var i = 0; i < 8; i++) {

    //     let f1 = gui.addFolder('Vertices ' + (i + 1));
    //     f1.add(controlPoints[i], 'x', -10, 10);
    //     f1.add(controlPoints[i], 'y', -10, 10);
    //     f1.add(controlPoints[i], 'z', -10, 10);

    // }

    // レンダラ処理を実行する
    render();

};  
