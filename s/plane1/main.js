
window.addEventListener('load', function() {
    var path = __H4PENV__PATH;
    game.preload(path+'monster1.gif', path+'monster2.gif', path+'monster3.gif', path+'monster4.gif', path+'bigmonster1.gif', path+'effect0.png');
    game.start();
    var hint;
    game.addEventListener('load', function(){

        var map = maps['Plane'];
        map.load();                 // Load map

        var player = new Knight(); // make player
        map.scene.addChild(player); // add player to scene
        player.locate(7, 2); // move position

        hint =
        "// ノーシグナル ......";

        // ここはコピペ
        // Runtime Evaluation
        setEval(function(code){
            eval(code);
        });
    });

    __H4PENV__DEFAULTCODE =
    "// ステージ改造コードを書いて、ステージを改造してやろう!!\n"+
    "\n"+
    "// -- マップの章 --\n"+
    "\n"+
    "// マップの絵を設定する\n"+
    "maps['Plane'].bmap.loadData([\n"+
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
    "]);\n"+
    "\n"+
    "// マップの当たり判定を設定する（0は通れるところ，1は通れないところ）\n"+
    "maps['Plane'].cmap = [\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
    "\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]\n"+
    "];\n"+
    "\n"+
    "\n"+
    "// -- アイテムの章 --\n"+
    "\n"+
    "// player は、自分のキャラクターのこと\n"+
    "player = env.player;\n"+
    "\n"+
    "// アイテム（コイン）\n"+
    "coin = new Item(); // アイテムを出す\n"+
    "coin.locate(3, 6); // コインの位置を変える\n"+
    "\n"+
    "\n"+
    "// アイテム（スター）\n"+
    "star = new Item(); // アイテムを出す\n"+
    "star.frame = 30; // スターの絵は３０番目\n"+
    "star.locate(7, 6); // スターの位置を変える\n"+
    "\n"+
    "// スターを拾ったときについて\n"+
    "star.pickup = function(){\n"+
    "\n"+
    "\t// ゆっくり上にあがって・・・\n"+
    "\tthis.sprite.tl.moveBy(0,-20,10).then(function(){\n"+
    "\t\n"+
    "\t\t// ゲームクリア\n"+
    "\t\tclear();\n"+
    "\t});\n"+
    "};\n"+
    "\n"+
    "// アイテム（ハート）\n"+
    "heart = new Item(); // アイテムを出す\n"+
    "heart.frame = 10; // ハートの絵は１０番目\n"+
    "heart.locate(11, 6); // ハートの位置を変える\n"+
    "\n"+
    "// ハートを拾ったときについて\n"+
    "heart.pickup = function(){\n"+
    "\tvar me = this;\n"+
    "\t\n"+
    "\t// ゆっくり上にあがって・・・\n"+
    "\tthis.sprite.tl.moveBy(0,-20,10).then(function(){\n"+
    "\t\n"+
    "\t\t// プレイヤーの体力を増やす\n"+
    "\t\tplayer.hp += 100;\n"+
    "\t\n"+
    "\t\t// テキストエリアに文字を表示する\n"+
    "\t\ttextarea.text = \"HPが 100 あがった！\";\n"+
    "\t\ttextarea.show();\n"+
    "\t\n"+
    "\t\t// このアイテムを消す\n"+
    "\t\tme.destroy();\n"+
    "\t});\n"+
    "\t\n"+
    "};\n"+
    "\n"+
    "\n"+
    "// アイテム（トラップ）\n"+
    "\n"+
    "// アイテムをプレイヤーより奥に表示するには、まず new Item(false) としておく\n"+
    "trap = new Item(false);\n"+
    "\n"+
    "// 次に、このように書く。insertBeforeを使ってplayerより手前に追加している\n"+
    "map.scene.insertBefore(trap, player);\n"+
    "\n"+
    "trap.setImage('map1.gif'); // map1.gif という画像を使う\n"+
    "trap.frame = 440; // トラップの絵は４４０番目\n"+
    "trap.locate(7, 5); // トラップの位置を変える\n"+
    "\n"+
    "// トラップにふれたときについて\n"+
    "trap.pickup = function(){\n"+
    "\t\n"+
    "\t// プレイヤーの体力を減らす\n"+
    "\tconsole.log(player.hp);\n"+
    "\tplayer.damage(100);\n"+
    "\tconsole.log(player.hp);\n"+
    "\t\n"+
    "\t// テキストエリアに文字を表示する\n"+
    "\ttextarea.text = \"HPが 100 さがった！\";\n"+
    "\ttextarea.show();\n"+
    "\t\n"+
    "\t// ハリの抜けた絵にかえる\n"+
    "\tthis.frame = 441; // ハリの抜けた絵は４４１番目\n"+
    "};\n"+
    "\n"+
    "\n"+
    "// -- モンスターの章 --\n"+
    "\n"+
    "// スライムについての「クラス（色々な設定をするところ）」\n"+
    "var BlueSlime = enchant.Class(Behaviour, {\n"+
    "\tinitialize: function(){\n"+
    "\t\t\n"+
    "\t\t// スライムの設定（名前,画像ファイル名,絵の幅,絵の高さ,絵の位置X,絵の位置Y）\n"+
    "\t\tBehaviour.call(this, {\n"+
    "\t\t\tnamae: 'slime',\n"+
    "\t\t\timage: path+'monster4.gif',\n"+
    "\t\t\twidth:48, height:48,\n"+
    "\t\t\tdx: -8, dy: -10\n"+
    "\t\t});\n"+
    "\t\tthis.width = this.height = 32; // 本体の大きさ\n"+
    "\t\tthis.collider.y = 0; // 当たり判定のY座標（もとは絵と同じ）\n"+
    "\t\tthis.sprite.frame = [2, 2, 2, 3, 3, 3]; // ピコピコする絵のフレーム\n"+
    "\t\tthis.hp = 3; // 体力の初期値\n"+
    "\t\tthis.behavior = BehaviorTypes.Idle; // 「休み（アイドル）」状態に設定\n"+
    "\t\tthis.useMessage = false; // ふれたときに、メッセージが出ないようにする\n"+
    "\t},\n"+
    "\tdamage : function(atk){\n"+
    "\t\t\n"+
    "\t\t// スライムがダメージを受けたときについて（アイドル状態の時のみ）\n"+
    "\t\tif(this.behavior === BehaviorTypes.Idle){\n"+
    "\t\t\tthis.hp -= atk; // atk（攻撃力）の分だけHPが減る\n"+
    "\t\t\tif(this.hp > 0){\n"+
    "\t\t\t\t\n"+
    "\t\t\t\t// HPがまだ0より多く残っているとき\n"+
    "\t\t\t\tthis.behavior = BehaviorTypes.Damaged; // ダメージ状態に設定\n"+
    "\t\t\t\tthis.sprite.frame = [4, 4, 5, null]; // くらう絵のフレーム\n"+
    "\t\t\t\t\n"+
    "\t\t\t\t// 少し時間をおいて・・・\n"+
    "\t\t\t\tthis.tl.clear().delay(5).then(function(){\n"+
    "\t\t\t\t\t\n"+
    "\t\t\t\t\t// 「休み（アイドル）」状態にもどる\n"+
    "\t\t\t\t\tthis.behavior = BehaviorTypes.Idle;\n"+
    "\t\t\t\t\tthis.sprite.frame = [2, 2, 2, 3, 3, 3];\n"+
    "\t\t\t\t});\n"+
    "\t\t\t}else{\n"+
    "\t\t\t\t\n"+
    "\t\t\t\t// HPが0以下になったとき\n"+
    "\t\t\t\tthis.behavior = BehaviorTypes.Dead; // デッド状態に設定\n"+
    "\t\t\t\tthis.sprite.frame = [5, 5, 5, 7, 7]; // やられた絵のフレーム\n"+
    "\t\t\t\t\n"+
    "\t\t\t\t// 少し時間をおいて・・・\n"+
    "\t\t\t\tthis.tl.clear().delay(5).then(function(){\n"+
    "\t\t\t\t\t\n"+
    "\t\t\t\t\t// このスライムを消去する\n"+
    "\t\t\t\t\tthis.destroy();\n"+
    "\t\t\t\t});\n"+
    "\t\t\t}\n"+
    "\t\t}\n"+
    "\t}\n"+
    "});\n"+
    "\n"+
    "// スライムを出現させる（この２行を書くと出現する）\n"+
    "slime1 = new BlueSlime();\n"+
    "slime1.setScene();\n"+
    "\n"+
    "slime1.locate(3, 5); // スライムの位置をかえる\n"+
    "\n"+
    "// スライムを出現させる\n"+
    "slime2 = new BlueSlime();\n"+
    "slime2.setScene();\n"+
    "\n"+
    "slime2.locate(11, 5); // スライムの位置をかえる\n"+
    "\n"+
    "\n";
});