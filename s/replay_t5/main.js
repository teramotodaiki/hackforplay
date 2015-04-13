window.addEventListener('load', function() {
    var path = __H4PENV__PATH;
    game.preload(path+'monster4.gif');
    game.start();
    var blueSlime, hint;
    game.addEventListener('load', function(){

        var map = maps['replay'];
        map.load();                 // Load map

        env.enchantbook = new EnchantBook();
        game.rootScene.addChild(env.enchantbook);

        blueSlime = new BlueSlime('blueSlime'); // make blue slime
        map.scene.addChild(blueSlime);
        blueSlime.locate(9, 5);

        var stair = new Stair('stair');
        map.scene.addChild(stair);
        stair.locate(13, 5);

        var player = new Knight('player'); // make player
        map.scene.addChild(player); // add player to scene
        player.locate(1, 5); // move position

        hint =
            "\n"+
            "";

        // ここはコピペ
        // Runtime Evaluation
        setEval(function(code){
            eval(code);
        });
    });

    var BlueSlime = enchant.Class(Behaviour, {
        initialize: function(_namae){
            Behaviour.call(this, {
                namae: _namae,
                image: path+'monster4.gif',
                width:48, height:48,
                dx: -8, dy: -10
            });
            this.width = this.height = 32;
            this.collider.y = 0;
            this.sprite.frame = [2, 2, 2, 3, 3, 3];
            this.hp = 3;
            this.behavior = BehaviorTypes.Idle;
            this.isPublic = false;
            this.useMessage = false;
        },
        damage : function(atk){
            if( this.behavior !== BehaviorTypes.Damaged &&
                this.behavior !== BehaviorTypes.Dead){
                this.hp -= atk;
                if(this.hp > 0){
                    this.behavior = BehaviorTypes.Damaged;
                    this.sprite.frame = [4, 4, 5, null];
                    this.tl.clear().delay(5).then(function(){
                        this.behavior = BehaviorTypes.Idle;
                        this.sprite.frame = [2, 2, 2, 3, 3, 3];
                    });
                }else{
                    this.behavior = BehaviorTypes.Dead;
                    this.sprite.frame = [5, 5, 5, 7, 7];
                    this.tl.clear().delay(5).then(function(){
                        this.destroy();
                    });
                }
            }
        }
    });

    var Stair = enchant.Class(Behaviour, {
        initialize: function(_namae){
            Behaviour.call(this, {
                namae: _namae,
                image: 'img/map1.gif',
                draw: 422
            });
            this.cleared = false;
            this.useMessage = false;
            this.collisionFlag = false; // no collision detection
        },
        onenterframe: function(){
            if(this.intersect(env.player)){
                if(!this.cleared){
                    this.cleared = true;
                    clear(__H4PENV__TOKEN);
                }
            }
        }
    });

    // bmapの ]) まで（セミコロンが登場するまで）を抜き出す
    var extend_bmap  =  __H4PENV__EXTENDCODE.match(/maps\[\'replay\'\]\.bmap\.loadData\(\[[\s\[\]0-9,\)\-\+]+/);
    if(extend_bmap !== null){
        extend_bmap = extend_bmap[0];
        extend_bmap += ";\n\n"; // セミコロンを抜き出していないため、付与する
    }else{
        extend_bmap = "// エラー：マップ情報が取得できませんでした。この部分にbmapについて書き直して下さい\n\n";
    }

    // cmapの ] まで（セミコロンが登場するまで）を抜き出す
    var extend_cmap  =  __H4PENV__EXTENDCODE.match(/maps\[\'replay\'\]\.cmap(\s)*\=(\s)*\[[\s\[\]0-9,\-\+]+/);
    if(extend_cmap !== null){
        extend_cmap = extend_cmap[0];
        extend_cmap += ";\n\n"; // セミコロンを抜き出していないため、付与する
    }else{
        extend_cmap = "// エラー：マップ情報が取得できませんでした。この部分にcmapについて書き直して下さい\n\n";
    }

    __H4PENV__DEFAULTCODE =
    "// おめでとう！マップの完成だ！\n"+
    "// 次はゲームの主役であるキャラクターやクリアのための階段についてのコードを書き換えてみよう\n\n"+

    extend_bmap+

    extend_cmap+

    "player.locate(1, 5);\n"+
    "player.hp = 999;\n"+
    "player.sprite.scale(1, 1)\n\n"+

    "blueSlime.locate(9, 5);\n"+
    "blueSlime.hp = 3;\n"+
    "blueSlime.sprite.scale(1, 1);\n\n"+

    "stair.locate(13, 5);\n\n"+

    "// 騎士(player)、スライム(blueSlime)、階段(stair)の場所(locate)を書き換えよう\n"+
    "// また、体力(hp)や、大きさ(sprite.scale)を書き換えることで、より面白いゲームになるだろう\n\n"+

    "// sprite.scale();は大きさを表している\n"+
    "// 括弧の中身は今(1, 1)となっているが、これを(2, 2)とすれば大きさが二倍になるぞ!\n\n"+
    "// (1, 2)とすれば、なんと縦の長さだけが２倍になる、一度試してみるといい...!\n\n"+

    "// 数値を自由に書き換え、より面白いステージにしよう！\n\n"+

    "//*---------------------------------------------------------------------------------*\n\n"+

    "// 完成し、「ステージ改造コードを実行」ボタンを押せば、次のステージへ行くといい...!\n\n"+

    "// 次はゲームをプレイする人へのヒントとなる、魔導書の中身を書き換えるぞ...!\n"+
    "";
});