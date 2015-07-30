window.addEventListener('load', function() {

	var game = enchant.Core.instance;
	game.preload(['kurage-koubou/lifeup.mp3','kurage-koubou/speedup.mp3','kurage-koubou/damage.mp3','kurage-koubou/attack.mp3','rengoku-teien/BGM.mp3','enchantjs/font1.png','enchantjs/x2/icon0.png','enchantjs/x2/map1.png','enchantjs/x2/map0.png','enchantjs/chara1.png','enchantjs/bigmonster1.gif','enchantjs/bigmonster2.gif','enchantjs/monster1.gif','enchantjs/monster2.gif','enchantjs/monster3.gif', 'enchantjs/monster4.gif','enchantjs/monster7.gif','hackforplay/enchantbook.png']);

	var binded_key = ' '.charCodeAt(0);
	game.keybind(binded_key, 'a'); // aボタンはスペースキー

	Hack.textarea.backgroundColor = 'rgba(0,20,40,0.5)';

	// ====> 改造コードへ
	Hack.restagingCode =
"//はじめに\n"+
"//このゲームを作った人は説明がうまくないので\n"+
"//あまりわからないかもしれません\n"+
"//でも...君ならできる！！\n"+
"//俺はそう信じている！！\n"+
"\n"+
"//そして同じようなことを書いてあるところや\n"+
"//説明が難しい部分にはコメントを書いていないかもしれない！！\n"+
"//それでも！それでもなお！！...君ならできる！！\n"+
"//俺はそう信じている...\n"+
"\n"+
"\n"+
"//難易度について\n"+
"//★☆☆☆☆:かんたん\n"+
"//★★☆☆☆:まぁまぁかんたん\n"+
"//★★★☆☆:ちょいむず\n"+
"//★★★★☆:激むず\n"+
"//★★★★★:鬼むず\n"+
"\n"+
"\t//難易度:★☆☆☆☆\n"+
"\t//====STAGE1:変数つくり====\n"+
"\n"+
"\t//ここではモンスターやアイテム、そしてビームの出る時間のかんかくをそうさしている\n"+
"\n"+
"\tslime_encounter = 50;//スライムのしゅつげんする時間のかんかく\n"+
"\tinsect_encounter = 50;\n"+
"\tspider_encounter = 50;\n"+
"\tscopion_encounter = 50;\n"+
"\tdragon_encounter = 50;\n"+
"\tdaemon_encounter = 50;\n"+
"\tspeedup_encounter = 300;//リンゴのしゅつげんする時間のかんかく\n"+
"\tlifeup_encounter = 300;//ハートのしゅつげんする時間のかんかく\n"+
"\tlifedown_encounter = 300;//どくろのしゅつげんする時間のかんかく\n"+
"\n"+
"\t//=========================\n"+
"\n"+
"\n"+
"\t//ゲームを起動したときに行う処理\n"+
"\tgame.onload = function() {\n"+
"\t\tHack.pressStartKey(' ');\n"+
"\t\tHack.defaultParentNode = new enchant.Group();//新しいグループを作る\n"+
"\t\t\n"+
"\n"+
"\t\t//難易度:★★☆☆☆\n"+
"\t\t//====STAGE2:はいけい作り====\n"+
"\n"+
"\t\t//ここでは、はいけいを作っています。\n"+
"\n"+
"\t\tvar map = new enchant.Map(32, 32);//はいけいの大きさみたいなものをきめます\n"+
"\t\tmap.image = game.assets['enchantjs/x2/map1.png'];//はいけいを作るのに使う画像を指定します\n"+
"\n"+
"\t\t//はいけいの画像を並べます？ちょっと説明が難しい...\n"+
"\t\tmap.loadData([\n"+
"\t\t\t[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],\n"+
"\t\t\t[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],\n"+
"\t\t\t[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],\n"+
"\t\t\t[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],\n"+
"\t\t\t[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],\n"+
"\t\t\t[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],\n"+
"\t\t\t[ 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],\n"+
"\t\t\t[ 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],\n"+
"\t\t\t[ 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],\n"+
"\t\t\t[ 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]\n"+
"\t\t]);\n"+
"\n"+
"\t\tHack.defaultParentNode.addChild(map);//はいけいをグループに入れます\n"+
"\t\tgame.rootScene.addChild(map);//はいけいをゲーム(画面上)に入れます\n"+
"\n"+
"\t\t//===========================\n"+
"\n"+
"\n"+
"\n"+
"\t\t//難易度:★★☆☆☆\n"+
"\t\t//====STAGE3:プレイヤーの設定====\n"+
"\n"+
"\t\t//ここではプレイヤーのいろいろなことを設定することができる\n"+
"\n"+
"\t\t//プレイヤーの画像をきめている\n"+
"\t\tHack.player = Hack.createMovingSprite(32,32, {\n"+
"\t\t\tx: 210, y: 160,\n"+
"\t\t\timage: game.assets['enchantjs/chara1.png'],\n"+
"\t\t\tframe: [0,0,0,1,1,1,2,2,2],\n"+
"\t\t});\n"+
"\n"+
"\t\t//プレイヤーのHPとかサイズとかをきめている\n"+
"\t\tHack.player.hp = 5; //プレイヤーのHP\n"+
"\t\tHack.player.hp_img = [];//HPのイメージ(HPのハートの画像のことだ)\n"+
"\t\tHack.player.size = 1;//プレイヤーのサイズ\n"+
"\t\tHack.player.direction = 0;//プレイヤーの向き(0が左、1が右を表している)\n"+
"\t\tHack.player.speed = 2;//プレイヤーのいどうスピード\n"+
"\t\tHack.player.isDamaged = false; //プレイヤーがダメージをくらったどうか\n"+
"\n"+
"\t\t//===============================\n"+
"\n"+
"\t\tHack.monster = [];//生成されるモンスターをいれる場所\n"+
"\t\tHack.item = [];//生成されるアイテムをいれる場所\n"+
"\t\tgame.keybind(90, 'z');//おまじない\n"+
"\n"+
"\t\t// 魔道書の画像\n"+
"\t\tHack.enchantBookIcon = Hack.createSprite(64, 64, {\n"+
"\t\t\timage: game.assets['hackforplay/enchantbook.png'],\n"+
"\t\t\tdefaultParentNode: game.rootScene,\n"+
"\t\t\tontouchend: function() {\n"+
"\t\t\t\tHack.openEditor();\n"+
"\t\t\t}\n"+
"\t\t});\n"+
"\t\t// 魔道書の中身\n"+
"\t\tHack.hint =\n"+
"\t\t\t\t\t'slime_encounter = 50;//スライムの出現頻度'+\n"+
"\t\t\t\t\t'insect_encounter = 50;//いもむしの出現頻度'+\n"+
"\t\t\t\t\t'spider_encounter = 50;//くもの出現頻度'+\n"+
"\t\t\t\t\t'scopion_encounter = 50;//さそりの出現頻度'+\n"+
"\t\t\t\t\t'dragon_encounter = 50;//ドラゴンの出現頻度'+\n"+
"\t\t\t\t\t'daemon_encounter = 50;//デーモンの出現頻度'+\n"+
"\t\t\t\t\t'speedup_encounter = 300;//リンゴの出現頻度'+\n"+
"\t\t\t\t\t'lifeup_encounter = 400;//ハートの出現頻度'+\n"+
"\t\t\t\t\t'lifedown_encounter = 400;//どくろの出現頻度'+\n"+
"\t\t\t\t\t'//出現頻度は低いほどたくさん出てくるようになるぞ！'+\n"+
"\t\t\t\t\t'//(でも0以下からは効果が変わらないぞ！)';\n"+
"\n"+
"\n"+
"\t\t//難易度★☆☆☆☆\n"+
"\t\t//====STAGE4:スタート画面のあれこれ====\n"+
"\n"+
"\t\t//ここではスタート画面の文字やモンスターやアイテムのがぞうを表示している。"+
"\n"+
"\t\t//遊び方のラベル\n"+
"\t\tHack.howtoLabel = Hack.createLabel('                            [遊び方]<br>'+\n"+
"\t\t\t\t\t\t\t\t\t\t\t'このゲームは弱肉強食の世の中を再現しようとして作ったゲームです<br>'+\n"+
"\t\t\t\t\t\t\t\t\t\t\t'自分より小さいものを喰らい、どんどん大きくなっていきましょう<br>'+\n"+
"\t\t\t\t\t\t\t\t\t\t\t'くまのサイズが100を超えるとゲームクリアです！！<br>',\n"+
"\t\t\t\t\t\t\t\t\t\t\t{\n"+
"\t\t\t\t\t\t\t\t\t\t\t\tx: 70, y: 10, color: 'blue', width:400,\n"+
"\t\t\t\t\t\t\t\t\t\t\t\tdefaultParentNode: game.rootScene\n"+
"\t\t\t\t\t\t\t\t\t\t\t});\n"+
"\t\tHack.PressStartLabel = [];\n"+
"\t\tHack.PressStartLabel[0] = CreateFont(220-16*4,170-16*2,48);//P\n"+
"\t\tHack.PressStartLabel[1] = CreateFont(220-16*2,170-16*2,50);//R\n"+
"\t\tHack.PressStartLabel[2] = CreateFont(220     ,170-16*2,37);//E\n"+
"\t\tHack.PressStartLabel[3] = CreateFont(220+16*2,170-16*2,51);//E\n"+
"\t\tHack.PressStartLabel[4] = CreateFont(220+16*4,170-16*2,51);//S\n"+
"\n"+
"\t\tHack.PressStartLabel[5] = CreateFont(220-16*1/2*2,170,52);//T\n"+
"\t\tHack.PressStartLabel[6] = CreateFont(220+16*1/2*2,170,47);//O\n"+
"\n"+
"\t\tHack.PressStartLabel[7] = CreateFont(220-16*4,170+16*2,51);//S\n"+
"\t\tHack.PressStartLabel[8] = CreateFont(220-16*2,170+16*2,48);//P\n"+
"\t\tHack.PressStartLabel[9] = CreateFont(220     ,170+16*2,33);//A\n"+
"\t\tHack.PressStartLabel[10] = CreateFont(220+16*2,170+16*2,35);//C\n"+
"\t\tHack.PressStartLabel[11] = CreateFont(220+16*4,170+16*2,37);//E\n"+
"\n"+
"\t\tfor(var i = 0; i < Hack.PressStartLabel.length;i++)//Hack.PressStartLabel.lengthはHack.PressStartLabelの長さを表している。長さは11\n"+
"\t\t{\n"+
"\t\t\tHack.PressStartLabel[i].onenterframe = function(){\n"+
"\t\t\t\tthis.scaleX=1.5+Math.sin(game.frame/20)/2;//文字の大きさを変えている\n"+
"\t\t\t\tthis.scaleY=1.5+Math.cos(game.frame/20)/2;//文字の大きさを変えている\n"+
"\t\t\t}\n"+
"\t\t}\n"+
"\n"+
"\t\t//リンゴの絵\n"+
"\t\tHack.apple = Hack.createMovingSprite(32,32, {\n"+
"\t\t\tx: 80, y: 70,\n"+
"\t\t\timage: game.assets['enchantjs/x2/icon0.png'],\n"+
"\t\t\tframe: [15],\n"+
"\t\t});\n"+
"\n"+
"\t\tHack.apple_label = [];\n"+
"\n"+
"\t\tHack.apple_label[0] = CreateFont(60     ,105   ,51);//S\n"+
"\t\tHack.apple_label[1] = CreateFont(60+16  ,105   ,48);//P\n"+
"\t\tHack.apple_label[2] = CreateFont(60+16*2,105   ,37);//E\n"+
"\t\tHack.apple_label[3] = CreateFont(60+16*3,105   ,37);//E\n"+
"\t\tHack.apple_label[4] = CreateFont(60+16*4,105   ,36);//D\n"+
"\n"+
"\t\tHack.apple_label[5] = CreateFont(80     ,105+16,53);//U\n"+
"\t\tHack.apple_label[6] = CreateFont(80+16  ,105+16,48);//P\n"+
"\t\tHack.apple_label[7] = CreateFont(80+16*2,105+16, 1);//!\n"+
"\n"+
"\t\t//ハートの絵\n"+
"\t\tHack.heart = Hack.createMovingSprite(32,32, {\n"+
"\t\t\tx: 210, y: 70,\n"+
"\t\t\timage: game.assets['enchantjs/x2/icon0.png'],\n"+
"\t\t\tframe: [10],\n"+
"\t\t});\n"+
"\n"+
"\t\tHack.heart_label = [];\n"+
"\t\tHack.heart_label[0] = CreateFont(195     ,105,40);//H\n"+
"\t\tHack.heart_label[1] = CreateFont(195+16  ,105,48);//P\n"+
"\n"+
"\t\tHack.heart_label[2] = CreateFont(230     ,105,53);//U\n"+
"\t\tHack.heart_label[3] = CreateFont(230+16*1,105,48);//P\n"+
"\t\tHack.heart_label[4] = CreateFont(230+16*2,105, 1);//!\n"+
"\n"+
"\t\t//どくろの絵\n"+
"\t\tHack.skull = Hack.createMovingSprite(32,32, {\n"+
"\t\t\tx: 340, y: 70,\n"+
"\t\t\timage: game.assets['enchantjs/x2/icon0.png'],\n"+
"\t\t\tframe: [11],\n"+
"\t\t});\t\t\n"+
"\n"+
"\t\tHack.skull_label = [];\n"+
"\t\tHack.skull_label[0] =  CreateFont(343    ,105,40);//H\n"+
"\t\tHack.skull_label[1] =  CreateFont(343+16  ,105,48);//P\n"+
"\t\tHack.skull_label[2] =  CreateFont(325     ,105+16,36);//D\n"+
"\t\tHack.skull_label[3] =  CreateFont(325+16  ,105+16,47);//O\n"+
"\t\tHack.skull_label[4] =  CreateFont(325+16*2,105+16,55);//W\n"+
"\t\tHack.skull_label[5] =  CreateFont(325+16*3,105+16,46);//N\n"+
"\t\tHack.skull_label[6] =  CreateFont(325+16*4,105+16, 1);//!\n"+
"\n"+
"\t\tHack.size_label = [];\n"+
"\t\tHack.size_label[0] = CreateFont(10,280,51);//S\n"+
"\t\tHack.size_label[1] = CreateFont(22,280,41);//I\n"+
"\t\tHack.size_label[2] = CreateFont(33,280,58);//Z\n"+
"\t\tHack.size_label[3] = CreateFont(46,280,37);//E\n"+
"\n"+
"\n"+
"\t\t//スライムの絵\n"+
"\t\tHack.slime_img = Hack.createMovingSprite(48,48, {\n"+
"\t\t\tx: 60, y: 240,\n"+
"\t\t\timage: game.assets['enchantjs/monster4.gif'],\n"+
"\t\t\tframe: [2,2,2,2,2,3,3,3,3,3,4,4,4,4,4,5,5,5,5,5],\n"+
"\t\t});\n"+
"\n"+
"\t\tHack.slime_label = [];\n"+
"\t\tHack.slime_label[0] = CreateFont(65,280,17);//1\n"+
"\t\tHack.slime_label[1] = CreateFont(78,280,14);//.\n"+
"\t\tHack.slime_label[2] = CreateFont(84,280,16);//0\n"+
"\n"+
"\t\t//いもむしの絵\n"+
"\t\tHack.incect_img = Hack.createMovingSprite(48,48, {\n"+
"\t\t\tx: 120, y: 235,\n"+
"\t\t\timage: game.assets['enchantjs/monster1.gif'],\n"+
"\t\t\tframe: [2,2,2,2,2,2,3,3,3,3,3,3],\n"+
"\t\t});\t\t\t\t\n"+
"\n"+
"\t\tHack.incect_label = [];\n"+
"\t\tHack.incect_label[0] = CreateFont(128,280,18);//2\n"+
"\t\tHack.incect_label[1] = CreateFont(141,280,14);//.\n"+
"\t\tHack.incect_label[2] = CreateFont(147,280,16);//0\n"+
"\n"+
"\t\t//くもの絵\n"+
"\t\tHack.spider_img = Hack.createMovingSprite(64,64, {\n"+
"\t\t\tx: 180, y: 225,\n"+
"\t\t\timage: game.assets['enchantjs/monster2.gif'],\n"+
"\t\t\tframe: [2,2,2,2,2,3,3,3,3,3,4,4,4,4,4],\n"+
"\t\t});\n"+
"\n"+
"\t\tHack.spider_label = [];\n"+
"\t\tHack.spider_label[0] = CreateFont(194,280,19);//3\n"+
"\t\tHack.spider_label[1] = CreateFont(207,280,14);//.\n"+
"\t\tHack.spider_label[2] = CreateFont(213,280,21);//5\n"+
"\n"+
"\t\t//さそりの絵\n"+
"\t\tHack.scopion_img = Hack.createMovingSprite(48,48, {\n"+
"\t\t\tx: 250, y: 233,\n"+
"\t\t\timage: game.assets['enchantjs/monster7.gif'],\n"+
"\t\t\tframe: [2,2,2,2,2,3,3,3,3,3,4,4,4,4,4],\n"+
"\t\t});\n"+
"\n"+
"\t\tHack.scopion_label = [];\n"+
"\t\tHack.scopion_label[0] = CreateFont(258,280,22);//6\n"+
"\t\tHack.scopion_label[1] = CreateFont(271,280,14);//.\n"+
"\t\tHack.scopion_label[2] = CreateFont(277,280,21);//5\n"+
"\n"+
"\t\t//ドラゴンの絵\n"+
"\t\tHack.dragon_img = Hack.createMovingSprite(80,80, {\n"+
"\t\t\tx: 310, y: 205,\n"+
"\t\t\timage: game.assets['enchantjs/bigmonster1.gif'],\n"+
"\t\t\tframe: [2,2,2,2,2,3,3,3,3,3,4,4,4,4,4],\n"+
"\t\t});\n"+
"\n"+
"\t\tHack.dragon_label = [];\n"+
"\t\tHack.dragon_label[0] = CreateFont(334,280,17);//1\n"+
"\t\tHack.dragon_label[1] = CreateFont(350,280,16);//0\n"+
"\n"+
"\t\t//デーモンの絵\n"+
"\t\tHack.daemon_img = Hack.createMovingSprite(80,80, {\n"+
"\t\t\tx: 385, y: 200,\n"+
"\t\t\timage: game.assets['enchantjs/bigmonster2.gif'],\n"+
"\t\t\tframe: [2,2,2,2,2,3,3,3,3,3,4,4,4,4,4],\n"+
"\t\t});\n"+
"\n"+
"\t\tHack.daemon_label = [];\n"+
"\t\tHack.daemon_label[0] = CreateFont(420,280,18);//2\n"+
"\t\tHack.daemon_label[1] = CreateFont(436,280,16);//0\n"+
"\n"+
"\t\t//===================================\n"+
"\t};\n"+
"\n"+
"\t//----------↓ボタンを押したらスタート↓--------------\n"+
"\n"+
"\tHack.onpressstart = function() {\n"+
"\t\tHack.started = true;\n"+
"\n"+
"\t\tif(game.assets[BGM] !== undefined){\n"+
"\t\t\tif(game.assets[BGM].src){\n"+
"\t\t\t\tgame.assets[BGM].play();\n"+
"\t\t\t\tgame.assets[BGM].src.loop = true;\n"+
"\t\t\t}\n"+
"\t\t}\t\n"+
"\n"+
"\t\t//難易度:★☆☆☆☆\n"+
"\t\t//====STAGE5:スタート画面のあれこれ2====\n"+
"\n"+
"\t\t//ここではゲームがスタートしたときに、スタート画面の文字やアイテムやモンスターのがぞうを消すことをしています。\n"+
"\n"+
"\t\t//[遊び方]を消す\n"+
"\t\tHack.defaultParentNode.removeChild(Hack.howtoLabel);\n"+
"\t\tgame.rootScene.removeChild(Hack.howtoLabel);\n"+
"\n"+
"\t\t//PRESS TO SPACE を消す\n"+
"\t\tfor(var i = 0; i < Hack.PressStartLabel.length;i++)\n"+
"\t\t{\n"+
"\t\t\tHack.defaultParentNode.removeChild(Hack.PressStartLabel[i]);\n"+
"\t\t\tgame.rootScene.removeChild(Hack.PressStartLabel[i]);\n"+
"\t\t}\n"+
"\n"+
"\t\t//リンゴの絵を消す\n"+
"\t\tHack.defaultParentNode.removeChild(Hack.apple);\n"+
"\t\tgame.rootScene.removeChild(Hack.apple);\n"+
"\n"+
"\t\t//SPEED UP! を消す処理\n"+
"\t\tfor(var i = 0; i < Hack.apple_label.length;i++)\n"+
"\t\t{\n"+
"\t\t\tHack.defaultParentNode.removeChild(Hack.apple_label[i]);\n"+
"\t\t\tgame.rootScene.removeChild(Hack.apple_label[i]);\n"+
"\t\t}\n"+
"\n"+
"\t\t//ハートの絵を消す\n"+
"\t\tHack.defaultParentNode.removeChild(Hack.heart);\n"+
"\t\tgame.rootScene.removeChild(Hack.heart);\n"+
"\n"+
"\t\t//HP UP! を消す\n"+
"\t\tfor(var i = 0; i < Hack.heart_label.length;i++)\n"+
"\t\t{\n"+
"\t\t\tHack.defaultParentNode.removeChild(Hack.heart_label[i]);\n"+
"\t\t\tgame.rootScene.removeChild(Hack.heart_label[i]);\n"+
"\t\t}\n"+
"\n"+
"\t\t//どくろの絵を消す\n"+
"\t\tHack.defaultParentNode.removeChild(Hack.skull);\n"+
"\t\tgame.rootScene.removeChild(Hack.skull);\n"+
"\n"+
"\t\t//HP DOWN! を消す\n"+
"\t\tfor(var i = 0; i < Hack.skull_label.length;i++)\n"+
"\t\t{\n"+
"\t\t\tHack.defaultParentNode.removeChild(Hack.skull_label[i]);\n"+
"\t\t\tgame.rootScene.removeChild(Hack.skull_label[i]);\n"+
"\t\t}\n"+
"\n"+
"\t\t//SIZEを消す\n"+
"\t\tfor(var i = 0; i < Hack.size_label.length;i++)\n"+
"\t\t{\n"+
"\t\t\tHack.defaultParentNode.removeChild(Hack.size_label[i]);\n"+
"\t\t\tgame.rootScene.removeChild(Hack.size_label[i]);\n"+
"\t\t}\t\t\n"+
"\n"+
"\t\t//スライムの絵を消す\n"+
"\t\tHack.defaultParentNode.removeChild(Hack.slime_img);\n"+
"\t\tgame.rootScene.removeChild(Hack.slime_img);\n"+
"\n"+
"\t\t//1.0 を消す\n"+
"\t\tfor(var i = 0; i < Hack.slime_label.length;i++)\n"+
"\t\t{\n"+
"\t\t\tHack.defaultParentNode.removeChild(Hack.slime_label[i]);\n"+
"\t\t\tgame.rootScene.removeChild(Hack.slime_label[i]);\n"+
"\t\t}\n"+
"\n"+
"\t\t//いもむしの絵を消す\n"+
"\t\tHack.defaultParentNode.removeChild(Hack.incect_img);\n"+
"\t\tgame.rootScene.removeChild(Hack.incect_img);\n"+
"\n"+
"\t\t//2.0 を消す\n"+
"\t\tfor(var i = 0; i < Hack.incect_label.length;i++)\n"+
"\t\t{\n"+
"\t\t\tHack.defaultParentNode.removeChild(Hack.incect_label[i]);\n"+
"\t\t\tgame.rootScene.removeChild(Hack.incect_label[i]);\n"+
"\t\t}\t\t\n"+
"\n"+
"\t\t//くもの絵を消す\n"+
"\t\tHack.defaultParentNode.removeChild(Hack.spider_img);\n"+
"\t\tgame.rootScene.removeChild(Hack.spider_img);\n"+
"\n"+
"\t\t//3.5 を消す\n"+
"\t\tfor(var i = 0; i < Hack.spider_label.length;i++)\n"+
"\t\t{\n"+
"\t\t\tHack.defaultParentNode.removeChild(Hack.spider_label[i]);\n"+
"\t\t\tgame.rootScene.removeChild(Hack.spider_label[i]);\n"+
"\t\t}\t\n"+
"\n"+
"\t\t//さそりの絵を消す\n"+
"\t\tHack.defaultParentNode.removeChild(Hack.scopion_img);\n"+
"\t\tgame.rootScene.removeChild(Hack.scopion_img);\n"+
"\n"+
"\t\t//6.5 を消す\n"+
"\t\tfor(var i = 0; i < Hack.scopion_label.length;i++)\n"+
"\t\t{\n"+
"\t\t\tHack.defaultParentNode.removeChild(Hack.scopion_label[i]);\n"+
"\t\t\tgame.rootScene.removeChild(Hack.scopion_label[i]);\n"+
"\t\t}\t\n"+
"\n"+
"\t\t//ドラゴンの絵を消す\n"+
"\t\tHack.defaultParentNode.removeChild(Hack.dragon_img);\n"+
"\t\tgame.rootScene.removeChild(Hack.dragon_img);\n"+
"\n"+
"\t\t//10 を消す\n"+
"\t\tfor(var i = 0; i < Hack.dragon_label.length;i++)\n"+
"\t\t{\n"+
"\t\t\tHack.defaultParentNode.removeChild(Hack.dragon_label[i]);\n"+
"\t\t\tgame.rootScene.removeChild(Hack.dragon_label[i]);\n"+
"\t\t}\t\n"+
"\n"+
"\t\t//デーモンの絵を消す\n"+
"\t\tHack.defaultParentNode.removeChild(Hack.daemon_img);\n"+
"\t\tgame.rootScene.removeChild(Hack.daemon_img)\n"+
"\n"+
"\t\t//20 を消す\n"+
"\t\tfor(var i = 0; i < Hack.daemon_label.length;i++)\n"+
"\t\t{\n"+
"\t\t\tHack.defaultParentNode.removeChild(Hack.daemon_label[i]);\n"+
"\t\t\tgame.rootScene.removeChild(Hack.daemon_label[i]);\n"+
"\t\t}\t\n"+
"\n"+
"\t\t//=========================================\n"+
"\n"+
"\n"+
"\t\tHack.player.parentNode.addChild(Hack.player); //プレイヤーをグループに入れる\n"+
"\n"+
"\t\t//難易度★★★☆☆\n"+
"\t\t//====STAGE6:ゲーム中のくまのHPとかサイズとかスピードとかのひょうじ====\n"+
"\n"+
"\t\t//--HPとかサイズとかスピードとかタイムとかのラベルを作るところ--\n"+
"\t\tfor(var i = 0; i < Hack.player.hp;i++)\n"+
"\t\t{\n"+
"\t\t//HPのハートの画像をつくる\n"+
"\t\t\tvar clone = Hack.createMovingSprite(32,32, {\n"+
"\t\t\t\tx: (25+i*20), y: 220,\n"+
"\t\t\t\timage: game.assets['enchantjs/x2/icon0.png'],\n"+
"\t\t\t\tframe: [10],\n"+
"\t\t\t\tscaleX:0.6,\n"+
"\t\t\t\tscaleY:0.6,\n"+
"\t\t\t});\n"+
"\n"+
"\n"+
"\t\t\tHack.player.hp_img.push(clone);\n"+
"\t\t}\n"+
"\n"+
"\t\t//HP: の部分をつくる\n"+
"\t\tHack.hpLabel = Hack.createLabel('HP ', {\n"+
"\t\t\tx: 10, y: 230, color: 'black',\n"+
"\t\t\tdefaultParentNode: game.rootScene\n"+
"\t\t});\n"+
"\n"+
"\t\t//サイズ: の部分をつくる\n"+
"\t\tHack.sizeLabel = Hack.createLabel('サイズ: ', {\n"+
"\t\t\tx: 10, y: 250, color: 'black',\n"+
"\t\t\tdefaultParentNode: game.rootScene\n"+
"\t\t});\n"+
"\n"+
"\t\t//スピード: の部分をつくる\n"+
"\t\tHack.speedLabel = Hack.createLabel('スピード: ', {\n"+
"\t\t\tx: 10, y: 270, color: 'black',\n"+
"\t\t\tdefaultParentNode: game.rootScene\n"+
"\t\t});\n"+
"\n"+
"\t\t//タイム： の部分をつくる\n"+
"\t\tHack.timeLabel = Hack.createLabel('タイム: ', {\n"+
"\t\t\tx: 10, y: 290, color: 'black',\n"+
"\t\t\tdefaultParentNode: game.rootScene\n"+
"\t\t});\n"+
"\n"+
"\n"+
"\n"+
"\t\t//--HPとかサイズとかスピードとかタイムとかのラベルを処理するところ--\n"+
"\n"+
"\t\t//サイズの数値をだしている\n"+
"\t\tHack.sizeLabel.onenterframe = function(){\n"+
"\t\t\tthis.text = 'サイズ:' + Hack.player.size.toFixed(1);//toFixed(1)で小数点第1位まで表わす\n"+
"\t\t}\n"+
"\t\tHack.speedLabel.onenterframe = function(){\n"+
"\t\t\tthis.text = 'スピード:' + Hack.player.speed.toFixed(1);\n"+
"\t\t}\n"+
"\t\tHack.timeLabel.onenterframe = function(){\n"+
"\t\t\tthis.text = 'タイム:' + parseInt(game.frame/game.fps);\n"+
"\t\t}\n"+
"\n"+
"\t\t//========================================\n"+
"\n"+
"\t\t//プレイヤーが十字キーで動く処理\n"+
"\t\tHack.player.on('enterframe', function(event) {\n"+
"\t\t\tif (game.input.up) {\n"+
"\t\t\t\tthis.y -= this.speed;\n"+
"\t\t\t}\n"+
"\t\t\tif(game.input.down)\n"+
"\t\t\t{\n"+
"\t\t\t\tthis.y += this.speed;\n"+
"\t\t\t}\n"+
"\t\t\tif (game.input.left) {\n"+
"\t\t\t\tthis.x -= this.speed;\n"+
"\t\t\t\tHack.player.direction = 1;\n"+
"\t\t\t}\n"+
"\t\t\tif(game.input.right)\n"+
"\t\t\t{\n"+
"\t\t\t\tthis.x += this.speed;\n"+
"\t\t\t\tHack.player.direction = 0;\n"+
"\t\t\t}\n"+
"\n"+
"\t\t});\n"+
"\t};\n"+
"\n"+
"\t//ゲームがスタートした時から毎回行う処理\n"+
"\tgame.onenterframe = function() {\n"+
"\t\tif (!Hack.started) return; // game started and running flag\n"+
"\n"+
"\t\t//ゲームクリアの条件\n"+
"\t\tif (Hack.player.size >= 100)//プレイヤーのサイズが100以上の時ゲームクリア\n"+
"\t\t{\n"+
"\t\t\tHack.gameclear();\n"+
"\t\t\tHack.started = false;\n"+
"\t\t}\n"+
"\n"+
"\t\t//難易度★★★★☆\n"+
"\t\t//====STAGE7:モンスターのしょうかん-------------------\n"+
"\n"+
"\t\tif(slime_encounter <= 0)slime_encounter = 1;\n"+
"\t\tif(game.frame%slime_encounter == 0)\n"+
"\t\t{\n"+
"\t\t\tvar clone = new Slime();\n"+
"\t\t\tclone.ran = Math.floor( Math.random() * 2 );//0か1かをランダムで決める\n"+
"\t\t\tclone.x = (clone.ran%2 == 0)?-50:500;//0なら-50、1なら500になる\n"+
"\t\t\tclone.y = Math.random()*250;//0から250までランダムで決める\n"+
"\t\t\tclone.speed += Math.random()*5;//スピードを1から5の範囲でランダムで増やす\n"+
"\t\t\tHack.monster.push(clone);\n"+
"\t\t}\n"+
"\n"+
"\t\tif(insect_encounter <= 0)insect_encounter = 1;\n"+
"\t\tif(game.frame%insect_encounter == 0)\n"+
"\t\t{\n"+
"\t\t\tvar clone = new Insect();\n"+
"\t\t\tclone.ran = Math.floor( Math.random() * 2 );\n"+
"\t\t\tclone.x = (clone.ran%2 == 0)?-50:500;\n"+
"\t\t\tclone.y = Math.random()*250;\n"+
"\t\t\tclone.speed += Math.random()*7;\n"+
"\t\t\tHack.monster.push(clone);\n"+
"\t\t}\n"+
"\n"+
"\t\tif(spider_encounter <= 0)spider_encounter = 1;\n"+
"\t\tif(game.frame%spider_encounter == 0)\n"+
"\t\t{\n"+
"\t\t\tvar clone = new Spider();\n"+
"\t\t\tclone.ran = Math.floor( Math.random() * 2 );\n"+
"\t\t\tclone.x = (clone.ran%2 == 0)?-50:500;\n"+
"\t\t\tclone.y = Math.random()*250;\n"+
"\t\t\tclone.speed += Math.random()*3;\n"+
"\t\t\tclone.ran_y = Math.random()*360;\n"+
"\t\t\tHack.monster.push(clone);\n"+
"\t\t}\n"+
"\n"+
"\t\tif(scopion_encounter <= 0)scopion_encounter = 1;\n"+
"\t\tif(game.frame%(scopion_encounter) == 0)\n"+
"\t\t{\n"+
"\t\t\tvar clone = new Scorpion();\n"+
"\t\t\tclone.ran = Math.floor( Math.random() * 2 );\n"+
"\t\t\tclone.x = (clone.ran%2 == 0)?-50:500;\n"+
"\t\t\tclone.y = Math.random()*250;\n"+
"\t\t\tclone.speed += Math.random()*2;\n"+
"\t\t\tHack.monster.push(clone);\n"+
"\t\t}\n"+
"\n"+
"\t\tif(dragon_encounter <= 0)dragon_encounter = 1;\n"+
"\t\tif(game.frame%(dragon_encounter) == 0)\n"+
"\t\t{\n"+
"\t\t\tvar clone = new Dragon();\n"+
"\t\t\tclone.ran = Math.floor( Math.random() * 2 );\n"+
"\t\t\tclone.x = (clone.ran%2 == 0)?-50:500;\n"+
"\t\t\tclone.y = Math.random()*250;\n"+
"\t\t\tclone.speed += Math.random()*2;\n"+
"\t\t\tHack.monster.push(clone);\n"+
"\t\t}\n"+
"\n"+
"\t\t if(daemon_encounter <= 0)daemon_encounter = 1;\n"+
"\t\t if(game.frame%(daemon_encounter) == 0)\n"+
"\t\t {\n"+
"\t\t \tvar clone = new Daemon();\n"+
"\t\t \tclone.ran = Math.floor( Math.random() * 2 );\n"+
"\t\t \tclone.x = Math.random()*400;\n"+
"\t\t \tclone.y = Math.random()*170;\n"+
"\t\t \tHack.monster.push(clone);\n"+
"\t\t }\n"+
"\n"+
"\t\t //=================================================\n"+
"\n"+
"\t\t //難易度★★★★☆\n"+
"\t\t //====STAGE8:アイテムの生成====\n"+
"\n"+
"         if(speedup_encounter <= 0)speedup_encounter = 1;\n"+
"\t\t if(game.frame%(speedup_encounter) == 0)\n"+
"\t\t {\n"+
"\t\t \tvar clone = new SpeedUp();\n"+
"\t\t \tclone.x = Math.random()*360+10;\n"+
"\t\t \tclone.y = 0;\n"+
"\t\t \tHack.item.push(clone);\n"+
"\t\t }\n"+
"\n"+
"         if(lifeup_encounter <= 0)lifeup_encounter = 1;\n"+
"\t\t if(game.frame%(lifeup_encounter) == 0)\n"+
"\t\t {\n"+
"\t\t \tvar clone = new LifeUp();\n"+
"\t\t \tclone.x = Math.random()*360+10;\n"+
"\t\t \tclone.y = -clone.width;\n"+
"\t\t \tHack.item.push(clone);\n"+
"\t\t }\n"+
"\n"+
"\t\t if(lifedown_encounter <= 0)lifedown_encounter = 1;\n"+
"\t\t if(game.frame%(lifedown_encounter) == 0)\n"+
"\t\t {\n"+
"\t\t \tvar clone = new LifeDown();\n"+
"\t\t \tclone.x = Math.random()*360+10;\n"+
"\t\t \tclone.y = -clone.width;\n"+
"\t\t \tHack.item.push(clone);\n"+
"\t\t }\n"+
"\n"+
"\t\t//============================\n"+
"\n"+
"\t\t//プレイヤーのサイズ\n"+
"\t\tif(Hack.player.direction == 0)\n"+
"\t\t\tHack.player.scaleX = 0.8+Hack.player.size/5;\n"+
"\t\telse\n"+
"\t\t\tHack.player.scaleX = -(0.8+Hack.player.size/5);\n"+
"\t\tHack.player.scaleY = 0.8+Hack.player.size/5;\n"+
"\n"+
"\n"+
"\t\t//難易度★★★★★\n"+
"\t\t//====STAGE9:当たり判定====\n"+
"\t\tif (!Hack.player.isDamaged) { //くまがダメージをうけていない時\n"+
"\t\t\tfor(var i = 0; i < Hack.monster.length;i++)\n"+
"\t\t\t{\n"+
"\t\t\t\tif (Hack.player.within(Hack.monster[i], 20+Hack.player.size+Hack.monster[i].size*Hack.monster[i].scale_hosei))//当たり判定 \n"+
"\t\t\t\t{\n"+
"\t\t\t\t\tif(Hack.player.size >= Hack.monster[i].size)//くまのサイズが当たったモンスターのサイズよりでかいとき\n"+
"\t\t\t\t\t{\n"+
"\t\t\t\t\t\tHack.player.size += Hack.monster[i].size/10;//くまのサイズに当たったモンスターの1/10の大きさを追加する(モンスターのサイズが1なら0.1追加)\n"+
"\t\t\t\t\t\tHack.defaultParentNode.removeChild(Hack.monster[i]);//モンスターを消す処理\n"+
"\t\t\t\t\t\tgame.rootScene.removeChild(Hack.monster[i]);//モンスターを消す処理\n"+
"\t\t\t\t\t\tHack.monster.splice(i,1);//モンスターを消す処理\n"+
"\n"+
"\t\t\t\t\t\tif(game.assets[Attack] !== undefined){\n"+
"\t\t\t\t\t\t\tif(game.assets[Attack].src){\n"+
"\t\t\t\t\t\t\t\tgame.assets[Attack].clone().play();\n"+
"\t\t\t\t\t\t\t}\n"+
"\t\t\t\t\t\t}\n"+
"\t\t\t\t\t}\n"+
"\t\t\t\t\telse\n"+
"\t\t\t\t\t{\n"+
"\t\t\t\t\t\tDamage_Me();\n"+
"\t\t\t\t\t}\n"+
"\t\t\t\t\treturn;\n"+
"\t\t\t\t}\n"+
"\t\t\t\telse if(Hack.monster[i].ran%2 == 0)//ranの値が0だったら時\n"+
"\t\t\t\t{\n"+
"\t\t\t\t\tif(Hack.monster[i].x > (450+Hack.monster[i].width))//x座標が450を超えた(画面外に出た)モンスターを削除\n"+
"\t\t\t\t\t{\n"+
"\t\t\t\t\t\tHack.defaultParentNode.removeChild(Hack.monster[i]);\n"+
"\t\t\t\t\t\tgame.rootScene.removeChild(Hack.monster[i]);\n"+
"\t\t\t\t\t\tHack.monster.splice(i,1);\n"+
"\t\t\t\t\t}\n"+
"\t\t\t\t}\n"+
"\t\t\t\telse\n"+
"\t\t\t\t{\n"+
"\t\t\t\t\tif(Hack.monster[i].x < -(50+Hack.monster[i].width))//x座標が0を下回った(画面外に出た)モンスターを削除\n"+
"\t\t\t\t\t{\n"+
"\t\t\t\t\t\tHack.defaultParentNode.removeChild(Hack.monster[i]);\n"+
"\t\t\t\t\t\tgame.rootScene.removeChild(Hack.monster[i]);\n"+
"\t\t\t\t\t\tHack.monster.splice(i,1);\n"+
"\t\t\t\t\t}\n"+
"\t\t\t\t}\n"+
"\t\t\t}\n"+
"\n"+
"\t\t\tfor(var i = 0; i < Hack.item.length;i++)\n"+
"\t\t\t{\n"+
"\t\t\t\tif(Hack.player.within(Hack.item[i],20+Hack.player.size))//アイテムがくまに当たった時\n"+
"\t\t\t\t{\n"+
"\t\t\t\t\tHack.item[i].Get_Item();//アイテムのGet_Item()関数を呼び出す\n"+
"\t\t\t\t\tHack.defaultParentNode.removeChild(Hack.item[i]);//アイテムを消す処理\n"+
"\t\t\t\t\tgame.rootScene.removeChild(Hack.item[i]);//アイテムを消す処理\n"+
"\t\t\t\t\tHack.item.splice(i,1);//アイテムを消す処理\n"+
"\t\t\t\t}\n"+
"\t\t\t\telse if(Hack.item[i].y > 300+Hack.item[i].width)//アイテムが画面外に出た時\n"+
"\t\t\t\t{\n"+
"\t\t\t\t\t//アイテムを消す"+
"\t\t\t\t\tHack.defaultParentNode.removeChild(Hack.item[i]);\n"+
"\t\t\t\t\tgame.rootScene.removeChild(Hack.item[i]);\n"+
"\t\t\t\t\tHack.item.splice(i,1);\n"+
"\t\t\t\t}\n"+
"\t\t\t}\n"+
"\t\t}\n"+
"\t};\n"+
"\t//====================================\n"+
"\n"+
"\n"+
"\t//難易度★★☆☆☆\n"+
"\t//====STAGE10:モンスターのクラス===="+
"\n"+
"\t//モンスターの移動速度とかサイズを決めているところ\n"+
"\n"+
"\t//スライムの中身(動き方とか大きさとか)をつくる\n"+
"\tvar Slime = enchant.Class.create(enchant.Sprite,{\n"+
"\t\tinitialize: function(){\n"+
"\t\t\tenchant.Sprite.call(this,this.width,this.height);\n"+
"\t\t\tthis.image = game.assets['enchantjs/monster4.gif'];//スライムの画像\n"+
"\t\t\tthis.width = this.height = 48; // 本体の大きさ\n"+
"\t\t\tthis.x = 10;\n"+
"\t\t\tthis.y = 10;\n"+
"\t\t\tthis.frame = [2, 2,2,3,3,4,4,5,5,5];//スライムのアニメーション\n"+
"\t\t\tthis.size = 1; //大きさ\n"+
"\t\t\tthis.speed = 1;//速さ\n"+
"\t\t\tthis.scale_hosei = 0.8;//スライムの大きさを調整するためのもの\n"+
"\t\t\tthis.scaleY = this.scale_hosei;//スライムの大きさを変えている\n"+
"\t\t\tthis.ran = 0;//乱数発生用\n"+
"\t\t\tHack.defaultParentNode.addChild(this)//スライムをグループに入れる\n"+
"\t\t},\t\n"+
"\t\t//スライムの動き\n"+
"\t\tonenterframe:function(){\n"+
"\t\t\tif(this.ran%2 == 0)//ranの値が0のとき\n"+
"\t\t\t{\n"+
"\t\t\t\tthis.x+=this.speed;//スライムを右に動かす\n"+
"\t\t\t\tthis.scaleX = -this.size*this.scale_hosei;//スライムの大きさを変えている\n"+
"\t\t\t}\n"+
"\t\t\telse//ranの値が1のとき\n"+
"\t\t\t{\t\n"+
"\t\t\t\tthis.x -= this.speed;//スライムを左に動かす\n"+
"\t\t\t\tthis.scaleX = this.size*this.scale_hosei;//スライムの大きさを変えている\n"+
"\t\t\t}\n"+
"\n"+
"\t\t}\n"+
"\t});\n"+
"\n"+
"\t//いもむしの中身(動き方とか大きさとか)をつくる\n"+
"\tvar Insect = enchant.Class.create(enchant.Sprite,{\n"+
"\t\tinitialize: function(){\n"+
"\t\t\tenchant.Sprite.call(this,this.width,this.height);\n"+
"\t\t\tthis.image = game.assets['enchantjs/monster1.gif'];//いもむしの画像\n"+
"\t\t\tthis.width = this.height = 48; // 本体の大きさ\n"+
"\t\t\tthis.x = 10;\n"+
"\t\t\tthis.y = 10;\n"+
"\t\t\tthis.frame = [2, 2,2,3,3,3];//いもむしのアニメーション\n"+
"\t\t\tthis.size = 2; //大きさ\n"+
"\t\t\tthis.speed = 3;//速さ\n"+
"\t\t\tthis.scale_hosei = 0.6;//いもむしの大きさを調整するためのもの\n"+
"\t\t\tthis.scaleY = this.size*this.scale_hosei;//いもむしの大きさを変えている\n"+
"\t\t\tthis.ran = 0;//乱数発生用\n"+
"\t\t\tHack.defaultParentNode.addChild(this)//いもむしをグループに入れる\n"+
"\t\t},\t\n"+
"\t\tonenterframe:function(){\n"+
"\t\t\tif(this.ran%2 == 0)//ranの値が0のとき(左から出現するとき)\n"+
"\t\t\t{\n"+
"\t\t\t\tthis.x+=this.speed;//いもむしを右に動かす\n"+
"\t\t\t\tthis.scaleX = -this.size*this.scale_hosei;//いもむしの大きさを決めている\n"+
"\t\t\t}\n"+
"\t\t\telse//ranの値が1のとき(右から出現するとき)\n"+
"\t\t\t{\n"+
"\t\t\t\tthis.x -= this.speed;//いもむしを左に動かす\n"+
"\t\t\t\tthis.scaleX = this.size*this.scale_hosei;//いもむしの大きさを決めている\n"+
"\t\t\t}\n"+
"\n"+
"\t\t}\n"+
"\t});\n"+
"\n"+
"\t//くもの中身(動き方とか大きさとか)をつくる\n"+
"\tvar Spider = enchant.Class.create(enchant.Sprite,{\n"+
"\t\tinitialize: function(){\n"+
"\t\t\tenchant.Sprite.call(this,this.width,this.height);\n"+
"\t\t\tthis.image = game.assets['enchantjs/monster2.gif'];\n"+
"\t\t\tthis.width = this.height = 64; // 本体の大きさ\n"+
"\t\t\tthis.x = 10;\n"+
"\t\t\tthis.y = 10;\n"+
"\t\t\tthis.frame = [2, 2,2,3,3,3,4,4,4];\n"+
"\t\t\tthis.size = 3.5; //大きさ\n"+
"\t\t\tthis.speed = 3;//速さ\n"+
"\t\t\tthis.scale_hosei = 0.3;\n"+
"\t\t\tthis.scaleY = this.size*this.scale_hosei;\n"+
"\t\t\tthis.ran = 0;//乱数発生用\n"+
"\t\t\tthis.ran_y = 0;//角度変えるための乱数\n"+
"\t\t\tHack.defaultParentNode.addChild(this)\n"+
"\t\t},\t\n"+
"\t\tonenterframe:function(){\n"+
"\t\t\tif(this.ran%2 == 0)\n"+
"\t\t\t{\n"+
"\t\t\t\tthis.x+=this.speed;//くもを右に動かす\n"+
"\t\t\t\tthis.y+= 5*Math.sin(this.ran_y+game.frame/20);//くもを上下に動かす\n"+
"\t\t\t\tthis.scaleX = -this.size*this.scale_hosei;\n"+
"\t\t\t}\n"+
"\t\t\telse\n"+
"\t\t\t{\n"+
"\t\t\t\tthis.x -= this.speed;//くもを右に動かす\n"+
"\t\t\t\tthis.y+= 5*Math.cos(this.ran_y+game.frame/20);//くもを上下に動かす\n"+
"\t\t\t\tthis.scaleX = this.size*this.scale_hosei;\n"+
"\t\t\t}\n"+
"\n"+
"\t\t}\n"+
"\t});\n"+
"\n"+
"\t//さそりの中身(動き方とか大きさとか)をつくる\n"+
"\tvar Scorpion = enchant.Class.create(enchant.Sprite,{\n"+
"\t\tinitialize: function(){\n"+
"\t\t\tenchant.Sprite.call(this,this.width,this.height);\n"+
"\t\t\tthis.image = game.assets['enchantjs/monster7.gif'];\n"+
"\t\t\tthis.width = this.height = 48; // 本体の大きさ\n"+
"\t\t\tthis.x = 10;\n"+
"\t\t\tthis.y = 10;\n"+
"\t\t\tthis.frame = [2, 2,2,3,3,3,4,4,4];\n"+
"\t\t\tthis.size = 6.5; //大きさ\n"+
"\t\t\tthis.speed = 10;//速さ\n"+
"\t\t\tthis.scale_hosei  = 0.3;\n"+
"\t\t\tthis.scaleY = this.size*this.scale_hosei;\n"+
"\t\t\tthis.ran = 0;//乱数発生用\n"+
"\t\t\tHack.defaultParentNode.addChild(this)\n"+
"\t\t},\t\n"+
"\t\tonenterframe:function(){\n"+
"\t\t\tif(this.ran%2 == 0)\n"+
"\t\t\t{\n"+
"\t\t\t\tif(Math.random()*10 < 3)//0から9までの間のランダムな値が3以下の時\n"+
"\t\t\t\tthis.x+=this.speed+Math.random()*10;//さそりを右に動かす\n"+
"\t\t\t\tif(Math.random()*10 < 1)//0から9の間のランダムな値が1以下になった時\n"+
"\t\t\t\t\tthis.y += Math.random()*50-25;//さそりを上か下かに動かす\n"+
"\t\t\t\tthis.scaleX = -this.size*this.scale_hosei;\n"+
"\t\t\t}\n"+
"\t\t\telse\n"+
"\t\t\t{\n"+
"\t\t\t\tif(Math.random()*10 < 3)\n"+
"\t\t\t\t\tthis.x -= this.speed+Math.random()*10;\n"+
"\t\t\t\tif(Math.random()*10 < 1)\n"+
"\t\t\t\t\tthis.y += Math.random()*50-25;\n"+
"\t\t\t\tthis.scaleX = this.size*this.scale_hosei;\n"+
"\t\t\t}\n"+
"\n"+
"\t\t}\n"+
"\t});\n"+
"\n"+
"\t//ドラゴンの中身(動き方とか大きさとか)をつくる\n"+
"\tvar Dragon = enchant.Class.create(enchant.Sprite,{\n"+
"\t\tinitialize: function(){\n"+
"\t\t\tenchant.Sprite.call(this,this.width,this.height);\n"+
"\t\t\tthis.image = game.assets['enchantjs/bigmonster1.gif'];\n"+
"\t\t\tthis.width = this.height = 80; // 本体の大きさ\n"+
"\t\t\tthis.x = 10;\n"+
"\t\t\tthis.y = 10;\n"+
"\t\t\tthis.frame = [2, 2,2,2,3,3,3,3,4,4,4,4];\n"+
"\t\t\tthis.size = 10; //大きさ\n"+
"\t\t\tthis.speed = 3;//速さ\n"+
"\t\t\tthis.scale_hosei = 0.15;\n"+
"\t\t\tthis.scaleY = this.size*this.scale_hosei;\n"+
"\t\t\tthis.ran = 0;//乱数発生用\n"+
"\t\t\tHack.defaultParentNode.addChild(this)\n"+
"\t\t},\t\n"+
"\t\tonenterframe:function(){\n"+
"\t\t\tif(this.ran%2 == 0)\n"+
"\t\t\t{\n"+
"\t\t\t\tthis.x += this.speed;\n"+
"\t\t\t\tthis.scaleX = -this.size*this.scale_hosei;\n"+
"\t\t\t}\n"+
"\t\t\telse\n"+
"\t\t\t{\n"+
"\t\t\t\tthis.x -= this.speed;\n"+
"\t\t\t\tthis.scaleX = this.size*this.scale_hosei;\n"+
"\t\t\t}\n"+
"\n"+
"\t\t}\n"+
"\t});\n"+
"\t//デーモンの中身(動き方とか大きさとか)をつくる\n"+
"\tvar Daemon = enchant.Class.create(enchant.Sprite,{\n"+
"\t\tinitialize: function(){\n"+
"\t\t\tenchant.Sprite.call(this,this.width,this.height);\n"+
"\t\t\tthis.image = game.assets['enchantjs/bigmonster2.gif'];\n"+
"\t\t\tthis.width = this.height = 80; // 本体の大きさ\n"+
"\t\t\tthis.x = 10;\n"+
"\t\t\tthis.y = 10;\n"+
"\t\t\tthis.frame = [0,0,0,0,0,0,0,1,1,1,1,1,1,3,3,3,3,3,3];\n"+
"\t\t\tthis.size = 20; //大きさ\n"+
"\t\t\tthis.speed = 0;//速さ\n"+
"\t\t\tthis.scale_hosei = 0.1;\n"+
"\t\t\tthis.scaleY = this.size*this.scale_hosei;\n"+
"\t\t\tthis.ran = 0;//乱数発生用\n"+
"\t\t\tthis.count = 0;\n"+
"\t\t\tHack.defaultParentNode.addChild(this);\n"+
"\t\t},\t\n"+
"\t\tonenterframe:function(){\n"+
"\t\t\tthis.count++;//カウントを毎回毎回+1している\n"+
"\n"+
"\t\t\tif(this.count==1)//カウントが1の時\n"+
"\t\t\t{\n"+
"\t\t\t\tif(this.ran%2 == 1)\n"+
"\t\t\t\t{\n"+
"\t\t\t\t\tthis.scaleX = this.size*this.scale_hosei;\n"+
"\t\t\t\t}\n"+
"\t\t\t\telse\n"+
"\t\t\t\t{\n"+
"\t\t\t\t\tthis.scaleX = -this.size*this.scale_hosei;\n"+
"\t\t\t\t}\n"+
"\t\t\t}\n"+
"\t\t\telse if(this.count==18)//カウントが18のとき\n"+
"\t\t\t{\n"+
"\t\t\t\tthis.frame = [3];//アニメーションを変える\n"+
"\t\t\t}\n"+
"\t\t\telse if(this.count == 50)//カウントが50のとき\n"+
"\t\t\t{\n"+
"\t\t\t\tthis.frame = [2,2,2,2,2,3,3,3,3,4,4,4,4];//アニメーションを変える\n"+
"\t\t\t\tthis.speed = Math.random()*90+10;\n"+
"\t\t\t}\n"+
"\t\t\telse if(this.count > 18)//カウントが18より上の時\n"+
"\t\t\t{\n"+
"\t\t\t \t if(this.ran%2 == 0)\n"+
"\t\t\t \t {\n"+
"\t\t\t\t \tthis.x += this.speed;\n"+
"\t\t\t \t }\n"+
"\t\t\t \t else\n"+
"\t\t\t \t {\n"+
"\t\t\t \t \tthis.x -= this.speed;\n"+
"\t\t\t \t }\n"+
"\t\t\t}\n"+
"\n"+
"\t\t}\n"+
"\t});\t\n"+
"\n"+
"\t//=======================================\n"+
"\n"+
"\n"+
"\t//難易度★★★☆☆\n"+
"\t//====STAGE11:アイテムのクラス====\n"+
"\n"+
"\tvar SpeedUp = enchant.Class.create(enchant.Sprite,{\n"+
"\t\tinitialize: function(){\n"+
"\t\t\tenchant.Sprite.call(this,this.width,this.height);\n"+
"\t\t\tthis.image = game.assets['enchantjs/x2/icon0.png'];\n"+
"\t\t\tthis.width = this.height = 32; // 本体の大きさ\n"+
"\t\t\tthis.x = 10;\n"+
"\t\t\tthis.y = 10;\n"+
"\t\t\tthis.frame = [15];//リンゴの絵\n"+
"\t\t\tthis.speed = 1;//速さ\n"+
"\t\t\tHack.defaultParentNode.addChild(this);\n"+
"\t\t},\t\n"+
"\t\tonenterframe:function(){\n"+
"\t\t\tthis.y += this.speed;//リンゴが下に動く\n"+
"\t\t},\n"+
"\t\t//アイテムをゲットした時\n"+
"\t\tGet_Item:function(){\n"+
"\t\t\tHack.player.speed += Math.abs(Math.random()-0.5);//プレイヤーのスピードを上げる\n"+
"\t\t\tif(game.assets[Item_SE1] !== undefined){//Item_SE1が存在するとき\n"+
"\t\t\t\t\t\t\tif(game.assets[Item_SE1].src){\n"+
"\t\t\t\t\t\t\t\tgame.assets[Item_SE1].clone().play();//Item_SE1を再生する\n"+
"\t\t\t\t\t\t\t}\n"+
"\t\t\t\t\t\t}\n"+
"\t\t}\n"+
"\t});\t\n"+
"\n"+
"\tvar LifeUp = enchant.Class.create(enchant.Sprite,{\n"+
"\t\tinitialize: function(){\n"+
"\t\t\tenchant.Sprite.call(this,this.width,this.height);\n"+
"\t\t\tthis.image = game.assets['enchantjs/x2/icon0.png'];\n"+
"\t\t\tthis.width = this.height = 32; // 本体の大きさ\n"+
"\t\t\tthis.x = 10;\n"+
"\t\t\tthis.y = 10;\n"+
"\t\t\tthis.frame = [10]//ハートの絵;\n"+
"\t\t\tthis.speed = 3;//速さ\n"+
"\t\t\tHack.defaultParentNode.addChild(this);\n"+
"\t\t},\t\n"+
"\t\tonenterframe:function(){\n"+
"\t\t\tthis.y += this.speed;\n"+
"\t\t},\n"+
"\t\tGet_Item:function(){\n"+
"\t\t\tHack.player.hp += 1;//プレイヤーのHPを+1している\n"+
"\t\t\tvar clone = Hack.createMovingSprite(32,32, {\n"+
"\t\t\t\tx: 25+20*(Hack.player.hp-1), y: 220,\n"+
"\t\t\t\timage: game.assets['enchantjs/x2/icon0.png'],\n"+
"\t\t\t\tframe: [10],\n"+
"\t\t\t\tscaleX:0.6,\n"+
"\t\t\t\tscaleY:0.6,\n"+
"\t\t\t});\n"+
"\t\t\tHack.player.hp_img.push(clone);\n"+
"\t\t\tif(game.assets[Item_SE2] !== undefined)\n"+
"\t\t\t{\n"+
"\t\t\t\tif(game.assets[Item_SE2].src)\n"+
"\t\t\t\t{\n"+
"\t\t\t\t\tgame.assets[Item_SE2].clone().play();\n"+
"\t\t\t\t}\n"+
"\t\t\t}\n"+
"\t\t}\n"+
"\t});\t\n"+
"\n"+
"\tvar LifeDown = enchant.Class.create(enchant.Sprite,{\n"+
"\t\tinitialize: function(){\n"+
"\t\t\tenchant.Sprite.call(this,this.width,this.height);\n"+
"\t\t\tthis.image = game.assets['enchantjs/x2/icon0.png'];\n"+
"\t\t\tthis.width = this.height = 32; // 本体の大きさ\n"+
"\t\t\tthis.x = 10;\n"+
"\t\t\tthis.y = 10;\n"+
"\t\t\tthis.frame = [11];//どくろの絵\n"+
"\t\t\tthis.speed = 5;//速さ\n"+
"\t\t\tthis.p1 = 0;//気にしないでだいじょうぶ\n"+
"\t\t\tthis.count =0;\n"+
"\t\t\tHack.defaultParentNode.addChild(this);\n"+
"\t\t},\t\n"+
"\t\tonenterframe:function(){\n"+
"\t\t\tthis.count++;\n"+
"\t\t\tif(this.count < 5)//カウントが5を超えるまでくまを追尾する\n"+
"\t\t\t\tp1 = Math.atan2((Hack.player.y-this.y),(Hack.player.x-this.x));\n"+
"\t\t\tthis.x+=Math.cos(p1)*4;\n"+
"\t\t\tthis.y+=Math.sin(p1)*4;\n"+
"\t\t\t// if(game.frame%50 < 5)\n"+
"\t\t\t// this.tl.moveTo(Hack.player.x,Hack.player.y,50).fadeOut(30).function(){\n"+
"\t\t\t// \tHack.defaultParentNode.removeChild(Hack.dragon_label[i]);\n"+
"\t\t\t// \tgame.rootScene.removeChild(Hack.dragon_label[i]);\n"+
"\t\t\t// };\n"+
"\t\t},\n"+
"\t\t//どくろにあたると...\n"+
"\t\tGet_Item:function(){\n"+
"\t\t\tDamage_Me();//ダメージを受ける\n"+
"\t\t}\n"+
"\t});\t\n"+
"\n"+
"\t//==================================================\n"+
"\n"+
"\t//難易度★★★★☆\n"+
"\t//====STAGE12:関数====\n"+
"\n"+
"\t//フォントをつくる関数\n"+
"\tfunction CreateFont (_x, _y, _frame) {\n"+
"\t\treturn Hack.createMovingSprite(16, 16, {\n"+
"\t\t\tx: _x || 0, y: _y || 0,\n"+
"\t\t\timage: game.assets['enchantjs/font1.png'],\n"+
"\t\t\tframe: _frame || [0],\n"+
"\t\t});\n"+
"\t}\n"+
"\n"+
"\t//ダメージを受けた時の関数\n"+
"\tfunction Damage_Me(){\n"+
"\t\tHack.player.hp--; // ouch!!\n"+
"\t\tHack.defaultParentNode.removeChild(Hack.player.hp_img[Hack.player.hp]);\n"+
"\t\tgame.rootScene.removeChild(Hack.player.hp_img[Hack.player.hp]);\n"+
"\t\tHack.player.hp_img.splice(Hack.player.hp,1);\n"+
"\t\tHack.player.isDamaged = true; // damaged (flashing) flag\n"+
"\n"+
"\t\tif(game.assets[Damage] !== undefined){\n"+
"\t\t\tif(game.assets[Damage].src){\n"+
"\t\t\t\tgame.assets[Damage].clone().play();\n"+
"\t\t\t}\n"+
"\t\t}\n"+
"\n"+
"\t\t//プレイヤーのHPが0以下の時\n"+
"\t\tif (Hack.player.hp <= 0) {\n"+
"\t\t\tHack.gameover();//ゲームオーバー\n"+
"\t\t\tHack.started = false;\n"+
"\t\t\tHack.player.onenterframe = null; // remove 'onenterframe'\n"+
"\t\t\tHack.player.tl.fadeOut(10);\n"+
"\t\t} else {\n"+
"\t\t\t// still living\n"+
"\t\t\tvar saveFrame = Hack.player._originalFrameSequence; // ~= player.frame\n"+
"\t\t\tHack.player.frame = [-1, -1, 3, 3]; // flashing (-1: invisible)\n"+
"\n"+
"\t\t\twindow.setTimeout(function() {\n"+
"\t\t\t    // 3 秒たったら...\n"+
"\t\t\t\tHack.player.isDamaged = false;\n"+
"\t\t\t\tHack.player.frame = saveFrame; // walking animation\n"+
"\t\t\t}, 3000);\n"+
"\t\t}\n"+
"\t}\n"+
"\n"+
"\n"+
"\n"+
"\t//==================================\n";


	//===================================================

	slime_encounter = 50;
	insect_encounter = 50;
	spider_encounter = 50;
	scopion_encounter = 50;
	dragon_encounter = 50;
	daemon_encounter = 50;
	speedup_encounter = 300;
	lifeup_encounter = 300;
	lifedown_encounter = 300;
	beam_late = 20;

	BGM = 'rengoku-teien/BGM.mp3';
	Attack = 'kurage-koubou/attack.mp3';
	Damage = 'kurage-koubou/damage.mp3';
	Item_SE1 = 'kurage-koubou/speedup.mp3';
	Item_SE2 = 'kurage-koubou/lifeup.mp3';

	//ゲームを起動したときに行う処理
	game.onload = game.onload || function() {
		Hack.pressStartKey(' ');
		Hack.defaultParentNode = new enchant.Group(); // prepear to scroll


		//-------Map作り----------------------
		var map = new enchant.Map(32, 32);
		map.image = game.assets['enchantjs/x2/map1.png'];

		map.loadData([
			[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
			[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
			[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
			[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
			[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
			[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
			[ 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
			[ 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
			[ 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
			[ 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
		]);

		Hack.defaultParentNode.addChild(map);
		game.rootScene.addChild(map);

		//=====================================


		Hack.pad = new Pad();
		Hack.pad.moveTo(350,200);
		game.rootScene.addChild(Hack.pad);




		//-----------プレイヤーの設定--------------

		//プレイヤーの画像設定
		Hack.player = Hack.createMovingSprite(32,32, {
			x: 210, y: 160,
			image: game.assets['enchantjs/chara1.png'],
			frame: [0,0,0,1,1,1,2,2,2],
		});

		//プレイヤーのHPとかサイズとかの宣言
		Hack.player.hp = 5; // player's hit point
		Hack.player.hp_img = [];
		// Hack.player.beam = [];
		Hack.player.size = 1;
		Hack.player.direction = 0;//0が左、1が右
		Hack.player.speed = 2;
		Hack.player.isDamaged = false; // damaged flag

		//====================================

		Hack.monster = [];
		Hack.item = [];
		game.keybind(90, "z");

		// 魔道書
		Hack.enchantBookIcon = Hack.createSprite(64, 64, {
			image: game.assets['hackforplay/enchantbook.png'],
			defaultParentNode: game.rootScene,
			ontouchend: function() {
				Hack.openEditor();
			}
		});
		// 魔道書の中身
		Hack.hint = 'game.dispatchEvent(new Event(\'abuttondown\'));//これを実行するとスタート\n\n'+
					'slime_encounter = 50;//スライムの生まれる早さ\n'+
					'insect_encounter = 50;//いもむしの生まれる早さ\n'+
					'spider_encounter = 50;//くもの生まれる早さ\n'+
					'scopion_encounter = 50;//さそりの生まれる早さ\n'+
					'dragon_encounter = 50;//ドラゴンの生まれる早さ\n'+
					'daemon_encounter = 50;//デーモンの生まれる早さ\n'+
					'speedup_encounter = 300;//リンゴの生まれる早さ\n'+
					'lifeup_encounter = 400;//ハートの生まれる早さ\n'+
					'lifedown_encounter = 400;//どくろの生まれる早さ\n'+
					'//生まれる早さは早いほどたくさん出てくるようになるぞ！\n'+
					'//(でも0以下からは効果が変わらないぞ！)\n';

		// // 最初のラベル
		// Hack.pressStartLabel = Hack.createLabel('スペースキーを押してスタート', {
		// 	x: 150, y: 150, width: 400
		// });

		//遊び方のラベル
		Hack.howtoLabel = Hack.createLabel('                            [遊び方]<br>'+
											'このゲームは弱肉強食の世の中を再現しようとして作ったゲームです<br>'+
											'自分より小さいものを喰らい、どんどん大きくなっていきましょう<br>'+
											'くまのサイズが100を超えるとゲームクリアです！！<br>',
											{
												x: 70, y: 10, color: 'blue', width:400,
												defaultParentNode: game.rootScene
											});
		Hack.PressStartLabel = [];
		Hack.PressStartLabel[0] = CreateFont(220-16*4,170-16*2,48);//P
		Hack.PressStartLabel[1] = CreateFont(220-16*2,170-16*2,50);//R
		Hack.PressStartLabel[2] = CreateFont(220     ,170-16*2,37);//E
		Hack.PressStartLabel[3] = CreateFont(220+16*2,170-16*2,51);//E
		Hack.PressStartLabel[4] = CreateFont(220+16*4,170-16*2,51);//S

		Hack.PressStartLabel[5] = CreateFont(220-16*1/2*2,170,52);//T
		Hack.PressStartLabel[6] = CreateFont(220+16*1/2*2,170,47);//O

		Hack.PressStartLabel[7] = CreateFont(220-16*4,170+16*2,51);//S
		Hack.PressStartLabel[8] = CreateFont(220-16*2,170+16*2,48);//P
		Hack.PressStartLabel[9] = CreateFont(220     ,170+16*2,33);//A
		Hack.PressStartLabel[10] = CreateFont(220+16*2,170+16*2,35);//C
		Hack.PressStartLabel[11] = CreateFont(220+16*4,170+16*2,37);//E

		for(var i = 0; i < Hack.PressStartLabel.length;i++)
		{
			Hack.PressStartLabel[i].onenterframe = function(){
				this.scaleX=1.5+Math.sin(game.frame/20)/2;
				this.scaleY=1.5+Math.cos(game.frame/20)/2;
				//this.tl.scaleTo(1.5+Math.sin(game.frame/20),1.5+Math.sin(game.frame/20),1);
			}
		}

		// //くまがビームうってる絵
		// Hack.beamdemo = Hack.createMovingSprite(121,59, {
		// 	x: 10, y: 150,
		// 	image: game.assets['resources/BeamDemo.png'],
		// 	scaleX:0.6,
		// 	scaleY:0.6,
		// 	rotation:-5,
		// });

		// Hack.beam_label = [];

		// Hack.beam_label[0] = CreateFont(30,205,7);//'
		// Hack.beam_label[1] = CreateFont(37,207,58);//Z
		// Hack.beam_label[2] = CreateFont(50,205,7);//'

		// Hack.beam_label[3] = CreateFont(70,207,43);//K
		// Hack.beam_label[4] = CreateFont(85,207,37);//E
		// Hack.beam_label[5] = CreateFont(100,207,57);//Y

		//リンゴの絵
		Hack.apple = Hack.createMovingSprite(32,32, {
			x: 80, y: 70,
			image: game.assets['enchantjs/x2/icon0.png'],
			frame: 15,
		});

		Hack.apple_label = [];

		Hack.apple_label[0] = CreateFont(60     ,105   ,51);//S
		Hack.apple_label[1] = CreateFont(60+16  ,105   ,48);//P
		Hack.apple_label[2] = CreateFont(60+16*2,105   ,37);//E
		Hack.apple_label[3] = CreateFont(60+16*3,105   ,37);//E
		Hack.apple_label[4] = CreateFont(60+16*4,105   ,36);//D

		Hack.apple_label[5] = CreateFont(80     ,105+16,53);//U
		Hack.apple_label[6] = CreateFont(80+16  ,105+16,48);//P
		Hack.apple_label[7] = CreateFont(80+16*2,105+16, 1);//!

		//ハートの絵
		Hack.heart = Hack.createMovingSprite(32,32, {
			x: 210, y: 70,
			image: game.assets['enchantjs/x2/icon0.png'],
			frame: [10],
		});

		Hack.heart_label = [];
		Hack.heart_label[0] = CreateFont(195     ,105,40);//H
		Hack.heart_label[1] = CreateFont(195+16  ,105,48);//P

		Hack.heart_label[2] = CreateFont(230     ,105,53);//U
		Hack.heart_label[3] = CreateFont(230+16*1,105,48);//P
		Hack.heart_label[4] = CreateFont(230+16*2,105, 1);//!

		//どくろの絵
		Hack.skull = Hack.createMovingSprite(32,32, {
			x: 340, y: 70,
			image: game.assets['enchantjs/x2/icon0.png'],
			frame: [11],
		});

		Hack.skull_label = [];
		Hack.skull_label[0] =  CreateFont(343    ,105,40);//H
		Hack.skull_label[1] =  CreateFont(343+16  ,105,48);//P
		Hack.skull_label[2] =  CreateFont(325     ,105+16,36);//D
		Hack.skull_label[3] =  CreateFont(325+16  ,105+16,47);//O
		Hack.skull_label[4] =  CreateFont(325+16*2,105+16,55);//W
		Hack.skull_label[5] =  CreateFont(325+16*3,105+16,46);//N
		Hack.skull_label[6] =  CreateFont(325+16*4,105+16, 1);//!

		Hack.size_label = [];
		Hack.size_label[0] = CreateFont(10,280,51);//S
		Hack.size_label[1] = CreateFont(22,280,41);//I
		Hack.size_label[2] = CreateFont(33,280,58);//Z
		Hack.size_label[3] = CreateFont(46,280,37);//E


		//スライムの絵
		Hack.slime_img = Hack.createMovingSprite(48,48, {
			x: 60, y: 240,
			image: game.assets['enchantjs/monster4.gif'],
			frame: [2,2,2,2,2,3,3,3,3,3,4,4,4,4,4,5,5,5,5,5],
		});

		Hack.slime_label = [];
		Hack.slime_label[0] = CreateFont(65,280,17);//1
		Hack.slime_label[1] = CreateFont(78,280,14);//.
		Hack.slime_label[2] = CreateFont(84,280,16);//0

		//いもむしの絵
		Hack.incect_img = Hack.createMovingSprite(48,48, {
			x: 120, y: 235,
			image: game.assets['enchantjs/monster1.gif'],
			frame: [2,2,2,2,2,2,3,3,3,3,3,3],
		});

		Hack.incect_label = [];
		Hack.incect_label[0] = CreateFont(128,280,18);//2
		Hack.incect_label[1] = CreateFont(141,280,14);//.
		Hack.incect_label[2] = CreateFont(147,280,16);//0

		//くもの絵
		Hack.spider_img = Hack.createMovingSprite(64,64, {
			x: 180, y: 225,
			image: game.assets['enchantjs/monster2.gif'],
			frame: [2,2,2,2,2,3,3,3,3,3,4,4,4,4,4],
		});

		Hack.spider_label = [];
		Hack.spider_label[0] = CreateFont(194,280,19);//3
		Hack.spider_label[1] = CreateFont(207,280,14);//.
		Hack.spider_label[2] = CreateFont(213,280,21);//5

		//さそりの絵
		Hack.scopion_img = Hack.createMovingSprite(48,48, {
			x: 250, y: 233,
			image: game.assets['enchantjs/monster7.gif'],
			frame: [2,2,2,2,2,3,3,3,3,3,4,4,4,4,4],
		});

		Hack.scopion_label = [];
		Hack.scopion_label[0] = CreateFont(258,280,22);//6
		Hack.scopion_label[1] = CreateFont(271,280,14);//.
		Hack.scopion_label[2] = CreateFont(277,280,21);//5

		//ドラゴンの絵
		Hack.dragon_img = Hack.createMovingSprite(80,80, {
			x: 310, y: 205,
			image: game.assets['enchantjs/bigmonster1.gif'],
			frame: [2,2,2,2,2,3,3,3,3,3,4,4,4,4,4],
		});

		Hack.dragon_label = [];
		Hack.dragon_label[0] = CreateFont(334,280,17);//1
		Hack.dragon_label[1] = CreateFont(350,280,16);//0

		//デーモンの絵
		Hack.daemon_img = Hack.createMovingSprite(80,80, {
			x: 385, y: 200,
			image: game.assets['enchantjs/bigmonster2.gif'],
			frame: [2,2,2,2,2,3,3,3,3,3,4,4,4,4,4],
		});

		Hack.daemon_label = [];
		Hack.daemon_label[0] = CreateFont(420,280,18);//2
		Hack.daemon_label[1] = CreateFont(436,280,16);//0

	};

	//----------↓ボタンを押したらスタート↓--------------

	Hack.onpressstart = Hack.onpressstart || function() {
		Hack.started = true;

		if(game.assets[BGM] !== undefined){
			if(game.assets[BGM].src){
				game.assets[BGM].play();
				game.assets[BGM].src.loop = true;
			}
		}

		//--------------最初の説明とかを消す処理----------

		//[遊び方]を消す処理
		Hack.defaultParentNode.removeChild(Hack.howtoLabel);
		game.rootScene.removeChild(Hack.howtoLabel);

		//PRESS TO SPACE を消す処理
		for(var i = 0; i < Hack.PressStartLabel.length;i++)
		{
			Hack.defaultParentNode.removeChild(Hack.PressStartLabel[i]);
			game.rootScene.removeChild(Hack.PressStartLabel[i]);
		}

		//リンゴの絵を消す処理
		Hack.defaultParentNode.removeChild(Hack.apple);
		game.rootScene.removeChild(Hack.apple);

		//SPEED UP! を消す処理
		for(var i = 0; i < Hack.apple_label.length;i++)
		{
			Hack.defaultParentNode.removeChild(Hack.apple_label[i]);
			game.rootScene.removeChild(Hack.apple_label[i]);
		}

		//ハートの絵を消す処理
		Hack.defaultParentNode.removeChild(Hack.heart);
		game.rootScene.removeChild(Hack.heart);

		//HP UP! を消す処理
		for(var i = 0; i < Hack.heart_label.length;i++)
		{
			Hack.defaultParentNode.removeChild(Hack.heart_label[i]);
			game.rootScene.removeChild(Hack.heart_label[i]);
		}

		//どくろの絵を消す処理
		Hack.defaultParentNode.removeChild(Hack.skull);
		game.rootScene.removeChild(Hack.skull);

		//HP DOWN! を消す処理
		for(var i = 0; i < Hack.skull_label.length;i++)
		{
			Hack.defaultParentNode.removeChild(Hack.skull_label[i]);
			game.rootScene.removeChild(Hack.skull_label[i]);
		}

		// //くまがビームうってるの絵を消す処理
		// Hack.defaultParentNode.removeChild(Hack.beamdemo);
		// game.rootScene.removeChild(Hack.beamdemo);

		// //'Z' KEY を消す処理
		// for(var i = 0; i < Hack.beam_label.length;i++)
		// {
		// 	Hack.defaultParentNode.removeChild(Hack.beam_label[i]);
		// 	game.rootScene.removeChild(Hack.beam_label[i]);
		// }

		//SIZEを消す処理
		for(var i = 0; i < Hack.size_label.length;i++)
		{
			Hack.defaultParentNode.removeChild(Hack.size_label[i]);
			game.rootScene.removeChild(Hack.size_label[i]);
		}

		//スライムの絵を消す処理
		Hack.defaultParentNode.removeChild(Hack.slime_img);
		game.rootScene.removeChild(Hack.slime_img);

		//1.0 を消す処理
		for(var i = 0; i < Hack.slime_label.length;i++)
		{
			Hack.defaultParentNode.removeChild(Hack.slime_label[i]);
			game.rootScene.removeChild(Hack.slime_label[i]);
		}

		//いもむしの絵を消す処理
		Hack.defaultParentNode.removeChild(Hack.incect_img);
		game.rootScene.removeChild(Hack.incect_img);

		//2.0 を消す処理
		for(var i = 0; i < Hack.incect_label.length;i++)
		{
			Hack.defaultParentNode.removeChild(Hack.incect_label[i]);
			game.rootScene.removeChild(Hack.incect_label[i]);
		}

		//くもの絵を消す処理
		Hack.defaultParentNode.removeChild(Hack.spider_img);
		game.rootScene.removeChild(Hack.spider_img);

		//3.5 を消す処理
		for(var i = 0; i < Hack.spider_label.length;i++)
		{
			Hack.defaultParentNode.removeChild(Hack.spider_label[i]);
			game.rootScene.removeChild(Hack.spider_label[i]);
		}

		//さそりの絵を消す処理
		Hack.defaultParentNode.removeChild(Hack.scopion_img);
		game.rootScene.removeChild(Hack.scopion_img);

		//6.5 を消す処理
		for(var i = 0; i < Hack.scopion_label.length;i++)
		{
			Hack.defaultParentNode.removeChild(Hack.scopion_label[i]);
			game.rootScene.removeChild(Hack.scopion_label[i]);
		}

		//ドラゴンの絵を消す処理
		Hack.defaultParentNode.removeChild(Hack.dragon_img);
		game.rootScene.removeChild(Hack.dragon_img);

		//10 を消す処理
		for(var i = 0; i < Hack.dragon_label.length;i++)
		{
			Hack.defaultParentNode.removeChild(Hack.dragon_label[i]);
			game.rootScene.removeChild(Hack.dragon_label[i]);
		}

		//デーモンの絵を消す処理
		Hack.defaultParentNode.removeChild(Hack.daemon_img);
		game.rootScene.removeChild(Hack.daemon_img);

		//20 を消す処理
		for(var i = 0; i < Hack.daemon_label.length;i++)
		{
			Hack.defaultParentNode.removeChild(Hack.daemon_label[i]);
			game.rootScene.removeChild(Hack.daemon_label[i]);
		}

		//=========================================


		Hack.player.parentNode.addChild(Hack.player); // bring to the front
		// {defaultParentNode: game.rootScene} means no-scroll

		//HPとかサイズとかスピードとかタイムとかのラベルを作るところ

		for(var i = 0; i < Hack.player.hp;i++)
		{
			var clone = Hack.createMovingSprite(32,32, {
				x: (25+i*20), y: 220,
				image: game.assets['enchantjs/x2/icon0.png'],
				frame: [10],
				scaleX:0.6,
				scaleY:0.6,
			});


			Hack.player.hp_img.push(clone);
		}

		Hack.hpLabel = Hack.createLabel('HP ', {
			x: 10, y: 230, color: 'black',
			defaultParentNode: game.rootScene
		});
		Hack.sizeLabel = Hack.createLabel('サイズ: ', {
			x: 10, y: 250, color: 'black',
			defaultParentNode: game.rootScene
		});
		Hack.speedLabel = Hack.createLabel('スピード: ', {
			x: 10, y: 270, color: 'black',
			defaultParentNode: game.rootScene
		});
		Hack.timeLabel = Hack.createLabel('タイム: ', {
			x: 10, y: 290, color: 'black',
			defaultParentNode: game.rootScene
		});



		//HPとかサイズとかスピードとかタイムとかのラベルを処理するところ

		// Hack.hpLabel.onenterframe = function() {
		// 	this.text = 'HP:' + Hack.player.hp;
		// }
		Hack.sizeLabel.onenterframe = function(){
			this.text = 'サイズ:' + Hack.player.size.toFixed(1);//toFixed(1)で小数点第1位まで表わす
		}
		Hack.speedLabel.onenterframe = function(){
			this.text = 'スピード:' + Hack.player.speed.toFixed(1);
		}
		Hack.timeLabel.onenterframe = function(){
			this.text = 'タイム:' + parseInt(game.frame/game.fps);
		}

		//プレイヤーが十字キーで動く処理
		Hack.player.on('enterframe', function(event) {

			// if (pad.isTouched) {
			// this.x += pad.vx * 4;
			// this.y += pad.vy * 4;
	  //  		}

			if (game.input.up) {
				this.y -= this.speed;
			}
			if(game.input.down)
			{
				this.y += this.speed;
			}
			if (game.input.left) {
				this.x -= this.speed;
				Hack.player.direction = 1;
			}
			if(game.input.right)
			{
				this.x += this.speed;
				Hack.player.direction = 0;
			}
		});
	};

	//ゲームがスタートした時から毎回行う処理
	game.onenterframe = game.onenterframe || function() {
		if (!Hack.started) return; // game started and running flag

		//ゲームクリアの条件
		if (Hack.player.size >= 100)//プレイヤーのサイズが100以上の時
		{
			Hack.gameclear();
			Hack.started = false;
		}

		//---------------モンスターを生成する場所-------------------

		if(slime_encounter <= 0)slime_encounter = 1;
		if(game.frame%slime_encounter == 0)
		{
			var clone = new Slime();
			clone.ran = Math.floor( Math.random() * 2 );
			clone.x = (clone.ran%2 == 0)?-50:500;
			clone.y = Math.random()*250;
			clone.speed += Math.random()*5;
			Hack.monster.push(clone);
		}

		if(insect_encounter <= 0)insect_encounter = 1;
		if(game.frame%insect_encounter == 0)
		{
			var clone = new Insect();
			clone.ran = Math.floor( Math.random() * 2 );
			clone.x = (clone.ran%2 == 0)?-50:500;
			clone.y = Math.random()*250;
			clone.speed += Math.random()*7;
			Hack.monster.push(clone);
		}

		if(spider_encounter <= 0)spider_encounter = 1;
		if(game.frame%spider_encounter == 0)
		{
			var clone = new Spider();
			clone.ran = Math.floor( Math.random() * 2 );
			clone.x = (clone.ran%2 == 0)?-50:500;
			clone.y = Math.random()*250;
			clone.speed += Math.random()*3;
			clone.ran_y = Math.random()*360;
			Hack.monster.push(clone);
		}

		if(scopion_encounter <= 0)scopion_encounter = 1;
		if(game.frame%(scopion_encounter) == 0)
		{
			var clone = new Scorpion();
			clone.ran = Math.floor( Math.random() * 2 );
			clone.x = (clone.ran%2 == 0)?-50:500;
			clone.y = Math.random()*250;
			clone.speed += Math.random()*2;
			Hack.monster.push(clone);
		}

		if(dragon_encounter <= 0)dragon_encounter = 1;
		if(game.frame%(dragon_encounter) == 0)
		{
			var clone = new Dragon();
			clone.ran = Math.floor( Math.random() * 2 );
			clone.x = (clone.ran%2 == 0)?-50:500;
			clone.y = Math.random()*250;
			clone.speed += Math.random()*2;
			Hack.monster.push(clone);
		}

		 if(daemon_encounter <= 0)daemon_encounter = 1;
		 if(game.frame%(daemon_encounter) == 0)
		 {
		 	var clone = new Daemon();
		 	clone.ran = Math.floor( Math.random() * 2 );
		 	clone.x = Math.random()*400;
		 	clone.y = Math.random()*170;
		 	Hack.monster.push(clone);
		 }

		 //=================================================

		 //-----------------アイテムを生成する場所----------------

         if(speedup_encounter <= 0)speedup_encounter = 1;
		 if(game.frame%(speedup_encounter) == 0)
		 {
		 	var clone = new SpeedUp();
		 	clone.x = Math.random()*360+10;
		 	clone.y = 0;
		 	Hack.item.push(clone);
		 }

         if(lifeup_encounter <= 0)lifeup_encounter = 1;
		 if(game.frame%(lifeup_encounter) == 0)
		 {
		 	var clone = new LifeUp();
		 	clone.x = Math.random()*360+10;
		 	clone.y = -clone.width;
		 	Hack.item.push(clone);
		 }

		 if(lifedown_encounter <= 0)lifedown_encounter = 1;
		 if(game.frame%(lifedown_encounter) == 0)
		 {
		 	var clone = new LifeDown();
		 	clone.x = Math.random()*360+10;
		 	clone.y = -clone.width;
		 	Hack.item.push(clone);
		 }

		//=================================================

		//プレイヤーのサイズ
		if(Hack.player.direction == 0)
			Hack.player.scaleX = 0.8+Hack.player.size/5;
		else
			Hack.player.scaleX = -(0.8+Hack.player.size/5);
		Hack.player.scaleY = 0.8+Hack.player.size/5;


		//damage
		if (!Hack.player.isDamaged) {
			for(var i = 0; i < Hack.monster.length;i++)
			{
				if (Hack.player.within(Hack.monster[i], 20+Hack.player.size+Hack.monster[i].size*Hack.monster[i].scale_hosei))//当たり判定
				{
					if(Hack.player.size >= Hack.monster[i].size)
					{
						Hack.player.size += Hack.monster[i].size/10;
						Hack.defaultParentNode.removeChild(Hack.monster[i]);
						game.rootScene.removeChild(Hack.monster[i]);
						Hack.monster.splice(i,1);

						if(game.assets[Attack] !== undefined){
							if(game.assets[Attack].src){
								game.assets[Attack].clone().play();
							}
						}
					}
					else
					{
						Damage_Me();
					}
					return;
				}
				else if(Hack.monster[i].ran%2 == 0)//ranの値が0だったら時
				{
					if(Hack.monster[i].x > (450+Hack.monster[i].width))//x座標が450を超えた(画面外に出た)モンスターを削除
					{
						Hack.defaultParentNode.removeChild(Hack.monster[i]);
						game.rootScene.removeChild(Hack.monster[i]);
						Hack.monster.splice(i,1);
					}
				}
				else
				{
					if(Hack.monster[i].x < -(50+Hack.monster[i].width))//x座標が0を下回った(画面外に出た)モンスターを削除
					{
						Hack.defaultParentNode.removeChild(Hack.monster[i]);
						game.rootScene.removeChild(Hack.monster[i]);
						Hack.monster.splice(i,1);
					}
				}
			}

			for(var i = 0; i < Hack.item.length;i++)
			{
				if(Hack.player.within(Hack.item[i],20+Hack.player.size))
				{
					Hack.item[i].Get_Item();
					Hack.defaultParentNode.removeChild(Hack.item[i]);
					game.rootScene.removeChild(Hack.item[i]);
					Hack.item.splice(i,1);
				}
				else if(Hack.item[i].y > 300+Hack.item[i].width)
				{
					Hack.defaultParentNode.removeChild(Hack.item[i]);
					game.rootScene.removeChild(Hack.item[i]);
					Hack.item.splice(i,1);
				}
			}
		}
	};
	//---------------------------------------------------------------------
	var Slime = enchant.Class.create(enchant.Sprite,{
		initialize: function(){
			enchant.Sprite.call(this,this.width,this.height);
			this.image = game.assets['enchantjs/monster4.gif'];
			this.width = this.height = 48; // 本体の大きさ
			this.x = 10;
			this.y = 10;
			this.frame = [2, 2,2,3,3,4,4,5,5,5];
			this.size = 1; //大きさ
			this.speed = 1;//速さ
			this.scale_hosei = 0.8;
			this.scaleY = this.scale_hosei;
			this.ran = 0;//乱数発生用
			Hack.defaultParentNode.addChild(this)
		},
		onenterframe:function(){
			if(this.ran%2 == 0)
			{
				this.x+=this.speed;
				this.scaleX = -this.size*this.scale_hosei;
				//this.rotation = 360;
			}
			else
			{
				this.x -= this.speed;
				this.scaleX = this.size*this.scale_hosei;
			}

		}
	});

	var Insect = enchant.Class.create(enchant.Sprite,{
		initialize: function(){
			enchant.Sprite.call(this,this.width,this.height);
			this.image = game.assets['enchantjs/monster1.gif'];
			this.width = this.height = 48; // 本体の大きさ
			this.x = 10;
			this.y = 10;
			this.frame = [2, 2,2,3,3,3];
			this.size = 2; //大きさ
			this.speed = 3;//速さ
			this.scale_hosei = 0.6;
			this.scaleY = this.size*this.scale_hosei;
			this.ran = 0;//乱数発生用
			Hack.defaultParentNode.addChild(this)
		},
		onenterframe:function(){
			if(this.ran%2 == 0)
			{
				this.x+=this.speed;
				this.scaleX = -this.size*this.scale_hosei;
				//this.scaleX = this.scaleY =-this.size;
				//this.rotation = 360;
			}
			else
			{
				this.x -= this.speed;
				this.scaleX = this.size*this.scale_hosei;
			}

		}
	});

	var Spider = enchant.Class.create(enchant.Sprite,{
		initialize: function(){
			enchant.Sprite.call(this,this.width,this.height);
			this.image = game.assets['enchantjs/monster2.gif'];
			this.width = this.height = 64; // 本体の大きさ
			this.x = 10;
			this.y = 10;
			this.frame = [2, 2,2,3,3,3,4,4,4];
			this.size = 3.5; //大きさ
			this.speed = 3;//速さ
			this.scale_hosei = 0.3;
			this.scaleY = this.size*this.scale_hosei;
			this.ran = 0;//乱数発生用
			this.ran_y = 0;//角度変えるための乱数
			Hack.defaultParentNode.addChild(this)
		},
		onenterframe:function(){
			if(this.ran%2 == 0)
			{
				this.x+=this.speed;
				this.y+= 5*Math.sin(this.ran_y+game.frame/20);
				this.scaleX = -this.size*this.scale_hosei;
				//this.scaleX = this.scaleY =-this.size;
				//this.rotation = 360;
			}
			else
			{
				this.x -= this.speed;
				this.y+= 5*Math.cos(this.ran_y+game.frame/20);
				this.scaleX = this.size*this.scale_hosei;
			}

		}
	});

	var Scorpion = enchant.Class.create(enchant.Sprite,{
		initialize: function(){
			enchant.Sprite.call(this,this.width,this.height);
			this.image = game.assets['enchantjs/monster7.gif'];
			this.width = this.height = 48; // 本体の大きさ
			this.x = 10;
			this.y = 10;
			this.frame = [2, 2,2,3,3,3,4,4,4];
			this.size = 6.5; //大きさ
			this.speed = 10;//速さ
			this.scale_hosei  = 0.3;
			this.scaleY = this.size*this.scale_hosei;
			this.ran = 0;//乱数発生用
			Hack.defaultParentNode.addChild(this)
		},
		onenterframe:function(){
			if(this.ran%2 == 0)
			{
				if(Math.random()*10 < 3)
				this.x+=this.speed+Math.random()*10;
				if(Math.random()*10 < 1)
					this.y += Math.random()*50-25;
				this.scaleX = -this.size*this.scale_hosei;
				//this.scaleX = this.scaleY =-this.size;
				//this.rotation = 360;
			}
			else
			{
				if(Math.random()*10 < 3)
					this.x -= this.speed+Math.random()*10;
				if(Math.random()*10 < 1)
					this.y += Math.random()*50-25;
				this.scaleX = this.size*this.scale_hosei;
			}

		}
	});

	var Dragon = enchant.Class.create(enchant.Sprite,{
		initialize: function(){
			enchant.Sprite.call(this,this.width,this.height);
			this.image = game.assets['enchantjs/bigmonster1.gif'];
			this.width = this.height = 80; // 本体の大きさ
			this.x = 10;
			this.y = 10;
			this.frame = [2, 2,2,2,3,3,3,3,4,4,4,4];
			this.size = 10; //大きさ
			this.speed = 3;//速さ
			this.scale_hosei = 0.15;
			this.scaleY = this.size*this.scale_hosei;
			this.ran = 0;//乱数発生用
			Hack.defaultParentNode.addChild(this)
		},
		onenterframe:function(){
			if(this.ran%2 == 0)
			{
				this.x += this.speed;
				this.scaleX = -this.size*this.scale_hosei;
			}
			else
			{
				this.x -= this.speed;
				this.scaleX = this.size*this.scale_hosei;
			}

		}
	});
	var Daemon = enchant.Class.create(enchant.Sprite,{
		initialize: function(){
			enchant.Sprite.call(this,this.width,this.height);
			this.image = game.assets['enchantjs/bigmonster2.gif'];
			this.width = this.height = 80; // 本体の大きさ
			this.x = 10;
			this.y = 10;
			this.frame = [0,0,0,0,0,0,0,1,1,1,1,1,1,3,3,3,3,3,3];
			this.size = 20; //大きさ
			this.speed = 0;//速さ
			this.scale_hosei = 0.1;
			this.scaleY = this.size*this.scale_hosei;
			this.ran = 0;//乱数発生用
			this.state = 0;//状態
			this.count = 0;
			Hack.defaultParentNode.addChild(this);
		},
		onenterframe:function(){
			this.count++;
			if(this.count==1)
			{
				if(this.ran%2 == 1)
				{
					this.scaleX = this.size*this.scale_hosei;
				}
				else
				{
					this.scaleX = -this.size*this.scale_hosei;
				}
			}
			else if(this.count==18)
			{
				this.frame = [3];
			}
			else if(this.count == 50)
			{
				this.frame = 	[2,2,2,2,2,3,3,3,3,4,4,4,4];
				this.speed = Math.random()*90+10;
			}
			else if(this.count > 18)
			{
			 	 if(this.ran%2 == 0)
			 	 {
				 	this.x += this.speed;
			 	 }
			 	 else
			 	 {
			 	 	this.x -= this.speed;
			 	 }
			}

		}
	});

	//=======================================


	//-----------------アイテムの定義-----------

	var SpeedUp = enchant.Class.create(enchant.Sprite,{
		initialize: function(){
			enchant.Sprite.call(this,this.width,this.height);
			this.image = game.assets['enchantjs/x2/icon0.png'];
			this.width = this.height = 32; // 本体の大きさ
			this.x = 10;
			this.y = 10;
			this.frame = [15];
			this.speed = 1;//速さ
			Hack.defaultParentNode.addChild(this);
		},
		onenterframe:function(){
			this.y += this.speed;
		},
		Get_Item:function(){
			Hack.player.speed += Math.abs(Math.random()-0.5);
			if(game.assets[Item_SE1] !== undefined){
							if(game.assets[Item_SE1].src){
								game.assets[Item_SE1].clone().play();
							}
						}
		}
	});

	var LifeUp = enchant.Class.create(enchant.Sprite,{
		initialize: function(){
			enchant.Sprite.call(this,this.width,this.height);
			this.image = game.assets['enchantjs/x2/icon0.png'];
			this.width = this.height = 32; // 本体の大きさ
			this.x = 10;
			this.y = 10;
			this.frame = [10];
			this.speed = 3;//速さ
			Hack.defaultParentNode.addChild(this);
		},
		onenterframe:function(){
			this.y += this.speed;
		},
		Get_Item:function(){
			Hack.player.hp += 1;
			var clone = Hack.createMovingSprite(32,32, {
				x: 25+20*(Hack.player.hp-1), y: 220,
				image: game.assets['enchantjs/x2/icon0.png'],
				frame: [10],
				scaleX:0.6,
				scaleY:0.6,
			});
			Hack.player.hp_img.push(clone);
			if(game.assets[Item_SE2] !== undefined)
			{
				if(game.assets[Item_SE2].src)
				{
					game.assets[Item_SE2].clone().play();
				}
			}
		}
	});

	var LifeDown = enchant.Class.create(enchant.Sprite,{
		initialize: function(){
			enchant.Sprite.call(this,this.width,this.height);
			this.image = game.assets['enchantjs/x2/icon0.png'];
			this.width = this.height = 32; // 本体の大きさ
			this.x = 10;
			this.y = 10;
			this.frame = [11];
			this.speed = 5;//速さ
			this.p1 = 0;
			this.count =0;
			Hack.defaultParentNode.addChild(this);
		},
		onenterframe:function(){
			this.count++;
			if(this.count < 5)//カウントが5を超えるまでくまを追尾する
				p1 = Math.atan2((Hack.player.y-this.y),(Hack.player.x-this.x));
			this.x+=Math.cos(p1)*4;
			this.y+=Math.sin(p1)*4;
			// if(game.frame%50 < 5)
			// this.tl.moveTo(Hack.player.x,Hack.player.y,50).fadeOut(30).function(){
			// 	Hack.defaultParentNode.removeChild(Hack.dragon_label[i]);
			// 	game.rootScene.removeChild(Hack.dragon_label[i]);
			// };
		},
		Get_Item:function(){
			Damage_Me();
		}
	});

	//==================================================

	//-----------------くまの攻撃----------------------

	// var Beam = enchant.Class.create(enchant.Sprite,{
	// 	initialize: function(){
	// 		enchant.Sprite.call(this,this.width,this.height);
	// 		this.image = game.assets['enchantjs/x2/icon0.png'];
	// 		this.width = this.height = 32; // 本体の大きさ
	// 		this.x = 10;
	// 		this.y = 10;
	// 		this.frame = [50];
	// 		this.speed = 10;//速さ
	// 		this.direction = 0;//方向を表している　0で右 1で左
	// 		Hack.defaultParentNode.addChild(this)
	// 	},
	// 	onenterframe:function(){
	// 		if(this.direction == 0)
	// 		{
	// 			this.x += this.speed;
	// 			this.rotation = 180;
	// 		}
	// 		else
	// 		{
	// 			this.x -= this.speed;
	// 		}
	// 	}
	// });

	//==============================================
	//--------------------関数------------------------

	function CreateFont (_x, _y, _frame) {
		return Hack.createMovingSprite(16, 16, {
			x: _x || 0, y: _y || 0,
			image: game.assets['enchantjs/font1.png'],
			frame: _frame || [0],
		});
	}

	function Damage_Me(){
		Hack.player.hp--; // ouch!!
		Hack.defaultParentNode.removeChild(Hack.player.hp_img[Hack.player.hp]);
		game.rootScene.removeChild(Hack.player.hp_img[Hack.player.hp]);
		Hack.player.hp_img.splice(Hack.player.hp,1);
		Hack.player.isDamaged = true; // damaged (flashing) flag

		if(game.assets[Damage] !== undefined){
			if(game.assets[Damage].src){
				game.assets[Damage].clone().play();
			}
		}

		if (Hack.player.hp <= 0) {
			// R.I.P
			Hack.gameover();
			Hack.started = false;
			Hack.player.onenterframe = null; // remove 'onenterframe'
			Hack.player.tl.fadeOut(10);
		} else {
			// still living
			var saveFrame = Hack.player._originalFrameSequence; // ~= player.frame
			Hack.player.frame = [-1, -1, 3, 3]; // flashing (-1: invisible)

			window.setTimeout(function() {
			    // 3 秒たったら...
				Hack.player.isDamaged = false;
				Hack.player.frame = saveFrame; // walking animation
			}, 3000);
		}
	}



	//===============================================

	Hack.MovingSprite = enchant.Class.create(enchant.Sprite, {
		initialize: function(width, height) {
			enchant.Sprite.call(this, width, height);
			this.velocity = { x: 0, y: 0 };
		},
		onenterframe: function() {
			// move then effect from gravity
			if (this.useGravity) {
				this.velocity.x += Hack.gravity.x;
				this.velocity.y += Hack.gravity.y;
			}
			this.moveBy(this.velocity.x, this.velocity.y); // move
			// get a foot on the ground
			if (this.useGround) {
				var foot = this.y + (this.footHeight || this.height);
				if (foot >= Hack.groundHeight) {
					this.y = Hack.groundHeight - (this.footHeight || this.height);
					this.velocity.y = 0;
				}
			}
		}
	});
	Hack.createMovingSprite = function(width, height, prop) {
		return (function () {
			// @ new Hack.MovingSprite()
			if (prop) {
				Object.keys(prop).forEach(function(key) {
					this[key] = prop[key];
				}, this);
			}
			if (Hack.defaultParentNode) {
				Hack.defaultParentNode.addChild(this);
			}
			return this;

		}).call(new Hack.MovingSprite(width, height));
	};

	function makeMonster1 (_x, _y, _frame) {
		return Hack.createMovingSprite(48, 48, {
			x: _x || 0, y: _y || 0,
			image: game.assets['enchantjs/monster1.gif'],
			frame: _frame || [2, 2, 2, 3, 3, 3],
		});
	}

	function makeMonster2 (_x, _y, _frame) {
		return Hack.createMovingSprite(48, 48, {
			x: _x || 0, y: _y || 0,
			image: game.assets['enchantjs/monster4.gif'],
			frame: _frame || [2, 2,2, 3, 3,4, 4,5,5,5],
		});
	}

	// <===

	Hack.createScrollMap = function(map) {
		// Vertical stick maps are lined up horizontal
		// Can move only  <====RIGHT TO LEFT====
		Hack.backgroundImage = [];
		// repeat horizontal
		for (var x = 0; x < Math.max(16, map[0].length); x++) {
			Hack.backgroundImage[x] = new enchant.Map(32, 32);
			Hack.backgroundImage[x].image = game.assets['enchantjs/x2/map1.png'];
			var stickMap = [];
			for (var y = 0; y < 10; y++) {
				stickMap[y] = [];
				stickMap[y][0] = map[y][x] || map[y][x%map[y].length]; // map[y].length less than 16
			}
			Hack.backgroundImage[x].loadData(stickMap);
			Hack.backgroundImage[x].x = x * 32;
			if (Hack.defaultParentNode) {
				Hack.defaultParentNode.addChild(Hack.backgroundImage[x]);
			}
		}
		return Hack.backgroundImage;
	};

	Hack.scrollRight = function(x) {
		Hack.defaultParentNode.x = -x;
		Hack.backgroundImage.forEach(function(item) {
			if (item.x + item.parentNode.x <= -32) {
				item.x += game.width + 32;
			}
		});
		game.rootScene.childNodes.forEach(function(item) {
			if (Hack.defaultParentNode && item !== Hack.defaultParentNode
				&& item._element === undefined) {
				game.rootScene.addChild(item);
			}
		});
	};

	Hack.pressStartKey = function(keyString) {
		var keyCode = keyString.charCodeAt(0);
		game.keyunbind(binded_key, 'a');
		game.keybind(keyCode, 'a');
		binded_key = keyCode;
	};

	game.on('abuttondown', function(event) {
		if (Hack.started) return;
		Hack.dispatchEvent(new enchant.Event('pressstart'));
	});

});