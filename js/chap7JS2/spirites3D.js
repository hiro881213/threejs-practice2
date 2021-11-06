let scene;

let camera;

let width = window.innerWidth;
let height = 500;

export const makeSprites3D = () => {

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ----------------------------------------
    // レンダラ生成処理
    // ----------------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0x000000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // カメラの位置を設定する
    camera.position.set(20, 0, 150);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("spirites3D-output").appendChild(webGLRenderer.domElement);

    // グループを定義する
    let group;
    let step;

    // スピリッツを生成する
    createSprites();

    // レンダリング処理を実行する
    render();

    // ----------------------------------------
    // スピリッツ生成関数
    // ----------------------------------------

    function createSprites() {

        // グループを生成する
        group = new THREE.Group();

        // 範囲を設定する
        let range = 200;

        // グループにメッシュを追加する
        for (let i = 0; i < 400; i++) {

            // グループにメッシュを生成する
            group.add(createSprite(10, false, 0.6, 0xffffff, i%5, range));

        }

        // シーンにグループを追加する
        scene.add(group);

    };

    // ----------------------------------------
    // テクスチャ生成関数
    // ----------------------------------------

    function getTexture() {

        // ローダを生成する
        let textureLoader = new THREE.TextureLoader();

        // テクスチャを読み込む
        let texture = textureLoader.load("../../assets/textures/particles/sprite-sheet.png");

        return texture;

    };

    // ----------------------------------------
    // スピリット生成関数
    // ----------------------------------------

    function createSprite(size, transparent, opacity, color, spriteNumber, range) {

        // マテリアルを生成する
        let spriteMaterial = new THREE.SpriteMaterial({
            opacity     : opacity,
            color       : color, 
            transparent : transparent,
            map         : getTexture()
        });

        // テクスチャの位置設定を行う
        spriteMaterial.map.offset = new THREE.Vector2(0.2*spriteNumber, 0);
        spriteMaterial.map.repeat = new THREE.Vector2(1/5, 1);
        spriteMaterial.depthTest = false;

        // メッシュを生成する
        let sprite = new THREE.Sprite(spriteMaterial);

        // メッシュのスケールを設定する
        sprite.scale.set(size, size, size);

        // メッシュの位置を設定する
        sprite.position.set(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);

        sprite.velocityX = 5;

        return sprite;

    }

    // ----------------------------------------
    // レンダリング関数
    // ----------------------------------------

    function render() {

        step += 0.01;

        // グループの位置を設定する
        group.rotation.x = step;

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

};
