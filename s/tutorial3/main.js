var editorTextChanged, editorWindowClosed;
window.addEventListener('load', function() {
    var path = __H4PENV__PATH;
    game.preload(path+'hand.png');
    game.start();
    var blueSlime, hint;
    game.addEventListener('load', function(){

        var map = maps['Tutorial3'];
        map.load();                 // Load map

        var stair = new Stair('stair');
        map.scene.addChild(stair);
        stair.locate(14, 6);
        stair.sprite.opacity = 0;

        env.enchantbook = new EnchantBook();
        game.rootScene.addChild(env.enchantbook);

        var player = new Knight('player'); // make player
        map.scene.addChild(player); // add player to scene
        player.locate(7, 1); // move position

        // 2秒間魔導書を押さなかった場合、handが出る
        var UseEnchantBook = false;
        env.enchantbook.on('touchstart', function(){
            UseEnchantBook = true;
        });

        setTimeout(function(){
            if(UseEnchantBook == false){
                var hand = new Sprite(128, 32);
                hand.image = game.assets[path+'hand.png'];
                hand.moveTo(16, 80);
                hand.tl.moveBy(0,-40,7).moveBy(0, 40,7).loop();
                game.rootScene.addChild(hand);
                env.enchantbook.on('touchstart', function(){
                    game.rootScene.removeChild(hand);
                });
            }
        }, 2000);

        // ヒントを強調する
        (function () {
            // 魔道書が開かれたあと、テキストが書き換えられたフラグ
            var editorTextChangedFlag = false;

            // touchendイベントを追加する
            env.enchantbook.on('touchend', function() {
                editorTextChanged = function() {
                    editorTextChangedFlag = true;
                };
            });

            // なにも書き換えずに魔道書が閉じられたとき
            editorWindowClosed = function() {
                if (!editorTextChangedFlag) {
                    emphasizeHint();
                }
            };
        })();

        hint =
        "// どちらへ いっても いきどまりで さきに すすめない\n"+
        "// だいじょうぶ。きみには せかいをかえる ちからが ある！\n\n"+

        "// このへやに でぐちが ないのは コードが まちがって いるからだ\n\n"+

        "stair.sprite.opacity = １;\n\n"+

        "// いま、コードの(すうじ の １)は\n"+
        "// 全角(ぜんかく) で かかれている\n"+
        "// 半角(はんかく) の (すうじ の 1) に かきなおせば\n"+
        "// みちが みえるだろう...\n"+
        "// かきかえたら ひだりうえの RUN ボタン を おそう";

        // ここはコピペ
        // Runtime Evaluation
        setEval(function(code){
            eval(code);
        });
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
    "player.locate(7, 1);\n"+
    "stair.locate(14, 6);\n\n"+

    "// 大きさを変えてやろう\n"+
    "player.width = 48; // プレイヤーの幅\n"+
    "player.height = 48; // プレイヤーの高さ\n"+

    "// マップの見た目を変えてやろう\n"+
    "maps['Tutorial3'].bmap.loadData([\n"+
    "\t[205,205,205,205,205,205,205,205,205,205,205,205,205,205,205],\n"+
    "\t[205,205,205,205,205,205,205,205,205,205,205,205,205,205,205],\n"+
    "\t[205,205,205,205,205,205,205,205,205,205,205,205,205,205,205],\n"+
    "\t[205,205,205,205,205,205,205,205,205,205,205,205,205,205,205],\n"+
    "\t[205,205,205,205,205,205,205,205,205,205,205,205,205,205,205],\n"+
    "\t[205,205,205,205,205,205,205,205,205,205,205,205,205,205,205],\n"+
    "\t[205,205,205,205,205,205,205,205,205,205,205,205,205,205,205],\n"+
    "\t[205,205,205,205,205,205,205,205,205,205,205,205,205,205,205],\n"+
    "\t[205,205,205,205,205,205,205,205,205,205,205,205,205,205,205],\n"+
    "\t[205,205,205,205,205,205,205,205,205,205,205,205,205,205,205]\n"+
    "],[\n"+
    "\t[ -1, -1, -1, -1, -1, -1,321,321,321, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1, -1, -1, -1, -1, -1,321,321,321, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1, -1, -1, -1, -1, -1,321,321,321, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1, -1, -1, -1, -1, -1,341,321,341, -1, -1, -1, -1, -1, -1],\n"+
    "\t[321,321,321, -1, -1, -1, -1,321, -1, -1, -1, -1,321,321,321],\n"+
    "\t[321,321,321,321,321,321,321,321,321,321,321,321,321,321,321],\n"+
    "\t[321,321,321,341,341,341,341,321,341,341,341,341,321,321,321],\n"+
    "\t[341,341,341, -1, -1, -1, -1,321, -1, -1, -1, -1,341,341,341],\n"+
    "\t[ -1, -1, -1, -1, -1, -1,321,321,321, -1, -1, -1, -1, -1, -1],\n"+
    "\t[ -1, -1, -1, -1, -1, -1,321,321,321, -1, -1, -1, -1, -1, -1]\n"+
    "]);\n"+
    "maps['Tutorial3'].cmap = [\n"+
    "\t[  1,  1,  1,  1,  1,  1,  0,  0,  0,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  0,  0,  0,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  0,  0,  0,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  0,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  0,  0,  0,  1,  1,  1,  1,  0,  1,  1,  1,  1,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  1,  1,  1,  1,  0,  1,  1,  1,  1,  0,  0,  0],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  1,  0,  1,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  0,  0,  0,  1,  1,  1,  1,  1,  1],\n"+
    "\t[  1,  1,  1,  1,  1,  1,  0,  0,  0,  1,  1,  1,  1,  1,  1]\n"+
    "];\n";
});

