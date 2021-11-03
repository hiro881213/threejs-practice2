let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const makeProgramBasedSprites = () => {
    
    // シーンを生成する　
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -----------------------------------
    // レンダラ生成処理
    // -----------------------------------

    // レンダラを生成する
    let canvasRenderer = new THREE.CanvasRenderer();

    // 背景色を設定する
    canvasRenderer.setClearColor(new THREE.Color(0x000000));

    // サイズを設定する
    canvasRenderer.setSize(width, height);

    // -----------------------------------
    // カメラ設定処理
    // -----------------------------------

    // カメラの位置を設定する
    camera.position.set(20, 0, 150);

    // THREEJSオブジェクトをDOMに設定する
    document.getElementById("programBasedSprites-output").appendChild(canvasRenderer.domElement);

    // -----------------------------------
    // テクスチャ生成処理
    // -----------------------------------

    let getTexture = (ctx) => {

        ctx.translate(-81, -84);

        ctx.fillStyle = "orange";

        // 始点を生成する
        ctx.beginPath();
        ctx.moveTo(83, 116);
        ctx.lineTo(83, 102);

        // ベジエ曲線を生成する
        ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);
        ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);

        // ラインを生成する
        ctx.lineTo(116, 116);
        ctx.lineTo(106.333, 111.333);
        ctx.lineTo(101.666, 116);
        ctx.lineTo(97, 111.333);
        ctx.lineTo(92.333, 116);
        ctx.lineTo(87.666, 111.333);
        ctx.lineTo(83,116);
        ctx.fill();

        ctx.fillStyle = 'white';

        ctx.beginPath();
        ctx.moveTo(91, 96);

        // ベジエ曲線
        ctx.bezierCurveTo(88, 96, 87, 99, 87, 101);
        ctx.bezierCurveTo(87, 103, 88, 106, 91, 106);
        ctx.bezierCurveTo(94, 106, 95, 103, 95, 101);
        ctx.bezierCurveTo(95, 99, 94, 96, 91, 96);

        ctx.moveTo(103, 96);

        ctx.bezierCurveTo(100, 96, 99, 99, 99, 101);
        ctx.bezierCurveTo(99, 103, 100, 106, 103, 106);
        ctx.bezierCurveTo(106, 106, 107, 103, 107, 101);
        ctx.bezierCurveTo(107, 99, 106, 96, 103, 96);
        ctx.fill();

        ctx.fillStyle = "blue";

        ctx.beginPath();
        ctx.arc(101, 102, 2, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(89, 102, 2, 0, Math.PI * 2, true);
        ctx.fill();

    };

    createSprites();
    render();

    // -----------------------------------
    // スピリット生成関数
    // -----------------------------------

    function createSprites() {

        // マテリアルを生成する
        let material = new THREE.SpriteCanvasMaterial({
            program: getTexture,
            color: 0xffffff
        });

        // マテリアルを回転させる
        material.rotation = Math.PI;

        // 範囲を定義する
        let range = 500;

        // スピリッツを生成する
        for (let i = 0; i < 1500; i++) {

            // スピリットを生成する
            let sprite = new THREE.Sprite(material);

            // スピリットの位置を設定する
            sprite.position.set(Math.random() * range - range/2 ,Math.random() * range - range/2, Math.random() * range - range/2);
    
            // スケールを設定する
            sprite.scale.set(0.1, 0.1, 0.1);

            // シーンにスピリットを追加する
            scene.add(sprite);

        }

    }

    // -----------------------------------
    // レンダリング関数
    // -----------------------------------

    function render() {

        requestAnimationFrame(render);
        canvasRenderer.render(scene, camera);

    }


};
