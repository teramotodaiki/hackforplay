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

    // 元々あったコメント行を除いた全てのコードを抜き出す
    var extend_code = __H4PENV__EXTENDCODE.replace(/(^\/\/.*)|(\n\/\/.*)/g, '');
    // 連続した空行を改行+空行にする
    extend_code = extend_code.replace(/\n\n+/mg, '\n\n');
    // 行頭の改行を削除する
    extend_code = extend_code.replace(/^\n+/g, '');

    __H4PENV__DEFAULTCODE =

    extend_code+

    "// 本当におめでとう！！オリジナルステージの改造はこれですべてだ！\n\n"+
    "// ステージが完成し、「ステージ改造コードを実行」ボタンを押せば、次はこのゲームの投稿だ\n\n"+

    "// 投稿されたステージは、サイト上に掲載され、みんなが自由に遊べるようになる\n"+
    "// また、投稿されたステージはすべて改造し直すことができる！\n"+
    "// 投稿したステージを改良するも良し、他の人に投稿されたステージをより面白く作り直すことも良しだ\n\n"+

    "// 「この改造ステージを投稿する」ボタンを押して、投稿するのだ！\n"+
    "// 実際にサイト上に掲載されるまでは少し時間がかかる、気長に待ってほしい\n\n"+

    "//*---------------------------------------------------------------------------------*\n\n"+

    "// おめでとう、そして、お疲れ様\n"+
    "// HackforPlay-RePlay- の改造ステージ一覧には様々なオリジナリティのあるステージが並んでいる\n\n"+

    "// 面白いステージを見つけたら、「改造する」ボタンを押してみよう\n"+
    "// そのステージを構成するコードがそこに並んでいるはずだ\n\n"+

    "// そのコードの一部をコピーして、自分のステージの改造コードにペーストすることで、\n"+
    "// 新しい面白さが、君のステージに取り込まれるだろう\n\n"+

    "// そのようにして、君がより最高のステージを作っていくことを期待している！\n"+
    "\n";
});