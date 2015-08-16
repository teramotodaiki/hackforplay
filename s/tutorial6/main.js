var editorWindowClosed, closingEditorTimer;
window.addEventListener('load', function() {
    var path = __H4PENV__PATH;
    game.preload(path+'bigmonster1.gif', path+'bar_dragon.png', path+'bar_player.png', path+'monster3.gif');
    game.preload(path+'effect0.png');
    game.start();
    var blueSlime, hint;
    game.addEventListener('load', function(){

        var map = maps['Floor'];
        map.load();                 // Load map

        env.enchantbook = new EnchantBook();
        game.rootScene.addChild(env.enchantbook);

        var player = new Knight('player'); // make player
        map.scene.addChild(player); // add player to scene
        player.locate(7, 6); // move position

        var bat = new Bat ('bat');
        map.scene.addChild(bat);
        bat.locate(11, 5);

        hint =
        "// いままで モンスターが はばんでいた かいだんが みぎにある\n"+
        "// あの かいだんの さきが さいごの へやに なっている\n"+
        "// いまなら かるがると たどりつける だろう\n\n"+

        "player.locate(7, 6);\n\n"+

        "// このコードは\n"+
        "// じぶんが ひだり から ７ばんめ うえ から ６ばんめ の\n"+
        "// いち へ いどう することを いみしている\n"+
        "// このコードを かきかえ さいごのへや へと むかうのだ！";

        map = maps['Tutorial6'];
        var dragon = new Dragon('dragon'); // make dragon
        map.scene.addChild(dragon);
        dragon.locate(8, 2);

        var ruby = new Ruby('ruby');
        map.scene.addChild(ruby);
        ruby.locate(10, 5);

        var dragonHP = new Sprite(400, 32);
        dragonHP.image = game.assets[path+'bar_dragon.png'];
        dragonHP.moveTo(80, 0);
        map.scene.addChild(dragonHP);
        dragonHP.max = dragon.hp;
        dragonHP.onenterframe = function(){
            this.width = 400 * dragon.hp / this.max;
        };

        var playerHP = new Sprite(480, 32);
        playerHP.image = game.assets[path+'bar_player.png'];
        playerHP.moveTo(0, 288);
        game.rootScene.addChild(playerHP);
        playerHP.max = 9999;
        playerHP.onenterframe = function(){
            this.width = 480 * player.hp / this.max;
        };

        map.callback = function(){
            hint =
            "// やつが この めいきゅうの あるじ\n"+
            "//   獄炎(ごくえん) の ドラゴン(dragon) だ！\n"+
            "// やつの ほのおを うければ、\n"+
            "// きみの たいりょくは たちまち へっていく だろう\n"+
            "\n"+
            "player.hp = 99;\n"+
            "\n"+
            "// このコードは\n"+
            "// きみ(player) の たいりょく(hp) について かかれている\n"+
            "// さあ、じぶんじしん の げんかいを かきかえ\n"+
            "// ドラゴンに いどむのだ！\n";
            sendToEditor('setHint();'); // ヒントを再セット

            // ヒントの強調を無効化
            if (closingEditorTimer) clearTimeout(closingEditorTimer);
            editorWindowClosed = function() {};
        };

        map = maps['Tutorial7'];

        map.callback = function(){
            hint =
            "// おめでとう！きみは 獄炎(ごくえん)のドラゴンを たおし、\n"+
            "// ダンジョンの さいしんぶ まで たどりついたのだ！\n"+
            "// ここにある ざいほうは すべて きみのものだ！\n"+
            "\n"+
            "// コードを かきかえる このちから...\n"+
            "// この ちからは こんごも きみの たすけに なることだろう\n"+
            "// そして それは きみじしんの みらいを、\n"+
            "// せかいを、かえるのだ！\n"+
            "\n"+
            "// すすめ！つぎの ちょうせんへ！\n"+
            "// きみの さらなる ひやくを ねがっている\n"+
            "\n"+
            "// ー魔導書(まどうしょ) に かかれている もじが\n"+
            "//   すこしづつ うすれてゆく...\n";
            sendToEditor('setHint();');
        };


        var itemMap = [
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  2,  1,  1,  1,  2,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  2,  1,  1,  1,  2,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  2,  1,  1,  1,  2,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
        ];

        for (var y = 0; y < 10; y++) {
            for (var x = 0; x < 15; x++) {
                switch(itemMap[y][x]){
                    case 0: break;
                    case 1:
                        var treasure = new Treasure('treasure');
                        map.scene.insertBefore(treasure, env.player);
                        treasure.locate(x, y);
                        break;
                    case 2:
                        var coin = new Coin('coin');
                        map.scene.insertBefore(coin, env.player);
                        coin.locate(x, y);
                        break;
                }
            }
        }

        map = maps['TutorialEND'];
        map.callback = function(){
            hint =
            "// ー魔導書(まどうしょ) は いつのまにか\n"+
            "//   もとの まっさらな ほん に もどっていたーーー\n\n"+

            "// ーfinー";
            sendToEditor('setHint();');
        };

        var stair1 = new Stair('stair1');
        map.scene.addChild(stair1);
        stair1.locate(14, 5);

        var stair2 = new Stair('stair2');
        map.scene.addChild(stair2);
        stair2.locate(14, 4);

        (function(){
            var _hp = 999; // プレイヤーHP初期値
            env.player.__defineGetter__('hp', function(){
                return _hp;
            });
            env.player.__defineSetter__('hp', function(val){
                _hp = Math.min(9999, val);
            });
        })();

        // ヒントを強調する
        (function () {
            // 魔道書をとじてから次のマップに移動するまでに40秒経過したとき
            editorWindowClosed = function() {
                if (closingEditorTimer) clearTimeout(closingEditorTimer);
                closingEditorTimer = setTimeout(function() {
                    window.parent.postMessage('hint_popover', '/');
                }, 40000);
            };

        })();

        // ここはコピペ
        // Runtime Evaluation
        setEval(function(code){
            eval(code);
        });
    });

    var Bat = enchant.Class(Behaviour, {
        initialize: function(_namae){
            Behaviour.call(this, {
                namae: _namae,
                image: path+'monster3.gif',
                width:96, height:96,
                dx: -24, dy: -24
            });
            this.width = this.height = 64;
            this.collider.y = 0;
            this.collider.x = 1;
            this.collider.width = 32;
            this.sprite.frame = [2, 2, 3, 3, 4, 4, 3, 3];
            this.hp = 99999999;
            this.behavior = BehaviorTypes.Idle;
            this.isPublic = false;
            this.useMessage = false;
        },
        damage : function(atk){},
        onenterframe : function(){
            this.y = env.player.y;
        }
    });

    var Stair = enchant.Class(Behaviour, {
        initialize: function(_namae){
            Behaviour.call(this, {
                namae: _namae,
                image: 'img/map1.gif',
                draw: 0
            });
            this.cleared = false;
            this.useMessage = false;
            this.collisionFlag = false; // no collision detection
            this.sprite.opacity = 0;
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

    var StairImage = enchant.Class(Behaviour, {
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
    });

    var Ruby = enchant.Class(Behaviour, {
        initialize: function(_namae){
            Behaviour.call(this, {
                namae: _namae,
                image: 'img/icon0.png',
                width: 32, height: 32
            });
            this.sprite.frame = 66;
            this.cleared = false;
            this.useMessage = false;
            this.collisionFlag = false; // no collision detection
            this.bring = false;
        },
        onenterframe: function(){
            if(this.bring === false && this.intersect(env.player)){
                //this.destroy();
                this.bring = true;
                // 少しずつ上にあがる
                var me = this;
                this.sprite.tl.moveBy(0, -20, 10).then(function(){
                    me.destroy();
                    // miru("ルビーを手に入れた！");

                    maps['Tutorial6'].rels.push({
                        from : { x: 14, y: 5 },
                        name : "Tutorial7",
                        to : { x: 0, y: 5 }
                    });

                    var stair = new Stair('stair');
                    env.map.scene.insertBefore(stair, env.player);
                    stair.locate(14, 5);
                    stair.onenterframe = function(){};
                    var stairimage = new StairImage('stairimage');
                    env.map.scene.insertBefore(stairimage, env.player);
                    stairimage.locate(14, 5);
                });
            }
        }
    });

    var Dragon = enchant.Class(Behaviour, {
        initialize: function(_namae){
            Behaviour.call(this, {
                namae: _namae,
                image: path+'bigmonster1.gif',
                width:160, height:160,
            });
            this.collider.width = 128;
            this.collider.x = 2;
            this.sprite.frame = 0;
            this.animCount = 0;
            this.behavior = BehaviorTypes.Idle;
            this.isPublic = false;
            this.useMessage = false;
            this.collisionFlag = true;
            this.fire = true; // Use fire
            this.hp = 27;
        },
        damage : function(atk){
            this.hp -= atk;
            if(this.hp <= 0){
                this.behavior = BehaviorTypes.Dead;
                var me = this;
                this.sprite.tl.fadeOut(10).then(function(){
                    me.destroy();
                });
            }
        },
        onenterframe : function(){
            this.animCount ++;
            switch(this.behavior){
                case BehaviorTypes.Idle:
                    if(this.animCount > 4){
                        this.animCount = 4;
                        this.behavior = BehaviorTypes.Attack;
                    }
                    break;
                case BehaviorTypes.Attack:
                    if(this.fire){
                        var emit = new Fire(
                            this.x + 1 + Math.random() * 4,
                            this.y + 70 + Math.random() * 4,
                            -10 - Math.random() * 16,
                            16 + Math.random() * 4);
                        env.map.scene.addChild(emit);
                    }
                    break;
            }
        }
    });

    // dragons fire
    var Fire = enchant.Class(Behaviour, {
        initialize: function(x, y, vx, vy){
            Behaviour.call(this, {
                namae: 'emit',
                image: path+'effect0.png',
                width:16, height:16
            });
            this.width = this.height = 32;
            this.moveTo(x, y);
            this.vx = vx;
            this.vy = vy;
            this.sprite.rotate(Math.random() * 360);

            this.sprite.frame = 0;
            this.animCount = 0;
            this.useMessage = false;
            this.collisionFlag = false;
        },
        onenterframe : function(){
            this.animCount++;
            if(this.animCount > 14){
                this.destroy();
            }else{
                this.sprite.frame = this.animCount / 3;
                var me = this;
                env.map.scene.childNodes.forEach(function(item){
                    if( env.player !== undefined && env.player.intersect(me)){
                        // if(env.player.hp <= 200){
                        //     env.player.damage(200);
                        // }else{
                        //     env.player.damage(env.player.hp / 20);
                        // }
                        env.player.damage(180);
                    }
                });
            }
            this.moveBy(this.vx, this.vy);
            this.width += 3;
            this.height += 3;
            this.sprite.opacity = (15 - this.animCount) / 15.0;
        }
    });

    var Treasure = enchant.Class(Behaviour, {
        initialize: function(_namae){
            Behaviour.call(this, {
                namae: _namae,
                image: 'img/map1.gif',
                draw: 420
            });
            this.cleared = false;
            this.useMessage = false;
            this.collisionFlag = false; // no collision detection
            this.bring = false;
        },
        onenterframe: function(){
            if(this.bring === false && this.intersect(env.player)){
                //this.destroy();
                this.bring = true;
                // 少しずつ上にあがる
                var me = this;
                this.sprite.tl.moveBy(0, -20, 10).then(function(){
                    me.destroy();
                });
            }
        }
    });

    var Coin = enchant.Class(Behaviour, {
        initialize: function(_namae){
            Behaviour.call(this, {
                namae: _namae,
                image: 'img/icon0.png',
                width: 32, height: 32
            });
            this.sprite.frame = 14;
            this.cleared = false;
            this.useMessage = false;
            this.collisionFlag = false; // no collision detection
            this.bring = false;
        },
        onenterframe: function(){
            if(this.bring === false && this.intersect(env.player)){
                //this.destroy();
                this.bring = true;
                // 少しずつ上にあがる
                var me = this;
                this.sprite.tl.moveBy(0, -20, 10).then(function(){
                    me.destroy();
                });
            }
        }
    });

    __H4PENV__DEFAULTCODE =
    "// ステージ改造コードを書いて、ステージを改造してやろう!!\n\n"+
    "// 初期位置を変えてやろう\n"+
    "player.locate(7, 6);\n"+
    "dragon.locate(8, 2);\n"+
    "ruby.locate(10, 5);\n"+
    "bat.locate(11, 5);\n\n"+

    "// 大きさを変えてやろう\n"+
    "player.width = 48; // プレイヤーの幅\n"+
    "player.height = 48; // プレイヤーの高さ\n"+

    "// マップの見た目を変えてやろう\n"+
    "maps['Floor'].bmap.loadData([\n"+
    "\t[342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],\n"+
    "\t[342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],\n"+
    "\t[342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],\n"+
    "\t[342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],\n"+
    "\t[342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],\n"+
    "\t[342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],\n"+
    "\t[342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],\n"+
    "\t[342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],\n"+
    "\t[342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],\n"+
    "\t[342,342,342,342,342,342,342,342,342,342,342,342,342,342,342]\n"+
    "],[\n"+
    "\t[321,321,321,341,341,341, -1, -1, -1,341,341, -1, -1,321,321],\n"+
    "\t[321,321,321, -1, -1, -1, -1,402, -1, -1, -1, -1, -1,321,321],\n"+
    "\t[321,321,321, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,321,321],\n"+
    "\t[341,341,341, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,341,341],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,402],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[321,321,321, -1, -1, -1,321,341,321, -1, -1, -1, -1,321,321],\n"+
    "\t[321,321,321, -1, -1, -1,321,402,321, -1, -1, -1, -1,321,321],\n"+
    "\t[341,341,341,341,341,341,341,341,341,341,341, -1, -1,341,341]\n"+
    "]);\n"+
    "maps['Floor'].cmap = [\n"+
    "\t[  1,  1,  1,  1,  1,  1,  0,  0,  0,  1,  1,  0,  0,  1,  1],\n"+
    "\t[  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1],\n"+
    "\t[  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1],\n"+
    "\t[  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  1,  1,  1,  0,  0,  0,  1,  1,  1,  0,  0,  0,  0,  1,  1],\n"+
    "\t[  1,  1,  1,  0,  0,  0,  1,  0,  1,  0,  0,  0,  0,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  1,  1]\n"+
    "];\n\n"+

    "maps['Tutorial6'].bmap.loadData([\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55]\n"+
    "],[\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75],\n"+
    "\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],\n"+
    "\t[ 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]\n"+
    "]);\n"+
    "maps['Tutorial6'].cmap = [\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1]\n"+
    "];\n\n"+

    "maps['Tutorial7'].bmap.loadData([\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,323],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],\n"+
    "\t[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55]\n"+
    "],[\n"+
    "\t[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],\n"+
    "\t[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],\n"+
    "\t[-1,-1,16,75,75,75,75,75,17,-1,-1,-1,-1,-1,-1],\n"+
    "\t[-1,-1,56,323,323,323,323,323,54,-1,-1,-1,-1,-1,-1],\n"+
    "\t[75,75,76,323,323,323,323,323,74,75,75,75,75,75,75],\n"+
    "\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,402],\n"+
    "\t[35,35,36,323,323,323,323,323,34,35,35,35,35,35,35],\n"+
    "\t[-1,-1,56,323,323,323,323,323,54,-1,-1,-1,-1,-1,-1],\n"+
    "\t[-1,-1,14,35,35,35,35,35,15,-1,-1,-1,-1,-1,-1],\n"+
    "\t[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]\n"+
    "]);\n\n"+

    "maps['Tutorial7'].cmap = [\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  1,  1,  1,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1]\n"+
    "];\n\n"+

    "maps['TutorialEND'].bmap.loadData([\n"+
    "\t[205,205,205,205,205,205,205,205,205,205,205,206,322,322,322],\n"+
    "\t[205,205,205,205,205,205,205,205,205,205,205,206,322,322,322],\n"+
    "\t[205,205,205,205,205,205,205,205,205,205,205,206,322,322,322],\n"+
    "\t[166,225,225,225,167,205,205,205,205,205,205,206,322,322,322],\n"+
    "\t[206,322,322,322,224,225,225,225,225,225,225,226,322,322,322],\n"+
    "\t[206,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
    "\t[206,322,322,322,184,185,185,185,185,185,185,186,322,322,322],\n"+
    "\t[164,185,185,185,165,205,205,205,205,205,205,206,322,322,322],\n"+
    "\t[205,205,205,205,205,205,205,205,205,205,205,206,322,322,322],\n"+
    "\t[205,205,205,205,205,205,205,205,205,205,205,206,322,322,322]\n"+
    "],[\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,461,462,461],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,481,482,481],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,421,421,461],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,421,421,481],\n"+
    "\t[ -1,421,421,421, -1, -1, -1, -1, -1, -1, -1, -1,421,421, -1],\n"+
    "\t[ -1,421, -1,421,421,421,421,421,421,421,421,421,421,421, -1],\n"+
    "\t[ -1,421,421,421, -1, -1, -1, -1, -1, -1, -1, -1,421,421,461],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,421,421,481],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,461,462,461],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,481,482,481]\n"+
    "]);\n"+
    "maps['TutorialEND'].cmap = [\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0],\n"+
    "\t[  1,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0],\n"+
    "\t[  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  1,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0]\n"+
    "];\n";
});
