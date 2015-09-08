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

        if(__H4PENV__MODE === "restaging"){
            var darklay = overlay('color', 'rgba(0,0,0,0.4)');
            game.rootScene.addChild(darklay);
            darklay.tl.fadeIn(30, enchant.Easing.LINEAR);

            var clearlay = overlay('image', 'img/clear.png', 267, 48);
            clearlay.moveTo(106, 136);
            game.rootScene.addChild(clearlay);
            clearlay.tl.fadeIn(30, enchant.Easing.LINEAR);
        } else if (__H4PENV__MODE === 'quest') {
            var darklay = overlay('color', 'rgba(0,0,0,0.4)');
            game.rootScene.addChild(darklay);
            darklay.tl.fadeIn(30, enchant.Easing.LINEAR);

            var clearlay = overlay('image', 'img/clear.png', 267, 48);
            clearlay.moveTo(106, 136);
            game.rootScene.addChild(clearlay);
            clearlay.tl.fadeIn(30, enchant.Easing.LINEAR).then(function() {
                // [NEXT]
                var nextSprite = new Sprite(266, 48);
                nextSprite.moveTo(32, 320);
                nextSprite.image = game.assets['img/button_next.png'];
                nextSprite.ontouchend = function() {
                    // [NEXT] がクリックされたとき
                    window.parent.postMessage('quest_clear_level', '/');
                };
                game.rootScene.addChild(nextSprite);
                nextSprite.tl.moveTo(32, 220, 20, enchant.Easing.CUBIC_EASEOUT);

                // [RETRY]
                var retrySprite = new Sprite(128, 32);
                retrySprite.moveTo(330, 320);
                retrySprite.image = game.assets['img/button_retry.png'];
                retrySprite.ontouchend = function() {
                    // [RETRY] がクリックされたとき
                    location.reload(false);
                };
                game.rootScene.addChild(retrySprite);
                retrySprite.tl.moveTo(330, 226, 20, enchant.Easing.CUBIC_EASEOUT);
            });
        } else if (__H4PENV__MODE === 'replay') {
            var darklay = overlay('color', 'rgba(0,0,0,0.4)');
            game.rootScene.addChild(darklay);
            darklay.tl.fadeIn(30, enchant.Easing.LINEAR);

            var clearlay = overlay('image', 'img/clear.png', 267, 48);
            clearlay.moveTo(106, 136);
            game.rootScene.addChild(clearlay);
            clearlay.tl.fadeIn(30, enchant.Easing.LINEAR).then(function() {
                // [RESTAGING]
                var relaySprite = new Sprite(116, 48);
                relaySprite.moveTo(100, 320);
                relaySprite.image = game.assets['hackforplay/new_button_replay.png'];
                relaySprite.ontouchend = function() {
                    // [RESTAGING] がクリックされたとき
                    window.parent.postMessage('begin_restaging', '/');
                };
                game.rootScene.addChild(relaySprite);
                relaySprite.tl.moveTo(100, 220, 20, enchant.Easing.CUBIC_EASEOUT);

                // [RETRY]
                var retrySprite = new Sprite(116, 48);
                retrySprite.moveTo(264, 320);
                retrySprite.image = game.assets['hackforplay/new_button_retry.png'];
                retrySprite.ontouchend = function() {
                    // [RETRY] がクリックされたとき
                    location.reload(false);
                };
                game.rootScene.addChild(retrySprite);
                retrySprite.tl.moveTo(264, 220, 20, enchant.Easing.CUBIC_EASEOUT);
            });
        } else {
            var lay = new Overlay('black'); // rgba(0,0,0,1)や#000000でも可能
            game.rootScene.addChild(lay);
            lay.opacity = 0;
            lay.tl.fadeIn(30, enchant.Easing.LINEAR).then(function(){
                window.parent.postMessage('clear', '/');
            });
        }

        function overlay (type, style, w, h) {
            // 暗めのオーバーレイ
            var _lay = new Sprite(w || game.width, h || game.height);
            switch (type) {
                case 'image':
                    _lay.image = game.assets[style];
                    break;
                case 'color':
                    _lay.image = new Surface(_lay.width, _lay.height);
                    _lay.image.context.fillStyle = style;
                    _lay.image.context.fillRect(0, 0, _lay.width, _lay.height);
                    break;
            }
            _lay.touchEnabled = false;
            _lay.opacity = 0;
            return _lay;
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
