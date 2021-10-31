let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const makeExtrudeGeometries = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ----------------------------
    // レンダラ生成処理
    // ----------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを有効にする
    webGLRenderer.shadowMap.enabled = true;

    // ----------------------------
    // メッシュ生成処理
    // ----------------------------

    // メッシュを生成する
    let shape = createMesh(new THREE.ShapeGeometry(drawShape()));

    // シーンにメッシュを追加する
    scene.add(shape);

    // ----------------------------
    // カメラ設定処理
    // ----------------------------

    // カメラの位置を設定する
    camera.position.set(-20, 60, 60);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(20, 20, 0));

    // THREEJSオブジェクトをDOMに追加する
    document.getElementById("extrudeGeometries-output").appendChild(webGLRenderer.domElement);

    // ----------------------------
    // コントローラ生成処理
    // ----------------------------

    let step = 0;

    // コントローラを生成する
    let controls = new function() {

        // 量
        this.amount = 2;

        // bevelThickness
        this.bevelThickness = 2;

        // bevelSize
        this.bevelSize = 0.5;

        // bevelEnabled
        this.bevelEnabled = true;

        // bevelSegment
        this.bevelSegments = 3;

        // bevelEnabled
        this.bevelEnabled = true;

        // curveSegments
        this.curveSegments = 12;

        // steps
        this.steps = 1;

        // メッシュ追加処理
        this.asGeom = function() {

            // シーンからメッシュを削除する
            scene.remove(shape);

            // オプション
            let options = {
                amount: controls.amount,
                bevelThickness: controls.bevelThickness,
                bevelSize: controls.bevelSize,
                bevelSegments: controls.bevelSegments,
                bevelEnabled: controls.bevelEnabled,
                curveSegments: controls.curveSegments,
                steps: controls.steps
            };

            // メッシュを生成する
            shape = createMesh(new THREE.ExtrudeGeometry(drawShape(), options));

            // シーンにメッシュを追加する
            scene.add(shape);

        };

    };

    // // ----------------------------
    // // GUI生成処理
    // // ----------------------------

    // // GUIを生成する
    // let gui = new dat.GUI();

    // // 量
    // gui.add(controls, 'amount', 0, 20).onChange(controls.asGeom);

    // // bevelThickness
    // gui.add(controls, 'bevelThickness', 0, 10).onChange(controls.asGeom);

    // // bevelSize
    // gui.add(controls, 'bevelSize', 0, 10).onChange(controls.asGeom);

    // // bevelセグメント
    // gui.add(controls, 'bevelSegments', 0, 30).step(1).onChange(controls.asGeom);

    // // bevelEnabled
    // gui.add(controls, 'bevelEnabled').onChange(controls.asGeom);

    // // curveセグメント
    // gui.add(controls, 'curveSegments', 1, 30).step(1).onChange(controls.asGeom);

    // // steps
    // gui.add(controls, 'steps', 1, 5).step(1).onChange(controls.asGeom);

    // 描画処理
    controls.asGeom();

    // レンダリング処理
    render();

    // ----------------------------
    // 形状描画関数
    // ----------------------------

    function drawShape () {

        // 形状を生成する
        let shape = new THREE.Shape();

        // 形状を移動させる
        shape.moveTo(10, 10);

        // 線を定義する
        shape.lineTo(10, 40);

        // ベジエ曲線を定義する
        shape.bezierCurveTo(15, 25, 25, 25, 30, 40);

        // スプラインを生成する
        shape.splineThru([
            new THREE.Vector2(32, 30),
            new THREE.Vector2(28, 20),
            new THREE.Vector2(30, 10)
        ]);

        // カーブを生成する
        shape.quadraticCurveTo(20, 15, 10, 10);

        let hole1 = new THREE.Path();
        hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true);
        shape.holes.push(hole1);

        let hole2 = new THREE.Path();
        hole2.absellipse(23, 24, 2, 3, 0, Math.PI * 2, true);
        shape.holes.push(hole2);

        let hole3 = new THREE.Path();
        hole3.absarc(20, 16, 2, 0, Math.PI, true);
        shape.holes.push(hole3);

        return shape;

    }

    // ----------------------------
    // メッシュ生成関数
    // ----------------------------

    function createMesh (geom) {

        // ジオメトリを生成する
        geom.applyMatrix(new THREE.Matrix4().makeTranslation(-20, 0, 0));

        // マテリアルを生成する
        let meshMaterial = new THREE.MeshNormalMaterial({
            transparent: true,
            opacity: 0.7
        });

        // ワイヤーフレームを生成する
        let wireFrameMat = new THREE.MeshBasicMaterial();
        wireFrameMat.wireframe = true;

        // メッシュを生成する
        let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

        return mesh;

    }

    // ----------------------------
    // ライン生成関数
    // ----------------------------

    function createLine(shape, spaced) {

        if (!spaced) {

            let mesh = new THREE.Line(
                shape.createPointsGeometry(), 
                new THREE.LineBasicMaterial({
                    color: 0xff3333,
                    linewidth: 2
                }));

            return mesh;

        } else {

            let mesh = new THREE.Line(
                shape.createSpacedPointsGeometry(20),
                new THREE.LineBasicMaterial({
                    color: 0xff3333,
                    linewidth: 2
                }));
            
            return mesh;

        }

    }

    // ----------------------------
    // レンダリング関数
    // ----------------------------

    function render() {

        // 形状を回転させる
        shape.rotation.y = step += 0.01;

        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }

};
