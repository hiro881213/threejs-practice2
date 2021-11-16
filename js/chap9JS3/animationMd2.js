let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeAnimationMd2 = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ----------------------------------------------
    // レンダラ生成処理
    // ----------------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xdddddd));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // ----------------------------------------------
    // カメラ設定処理
    // ----------------------------------------------

    // カメラの位置を設定する
    camera.position.set(-50, 40, 60);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(0, 25, 0));

    // ----------------------------------------------
    // 点光源生成処理
    // ----------------------------------------------

    // 点光源を生成する
    let spotSpotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotSpotLight.position.set(-50, 70, 60);

    // intensity
    spotSpotLight.intensity = 1;

    // シーンに点光源を追加する
    scene.add(spotSpotLight);

    // THREEJSオブジェクトにDOMを設定する
    document.getElementById("AnimationMd2-output").appendChild(webGLRenderer.domElement);

    // ----------------------------------------------
    // コントローラ生成処理
    // ----------------------------------------------

    let step = 0;

    // コントローラを生成する
    let controls = new function() {

        this.animetions = 'crattack';
        this.playbackrate = 10;

    };

    // メッシュを生成する
    let mesh;

    // クロックを生成する
    let clock = new THREE.Clock();

    // ----------------------------------------------
    // アニメーション生成処理
    // ----------------------------------------------

    // MD2を生成する
    let character = new THREE.MD2Character();

    // アニメーション生成処理
    character.onLoadComplete = () => {

        // アニメーションを定義する
        let animations = character.meshBody.geometry.animations;

        let animLabels = [];

        animLabels.forEach((anim)=> {

            if (!anim.name.match(/¥d{3}f$/)) {
                
                animLabels.push(anim.name);

            }

        });

        // animations
        gui.add(controls, 'animations', animLabels).onChange((e) => {
            
            character.setAnimation(controls.animations);
        
        });

        // playbackrate
        gui.add(controls, 'playbackrate', 1, 20).step(1).onChange((e) => {
            
            character.setPlaybackRate(controls.playbackrate);

        })

        // アニメーションを設定する
        character.setAnimation(controls.animetions);

        // プレーバックレートを設定する
        character.setPlaybackRate(controls.playbackrate);

    };

    // ファイル読み込み処理
    character.loadParts({
        baseUrl: "../../assets/models/ogre/",
        body: "ogro.md2",
        skins: ["skin.jpg"],
        weapons:[]
    });

    // シーンにファイルを追加する
    scene.add(character.root);

    // レンダリング処理を実行する
    render();

    // ----------------------------------------------
    // レンダリング関数
    // ----------------------------------------------

    function render() {

        // デルタを生成する
        let delta = clock.getDelta();

        // メッシュを更新する
        character.update(delta);

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

};
