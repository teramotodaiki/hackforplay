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
            "// ー魔導書にうっすらと文字が浮かび上がっている...\n"+
            "// ゲーム画面の外にある「改造する」ボタンを押し、\n"+
            "// 新たなハックフォープレイを目の当たりにしよう...!";

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
    "// すばらしい！選ばれし者よ...よくぞここまで来た...!\n"+
    "// 真のHackforPlayはここからはじまる!\n\n"+

    "// 今まではダンジョンのコードを書き換え、ゲームを進めることを楽しんでいた\n"+
    "// しかし、このHackforPlay -RePlay- ではゲームを作ることを楽しむことができる！\n"+
    "// ...簡単だ、やることは今までと同じ、「コードの書き換え」なのだから...\n\n"+

    "// その第一歩として、まずはマップの見た目を書き換えてみるのだ\n"+
    "// このコードを見てほしい\n\n"+

    "maps['replay_t1'].bmap.loadData([\n"+
    "\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
    "\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
    "\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
    "\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
    "\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
    "\t[322,322,322,322,322,322,322, 76,322,322,322,322,322,322,322],\n"+
    "\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
    "\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
    "\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
    "\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322]\n"+
    "]);\n\n"+

    "// 地図のようなコード...似たようなものを見たことがあるだろうが、あれとは少し違う\n"+
    "// これはマップの見た目を表すコードなのだ\n"+
    "// そして322という数字は草原を表している\n\n"+

    "// このコードの数字を、自由に一つ書き換えてみよう...!\n\n"+

    "// 書き換えた後は、「ステージ改造コードを実行」ボタンを押すのだ\n\n"+

    "//*---------------------------------------------------------------------------------*\n\n"+

    "// 「ステージ改造コードを実行」ボタンは押せたか？\n"+
    "// ならば、マップの見た目が、少し変わっているはずだ\n\n"+

    "// 「うまくうごかなかった」と出た場合は、文字は半角か ,(カンマ)が消えていないかを確認するのだ\n\n"+

    "// うまく動いたなら、ゲーム画面の下にある「次のステージへ」ボタンを押し、\n"+
    "// ゲームにさらなる改造を加えよう！\n"+
    "\n";
});