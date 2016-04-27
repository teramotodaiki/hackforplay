/*
 * きちんと文字折り返しをして、Web Fontが使えて、任意文字数を表示できるテキストエリア。
 */
 var textarea = {}; // textareaは、どこからでも呼び出せる
 window.addEventListener('load', function(){

    var entity = new enchant.Entity(); // enchant.jsでDOM要素を表示させる場合はEntityを使う
    entity.width = 460;
    entity.height = 100;
    entity.moveTo(10, 140); // topの値をこれより下げられない事件...
    entity.opacity = 0.9;
    entity._element = $("<textarea disabled>").css({
        "border":"2px solid #e8e8e8",
        "-moz-border-radius": "5px",
        "-webkit-border-radius": "5px"
    }).get(0);
    entity._element.type = "textarea";
    game.on('abuttondown', function() {
        textarea.hide();
    });
    entity.on('enterframe', function(){
        if(env.player.beginWalking){
            textarea.hide();
        }
    });
    var close = new Sprite(460, 40);
    close.moveTo(entity.x, entity.y+entity.height+10);
    close.on('touchstart', function(){
        textarea.hide();
    });

    var enabled = false; // textareaの表示/非表示を保持するプライベート変数
    textarea.show = function(){
        enabled = true;
        if(entity.scene !== game.rootScene){
            game.rootScene.addChild(entity);
            if(close.image == null){
                close.image = game.assets['img/close.png'];
            }
            game.rootScene.addChild(close);
            entity.moveTo(10, 140); // topの値を初期化
            entity.width = 460;
            entity.height = 100;
            close.visible = true; // 閉じるボタンの表示状態を初期化
        }else{
        // 奥に隠れているとき、手前に表示させる処理

        }
    };
    textarea.hide = function(){
        enabled = false;
        if(entity.scene === game.rootScene){
            game.rootScene.removeChild(entity);
            game.rootScene.removeChild(close);
        }
    };
    textarea.__defineGetter__('entity', function(){ return entity; });
    textarea.__defineGetter__('element', function(){ return entity._element; });
    textarea.__defineGetter__('enabled', function(){ return enabled; });
    textarea.__defineGetter__('text', function(){ return entity._element.value; });
    textarea.__defineSetter__('text', function(t){ entity._element.value = t; });
    textarea.__defineGetter__('closeSprite', function(){ return close; });

 });