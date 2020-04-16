
// = 001 ======================================================================
// three.js サンプルの雛形。
// これは基本となる雛形サンプルなので他のサンプルよりもコメント多めになってます。
// ============================================================================

// - JavaScript にあまり詳しくない方向けの解説 --------------------------------
// JavaScript がブラウザ上で動作するとき、変数などのスコープのうち、最も広い範囲
// で有効となるグローバルスコープは「ウィンドウの名前空間」です。
// つまり、JavaScript におけるグローバルスコープは window.XXXXX のように window
// のプロパティとして定義されます。
// また、JavaScript では関数を使ってスコープを切ることができます。ですから以下の
// 例では、スクリプトの処理全体を関数で包んでしまうことによって、利用する変数や
// 関数がグローバル汚染をしないようにしているわけですね。
// ----------------------------------------------------------------------------
// グローバル空間を汚染しないように、無名関数で全体を囲んでいます
(() => {
    window.addEventListener('DOMContentLoaded', () => {
        // デバッグ出力
        console.log('🍎 dom content loaded!');
        // 初期化処理
        init();
        // デバッグ出力
        console.log('🍹 initialized!');
        // 描画処理
        render();
        // デバッグ出力
        console.log('😋 rendered!');
    }, false);

    // three.js に関連するオブジェクト用の変数
    let scene;    // シーン
    let camera;   // カメラ
    let renderer; // レンダラ
    let geometry; // ジオメトリ
    let material; // マテリアル
    let box;      // ボックスメッシュ

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
        clearColor: 0x666666,       // 背景をクリアする色
        width: window.innerWidth,   // レンダリングする領域の幅
        height: window.innerHeight, // レンダリングする領域の高さ
    };
    // マテリアルに関するパラメータ
    const MATERIAL_PARAM = {
        color: 0x3399ff,            // マテリアルの持つ色
    };

    // デバッグ出力
    console.log('🍏 declared!');

    function init(){
        // - 初期化フェーズ ---------------------------------------------------
        // three.js には多数の組み込みオブジェクトが用意されており、これらを通し
        // て様々な処理を行っていきます。この初期化フェーズではそれらを実際にイ
        // ンスタンス化しながら、必要な設定などを適宜行なっていきます。
        // --------------------------------------------------------------------

        // . シーンの初期化 ...................................................
        // Scene とは、その名のとおり 3D シーンを管理するためのものです。
        // たとえばこのシーンにはどんなオブジェクトを使うのか、であったり、ある
        // いはどんなカメラを使って撮影を行うのかなど、3D 空間全体の情報をまとめ
        // て持っているのが Scene オブジェクトです。
        // 3D の専門用語では、いわゆるシーングラフ（Scene Graph）と呼ばれている
        // もので、three.js ではこれを Scene オブジェクトによって実現します。
        // ....................................................................
        scene = new THREE.Scene();

        // . レンダラの初期化 .................................................
        // レンダラ、という言葉はフロントエンドではあまり見聞きしない言葉ですね。
        // わかりやすく言うなら、レンダラとは「現像する人」です。カメラが撮影し
        // たフィルムを、現像してスクリーンに映してくれるわけです。
        // レンダラという言葉自体は three.js に独特なものではありませんが、一般
        // 的なレンダラと three.js のレンダラは、ちょっとだけ意味合いが違うので
        // 間違った覚え方をしないように気をつけましょう。
        // ....................................................................
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
        renderer.setSize(RENDERER_PARAM.width, RENDERER_PARAM.height);
        const wrapper = document.querySelector('#webgl');
        wrapper.appendChild(renderer.domElement);

        // . カメラの初期化 ...................................................
        // three.js におけるカメラは、現実世界のカメラと同じように空間を撮影する
        // ために使います。
        // 現実のカメラがそうであるように、カメラの性能や、あるいは性質によって、
        // 最終的に描かれる世界はまったく違ったものになります。
        // カメラに限らず、設定しているパラメータの詳細については別途解説します。
        // ....................................................................
        camera = new THREE.PerspectiveCamera(
            CAMERA_PARAM.fovy,
            CAMERA_PARAM.aspect,
            CAMERA_PARAM.near,
            CAMERA_PARAM.far
        );
        camera.position.set(CAMERA_PARAM.x, CAMERA_PARAM.y, CAMERA_PARAM.z);
        camera.lookAt(CAMERA_PARAM.lookAt);

        // . ジオメトリとマテリアルの初期化 ...................................
        // ジオメトリとは、3D シーンを描くために使う「頂点」の集合体です。
        // もっと言うと、ジオメトリとは「単なる形状」であり、言うなれば設計図、
        // あるいは骨組みのようなものです。
        // これにどのような色を塗るであるとか、どのような質感の材質を使うである
        // とか、そういったことは「マテリアル」が決めます。
        // ....................................................................
        geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
        material = new THREE.MeshBasicMaterial(MATERIAL_PARAM);

        // . メッシュの初期化 .................................................
        // three.js では、ジオメトリとマテリアルを別々に生成し組み合わせることで
        // 3D 空間に置くことができるメッシュオブジェクトを定義できます。
        // 定義したメッシュオブジェクトは、最終的に「シーンに追加」しておいてや
        // る必要があります。シーンオブジェクトが持つ add メソッドを利用すると、
        // シーンにメッシュを追加することができます。
        // ....................................................................
        box = new THREE.Mesh(geometry, material);
        scene.add(box);
    }

    function render(){
        // - 描画フェーズ -----------------------------------------------------
        // さていよいよ描画です。
        // 描画を行うためには、必要なオブジェクトをまず「シーンに追加」したあと、
        // そのシーンをレンダラで「スクリーンに描画」します。
        // このとき、どのシーンを、どのカメラで描画するかを指定します。
        // --------------------------------------------------------------------

        // レンダラにシーンとカメラを渡して描画させる
        renderer.render(scene, camera);
    }
})();

