let scene;

let camera;

let width = window.innerWidth;
let height = 500;
let pos = 0;

export const makeBonesManually = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // --------------------------------------------
    // レンダラ生成処理
    // --------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // --------------------------------------------
    // カメラ設定処理
    // --------------------------------------------

    // カメラの位置を設定する
    camera.position.set(0, 0, 0);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // --------------------------------------------
    // 点光源生成処理
    // --------------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(0, 50, 30);

    // intensity
    spotLight.intensity = 2;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("bonesManually-output").appendChild(webGLRenderer.domElement);

    // --------------------------------------------
    // メッシュ生成処理
    // --------------------------------------------

    // メッシュを定義する
    let mesh;

    // クロックを生成する
    let clock = new THREE.Clock();

    // ファイルを読み込む
    var loader = new THREE.JSONLoader();
    loader.load('../../assets/models/hand-1.js', function (geometry, mat) {
        var mat = new THREE.MeshLambertMaterial({color: 0xF0C8C9, skinning: true});
        mesh = new THREE.SkinnedMesh(geometry, mat);

        // rotate the complete hand
        mesh.rotation.x = 0.5 * Math.PI;
        mesh.rotation.z = 0.7 * Math.PI;

        // add the mesh
        scene.add(mesh);

        // and start the animation
        tween.start();

    }, '../../assets/models');

    // トゥーンを生成する
    let tween = new TWEEN.Tween({pos: -1})
                         .to({pos: 0}, 3000)
                         .easing(TWEEN.Easing.Cubic.InOut)
                         .yoyo(true)
                         .repeat(Infinity)
                         .onUpdate(onUpdate);


    // 更新処理
    function onUpdate() {

        // 位置を設定する
        var pos = this.pos;

        // メッシュを回転させる
        mesh.skeleton.bones[5].rotation.set(0, 0, pos);
        mesh.skeleton.bones[6].rotation.set(0, 0, pos);
        mesh.skeleton.bones[10].rotation.set(0, 0, pos);
        mesh.skeleton.bones[11].rotation.set(0, 0, pos);
        mesh.skeleton.bones[15].rotation.set(0, 0, pos);
        mesh.skeleton.bones[16].rotation.set(0, 0, pos);
        mesh.skeleton.bones[20].rotation.set(0, 0, pos);
        mesh.skeleton.bones[21].rotation.set(0, 0, pos);

        mesh.skeleton.bones[1].rotation.set(pos, 0, 0);

    };

    // レンダリング処理を実行する
    render();

    // --------------------------------------------
    // レンダリング関数
    // --------------------------------------------

    function render() {

        // トゥーンを更新する
        TWEEN.update();

        // デルタを生成する
        let delta = clock.getDelta();

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    };

};
