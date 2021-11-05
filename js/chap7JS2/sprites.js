let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const makeSprites = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();
    sceneOrtho = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
    cameraOrtho = new THREE.OrthographicCamera(0, width, height, 0, -10, 10);

    // ------------------------------
    // レンダラ生成処理
    // ------------------------------
    
    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0x000000));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // ------------------------------
    // カメラ設定処理
    // ------------------------------

    // カメラの位置を設定する
    camera.position.set(0, 0, 50);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("spirites-output").appendChild(webGLRenderer.domElement);

    // ------------------------------
    // メッシュ生成処理
    // ------------------------------

    // マテリアルを生成する
    let material = new THREE.MeshNormalMaterial();

    // ジオメトリを生成する
    let geom = new THREE.SphereGeometry(15, 20, 20);

    // メッシュを生成する
    let mesh = new THREE.Mesh(geom, material);

    // シーンにメッシュを追加する
    scene.add(mesh);

    // ------------------------------
    // テクスチャ生成関数
    // ------------------------------

    // テクスチャを生成する
    let getTexture = () => {

        // ローダーを生成する
        let textureLoader = new THREE.TextureLoader();

        // テクスチャを読み込む
        let texture = new textureLoader.load("../../assets/textures/particles/sprite-sheet.png");

        return texture;

    }

    // ------------------------------
    // コントローラ生成処理
    // ------------------------------

    // コントローラを生成する
    let controls = new function() {
        
        // size
        this.size = 150;
        
        // sprite
        this.sprite = 0;

        // transparent
        this.transparent = true;

        // opacity
        this.opacity = 0.6;

        // color
        this.color = 0xffffff;

        // rotateSystem
        this.rotateSystem = true;

        // 再描画処理
        this.redraw = () => {

            sceneOrtho.children.forEach((child) => {
                if (child instanceof THREE.Sprite) sceneOrtho.remove(child);
            });

            // spritesを生成する
            createSprite(controls.size, controls.transparent, controls.opacity, controls.color, controls.sprite);

        }


    }

    // ------------------------------
    // GUI生成処理
    // ------------------------------

    // GUIを生成する
    let gui = new dat.GUI();

    // sprite
    gui.add(controls, 'sprite', 0, 4).step(1).onChange(controls.redraw);

    // size
    gui.add(controls, 'size', 0, 120).onChange(controls.redraw);

    // transparent
    gui.add(controls, 'transparent').onChange(controls.redraw);

    // opacity
    gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);

    // color
    gui.addColor(controls, 'color').onChange(controls.redraw);

    // 再描画処理を実行する
    controls.redraw();

    // ------------------------------
    // sprites生成処理
    // ------------------------------

    // レンダリング処理を実行する
    render();

    function createSprite(size, transparent, opacity, color, spriteNumber) {

        // スプリットマテリアルを生成する
        let spriteMaterial = new THREE.SpriteMaterial({
            opacity: opacity,
            color: color,
            transparent: transparent,
            map: getTexture()
        });

    }

}