
window.addEventListener('load', function() {
    var path = __H4PENV__PATH;
    game.preload(path+'monster4.gif', path+'monster1.gif', path+'madosyo_small.png', path+'hand.png');
    game.start();
    var blueSlime, hint;
    game.addEventListener('load', function(){

        var map = maps['Tutorial2'];
        map.load();                 // Load map

        blueSlime = new BlueSlime('blueSlime'); // make blue slime
        map.scene.addChild(blueSlime);
        blueSlime.locate(8, 5);

        var stair = new Stair('stair');
        map.scene.addChild(stair);
        stair.locate(7, 9);

        var enchantBookItem = new EnchantBookItem('enchantBookItem');
        map.scene.addChild(enchantBookItem);
        enchantBookItem.locate(5, 4);

        var player = new Knight('player'); // make player
        map.scene.addChild(player); // add player to scene
        player.locate(1, 5); // move position

        var insect = new Insect('insect');
        map.scene.addChild(insect);
        insect.locate(5, 7);

        hint =
        "// ーまっしろだった本に、言葉が浮かび上がってきた\n"+
        "// いにしえの魔導書を開くことができた選ばれし者よ...\n"+
        "// この先を進むには、ダンジョンの謎を解き、この本に\n"+
        "// 書かれた謎(コード)を書き換えなくてはならない...\n\n"+

        "blueSlime.hp = 99;\n"+
        "insect.hp = 99999999;\n\n"+

        "// 岩場に潜む青いスライム(blueSlime)の体力(hp)は\n"+
        "// とても高いという...そのhpを減らせないだろうか？\n\n"+

        "// まずはスライムのhpを表す99という数字を書き換えよう\n"+
        "// 書き換える時は、半角で書くことに気をつけるのだ\n"+
        "// 書き換えたら、左上のRUNボタンを押すのだ！";

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
            this.hp = 99999999;
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

    var Insect = enchant.Class(Behaviour, {
        initialize: function(_namae){
            Behaviour.call(this, {
                namae: _namae,
                image: path+'monster1.gif',
                width:48, height:48,
                dx:-8, dy:-8
            });
            this.width = this.height = 32;
            this.collider.y = 0;
            this.sprite.frame = [2, 2, 2, 3, 3, 3];
            this.hp = 99999999;
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

    var EnchantBookItem = enchant.Class(Behaviour, {
        initialize: function(_namae){
            Behaviour.call(this, {
                namae: _namae,
                image: path+'madosyo_small.png'
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
                env.enchantbook = new EnchantBook();
                game.rootScene.addChild(env.enchantbook);
                // 少しずつ上にあがる
                var me = this;
                this.sprite.tl.moveBy(0, -20, 10).then(function(){
                    me.destroy();
                    miru("魔道書を手に入れた！");
                    var hand = new Sprite(128, 32);
                    hand.image = game.assets[path+'hand.png'];
                    hand.moveTo(16, 80);
                    hand.tl.moveBy(0,-40,7).moveBy(0, 40,7).loop();
                    game.rootScene.addChild(hand);
                    env.enchantbook.on('touchstart', function(){
                        game.rootScene.removeChild(hand);
                    });
                });
            }
        }
    });

    __H4PENV__DEFAULTCODE =
    "// ステージ改造コードを書いて、ステージを改造してやろう!!\n\n"+
    "// 初期位置を変えてやろう\n"+
    "player.locate(1, 5);\n"+
    "blueSlime.locate(8, 5);\n"+
    "insect.locate(5, 7);\n"+
    "enchantBookItem.locate(5, 4);\n"+
    "stair.locate(7, 9);\n\n"+

    "// 大きさを変えてやろう\n"+
    "player.width = 48; // プレイヤーの幅\n"+
    "player.height = 48; // プレイヤーの高さ\n"+
    "blueSlime.width = 48; // スライムの幅\n"+
    "blueSlime.height = 48; // スライムの高さ\n\n"+

    "// マップの見た目を変えてやろう\n"+
    "maps['Tutorial2'].bmap.loadData([\n"+
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
    "\t[320,320,320,320,320,320,320,320,401,401, -1,340,340,340,320],\n"+
    "\t[320,320,320,320,320,320,320,320,401, -1, -1, -1, -1, -1,320],\n"+
    "\t[320,320,320,320,320,320,320,320, -1, -1, -1,320,320, -1,320],\n"+
    "\t[340,340,340,320,340,340,340,320,320, -1,320,320,320, -1,320],\n"+
    "\t[ -1, -1, -1,340, -1, -1, -1,340,340, -1,320,320,320, -1,320],\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,320,320,320, -1,320],\n"+
    "\t[ -1, -1, -1,320, -1, -1, -1,320,320,320,320,320,320, -1,320],\n"+
    "\t[320,320,320,320,320, -1,340,340,340,340,340,340,340, -1,320],\n"+
    "\t[320,320,320,320,320, -1, -1, -1, -1, -1, -1, -1, -1, -1,320],\n"+
    "\t[320,320,320,320,320,320, -1, -1, -1,320,320,320,320,320,320]\n"+
    "]);\n"+
    "maps['Tutorial2'].cmap = [\n"+
    "\t[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],\n"+
    "\t[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],\n"+
    "\t[ 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1],\n"+
    "\t[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],\n"+
    "\t[ 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1],\n"+
    "\t[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],\n"+
    "\t[ 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1],\n"+
    "\t[ 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],\n"+
    "\t[ 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],\n"+
    "\t[ 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1]\n"+
    "];\n";
});

