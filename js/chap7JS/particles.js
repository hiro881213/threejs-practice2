let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const makeParticles = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // --------------------------------
    // レンダラ生成処理 
    // --------------------------------

    // レンダラを生成する
    let canvasRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    canvasRenderer.setClearColor(new THREE.Color(0x000000));

    // サイズを設定する
    canvasRenderer.setSize(width, height);

    // --------------------------------
    // カメラ設定処理 
    // --------------------------------

    // カメラの位置を設定する
    camera.position.set(0, 0, 150);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("particles-output").appendChild(canvasRenderer.domElement);

    // メッシュを生成する
    createSprites();

    // レンダリング処理を実行する
    render();

    // --------------------------------
    // メッシュ生成関数 
    // --------------------------------

    function createSprites() {

        // マテリアルを生成する
        let material = new THREE.SpriteMaterial();

        // メッシュを生成する
        for ( let x = -5; x < 5; x++) {
            
            for ( let y = -5; y < 5; y++ ) {

                // メッシュを生成する
                let sprite = new THREE.Sprite(material);

                // メッシュの位置を設定する
                sprite.position.set(x*10, y*10, 0);

                // シーンにメッシュを追加する
                scene.add(sprite);

            }

        }

    };

    // --------------------------------
    // レンダリング関数 
    // --------------------------------

    function render() {

        // アニメーションを生成する
        requestAnimationFrame(render);
        canvasRenderer.render(scene, camera);

    }
}
