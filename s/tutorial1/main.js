
window.addEventListener('load', function() {
    var path = __H4PENV__PATH;
    game.preload(path+'monster4.gif');
    game.preload(path+'setumei_idou.png');
    game.preload(path+'setumei_kougeki.png');
    game.start();
    var blueSlime, hint;
    game.addEventListener('load', function(){

        var map = maps['Tutorial1'];
        map.load();                 // Load map

        blueSlime = new BlueSlime('blueSlime'); // make blue slime
        map.scene.addChild(blueSlime);
        blueSlime.locate(9, 5);

        var stair = new Stair('stair');
        map.scene.addChild(stair);
        stair.locate(12, 5);

        var player = new Knight('player'); // make player
        map.scene.addChild(player); // add player to scene
        player.locate(1, 5); // move position

        var setumei_idou = new Sprite(96, 96);
        setumei_idou.image = game.assets[path+'setumei_idou.png'];
        setumei_idou.moveTo(16, 16);
        game.rootScene.addChild(setumei_idou);

        var setumei_kougeki = new Sprite(96, 96);
        setumei_kougeki.image = game.assets[path+'setumei_kougeki.png'];
        setumei_kougeki.moveTo(144, 16);
        game.rootScene.addChild(setumei_kougeki);

        hint = "";

        // ヒントを強調する
        (function() {
            // 100msごとにgame.inputのいずれかがtrueになっていればFlagをtrueに
            var inputFlag = false;
            (function task () {
                Object.keys(game.input).forEach(function(item) {
                    inputFlag = inputFlag || game.input[item];
                });
                if (!inputFlag) {
                    setTimeout(task, 100);
                }
            })();

            // 30s inputがなければ、ヒントを強調する
            setTimeout(function() {
                if (!inputFlag) {
                    window.parent.postMessage('hint_popover', '/');
                }
            }, 20000);
        })();

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

    __H4PENV__DEFAULTCODE =
    "// ステージ改造コードを書いて、ステージを改造してやろう!!\n\n"+
    "// 初期位置を変えてやろう\n"+
    "player.locate(1, 5);\n"+
    "blueSlime.locate(9, 5);\n"+
    "stair.locate(12, 5);\n\n"+

    "// 大きさを変えてやろう\n"+
    "player.width = 48; // プレイヤーの幅\n"+
    "player.height = 48; // プレイヤーの高さ\n"+
    "blueSlime.width = 48; // スライムの幅\n"+
    "blueSlime.height = 48; // スライムの高さ\n\n"+

    "// ブルースライムを増やしてやろう\n"+
    "var blueSlime2 = new BlueSlime('blueSlime2'); // ブルースライム2を作成\n"+
    "map.scene.addChild(blueSlime2); // ブルースライム2を追加\n"+
    "blueSlime2.locate(5, 5);\n"+
    "blueSlime2.width = 100;\n"+
    "blueSlime2.height = 100;\n\n"+

    "// マップの見た目を変えてやろう\n"+
    "maps['Tutorial1'].bmap.loadData([\n"+
    "\t[322,322,322,322,322,322,322,204,205,205,205,205,205,205,205],\n"+
    "\t[322,322,322,322,322,322,322,204,205,205,205,205,205,205,205],\n"+
    "\t[322,322,322,322,322,322,322,204,205,205,205,205,205,205,205],\n"+
    "\t[322,322,322,322,322,322,322,204,205,205,166,225,225,225,167],\n"+
    "\t[322,322,322,322,322,322,322,224,225,225,226,322,322,322,204],\n"+
    "\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,204],\n"+
    "\t[322,322,322,322,322,322,322,184,185,185,186,322,322,322,204],\n"+
    "\t[322,322,322,322,322,322,322,204,205,205,164,185,185,185,165],\n"+
    "\t[322,322,322,322,322,322,322,204,205,205,205,205,205,205,205],\n"+
    "\t[322,322,322,322,322,322,322,204,205,205,205,205,205,205,205]\n"+
    "],[\n"+
    "\t[462,461,462,461,462,461,462, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[482,481,482,481,482,481,482, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[462, -1, -1,421, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[482, -1,421, -1, -1,421, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1,421, -1, -1,421, -1,421, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1, -1,421,421,421, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[462, -1, -1,421,421, -1,421, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[482, -1,421,421, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[462,461,462,461,462,461,462, -1, -1, -1, -1, -1, -1, -1, -1],\n"+
    "\t[482,481,482,481,482,481,482, -1, -1, -1, -1, -1, -1, -1, -1]\n"+
    "]);\n"+
    "maps['Tutorial1'].cmap = [\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  0,  0,  0,  1],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1],\n"+
    "\t[  1,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  0,  0,  0,  1],\n"+
    "\t[  1,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1]\n"+
    "];\n";
});

