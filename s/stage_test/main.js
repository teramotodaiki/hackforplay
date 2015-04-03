
window.addEventListener('load', function() {
    game.start();
    game.addEventListener('load', function(){

        var map = maps['Living'];   // リビングのマップを
        map.load();                 // マップのロード（最初に読み込むマップ）

        var kikai = new VendingMachine('kikai');  // 自動販売機
        map.scene.addChild(kikai);
        kikai.locate(10, 3);

        var player = new Player('player');  // プレイヤーを作る
        map.scene.addChild(player);         // プレイヤーをシーンに追加する
        player.locate(4, 6);

        var pc = new PC('pc');  // PCを作る
        map.scene.addChild(pc); // シーンに追加する
        pc.locate(7, 4);        // PCの位置をきめる

        var girl = new Girl('girl');
        map.scene.addChild(girl);
        girl.locate(4, 4);
        env.player._nomimono = null;

        var hint =
        "// じっこうボタンをおすと、プログラムじっこう。\n" +
        "// 「'」というマークでかこんであることが、だいじ。\n" +
        "// かきかえたら、じっこう することをわすれずに。\n" +
        "kikai.nomimono = 'オレンジジュース';\n";

        // ここはコピペ
        // Runtime Evaluation
        setEval(function(code){
            eval(code);
        });
    });
    var VendingMachine = enchant.Class(Behaviour, {
        initialize: function(_namae){
            Behaviour.call(this, {
                namae: _namae,
                image: 'img/map_lizzy.png',
                width: 32, height: 64, dy: 15,
                draw:  [[55],[63]]
            });
            this.collider = { x:0, y:0, width:32, height:48 }; // コライダを調整する
            this.nomimono = null;
            this.__defineGetter__('message', function(){
                if(this.nomimono === null) return "なにもでてこなかった。\nじっこうして、のみものをけっていしよう。";
                else {
                    env.player._nomimono = this.nomimono;
                    return "「ガチャガチャ...バコン!!」\nキカイから おとがして、 " + this.nomimono + " がでてきた。";
                }
            });
        },
        onenterframe: function(){
        }
    });
    var Girl =　enchant.Class(Behaviour, {
        initialize: function(_namae){
            Behaviour.call(this, {
                namae: _namae,
                image: 'img/chara0.png'
            });
            this.isPublic = false;  // 女の子の変数名はわからない
            this.sprite.frame = 7;  // 手前を向いている女の子
            this.cleared = 0;       // ちゃんと運べた数
            this.wanted = [
            "オレンジジュース",
            "おいしいみず",
            "ごくごくマイルドなんごくコーラ"]; // これを順番に欲しがる
            this.__defineGetter__('message', function(){
                var have = env.player._nomimono;
                var want = this.wanted[this.cleared];
                if(this.cleared < 3){
                    if(have === null) {
                        return "わたし、" + this.wanted[this.cleared] + "がのみたいの。\n" +
                            "でも、キカイがこわれているみたい。\n・・・はあ。";
                    }
                    if(want === have){
                        // 正解
                        this.cleared ++;
                        env.player._nomimono = null;
                        return "わあ！ありがとう！\nゴク、ゴク...おいしかったわ！\n" +
                            (this.cleared < 3 ?
                                "つぎは" + this.wanted[this.cleared] + "がのみたいの。おねがいね！" :
                                "わがままにつきあってくれて、どうもありがとう！");
                    }else{
                        // 不正解
                        env.player._nomimono = null;
                        return "わあ！ありがとう！\nゴク、ゴク...って、ちがうじゃない！これ、" + have + "よ！\n" +
                            "わたしがほしいのは、" + want + "なの。わかった？";
                    }
                } else {
                    // 終了
                    return "ぜんぶおいしかったわ。\nキカイはこわれていなかったのね。";
                }
            });
        },
        onenterframe: function(){
            if(this.cleared >= 3 && !textarea.enabled){
                clear(__H4PENV__TOKEN);
            }
        }
    });
});
