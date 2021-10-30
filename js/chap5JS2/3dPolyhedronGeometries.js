let scene;
let camera;

let width = window.innerWidth;
let height = 500;

export const make3dPolyhedronGeometries = () => {
    
    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);

    // ----------------------------------
    // レンダラ生成処理
    // ----------------------------------

    // レンダラを生成する
    let webGLRenderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));

    // サイズを設定する
    webGLRenderer.setSize(width, height);

    // シャドウマップを設定する
    webGLRenderer.shadowMap.enabled = true;

    // ----------------------------------
    // メッシュ生成処理
    // ----------------------------------

    // polyhedronメッシュを生成する
    let polyhedron = createMesh(new THREE.IcosahedronGeometry(10,0));

    // シーンにpolyhedronを追加する
    scene.add(polyhedron);

    // ----------------------------------
    // カメラ設定処理
    // ----------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 50);

    // カメラの方向を設定する
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // THREEJSオブジェクトをDOMに追加する
    document.getElementById("3dPolyhedronGeometries-output").appendChild(webGLRenderer.domElement);

    // ----------------------------------
    // コントローラ生成処理
    // ----------------------------------

    let step = 0;

    // コントローラを生成する
    let controls = new function () {

        // radius
        this.radius = 10;

        // detail
        this.detail = 0;

        // type
        this.type = 'Icosahedron';

        // 再描画処理
        this.redraw = function () {

            // シーンからメッシュをを削除する
            scene.remove(polyhedron);

            // タイプ別でメッシュを生成する
            switch (controls.type) {

                // Icosahedron
                case 'Icosahedron' :
                    polyhedron = createMesh(new THREE.IcosahedronGeometry(controls.radius, controls.detail));
                    break;

                case 'Tetrahedron' :
                    polyhedron = createMesh(new THREE.TetrahedronGeometry(controls.radius, controls.detail));
                    break;

                case 'Octahedron' :
                    polyhedron = createMesh(new THREE.OctahedronGeometry(controls.radius, controls.detail));
                    break;
            
                case 'Dodecahedron' :
                    polyhedron = createMesh(new THREE.DodecahedronGeometry(controls.radius, controls.detail));
                    break;

                case 'Custom':
                    
                    // 頂点を定義する
                    let vertices = [
                        1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1
                    ];

                    // 面を定義する
                    let indices = [
                        2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
                    ];

                    polyhedron = createMesh(new THREE.PolyhedronGeometry(vertices, indices, controls.radius, controls.detail));
                    break;
            }

            // シーンにメッシュを追加する
            scene.add(polyhedron);

        };

    };

    // // ----------------------------------
    // // GUI生成処理
    // // ----------------------------------

    // // GUIを生成する
    // let gui = new dat.GUI();

    // // radius
    // gui.add(controls, 'radius', 0, 40).step(1).onChange(controls.redraw);

    // // detail
    // gui.add(controls, 'detail', 0, 3).step(1).onChange(controls.redraw);

    // // type
    // gui.add(controls, 'type', ['Icosahedron', 'Tetrahedron', 'Octahedron', 'Dodecahedron', 'Custom']).onChange(controls.redraw);

    // レンダリングを実行する
    render();

    // ----------------------------------
    // メッシュ生成関数
    // ----------------------------------

    function createMesh(geom) {

        // マテリアルを生成する
        let meshMaterial = new THREE.MeshNormalMaterial();

        // サイドを設定する
        meshMaterial.side = THREE.DoubleSide;

        // ワイヤーフレームを生成する
        let wireFrameMat = new THREE.MeshBasicMaterial();
        wireFrameMat.wireframe = true;

        // メッシュを生成する
        let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);
    
        return mesh;

    }

    // ----------------------------------
    // レンダラ生成関数
    // ----------------------------------

    function render() {

        // メッシュを回転させる
        polyhedron.rotation.y = step += 0.01;

        // アニメーションを生成する
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

    }


}
