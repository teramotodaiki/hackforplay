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
            "\n"+
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
    "// おめでとう！マップの完成だ！\n"+
    "// ゴールの階段(stair)とスライム(blueSlime)を置き、ゲームを完成させよう...!\n\n"+

    "// ExtendCode\n\n"+

    "player.locate(1, 5);\n\n"+

    "blueSlime.locate(9, 5);\n\n"+

    "stair.locate(13, 5);\n\n"+

    "// 場所(locate)を書き換え、クリアができる状態までもっていけば、完成だ\n"+
    "// マップについても自由に調整するといい\n\n"+

    "//*---------------------------------------------------------------------------------*\n\n"+

    "// 完成し、「ステージ改造コードを実行」ボタンを押せば、次はこのゲームの投稿だ\n\n"+

    "// 投稿されたステージは、サイト上に掲載され、みんなが自由に遊べるようになる\n"+
    "// また、投稿されたステージはすべて改造し直すことができる！\n"+
    "// 自分の投稿したステージを改良するも良し、他の人が投稿したステージをより面白く作り直すことも良しだ\n\n"+

    "// 「この改造ステージを投稿する」ボタンを押して、投稿するのだ！\n"+
    "// 実際にサイト上に掲載されるまでは少し時間がかかる、気長に待ってほしい\n\n"+

    "//*---------------------------------------------------------------------------------*\n\n"+

    "// おめでとう、そして、お疲れ様\n"+
    "// HackforPlay-RePlay- の改造ステージ一覧には様々なオリジナリティのあるステージが並んでいる\n"+
    "// それらに負けないよう、君がより面白いステージを作ることを期待している\n"+
    "\n";
});