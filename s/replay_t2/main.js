window.addEventListener('load', function() {
    var path = __H4PENV__PATH;
    game.preload(path+'monster4.gif');
    game.start();
    var blueSlime, hint;
    game.addEventListener('load', function(){

        var map = maps['replay_t1'];
        map.load();                 // Load map

        env.enchantbook = new EnchantBook();
        game.rootScene.addChild(env.enchantbook);

        // blueSlime = new BlueSlime('blueSlime'); // make blue slime
        // map.scene.addChild(blueSlime);
        // blueSlime.locate(9, 5);

        // var stair = new Stair('stair');
        // map.scene.addChild(stair);
        // stair.locate(12, 5);

        var player = new Knight('player'); // make player
        map.scene.addChild(player); // add player to scene
        player.locate(1, 5); // move position

        hint = 
            "// ー魔導書にうっすらと文字が浮かび上がっている...\n"+
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

    __H4PENV__DEFAULTCODE =
    "// おめでとう！君は改造ステージ作りの第一歩を踏み出した！\n\n"+

    "// このHackforPlay -RePlay- では、ここからさらにステージに改造してゆく...\n"+
    "// 最後には君だけのオリジナルステージが出来上がり、サイト上に投稿することができるのだ！\n"+
    "// 投稿されたステージはみんなに遊んでもらうことができ、\n"+
    "// もちろん君もみんなの作ったステージで遊ぶことができる！\n\n"+

    "// それでは、そのためにもう少しオリジナリティーを出していこう\n\n"+

    "// ExtendCode\n\n"+

    "// これが今のマップの見た目についてのコードだ\n"+
    "// いまはほとんどが322(草原)になっていると思うが、これをより書き換えていこう\n\n"+

    "// どの数字がどの見た目を表しているかについてだが、\n"+
    "// サイトの画面を下へスクロールすると表があるはずだ、これをみながら書き換えるといい\n\n"+

    "// 書き換えたら、「ステージ改造コードを実行」ボタンだ\n\n"+

    "//*---------------------------------------------------------------------------------*\n\n"+

    "// 思い通りのマップに書き換えられただろうか\n"+
    "// できたなら「次のステージへ」ボタンを押すのだ！\n"+
    "";
});