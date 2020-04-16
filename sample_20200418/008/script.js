
// = 008 ======================================================================
// three.js にはたくさんの組み込みジオメトリがあります。
// これまでのサンプルでは一貫してボックスばかり使っていましたが、代表的なその他
// のジオメトリについてもここで試してみましょう。
// 引数がそれぞれどういった意味を持っているのか疑問に思ったときは、公式のドキュ
// メント等を参考にしましょう。
// ちなみに、ここでは「マテリアルについては同じものを使いまわしている」という点
// も地味に重要です。個別に色や質感を変えたい場合は、もちろん別々のマテリアルを
// 使っても問題はありませんが、同じ質感であればマテリアルは再利用することで無駄
// なくプログラムを組むことができます。
// ============================================================================

(() => {
    window.addEventListener('DOMContentLoaded', () => {
        // 初期化処理
        init();

        window.addEventListener('keydown', (event) => {
            switch(event.key){
                case 'Escape':
                    run = event.key !== 'Escape';
                    break;
                case ' ':
                    isDown = true;
                    break;
                default:
            }
        }, false);
        window.addEventListener('keyup', (event) => {
            isDown = false;
        }, false);

        // 描画処理
        run = true;
        render();
    }, false);

    // 汎用変数
    let run = true; // レンダリングループフラグ
    let isDown = false; // スペースキーが押されているかどうかのフラグ

    // three.js に関連するオブジェクト用の変数
    let scene;      // シーン
    let camera;     // カメラ
    let renderer;   // レンダラ
    let geometry;   // ジオメトリ
    let material;   // マテリアル
    let box;        // ボックスメッシュ
    let sphere;     // スフィアメッシュ @@@
    let cone;       // コーンメッシュ @@@
    let torus;      // トーラスメッシュ @@@
    let plane;      // プレーンメッシュ @@@
    let controls;   // カメラコントロール
    let axesHelper; // 軸ヘルパーメッシュ
    let directionalLight; // ディレクショナル・ライト（平行光源）
    let ambientLight;     // アンビエントライト（環境光）

    // カメラに関するパラメータ
    const CAMERA_PARAM = {
        fovy: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 30.0,
        x: 0.0,
        y: 5.0,
        z: 10.0,
        lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    };
    // レンダラに関するパラメータ
    const RENDERER_PARAM = {
        clearColor: 0x666666,
        width: window.innerWidth,
        height: window.innerHeight,
    };
    // マテリアルのパラメータ
    const MATERIAL_PARAM = {
        color: 0x3399ff,    // マテリアル自体の色
        specular: 0xffffff, // スペキュラ成分（反射光）の色
    };
    // ライトに関するパラメータの定義
    const DIRECTIONAL_LIGHT_PARAM = {
        color: 0xffffff, // 光の色
        intensity: 1.0,  // 光の強度
        x: 1.0,          // 光の向きを表すベクトルの X 要素
        y: 1.0,          // 光の向きを表すベクトルの Y 要素
        z: 1.0           // 光の向きを表すベクトルの Z 要素
    };
    // アンビエントライトに関するパラメータの定義
    const AMBIENT_LIGHT_PARAM = {
        color: 0xffffff, // 光の色
        intensity: 0.2,  // 光の強度
    };

    function init(){
        // シーン
        scene = new THREE.Scene();

        // レンダラ
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
        renderer.setSize(RENDERER_PARAM.width, RENDERER_PARAM.height);
        const wrapper = document.querySelector('#webgl');
        wrapper.appendChild(renderer.domElement);

        // カメラ
        camera = new THREE.PerspectiveCamera(
            CAMERA_PARAM.fovy,
            CAMERA_PARAM.aspect,
            CAMERA_PARAM.near,
            CAMERA_PARAM.far
        );
        camera.position.set(CAMERA_PARAM.x, CAMERA_PARAM.y, CAMERA_PARAM.z);
        camera.lookAt(CAMERA_PARAM.lookAt);

        // マテリアル（以下のメッシュ生成ではこのマテリアルを使いまわす）
        material = new THREE.MeshPhongMaterial(MATERIAL_PARAM);

        // ボックスジオメトリの生成とメッシュ化 @@@
        geometry = new THREE.BoxGeometry(1.0, 2.0, 3.0);
        box = new THREE.Mesh(geometry, material);
        box.position.x = 2.0;
        box.position.z = -2.0;
        scene.add(box);
        // スフィアジオメトリの生成とメッシュ化 @@@
        geometry = new THREE.SphereGeometry(1.0, 16, 16);
        sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = 2.0;
        sphere.position.z = 2.0;
        scene.add(sphere);
        // コーンジオメトリの生成とメッシュ化 @@@
        geometry = new THREE.ConeGeometry(1.0, 1.5, 32);
        cone = new THREE.Mesh(geometry, material);
        cone.position.x = -2.0;
        cone.position.z = 2.0;
        scene.add(cone);
        // トーラスジオメトリの生成とメッシュ化 @@@
        geometry = new THREE.TorusGeometry(1.0, 0.4, 32, 32);
        torus = new THREE.Mesh(geometry, material);
        torus.position.x = -2.0;
        torus.position.z = -2.0;
        scene.add(torus);
        // プレーンジオメトリの生成とメッシュ化 @@@
        geometry = new THREE.PlaneGeometry(20.0, 20.0);
        plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2.0;
        plane.position.set(0.0, -2.0, 0.0);
        scene.add(plane);

        // ディレクショナルライト
        directionalLight = new THREE.DirectionalLight(
            DIRECTIONAL_LIGHT_PARAM.color,
            DIRECTIONAL_LIGHT_PARAM.intensity
        );
        directionalLight.position.x = DIRECTIONAL_LIGHT_PARAM.x;
        directionalLight.position.y = DIRECTIONAL_LIGHT_PARAM.y;
        directionalLight.position.z = DIRECTIONAL_LIGHT_PARAM.z;
        scene.add(directionalLight);

        // アンビエントライト
        ambientLight = new THREE.AmbientLight(
            AMBIENT_LIGHT_PARAM.color,
            AMBIENT_LIGHT_PARAM.intensity
        );
        scene.add(ambientLight);

        // 軸ヘルパー
        axesHelper = new THREE.AxesHelper(5.0);
        scene.add(axesHelper);

        // コントロール
        controls = new THREE.OrbitControls(camera, renderer.domElement);
    }

    function render(){
        // 再帰呼び出し
        if(run === true){requestAnimationFrame(render);}

        // スペースキーが押されている場合メッシュ各種を回転させる @@@
        if(isDown === true){
            box.rotation.y    += 0.02;
            box.rotation.z    += 0.02;
            sphere.rotation.y += 0.02;
            sphere.rotation.z += 0.02;
            cone.rotation.y   += 0.02;
            cone.rotation.z   += 0.02;
            torus.rotation.y  += 0.02;
            torus.rotation.z  += 0.02;
        }

        // 描画
        renderer.render(scene, camera);
    }
})();

