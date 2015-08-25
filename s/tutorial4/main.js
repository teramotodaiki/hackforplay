var getSapphireFlag = false, editorWindowClosed;
window.addEventListener('load', function() {
    var path = __H4PENV__PATH;
    game.preload(path+'monster3.gif');
    game.start();
    var blueSlime, hint;
    game.addEventListener('load', function(){

        var map = maps['Floor'];
        map.load();                 // Load map

        env.enchantbook = new EnchantBook();
        game.rootScene.addChild(env.enchantbook);

        var player = new Knight('player'); // make player
        map.scene.addChild(player); // add player to scene
        player.locate(1, 5); // move position

        var bat = new Bat ('bat');
        map.scene.addChild(bat);
        bat.locate(11, 5);

        hint =
        "// すすむべき みちが いくつも ある...\n"+
        "// しかし みぎの かいだんは モンスターが、\n"+
        "// したの かいだんは かべが ふさいでいる...\n"+
        "// ひとまず うえの かいだんへ いくしか ないようだ...";

        map = maps['Tutorial4'];
        map.callback = function(){
            var sapphire = new Sapphire('sapphire');
            var map = maps['Tutorial4'];
            map.scene.addChild(sapphire);
            sapphire.locate(13, 2);
            hint =
            "// 群青(ぐんじょう) の 精霊石(せいれいせき)\n"+
            "//   サファイヤ(sapphire) は かべに かこまれている\n"+
            "// ーふと、ちず のような かたちが うかびあがった！\n"+
            "maps['Tutorial4'].cmap = [\n"+
            "\t[1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],\n"+
            "\t[1,1,1,1,1,1,1,1,1,1,1,0,1,1,1],\n"+
            "\t[1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],\n"+
            "\t[1,0,0,0,1,1,1,1,1,1,1,0,1,1,1],\n"+
            "\t[1,0,0,0,0,0,0,0,1,1,1,0,0,0,0],\n"+
            "\t[1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],\n"+
            "\t[1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],\n"+
            "\t[1,1,1,1,1,1,0,0,0,1,1,1,1,1,1],\n"+
            "\t[1,1,1,1,1,1,0,0,0,1,1,1,1,1,1],\n"+
            "\t[1,1,1,1,1,1,0,0,0,1,1,1,1,1,1]\n"+
            "];\n"+
            "// 0 は とおれる ところ、\n"+
            "// 1 は とおれない ところを あらわしている\n"+
            "// みためは かわらないが あるけば わかる だろう...";
            sendToEditor('setHint();'); // ヒントを再セット
        };

        // ヒントを強調する
        (function () {
            // 最初のマップに２回戻ってきたとき
            var comeBackCount = 0;

            maps['Floor'].callback = function() {
                comeBackCount++;
                if (comeBackCount === 2 && !getSapphireFlag) {
                    emphasizeHint();
                }
            };

            // 魔道書をとじた状態が40秒継続したとき
            var timer;
            editorWindowClosed = function() {
                if (timer) clearTimeout(timer);
                timer = setTimeout(function() {
                    if (!getSapphireFlag) {
                        emphasizeHint();
                    }
                }, 40000);
            };
            env.enchantbook.on('touchend', function() {
                if (timer) clearTimeout(timer);
            });

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

    var Sapphire = enchant.Class(Behaviour, {
        initialize: function(_namae){
            Behaviour.call(this, {
                namae: _namae,
                image: 'img/icon0.png',
                width: 32, height: 32
            });
            this.sprite.frame = 65;
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
                    miru("サファイヤを手に入れた！");
                    var stair = new Stair('stair');
                    env.map.scene.insertBefore(stair, env.player);
                    stair.locate(7, 8);
                });
                // サファイアをとったフラグ
                getSapphireFlag = true;
            }
        }
    });

    __H4PENV__DEFAULTCODE =
    "// ステージ改造コードを書いて、ステージを改造してやろう!!\n\n"+
    "// 初期位置を変えてやろう\n"+
    "player.locate(1, 5);\n"+
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

    "maps['Tutorial4'].bmap.loadData([\n"+
    "\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],\n"+
    "\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],\n"+
    "\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],\n"+
    "\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],\n"+
    "\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],\n"+
    "\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],\n"+
    "\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],\n"+
    "\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],\n"+
    "\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],\n"+
    "\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323]\n"+
    "],[\n"+
    "\t[320,320,320,320,320,320,320,320,320,320,320, -1, -1, -1, -1],\n"+
    "\t[320,340,340,340,340,340,340,340,340,340,340, -1,320,340,320],\n"+
    "\t[320, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,320, -1,320],\n"+
    "\t[320, -1, -1, -1,340,340,340,340,320,320,320, -1,340,340,340],\n"+
    "\t[320, -1, -1, -1, -1, -1, -1, -1,320,320,320, -1, -1, -1, -1],\n"+
    "\t[320,320,320,320,320,320,320, -1,320,320,320,320,320,320,320],\n"+
    "\t[320,320,320,320,320,320,340, -1,340,320,320,320,320,320,320],\n"+
    "\t[320,320,320,320,320,320, -1, -1, -1,320,320,320,320,320,320],\n"+
    "\t[320,320,320,320,320,320, -1,422, -1,320,320,320,320,320,320],\n"+
    "\t[340,340,340,340,340,340, -1, -1, -1,340,340,340,340,340,340]\n"+
    "]);\n"+
    "maps['Tutorial4'].cmap = [\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0,  0],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  1,  1,  1],\n"+
    "\t[  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  1],\n"+
    "\t[  1,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  0,  1,  1,  1],\n"+
    "\t[  1,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  0,  0,  0,  0],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  0,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  0,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  0,  0,  0,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  0,  0,  0,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  0,  0,  0,  1,  1,  1,  1,  1,  1]\n"+
    "];\n";

});

