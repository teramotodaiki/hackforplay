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
        });

        // 演出
        var game = enchant.Game.instance;
        var lay = new Overlay('rgba(0,0,0,0.4)'); // rgba(0,0,0,1)や#000000でも可能
        game.rootScene.addChild(lay);
        lay.opacity = 0;
        lay.tl.fadeIn(30, enchant.Easing.LINEAR).then(function(){
            switch (__H4PENV__MODE) {

                case 'quest':
                // [NEXT]
                (function (sprite) {
                    sprite.image = game.assets['hackforplay/new_button_next.png'];
                    sprite.moveTo(65, 320);
                    sprite.tl.moveTo(65, 240, 10, enchant.Easing.CUBIC_EASEOUT);
                    sprite.on('touchstart', function() {
                        window.parent.postMessage('quest_clear_level', '/');
                    });
                    game.rootScene.addChild(sprite);
                })(new Sprite(165, 69));
                // [RETRY]
                (function (sprite) {
                    sprite.image = game.assets['hackforplay/new_button_retry.png'];
                    sprite.moveTo(278, 320);
                    sprite.tl.moveTo(278, 250, 10, enchant.Easing.CUBIC_EASEOUT);
                    sprite.on('touchstart', function() {
                        location.reload();
                    });
                    game.rootScene.addChild(sprite);
                })(new Sprite(116, 48));
                break;
                case 'official':
                case 'replay':
                if (__H4PENV__NEXT) {
                    console.log('has next');
                    // window.parent.postMessage('clear', '/');
                    return;
                }
                // [RESTAGING]
                (function (sprite) {
                    sprite.image = game.assets['hackforplay/new_button_replay.png'];
                    sprite.moveTo(100, 320);
                    sprite.tl.moveTo(100, 264, 10, enchant.Easing.CUBIC_EASEOUT);
                    sprite.on('touchstart', function() {
                        window.parent.postMessage('begin_restaging', '/');
                    });
                    game.rootScene.addChild(sprite);
                })(new Sprite(116, 48));
                // [RETRY]
                (function (sprite) {
                    sprite.image = game.assets['hackforplay/new_button_retry.png'];
                    sprite.moveTo(264, 320);
                    sprite.tl.moveTo(264, 264, 10, enchant.Easing.CUBIC_EASEOUT);
                    sprite.on('touchstart', function() {
                        location.reload();
                    });
                    game.rootScene.addChild(sprite);
                })(new Sprite(116, 48));
                break;
            }
        });

        var clearlay = new Overlay(game.assets['hackforplay/clear.png']);
        game.rootScene.addChild(clearlay);
        clearlay.opacity = 0;
        clearlay.tl.fadeIn(30, enchant.Easing.LINEAR);
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
            switch (__H4PENV__MODE) {

                case 'quest':
                // [RETRY]
                (function (sprite) {
                    sprite.image = game.assets['hackforplay/new_button_retry.png'];
                    sprite.moveTo(182, 320);
                    sprite.tl.moveTo(182, 264, 10, enchant.Easing.CUBIC_EASEOUT);
                    sprite.on('touchstart', function() {
                        location.reload();
                    });
                    game.rootScene.addChild(sprite);
                })(new Sprite(116, 48));
                break;
                case 'official':
                case 'replay':
                // [RESTAGING]
                (function (sprite) {
                    sprite.image = game.assets['hackforplay/new_button_replay.png'];
                    sprite.moveTo(100, 320);
                    sprite.tl.moveTo(100, 264, 10, enchant.Easing.CUBIC_EASEOUT);
                    sprite.on('touchstart', function() {
                        window.parent.postMessage('begin_restaging', '/');
                    });
                    game.rootScene.addChild(sprite);
                })(new Sprite(116, 48));
                // [RETRY]
                (function (sprite) {
                    sprite.image = game.assets['hackforplay/new_button_retry.png'];
                    sprite.moveTo(264, 320);
                    sprite.tl.moveTo(264, 264, 10, enchant.Easing.CUBIC_EASEOUT);
                    sprite.on('touchstart', function() {
                        location.reload();
                    });
                    game.rootScene.addChild(sprite);
                })(new Sprite(116, 48));
                break;
            }
        });
        var gameoverlay = new Overlay(game.assets['hackforplay/gameover.png']);
        game.rootScene.addChild(gameoverlay);
        gameoverlay.opacity = 0;
        gameoverlay.tl.fadeIn(30, enchant.Easing.LINEAR);
    };
})();
