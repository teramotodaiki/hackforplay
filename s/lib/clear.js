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

        // Questの実績を報告
        if (__H4PENV__MODE === 'quest') {
            window.parent.postMessage('quest_clear_level', '/');
        }

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
                        window.parent.postMessage('quest_move_next', '/');
                    });
                    game.rootScene.addChild(sprite);
                })(new Sprite(165, 69));
                // [COMMENT]
                (function (sprite) {
                    sprite.image = game.assets['hackforplay/new_button_comment.png'];
                    sprite.moveTo(250, 320);
                    sprite.tl.moveTo(250, 240, 10, enchant.Easing.CUBIC_EASEOUT);
                    sprite.on('touchstart', function() {
                        window.parent.postMessage('show_comment', '/');
                    });
                    game.rootScene.addChild(sprite);
                })(new Sprite(165, 69));
                break;
                case 'official':
                if (__H4PENV__PATH.indexOf('tutorial') === 0) {
                    // チュートリアルステージをクリアしたとき
                    if (__H4PENV__NEXT) {
                        // [NEXT]
                        (function (sprite) {
                            sprite.image = game.assets['hackforplay/new_button_next.png'];
                            sprite.moveTo(157, 320);
                            sprite.tl.moveTo(157, 240, 10, enchant.Easing.CUBIC_EASEOUT);
                            sprite.on('touchstart', function() {
                                window.parent.postMessage('tutorial_next_page', '/');
                            });
                            game.rootScene.addChild(sprite);
                        })(new Sprite(165, 69));
                    } else {
                        // さらに暗く
                        var dark = new Overlay('rgb(0,0,0,1)');
                        dark.opacity = 0;
                        game.rootScene.addChild(dark);
                        dark.tl.fadeIn(60, enchant.Easing.CUBIC_EASEOUT).then(function () {
                            var label = new Label('OPEN THE BOX');
                            label.width = 480;
                            label.moveTo(0, 100);
                            label.color = 'white';
                            label.textAlign = 'center';
                            label.opacity = 0;
                            label.tl.fadeIn(15);
                            game.rootScene.addChild(label);
                            var treasure = new Sprite(32, 32);
                            treasure.image = game.assets['img/map1.gif'];
                            treasure.moveTo(224, 150);
                            treasure.frame = 420;
                            treasure.opacity = 0;
                            treasure.tl.delay(30).fadeIn(15);
                            treasure.ontouchstart = function () {
                                game.rootScene.removeChild(cursor);
                                this.tl.fadeOut(20).and().scaleTo(6, 6, 20);
                                setTimeout(function () {
                                    // アニメーション中に移動
                                    window.parent.postMessage('tutorial_next_page', '/');
                                }, 1000);
                            };
                            game.rootScene.addChild(treasure);
                            var cursor = new Sprite(32, 32);
                            cursor.image = game.assets['img/icon0.png'];
                            cursor.frame = 43;
                            cursor.moveTo(224, 190);
                            setTimeout(function () {
                                game.rootScene.addChild(cursor);
                                cursor.tl.delay(15).moveBy(0, -8, 1).delay(15).moveBy(0, 8, 1).loop();
                            }, 8000);
                        });
                    }

                } else {
                    // そうでないステージをクリアしたとき => 何もしない
                }
                break;
                case 'replay':
                // [RESTAGING]
                (function (sprite) {
                    sprite.image = game.assets['hackforplay/new_button_restage.png'];
                    sprite.moveTo(65, 320);
                    sprite.tl.moveTo(65, 240, 10, enchant.Easing.CUBIC_EASEOUT);
                    sprite.on('touchstart', function() {
                        window.parent.postMessage('begin_restaging', '/');
                    });
                    game.rootScene.addChild(sprite);
                })(new Sprite(165, 69));
                // [RETRY]
                (function (sprite) {
                    sprite.image = game.assets['hackforplay/new_button_retry.png'];
                    sprite.moveTo(250, 320);
                    sprite.tl.moveTo(250, 240, 10, enchant.Easing.CUBIC_EASEOUT);
                    sprite.on('touchstart', function() {
                        location.reload();
                    });
                    game.rootScene.addChild(sprite);
                })(new Sprite(165, 69));
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
                    sprite.moveTo(157, 320);
                    sprite.tl.moveTo(157, 240, 10, enchant.Easing.CUBIC_EASEOUT);
                    sprite.on('touchstart', function() {
                        location.reload();
                    });
                    game.rootScene.addChild(sprite);
                })(new Sprite(165, 69));
                break;
                case 'official':
                case 'replay':
                // [RESTAGING]
                (function (sprite) {
                    sprite.image = game.assets['hackforplay/new_button_restage.png'];
                    sprite.moveTo(65, 320);
                    sprite.tl.moveTo(65, 240, 10, enchant.Easing.CUBIC_EASEOUT);
                    sprite.on('touchstart', function() {
                        window.parent.postMessage('begin_restaging', '/');
                    });
                    game.rootScene.addChild(sprite);
                })(new Sprite(165, 69));
                // [RETRY]
                (function (sprite) {
                    sprite.image = game.assets['hackforplay/new_button_retry.png'];
                    sprite.moveTo(250, 320);
                    sprite.tl.moveTo(250, 240, 10, enchant.Easing.CUBIC_EASEOUT);
                    sprite.on('touchstart', function() {
                        location.reload();
                    });
                    game.rootScene.addChild(sprite);
                })(new Sprite(165, 69));
                break;
            }
        });
        var gameoverlay = new Overlay(game.assets['hackforplay/gameover.png']);
        game.rootScene.addChild(gameoverlay);
        gameoverlay.opacity = 0;
        gameoverlay.tl.fadeIn(30, enchant.Easing.LINEAR);
    };

})();
