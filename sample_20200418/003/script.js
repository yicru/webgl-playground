
// = 003 ======================================================================
// three.js には、情報を可視化するためのヘルパーと呼ばれる補助機能があります。
// これは主に開発中に、実装を行う上での補助を行ってくれる機能で、リリースする前
// の段階でヘルパーは削除（もしくは非表示に）するのが前提になります。
// 当面は、わかりやすさを重視してヘルパーを使っていきましょう。
// ============================================================================

(() => {
    window.addEventListener('DOMContentLoaded', () => {
        // 初期化処理
        init();

        window.addEventListener('keydown', (event) => {
            run = event.key !== 'Escape';
        }, false);

        // 描画処理
        run = true;
        render();
    }, false);

    // 汎用変数
    let run = true; // レンダリングループフラグ

    // three.js に関連するオブジェクト用の変数
    let scene;      // シーン
    let camera;     // カメラ
    let renderer;   // レンダラ
    let geometry;   // ジオメトリ
    let material;   // マテリアル
    let box;        // ボックスメッシュ
    let controls;   // カメラコントロール
    let axesHelper; // 軸ヘルパーメッシュ @@@

    // カメラに関するパラメータ
    const CAMERA_PARAM = {
        fovy: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 10.0,
        x: 0.0,
        y: 2.0,
        z: 5.0,
        lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    };
    // レンダラに関するパラメータ
    const RENDERER_PARAM = {
        clearColor: 0x666666,
        width: window.innerWidth,
        height: window.innerHeight,
    };
    // マテリアルに関するパラメータ
    const MATERIAL_PARAM = {
        color: 0x3399ff,
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

        // ジオメトリ、マテリアル、メッシュ生成
        geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
        material = new THREE.MeshBasicMaterial(MATERIAL_PARAM);
        box = new THREE.Mesh(geometry, material);
        scene.add(box);

        // - 軸ヘルパーを追加する ---------------------------------------------
        // axis とは、3D 用語としては「XYZ などの軸」を表します。
        // X 軸なら、横方向に伸びる軸のこと。同様に Y なら縦方向、Z なら前後に伸
        // びる軸のことをいいます。AxesHelper では、XYZ の各軸を手間なく簡単に、
        // シーンに追加することができます。
        // なお、XYZ を RGB に置き換えてみると、X が R で赤、Y が G で緑というよ
        // うに、多少カメラが動いてしまっても方向がイメージしやすいと思います。
        // --------------------------------------------------------------------
        // 軸ヘルパー @@@
        axesHelper = new THREE.AxesHelper(5.0);
        scene.add(axesHelper);

        // コントロール
        controls = new THREE.OrbitControls(camera, renderer.domElement);
    }

    function render(){
        // 再帰呼び出し
        if(run === true){requestAnimationFrame(render);}

        // 描画
        renderer.render(scene, camera);
    }
})();

