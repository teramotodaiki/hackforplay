/*
 * clear.js
 * ステージクリアしたときに呼び出す,ゲームオーバー時に呼び出す
*/
var clear; // clearメソッドはグローバルスコープ
var gameover; // gameoverメソッドも
(function(){
    var running = true;    //  実行中フラグ

    clear = function() {
        if(!running) return;     // すでにクリア
        else running = false;    // 終了したフラグ
        env.player.onenterframe();
        env.player.onenterframe = function(){};
        var token = __H4PENV__TOKEN;

        // クリア状態を送信
        $.post('../../stage/playlog.php', {
            'value': 'clear',
            'attendance-token': sessionStorage.getItem('attendance-token')
        }, function(data, textStatus, xhr) {
            console.log(data);
        });

        // 演出
        var game = enchant.Game.instance;

        if(__H4PENV__MODE === "restaging"){
            var gameclearray = new Overlay(game.assets['img/clear.png']);
            gameclearray.width = 267;
            gameclearray.height = 48;
            gameclearray.moveTo(106, 136);
            game.rootScene.addChild(gameclearray);
            gameclearray.opacity = 0;
            gameclearray.tl.fadeIn(30, enchant.Easing.LINEAR).then(function(){
                console.log("cleared");
            });
        }else{
            var lay = new Overlay('black'); // rgba(0,0,0,1)や#000000でも可能
            game.rootScene.addChild(lay);
            lay.opacity = 0;
            lay.tl.fadeIn(30, enchant.Easing.LINEAR).then(function(){
                window.parent.postMessage('clear', '/');
            });
        }
    };

    gameover = function(){
        if(!running) return;     // すでにクリア
        else running = false;    // 終了したフラグ
        env.player.onenterframe = function(){};

        // 演出
        var game = enchant.Game.instance;
        var lay = new Overlay('rgba(0,0,0,0.4)'); // rgba(0,0,0,1)や#000000でも可能
        game.rootScene.addChild(lay);
        lay.opacity = 0;
        lay.tl.fadeIn(30, enchant.Easing.LINEAR).then(function(){
            if(__H4PENV__MODE === "official" || __H4PENV__MODE === "replay"){
                var retry = new Sprite(128, 32);
                retry.image = game.assets['img/button_retry.png'];
                retry.moveTo(176, 320);
                retry.tl.moveTo(176, 270, 10);
                retry.on('touchstart', function() {
                    location.reload();
                });
                game.rootScene.addChild(retry);
            }
        });
        var gameoverlay = new Overlay(game.assets['img/gameover.png']);
        game.rootScene.addChild(gameoverlay);
        gameoverlay.opacity = 0;
        gameoverlay.tl.fadeIn(30, enchant.Easing.LINEAR);
    };
})();
