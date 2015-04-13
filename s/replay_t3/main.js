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

        var player = new Knight('player'); // make player
        map.scene.addChild(player); // add player to scene
        player.locate(1, 5); // move position

        hint =
            "// ゲーム画面の外にある「改造する」ボタンを押すのだ...!\n"+
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

    // マップ定義の ] まで（`)`が登場するまで）を抜き出す
    var extend_map  =  __H4PENV__EXTENDCODE.match(/maps\[\'replay\'\]\.bmap\.loadData\(\[[\s\[\]0-9,]+/);
    if(extend_map === null){
        extend_map = "// エラー：マップ情報が取得できませんでした。この部分にマップについて書き直して下さい\n\n";
    }

    __H4PENV__DEFAULTCODE =
    "// 面白い...!マップにオリジナルな要素が出てきたな\n"+
    "// 次はマップをより面白い見た目にする方法を伝授する!\n\n"+

    extend_map +
    ",[\n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], \n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], \n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], \n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], \n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], \n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1,400,421, -1, -1, -1, -1, -1, -1], \n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], \n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], \n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], \n"+
    "\t[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]  \n"+
    "]);\n\n"+

    "// マップの見た目を表すコード、前とくらべて増えたことに気づいただろうか\n"+
    "// ほとんどが -1と書かれているコードのことだ。今回はこの２つ目のコード書き換えていこう\n\n"+

    "// このコードの数字は、前回作ったマップの”上”に描かれる見た目を表している\n"+
    "// 試しにマップの中央に400(壺)と421(花)を置いておいた\n\n"+

    "// この二つが邪魔な場合は -1と書き直すといい、-1は”何もない”ことを表す数字だ\n"+
    "// 逆に「ここに壺を置きたい」と思った場合は、その場所の -1を400に書き換えるといい\n\n"+

    "// どの数字がどの見た目なのかは、前回と同じくサイトの下に対応する表があるぞ...\n"+
    "// さあ、この２つ目のマップの見た目コードを書き換え、マップをより華やかにしてゆこう！\n\n"+

    "// 書き換えたら、「ステージ改造コードを実行」ボタンだ！\n\n"+

    "//*---------------------------------------------------------------------------------*\n\n"+

    "// 思い通りの見た目になっただろうか...\n"+
    "// なったのなら「次のステージへ」ボタンを押すのだ！\n"+

    "\n";
});