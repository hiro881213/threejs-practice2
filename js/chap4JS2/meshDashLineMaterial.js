let scene;
let camera;
let renderer;

let width = window.innerWidth;
let height = 500;

export const makeDachLineMaterial = () => {
    
    const gosper = (a, b) => {

        let turtle = [0, 0, 0];
        let points = [];
        let count = 0;

        rg(a, b, turtle);

        return points;

        function rt(x) {
            turtle[2] += x;
        }

        function lt(x) {
            turtle[2] -= x;
        }

        function fd(dist) {
            points.push({
                x: turtle[0],
                y: turtle[1],
                z: Math.sin(count) *5
            });

            let dir = turtle[2] * (Math.PI / 180);
            turtle[0] += Math.cos(dir) * dist;
            turtle[1] += Math.sin(dir) * dist;

            points.push({
                x: turtle[0],
                y: turtle[1],
                z: Math.sin(count) * 5
            });

        }

        function rg(st, ln, turtle) {

            st--;
            ln = ln / 2.6457;

            if (st > 0) {

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
                rg(st, ln, turtle);

                lt(60);
                gl(st, ln, turtle);

            }

            if (st == 0) {

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

    } 

    // ????????????????????????
    scene = new THREE.Scene();

    // ????????????????????????
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    // --------------------------------
    // ????????????????????????
    // --------------------------------

    // ???????????????????????????
    let renderer = new THREE.WebGLRenderer();

    // ????????????????????????
    renderer.setClearColor(new THREE.Color(0x000000));

    // ????????????????????????
    renderer.setSize(width, height);

    // ????????????????????????????????????
    renderer.shadowMap.enabled = true;

    // --------------------------------
    // ?????????????????????
    // --------------------------------

    // ?????????????????????????????????
    camera.position.set(-30, 40, 30);

    // ?????????????????????????????????
    camera.lookAt(scene.position);

    // --------------------------------
    // ?????????????????????
    // --------------------------------

    // ????????????????????????
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);

    // ????????????????????????????????????
    scene.add(ambientLight);

    // --------------------------------
    // ?????????????????????
    // --------------------------------

    // ????????????????????????
    let spotLight = new THREE.SpotLight(0xffffff);

    // ?????????????????????????????????
    spotLight.position.set(-40, 60, -10);

    // ???????????????????????????????????????
    spotLight.castShadow = true;

    // ????????????????????????????????????
    scene.add(spotLight);

    // --------------------------------
    // ?????????????????????????????????
    // --------------------------------

    // ?????????????????????
    let points = gosper(4, 60);

    // ???????????????????????????????????????
    let lines = new THREE.Geometry();

    // ????????????????????????
    let colors =[];

    let i = 0;

    // ?????????????????????????????????
    points.forEach((e) => {

        // ????????????????????????????????????????????????
        lines.vertices.push(new THREE.Vector3(e.x, e.z, e.y));

        colors[i] = new THREE.Color(0xffffff);
        colors[i].setHSL(e.x / 100 + 0.5, (e.y * 20) / 300, 0.8);
        i++;

    });

    // ??????????????????????????????
    lines.colors = colors;

    lines.computeLineDistances();

    // ????????????????????????????????????
    let material = new THREE.LineDashedMaterial({
        vertexColors: true,
        color: 0xffffff,
        dashSize: 2,
        gapSize: 2,
        scale: 0.2
    });

    // ????????????????????????????????????
    let line = new THREE.Line(lines, material);

    // ?????????????????????????????????????????????
    line.position.set(25, -30, -60);

    // ????????????????????????????????????????????????
    scene.add(line);

    // THREE.JS?????????????????????DOM???????????????
    document.getElementById("meshLineDashMaterial-output").appendChild(renderer.domElement);

    let step = 0;

    const render = () => {

        // ?????????????????????????????????????????????
        line.rotation.z = step += 0.01;

        // ???????????????????????????????????????
        requestAnimationFrame(render);
        renderer.render(scene, camera);

    };

    render();

}
    