
window.addEventListener('load', function() {
    var path = __H4PENV__PATH;
    game.preload(path+'SC-DoorI01.png');
    game.start();
    var hint;
    game.addEventListener('load', function(){

        var map = maps['Living'];
        map.load();                 // Load map

        var player = new Player('player');  // プレイヤーを作る
        map.scene.addChild(player);         // プレイヤーをシーンに追加する
        player.locate(7, 5);

        hint =
        "// ノーシグナル ......";

        // ここはコピペ
        // Runtime Evaluation
        setEval(function(code){
            eval(code);
        });
    });

    __H4PENV__DEFAULTCODE =
    "// ステージ改造コードを書いて、ステージを改造してやろう!!\n";
});

