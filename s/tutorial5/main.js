
window.addEventListener('load', function() {
    var path = __H4PENV__PATH;
    game.preload(path+'monster3.gif');
    game.preload(path+'monster2.gif');
    game.start();
    var blueSlime, hint;
    game.addEventListener('load', function(){

        var map = maps['Floor'];
        map.load();

        env.enchantbook = new EnchantBook();
        game.rootScene.addChild(env.enchantbook);

        var player = new Knight('player'); // make player
        map.scene.addChild(player); // add player to scene
        player.locate(7, 2); // move position

        var bat = new Bat ('bat');
        map.scene.addChild(bat);
        bat.locate(11, 5);

        hint =
        "// ー突然、地図のような形が浮かび上がってきた\n"+
        "maps['Floor'].cmap = [\n"+
        "\t[1,1,1,1,1,1,0,0,0,1,1,0,0,1,1],\n"+
        "\t[1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],\n"+
        "\t[1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],\n"+
        "\t[1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],\n"+
        "\t[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n"+
        "\t[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n"+
        "\t[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n"+
        "\t[1,1,1,0,0,0,1,1,1,0,0,0,0,1,1],\n"+
        "\t[1,1,1,0,0,0,1,0,1,0,0,0,0,1,1],\n"+
        "\t[1,1,1,1,1,1,1,1,1,1,1,0,0,1,1]\n"+
        "];\n\n"+
        "// すでにこの地図の見方はわかっただろう\n"+
        "// 塞がれていた下の階段に、今ならたどり着けるはずだ...";

        map = maps['Tutorial5'];
        var diamond = new Diamond('diamond');
        map.scene.addChild(diamond);
        diamond.locate(2, 7);
        var spider = new Spider ('spider');
        map.scene.addChild(spider);
        spider.locate(7, 4);

        map.callback = function(){
            hint =
            "// 怪物に守られた光彩の精霊石・ダイヤモンド(diamond)\n"+
            "// この怪物は倒すこともすり抜けることもできない\n"+
            "// 自分(player)の位置(locate)をダイヤモンドの位置まで\n"+
            "// 動かすことができれば...\n\n"+

            "player.locate(7, 2);\n\n"+

            "// このコードは、自分が左から７番目、上から２番目の\n"+
            "// 位置へ移動することを意味している\n"+
            "// この数字を書き換えることで、自分自身すら操れる！";
            sendToEditor('setHint();'); // ヒントを再セット
        };

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

    var Spider = enchant.Class(Behaviour, {
        initialize: function(_namae){
            Behaviour.call(this, {
                namae: _namae,
                image: path+'monster2.gif',
                width:64, height:64,
                dx: 0, dy: 10
            });
            this.collider.height = 32;
            this.collider.y = 32;
            this.sprite.frame = [2, 2, 3, 3, 4, 4, 3, 3];
            this.hp = 99999999;
            this.behavior = BehaviorTypes.Idle;
            this.isPublic = false;
            this.useMessage = false;
        },
        damage : function(atk){},
        onenterframe : function(){
            if(this.sprite.scaleX > 0 && this.x < env.player.x){
                this.sprite.scaleX = -1;
            }
            else if (this.sprite.scaleX < 0 && this.x > env.player.x){
                this.sprite.scaleX = 1;
            }
            this.x = env.player.x;
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

    var Diamond = enchant.Class(Behaviour, {
        initialize: function(_namae){
            Behaviour.call(this, {
                namae: _namae,
                image: 'img/icon0.png',
                width: 32, height: 32
            });
            this.sprite.frame = 64;
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
                    miru("ダイヤモンドを手に入れた！");
                    var stair = new Stair('stair');
                    env.map.scene.insertBefore(stair, env.player);
                    stair.locate(7, 0);
                });
            }
        }
    });

    __H4PENV__DEFAULTCODE =
    "// ステージ改造コードを書いて、ステージを改造してやろう!!\n\n"+
    "// 初期位置を変えてやろう\n"+
    "player.locate(7, 2);\n"+
    "diamond.locate(2, 7);\n"+
    "spider.locate(7, 2);\n"+
    "player.locate(7, 4);\n"+
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
    "];\n"+
    "maps['Floor'].rels.push({\n"+
    "\tfrom : { x:7, y:8 },\n"+
    "\tname : 'Tutorial5',\n"+
    "\tto : { x:7, y:1 }\n"+
    "});\n\n"+
    "maps['Tutorial5'].bmap.loadData([\n"+
    "\t[45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],\n"+
    "\t[45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],\n"+
    "\t[45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],\n"+
    "\t[45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],\n"+
    "\t[45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],\n"+
    "\t[45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],\n"+
    "\t[45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],\n"+
    "\t[45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],\n"+
    "\t[45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],\n"+
    "\t[45,45,45,45,45,45,45,45,45,45,45,45,45,45,45]\n"+
    "],[\n"+
    "\t[320,320,320,320,320,320, -1,422, -1,320,320,320,320,320,320],\n"+
    "\t[340,340,340,340,340,340, -1, -1, -1,340,340,340,340,340,340],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[340,340,340,340,340,340,340,340,340,340,340,340,340,340,340]\n"+
    "]);\n"+
    "maps['Tutorial5'].cmap = [\n"+
    "\t[  1,  1,  1,  1,  1,  1,  0,  0,  0,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  0,  0,  0,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1]\n"+
    "];\n"+
    "maps['Tutorial5'].rels.push({\n"+
    "\tfrom : { x:7, y:0 },\n"+
    "\tname : 'Floor',\n"+
    "\tto : { x:7, y:6 }\n"+
    "});\n";
});
