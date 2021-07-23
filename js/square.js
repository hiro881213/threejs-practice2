// カメラオブジェクト
let camera;

// シーン
let scene;

// レンダラ
let renderer;

let width = window.innerWidth;

let height = 500;


/**
 * 球体アニメーション生成処理
 */
export const makeSquare = () => {
    
    /**
     * 初期状態定義メソッド
     */

    const initStats = () => {

        // stats
     　 //   １秒毎のフレーム数を示してくれる
        let stats = new Stats();
    
        // 0: フレーム数を表示する
        // 1: 描画時間を表示する
        stats.setMode(0);
        
        // stats.domElement.style.position = 'absolute';
        // stats.domElement.style.left = '0px';
        // stats.domElement.style.top = '0px';
        
        // ------------------------------------------------
        // 画面描画処理
        // ------------------------------------------------
            
        // フレーム数を表示する
        document.getElementById("Stats-output").appendChild(stats.domElement);
    
        return stats;
    
    };

    /**
     * アニメーション生成処理
     */
    const renderScene = () => {

        //statsエリアを更新する
        stats.update();
        
        // 立方体を回転させる
        cube.rotation.x += 0.02;
        cube.rotation.y += 0.02;
        cube.rotation.z += 0.02;
        // cube.rotation.x += controls.rotationSpeed;
        // cube.rotation.y += controls.rotationSpeed;
        // cube.rotation.z += controls.rotationSpeed;
        
        // 弾む速さを設定する
        // step += controls.bouncingSpeed;
        step += 0.03;

        sphere.position.x = 20 + (10* (Math.cos(step)));
        sphere.position.y = 2  + (10*  Math.abs(Math.sin(step)));
        

        // requestAnimationFrame
        //   ブラウザに定義された間隔で呼び出される関数が設定でき、必要な物を
        //   その関数内で自由に描画できる
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    
    };

    // 初期状態を定義する
    let stats = initStats();

    // シーンを作成する
    // シーン
    //  表示したい全ての物体と利用したい全ての光源を保持して変更を監視する
    //  コンテナオブジェクト
    scene = new THREE.Scene();

    // カメラを作成する
    // カメラ
    //   何が表示されるかを決定する
    // 第一引数：画角
    // 第二引数：アスペクト比
    // 第三引数: 描画開始距離
    // 第四引数: 描画終了距離
    // ・window.innerWidth
    //  　ウィンドウのwidthを取得する
    // ・window.innerHeight
    //    ウィンドウのheightを取得する
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1,1000);

    // ------------------------------------------------
    // レンダラ生成処理
    // ------------------------------------------------

    // レンダラを作成する
    // レンダラオブジェクト
    //   cameraオブジェクトの角度に基づいて、ブラウザ内でsceneオブジェクトが
    //   どのように見えるか計算する
    renderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    renderer.setClearColor(new THREE.Color(0xEEEEEE));

    // レンダラのサイズを指定する
    renderer.setSize(width, height);

    // デバイスの解像度をセットする
    renderer.setPixelRatio(window.devicePixelRatio);

    // 影をレンダリングできるようにする
    renderer.shadowMap.enabled = true;

    // // ------------------------------------------------
    // // 座標軸生成処理
    // // ------------------------------------------------

    // // 座標軸を生成する
    // const axes = new THREE.AxisHelper(20);
    // scene.add(axes);

    // ------------------------------------------------
    // 平面生成処理
    // ------------------------------------------------

    // 平面ジオメトリを生成する
    // 第一引数: 縦幅
    // 第二引数: 高さ
    const planeGeometry = new THREE.PlaneGeometry(60,20);

    // 平面マテリアルを生成する
    // MeshLambertMaterial
    //   ランバードシェーディングに設定する
    //   →光沢感のないマットな質感を表現できるマテリアル(陰影が必要なためライトが必要)
    const planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

    // // ・MeshBasicMaterial
    // //    陰のない均一な塗り潰しになる
    // const planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});

    // 平面メッシュを生成する
    const plane = new THREE.Mesh(planeGeometry,planeMaterial)

    // 影をうける属性を有効にする
    plane.receiveShadow = true;

    // ------------------------------------------------
    // 平面の位置設定
    // ------------------------------------------------
    
    // 回転させる
    plane.rotation.x = -0.5 * Math.PI;

    // 平面の位置を設定する
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    // ------------------------------------------------
    // 立方体生成処理
    // ------------------------------------------------

    // 立方体ジオメトリを生成する
    const cubeGeometry = new THREE.BoxGeometry(4,4,4);
    
    // 立方体マテリアルを生成する
    const cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});

    // // wireframe:true
    // //  ワイヤフレームで表示する
    // const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});

    // 立方体メッシュを生成する
    let cube = new THREE.Mesh(cubeGeometry,cubeMaterial);

    // キャストシャドウを有効にする
    cube.castShadow = true;

    // ------------------------------------------------
    // 立方体位置設定処理
    // ------------------------------------------------

    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;

    scene.add(cube);

    // ------------------------------------------------
    // 球体生成処理
    // ------------------------------------------------

    // 球体ジオメトリを生成する
    const sphereGeometry = new THREE.SphereGeometry(4,20,20);

    // 球体マテリアルを生成する
    const sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
    // const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: true});

    // 球体メッシュを生成する
    const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);

    // ------------------------------------------------
    // 球体位置設定処理
    // ------------------------------------------------

    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;

    // ?
    sphere.castShadow = true;

    scene.add(sphere);

    // ------------------------------------------------
    // カメラ位置設定処理
    // ------------------------------------------------

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;

    // シーンの中心にカメラが向くように設定する
    camera.lookAt(scene.position);

    // ------------------------------------------------
    // ライト設定処理
    // ------------------------------------------------

    // スポットライトを生成する
    const spotLight = new THREE.SpotLight(0xffffff);

    // スポットライトの位置を設定する
    spotLight.position.set(-20,30,-5);

    spotLight.castShadow = true;
    scene.add(spotLight);

    // ------------------------------------------------
    // 画面描画処理
    // ------------------------------------------------

    document.getElementById("Square-output").appendChild(renderer.domElement);

    // // シーンをレンダラに追加する
    // renderer.render(scene, camera);

    let step = 0;

    // // ------------------------------------------------
    // // GUI制御設定処理
    // // ------------------------------------------------

    // // GUI用コントローラを定義する
    // // GUIで制御するパラメータを指定する
    // let controls = new function () {
    //     this.rotationSpeed = 0.02;
    //     this.bouncingSpeed = 0.03;
    // };

    // // GUIにコントローラを追加する
    // const gui = new dat.GUI();
    // gui.add(controls, 'rotationSpeed', 0, 0.5);
    // gui.add(controls, 'bouncingSpeed', 0, 0.5);

    renderScene();

}

/**
 * リサイズイベント
 */

const onResize = () => {

    // アスペクト比を更新する
    camera.aspect = window.innerWidth/window.innerHeight;

    // カメラを更新する
    camera.updateProjectionMatrix();

    // レンダラのサイズを更新する
    renderer.setSize(width, height);
}

// リサイズイベントを付与する
window.addEventListener('resize', onResize, false);