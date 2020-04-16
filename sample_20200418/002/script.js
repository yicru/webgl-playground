
// = 002 ======================================================================
// まず最初に、描画結果を確認しやすくするために、マウスで描画結果に干渉できるよ
// うにしておきましょう。
// three.js には、カメラを操作するためのコントロールと呼ばれる補助機能が用意され
// ているので、それを読み込んで利用します。
// より具体的には、ここでは OrbitControls と名付けられたコントロールを使っていま
// す。three.js には他のコントロールもありますが、最も直感的な動作をしてくれるの
// がオービットコントロールだと思います。
// このサンプルでは、OrbitControls を利用するために index.html にも変更が加えら
// れていますので、注意しましょう。
// ============================================================================

(() => {
    window.addEventListener('DOMContentLoaded', () => {
        // 初期化処理
        init();

        // - レンダリング・ループ ---------------------------------------------
        // WebGL 実装の多くでは、特に理由がない場合、連続してレンダリングを行い
        // 続けることで 3D シーンをアニメーションさせます。
        // このような処理は一般に恒常ループ、あるいはレンダリングループなどと呼
        // ばれます。JavaScript でこのようなループ処理を実現するのに最も適切な方
        // 法は requestAnimationFrame を利用することです。
        // ただし、レンダリングループを設定すると、意図的にそれを停止しない限り
        // 永遠に描画処理が続行されます。これを任意のタイミングで止めることがで
        // きるようにするために、スクールのサンプルで Escape キーを押下すると、
        // レンダリングループを止めることができるような設計にしています。
        // --------------------------------------------------------------------
        window.addEventListener('keydown', (event) => {
            // キーダウンイベントで、押されたキーが Escape キーかどうか調べる @@@
            run = event.key !== 'Escape';
        }, false);

        // 描画処理
        run = true;
        render();
    }, false);

    // 汎用変数
    let run = true; // レンダリングループフラグ @@@

    // three.js に関連するオブジェクト用の変数
    let scene;    // シーン
    let camera;   // カメラ
    let renderer; // レンダラ
    let geometry; // ジオメトリ
    let material; // マテリアル
    let box;      // ボックスメッシュ
    let controls; // カメラコントロール @@@

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

        // コントロール @@@
        controls = new THREE.OrbitControls(camera, renderer.domElement);
    }

    function render(){
        // 再帰呼び出し @@@
        if(run === true){
            // - requestAnimationFrame とは -----------------------------------
            // 現代の一般的な PC などのディスプレイは、１秒間に６０回画面が更新
            // されます。この画面の更新回数のことを「リフレッシュレート」と呼び、
            // リフレッシュレートが高いほど、アニメーションがなめらかになります。
            // requestAnimationFrame には、このリフレッシュレートに応じて処理を
            // 実行してくれる機能があります。
            // 第一引数に指定した関数が、次の画面の更新に合わせて自動的に実行さ
            // れます。これにより、再帰的にアニメーションを行うような仕組みを実
            // 現することができるようになっています。
            // ----------------------------------------------------------------
            requestAnimationFrame(render);
        }

        // 描画
        renderer.render(scene, camera);
    }
})();

