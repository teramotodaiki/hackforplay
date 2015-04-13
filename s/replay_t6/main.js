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
            "// ここは深遠なる迷宮...\n"+
            "// はたして無事に階段までたどり着けるかな...\n\n"+

            "blueSlime.hp = 99;\n\n"+

            "// 最強のスライムの前にひれ伏すがいい...!\n"+
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

    // 元々あったコメント行を除いた全てのコードを抜き出す
    var extend_code = __H4PENV__EXTENDCODE.replace(/(^\/\/.*)|(\n\/\/.*)/g, '');
    // 連続した空行を改行+空行にする
    extend_code = extend_code.replace(/\n\n+/mg, '\n\n');
    // 行頭の改行を削除する
    extend_code = extend_code.replace(/^\n+/g, '');

    __H4PENV__DEFAULTCODE =
    "// すばらしい出来だ！\n"+
    "// 最後は魔導書の中身を書き換えよう！\n\n"+

    extend_code+

    "hint = \n"+
    "\t\"// ここは深遠なる迷宮...\\n\"+\n"+
    "\t\"// はたして無事に階段までたどり着けるかな...\\n\\n\"+\n"+
    "\t\"blueSlime.hp = 99\\n\\n\"+\n"+
    "\t\"// 最強のスライムの前にひれ伏すがいい...!\\n\"+\n"+
    "\t\"\";\n"+
    "sendToEditor('setHint();');\n\n"+

    "// hint = 以降の、オレンジ色になっている部分が、魔導書の中身のコードだ\n"+
    "// 改造コードを実行し、魔導書を開けば、同じことが書かれているとわかるだろう\n\n"+

    "// 魔導書の中身のコードは、このステージを遊ぶ人のためのヒントとなる\n"+
    "// また、そのステージのストーリーを伝える役目もあるのだ！\n\n"+

    "// 楽しくクリアできるステージにするために、オレンジ色の文字を書き換えていこう！\n\n"+

    "//*---------------------------------------------------------------------------------*\n\n"+

    "// だが少しだけ注意が必要だ\n\n"+

    "// 文章が緑色や黒色になったときは、文章が「文字列」でないことを示している\n"+
    "// 「文字列」とは、日本語や英語を自由に書ける文章のことだ\n"+
    "// \"(ダブルクォーテーション)で囲むことで、文字列になるぞ...！\n"+
    "// また、行をまたいで文字列にしたい時は、+記号でつなげることができるのだ！\n\n"+

    "// 改行したいときは、文字列の中で\\nと書くといい(これを改行文字という)\n"+
    "// \\という文字は、altキーを押しながら￥キーを押すことで入力できる\n"+
    "// ２行改行したいときは、\\n\\nと書くといい、もちろんこれらはすべて半角で書くのだ\n\n"+

    "// 「ここは深遠なる迷宮...」などの文章の手前に//という記号があることに注目してほしい\n"+
    "// この記号の書かれた行の文章を「コメント」という\n"+
    "// コード以外の、日本語などの文章を書くときには、その行の始めに//記号をつけるのだ...！\n\n"+

    "//*---------------------------------------------------------------------------------*\n\n"+

    "// 完成し、「ステージ改造コードを実行」ボタンを押せば、次のステージでこのゲームを投稿しよう！\n"+
    "";
});