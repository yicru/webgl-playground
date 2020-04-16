
// = 005 ======================================================================
// オブジェクトに光を当て、より立体感を出すためにライトを導入しましょう。
// three.js を用いる場合はライトはオブジェクトとしてシーンに追加します。つまり、
// three.js ではオブジェクトを照らすライトについても、これまでに登場した様々なオ
// ブジェクトと同じように「シーンに追加する」という手順で扱えばいいのですね。
// 3D の世界では、ライトには様々な種類（分類）があります。
// まずは最もポピュラーなライトである平行光源のライトをシーンに追加し、オブジェ
// クトがより立体的に見えるようにしてみましょう。
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
    let controls;   // カメラコントロール
    let axesHelper; // 軸ヘルパーメッシュ
    let directionalLight; // ディレクショナル・ライト（平行光源） @@@

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
    // ライトに関するパラメータの定義 @@@
    const DIRECTIONAL_LIGHT_PARAM = {
        color: 0xffffff, // 光の色
        intensity: 1.0,  // 光の強度
        x: 1.0,          // 光の向きを表すベクトルの X 要素
        y: 1.0,          // 光の向きを表すベクトルの Y 要素
        z: 1.0           // 光の向きを表すベクトルの Z 要素
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
        // - ライトを有効にするためにマテリアルを変更する ---------------------
        // ライトというと照らす側の光源のことばかり考えてしまいがちですが、その
        // 光を受け取る側の準備も必要です。
        // 具体的には、メッシュに適用するマテリアルをライトを受けることができる
        // タイプに変更します。いくつかある対応するマテリアルのうち、今回はまず
        // ランバートマテリアルを選択します。
        // three.js には、ライトの影響を受けるマテリアルと、そうでないマテリアル
        // があります。以前までのサンプルで利用していた MeshBasicMaterial は、
        // ライトの影響を受けないマテリアルです。（つまりベタ塗り用）
        // --------------------------------------------------------------------
        // change material type @@@
        material = new THREE.MeshLambertMaterial(MATERIAL_PARAM);
        box = new THREE.Mesh(geometry, material);
        scene.add(box);

        // - ライトオブジェクトを生成してシーンに追加する ---------------------
        // 続いてライトオブジェクトを作ります。
        // 先述のとおりライトにはいくつか種類がありますが今回は平行光源を使いま
        // す。平行光源は英語ではディレクショナルライト、と呼びます。
        // また、光には色や強度という概念を持たせることができますので、これらは
        // 引数で任意の値を指定してやります。
        // --------------------------------------------------------------------
        // initialize light @@@
        directionalLight = new THREE.DirectionalLight(
            DIRECTIONAL_LIGHT_PARAM.color,
            DIRECTIONAL_LIGHT_PARAM.intensity
        );
        directionalLight.position.x = DIRECTIONAL_LIGHT_PARAM.x;
        directionalLight.position.y = DIRECTIONAL_LIGHT_PARAM.y;
        directionalLight.position.z = DIRECTIONAL_LIGHT_PARAM.z;
        scene.add(directionalLight);

        // 軸ヘルパー
        axesHelper = new THREE.AxesHelper(5.0);
        scene.add(axesHelper);

        // コントロール
        controls = new THREE.OrbitControls(camera, renderer.domElement);
    }

    function render(){
        // 再帰呼び出し
        if(run === true){requestAnimationFrame(render);}

        // スペースキーが押されたフラグが立っている場合、メッシュを操作する
        if(isDown === true){
            box.rotation.y += 0.05;
        }

        // 描画
        renderer.render(scene, camera);
    }
})();

