let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeLineMaterial = () => {
    
    function gosper(a, b) {

        let turtle = [0, 0, 0];
        let points = [];
        let count = 0;

        function rt(x) {
            turtle[2] += x;
        }

        function lt(x) {
            turtle[2] -= x;
        }

        function fd(dist) {
            
            points.push({ x: turtle[0], y: turtle[1], z: Math.sin(count) * 5});

            let dir = turtle[2] * (Math.PI / 180);
            
            turtle[0] += Math.cos(dir) * dist;
            turtle[1] += Math.sin(dir) * dist;

            points.push({x: turtle[0], y: turtle[1], z: Math.sin(count) * 5});

        }

        function rg(st, ln, turtle) {

            st--;
            ln = ln / 2.6457;

            if ( st > 0 ) {
                rg(st, ln, turtle);
                rt(60);

                gl(st, ln, turtle);
                rt(120);

                gl(st, ln, turtle);
                lt(60);

                rg(st, ln, turtle);
                lt(120);

                rg(st, ln, turtle);
                rg(st, ln, turtle);
                lt(60);

                gl(st, ln, turtle);
                rt(60);

            }

            if (st == 0) {
                fd(ln);
                rt(60);

                fd(ln);
                rt(120);

                fd(ln);
                lt(60);

                fd(ln);
                lt(120);

                fd(ln);
                fd(ln);
                lt(60);

                fd(ln);
                rt(60);

            }

        }

        function gl(st, ln, turtle) {
            
            st--;
            ln = ln / 2.6457;

            if ( st > 0 ) {

                lt(60);
                rg(st, ln, turtle);

                rt(60);
                gl(st, ln, turtle);
                gl(st, ln, turtle);

                rt(120);
                gl(st, ln, turtle);

                rt(60);
                rg(st, ln, turtle);

                lt(120);
                rg(st,ln, turtle);

                lt(60);
                gl(st, ln, turtle);

            }

            if (st == 0 ) {

                lt(60);
                fd(ln);

                rt(60);
                fd(ln);
                fd(ln);

                rt(120);
                fd(ln);

                rt(60);
                fd(ln);

                lt(120);
                fd(ln);

                lt(60);
                fd(ln);

            }

        }

        rg(a,b,turtle);

        return points;

    }

    // シーンを生成する
    scene = new THREE.Scene();

    // カメラを生成する
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    // -----------------------------------------
    // レンダラ設定処理
    // -----------------------------------------

    // レンダラを生成する
    renderer = new THREE.WebGLRenderer();

    // 背景色を設定する
    renderer.setClearColor(new THREE.Color(0x000000));

    // 画面サイズを設定する
    renderer.setSize(width, height);

    // シャドウマップを設定する
    renderer.shadowMap.enabled = true;

    // -----------------------------------------
    // カメラ設定処理
    // -----------------------------------------

    // カメラの位置を設定する
    camera.position.set(-30, 40, 30);

    // カメラの方向を設定する
    camera.lookAt(scene.position);

    // -----------------------------------------
    // 環境光設定処理
    // -----------------------------------------

    // 環境光を生成する
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);

    // シーンに環境光を追加する
    scene.add(ambientLight);

    // -----------------------------------------
    // 点光源設定処理
    // -----------------------------------------

    // 点光源を生成する
    let spotLight = new THREE.SpotLight(0xffffff);

    // 点光源の位置を設定する
    spotLight.position.set(-40, 60, -10);

    // 点光源のキャストシャドウを設定する
    spotLight.castShadow = true;

    // シーンに点光源を追加する
    scene.add(spotLight);

    // -----------------------------------------
    // ライン設定処理
    // -----------------------------------------

    let points = gosper(4, 60);

    let lines = new THREE.Geometry();

    let colors = [];

    let i = 0;

    // 線の色を設定する
    points.forEach((e) => {

        lines.vertices.push(new THREE.Vector3(e.x, e.z, e.y));

        colors[i] = new THREE.Color(0xffffff);
        colors[i].setHSL(e.x / 100 + 0.5, (e.y * 20) / 300, 0.8);

        i++;

    });

    lines.colors = colors;

    // マテリアルを設定する
    let material = new THREE.LineBasicMaterial({
        opacity: 1.0,
        linewidth: 1,
        vertexColor: THREE.VertexColors
    });

    // 線メッシュを生成する
    let line = new THREE.Line(lines, material);
    
    // 線の位置を設定する
    line.position.set(25, -30, -60);

    // シーンに線を追加する
    scene.add(line);

    document.getElementById("meshLineMaterial-output").appendChild(renderer.domElement);

    // -----------------------------------------
    // レンダラ設定処理
    // -----------------------------------------

    let step = 0;

    const render = () => {

        line.rotation.y = step += 0.01;
        line.rotation.z = step -= 0.01;
        line.rotation.x = step += 0.01;
        
        requestAnimationFrame(render);
        renderer.render(scene, camera);

    };

    render();

};
