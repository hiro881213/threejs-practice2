let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const make2dShapeGeometries = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // -----------------------------------
    // レンダラ設定処理
    // -----------------------------------

    // レンダラを設定する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // -----------------------------------
    // メッシュ生成処理
    // -----------------------------------

    // シェープを生成する
    let shape = createMesh(new THREE.ShapeGeometry(drawShape()));

    // シーンにシェープを追加する
    scene.add(shape);

    // -----------------------------------
    // カメラ設定処理
    // -----------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 70, 70);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // -----------------------------------
    // 点光源設定処理
    // -----------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(-40, 60, -10);

    // シーンに点光源を追加する
    scene.add(spotLight);

    // THREEJSをDOMに設定する
    document.getElementById("2dShapeGeometries-output").appendChild(webGLRenderer.domElement);

    // -----------------------------------
    // コントローラ設定処理
    // -----------------------------------

    let step = 0;

    let controls = new function() {

        this.asGeom = function() {

            // シーンからメッシュを削除する
            scene.remove(shape);

            // メッシュを生成する
            shape = createMesh(new THREE.ShapeGeometry(drawShape()));

            // シーンにメッシュを追加する
            scene.add(shape);

        };

        this.asPoints = function() {

            // シーンからメッシュを削除する
            scene.remove(shape);

            // メッシュを生成する
            shape = createLine(drawShape(), false);

            // シーンにメッシュを追加する
            scene.add(shape);

        };

        this.asSpacedPoints = function() {

            // シーンからメッシュを削除する
            scene.remove(shape);

            // メッシュを生成する
            shape = createLine(drawShape(), true);

            // シーンにメッシュを追加する
            scene.add(shape);

        };

    };

    // -----------------------------------
    // GUI設定処理
    // -----------------------------------

    // // GUIを生成する
    // let gui = new dat.GUI();

    // gui.add(controls, 'asGeom');
    // gui.add(controls, 'asPoints');
    // gui.add(controls, 'asSpacedPoints');

    // -----------------------------------
    // レンダリング処理
    // -----------------------------------

    // レンダリング関数を定義する
    const render = () => {

        // メッシュを回転させる
        shape.rotation.y = step += 0.01;

        // アニメーションを実行する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    };

    // レンダリングを実行する
    render();

    // -----------------------------------
    // メッシュ描画関数
    // -----------------------------------

    function drawShape() {

        // shapeを生成する
        let shape = new THREE.Shape();

        // シェープを移動する
        shape.moveTo(10, 10);

        // ラインを設定する
        shape.lineTo(10, 40);

        // ベジエ曲線
        shape.bezierCurveTo(15, 25, 25, 25, 30, 40);

        shape.splineThru([
            new THREE.Vector2(32, 30),
            new THREE.Vector2(28, 20),
            new THREE.Vector2(30, 10),
        ]);

        shape.quadraticCurveTo(20, 15, 10, 10);

        let hole1 = new THREE.Path();
        hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true);
        shape.holes.push(hole1);

        let hole2 = new THREE.Path();
        hole2.absellipse(23, 24, 2, 3, 0, Math.PI * 2, true);
        shape.holes.push(hole2);

        let hole3 = new THREE.Path();
        hole3.absellipse(20, 16, 2, 0, Math.PI, true);
        shape.holes.push(hole3);

        return shape;

    };

    // -----------------------------------
    // メッシュ生成関数
    // -----------------------------------

    function createMesh(geom) {

        // マテリアルを生成する
        let meshMaterial = new THREE.MeshNormalMaterial();

        // マテリアルの方向を設定する
        meshMaterial.side = THREE.DoubleSide;

        // ワイヤーフレームを生成する
        let wireFrameMat = new THREE.MeshBasicMaterial();

        // ワイヤーフレームを有効にする
        wireFrameMat.wireframe = true;

        // メッシュを生成する
        let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

        return mesh;

    }

    // -----------------------------------
    // ライン生成関数
    // -----------------------------------

    function createLine(shape, spaced) {

        if (!spaced) {

            // ラインメッシュを生成する
            let mesh = new THREE.Line(
                shape.createPointsGeometry(10, new THREE.LineBasicMaterial({
                    color: 0xff3333,
                    linewidth: 2
                })));
            
            return mesh;

        } else {

            // ラインメッシュを生成する
            let mesh = new THREE.Line(shape.createSpacedPointsGeometry(3), new THREE.LineBasicMaterial({
                color: 0xff3333,
                linewidth: 2
            }));

            return mesh;

        }

    }

};
