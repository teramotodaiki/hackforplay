//actionpuzzlea.js
window.addEventListener('load', function() {

	var game = enchant.Core.instance;
	// New Resourses :
	game.preload(['enchantjs/x2/map2.png', 'hackforplay/dot_syuj.png', 'enchantjs/x2/icon0.png', 'enchantjs/font2.png', 'enchantjs/monster1.gif',
		 'dots_design/bg10_3.gif', 'dot_art_world/SC-Door-Entce03.png', 'rengoku-teien/asa_no_komorebi.mp3', 'etolier/01sougen.jpg']);

	BGM = 'rengoku-teien/asa_no_komorebi.mp3';

	// ====> 改造コードへ
	Hack.restagingCode =
	"\n\n"+
	"/* はじめてのかたは☆マークのばしょをかえてみてね　//\n"+
	"/  ほしのかずがすくないほどかんたんだよ　　　　　　 /\n"+
	"// 　　　　　　　　　　　　　　　　　　　　　　　  */\n\n\n"+
	"/*ゲーム用素材のプリロード*/\n"+
	"game.preload(['enchantjs/x2/map2.png', 'hackforplay/dot_syuj.png', 'enchantjs/x2/icon0.png', 'enchantjs/font2.png', 'enchantjs/monster1.gif',\n"+
	"\t\t'dots_design/bg10_3.gif', 'dot_art_world/SC-Door-Entce03.png', 'rengoku-teien/asa_no_komorebi.mp3', 'etolier/01sougen.jpg']);\n"+
	"//BGMの指定\n"+
	"BGM = 'rengoku-teien/asa_no_komorebi.mp3';\n"+
	"//ブロックの作成可能数の初期値\n"+
	"makeCounter = 0;\n"+
	"Hack.gamestate = -1;//ゲームの状態を表す(0:run, 1:gameover, 2:clear)\n\n"+

	"//ゲームが始まったときに呼ばれる関数\n"+
	"game.onload = function() {\n"+
	"\tif(game.assets[BGM] !== undefined){\n"+
	"\t\tif(game.assets[BGM].src){\n"+
	"\t\t\tgame.assets[BGM].play();\n"+
	"\t\t\tgame.assets[BGM].src.loop = true;\n"+
	"\t\t}\n"+
	"\t}\n"+
	"\tHack.defaultParentNode = new enchant.Group();\n"+
	"\tHack.width = 32 * 15;//ステージの横幅\n"+
	"\tHack.height = 32 * 10;//ステージの縦幅\n\n"+

	"\t/* ☆　  のこりじかんをかえてみよう　　      　　//\n"+
	"\t/ Hack.limitTimeは　のこり　の　びょうすう　/\n"+
	"\t/ をあらわしている。　すうじをかえてみよう。　　  /\n"+
	"\t//                          　　　　　　　　　  */\n"+
	"\tHack.limitTime = 120;//制限時間[s]\n\n"+

	"\t//バックグラウンド\n"+
	"\tHack.backgroundImage = Hack.createMovingSprite(480, 320, {\n"+
	"\t\tx: 0, y: 0,\n"+
	"\t\timage: game.assets['etolier/01sougen.jpg'],\n"+
	"\t\tframe: [0],\n"+
	"\t\tuseGravity: false, useGround: false, useInput: false, useInduction: false\n"+
	"\t});\n\n"+

	"\tHack.monster = [];//この配列にモンスターを追加\n"+
	"\tHack.monster[0] = Hack.makeMonster(320, 0, 2,true, true, false, false, 46, 26, 8);\n"+
	"\t//makeMonster( x, y, frame, 重力, 地面判定, キーボード操作, マウス操作, 画像のずれ下, 上, 横部分の空白)\n"+
	"\tHack.Blocks = [];//この配列にブロックを追加する\n\n"+

	"\t//マップの生成　第一引数にマップ　第二引数にブロックを追加する配列　第三引数にマップに合わせてステージの広さを変えるかどうか\n"+
	"\t/*  ☆ マップのかたちをかえてみよう　　　　　　　　　　//\n"+
	"\t/ したのすうじをかえてみるとマップのかたちがかわるよ。　　/\n"+
	"\t/ 1は　けすことのできるブロックだよ。　　　　　　　　　　　/\n"+
	"\t/ 2は　けせないブロックだよ。　　　　　　　　　　　　　　　/\n"+
	"\t/ 3は　とげのわなをしかけるよ。　　　　　　　　　　　　　/\n"+
	"\tarrayframe = [-1,0,4,10];//frameとマップの対応\n"+
	"\t//　　　　　　　　　　　　　　　　　　　　　　　　　　　　　*/\n"+
	"\tHack.MapBlocks([\n"+
	"\t\t[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n"+
	"\t\t[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n"+
	"\t\t[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n"+
	"\t\t[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n"+
	"\t\t[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n"+
	"\t\t[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n"+
	"\t\t[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n"+
	"\t\t[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n"+
	"\t\t[0,0,0,0,1,0,0,0,1,0,0,0,0,0,0, 0,0,0,2,0,0,1,1,1,0,0,2,0,0,0],\n"+
	"\t\t[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, 2,2,2,2,3,3,3,3,3,3,3,2,2,2,2]\n"+
	"\t], Hack.Blocks, true);\n\n"+

	"\t/* ☆   ゴールのいちをかえよう　     　    　　//\n"+
	"\t/ xとyはそれぞれよことたてのいちになっているので　　　/\n"+
	"\t/ すうじをかえてみよう。　　　　　　　　　　　　 　　   /\n"+
	"\t/ ひだりの32が1ブロックぶんのおおきさで　	　　　   /\n"+
	"\t/ みぎのすうじがマップのマスにたいおうしているよ    /\n"+
	"\t//                                 */\n"+
	"\t//ゴールのさくせい\n"+
	"\tHack.goal = Hack.createMovingSprite(96, 64, {\n"+
	"\t\tx: 32 * 27, y: 32 * 7,\n"+
	"\t\timage: game.assets['dot_art_world/SC-Door-Entce03.png'],\n"+
	"\t\tframe: [1],//色違いあり\n"+
	"\t\tuseGravity: false, useGround: false, useInput: false, useInduction: false\n"+
	"\t});\n\n"+

	"\t/* ☆☆  かぎをかくしてみよう     　      　　//\n"+
	"\t/ つぎの　かいぎょう　までのコードを　　　　　　　　　　　/\n"+
	"\t/ Hack.MapBlocksのまえにうつしてみよう 　　   /\n"+
	"\t/ かぎのいちをブロックと　かさなるようにすると・・・　   /\n"+
	"\t//                                 */\n"+
	"\t//かぎのさくせい\n"+
	"\tHack.key = Hack.createMovingSprite(32, 32, {\n"+
	"\t\tx: 32 * 22, y: 32 * 2,\n"+
	"\t\timage: game.assets['enchantjs/x2/icon0.png'],\n"+
	"\t\tframe: [33],\n"+
	"\t\tuseGravity: false, useGround: false, useInput: false, useInduction: false\n"+
	"\t});\n"+
	"\tHack.key.rotate(180);//向き反転\n"+
	"\tHack.getkey = false;//鍵の取得状況\n\n"+

	"\t//プレイヤー\n"+
	"\tHack.player = Hack.createMovingSprite(40, 56, {\n"+
	"\t\tx: 64, y: 0,\n"+
	"\t\timage: game.assets['hackforplay/dot_syuj.png'],\n"+
	"\t\tframe: [7],\n"+
	"\t\tuseGravity: true, useGround: true, useInput: false, useInduction: true, footHeight: 54, headHeight: 12, sideWidth: 6\n"+
	"\t});\n"+
	"\tHack.player.hp = 1; //プレイヤーの耐久力（あまり関係ない）\n"+
	"\ttouchX = Hack.player.x;//touchXの初期化\n"+
	"\ttouchY = Hack.height;//touchYの初期化\n\n"+

	"\t//上の情報バーの作成\n"+
	"\tHack.bar = Hack.createMovingSprite(32 * 15, 48, {\n"+
	"\t\tx: 0, y: 0,\n"+
	"\t\timage: game.assets['dots_design/bg10_3.gif'],\n"+
	"\t\tframe: [0],\n"+
	"\t\tuseGravity: false, useGround: false, useInput: false, useInduction: false\n"+
	"\t});\n"+
	"\tHack.bar_blocks = Hack.createMovingSprite(32, 32, {\n"+
	"\t\tx: 0, y: 0,\n"+
	"\t\timage: game.assets['enchantjs/x2/map2.png'],\n"+
	"\t\tframe: [0],\n"+
	"\t\tuseGravity: false, useGround: false, useInput: false, useInduction: false\n"+
	"\t});\n"+
	"\tHack.bar_blocknum = new Label();\n"+
	"\tHack.bar_blocknum.font = \"32px fantasy\";\n"+
	"\tHack.bar_blocknum.color = \"#0000ff\";\n"+
	"\tHack.bar_time = new Label();\n"+
	"\tHack.bar_time.font = \"32px fantasy\";\n"+
	"\tHack.bar_time.color = \"#0000ff\";\n"+
	"\tHack.defaultParentNode.addChild(Hack.bar_blocknum);\n"+
	"\tHack.defaultParentNode.addChild(Hack.bar_time);\n\n"+

	"\t//タッチ判定\n"+
	"\tgame.rootScene.addEventListener('touchstart', function(e){\n"+
	"\t\t//gameover後処理しないよう\n"+
	"\t\tif(Hack.gamestate == 1){this.removeEventListener('touchstart', arguments.callee);return;}\n"+
	"\t\t//マウス座標の取得\n"+
	"\t\ttouchX = e.localX + cam.x;\n"+
	"\t\ttouchY = e.localY + cam.y;\n"+
	"\t\t//障害物に当たったかどうかの判定\n"+
	"\t\tboolCollided = false;\n"+
	"\t\ttouchMode = 'Create';\n"+
	"\t\t//情報バーとのあたり判定\n"+
	"\t\tif( e.localY < 64){\n"+
	"\t\t\tboolCollided = true;\n"+
	"\t\t}\n"+
	"\t\t//プレイヤーとのあたり判定 else以降は作成されたブロックとプレイヤーとの判定\n"+
	"\t\tif(touchX >= Hack.player.x + Hack.player.sideWidth && touchX <= Hack.player.x - Hack.player.sideWidth + Hack.player.width && \n"+
	"\t\t\ttouchY  >= Hack.player.y + Hack.player.headHeight && touchY < Hack.player.y + Hack.player.footHeight){\n"+
	"\t\t\ttouchMode = 'Induction';\n"+
	"\t\t\tboolCollided = true;\n"+
	"\t\t}\n"+
	"\t\telse if( ( (parseInt(touchX/32) * 32 >= Hack.player.x + Hack.player.sideWidth && parseInt(touchX/32) * 32 <= Hack.player.x - Hack.player.sideWidth + Hack.player.width) ||\n"+
	"\t\t \t( (parseInt(touchX/32)+1) * 32 >= Hack.player.x + Hack.player.sideWidth && (parseInt(touchX/32)+1) * 32 <= Hack.player.x - Hack.player.sideWidth + Hack.player.width) || \n"+
	"\t\t \t( parseInt(touchX/32) * 32 <= Hack.player.x + Hack.player.sideWidth && (parseInt(touchX/32)+1) * 32 >= Hack.player.x + Hack.player.sideWidth) ) &&\n"+
	"\t\t\t( (parseInt(touchY/32) * 32 >= Hack.player.y + Hack.player.headHeight && parseInt(touchY/32) * 32 < Hack.player.y + Hack.player.footHeight) || \n"+
	"\t\t\t( (parseInt(touchY/32)+1) * 32 >= Hack.player.y + Hack.player.headHeight && (parseInt(touchY/32)+1) * 32 < Hack.player.y + Hack.player.footHeight) ) ){\n"+
	"\t\t\tboolCollided = true;\n"+
	"\t\t}//ゴールとの判定\n"+
	"\t\telse if( ( (parseInt(touchX/32) * 32 >= Hack.goal.x + 1 && parseInt(touchX/32) * 32 <= Hack.goal.x + Hack.goal.width - 1) ||\n"+
	"\t\t \t(parseInt(touchX/32)+1) * 32 >= Hack.goal.x + 1 && (parseInt(touchX/32)+1) * 32 <= Hack.goal.x + Hack.goal.width - 1) &&\n"+
	"\t\t\t( (parseInt(touchY/32) * 32 >= Hack.goal.y + 1 && parseInt(touchY/32) * 32 <= Hack.goal.y + Hack.goal.height - 1) || \n"+
	"\t\t\t( (parseInt(touchY/32)+1) * 32 >= Hack.goal.y + 1 && (parseInt(touchY/32)+1) * 32 <= Hack.goal.y + Hack.goal.height - 1) ) ){\n"+
	"\t\t\tboolCollided = true;\n"+
	"\t\t}\n"+
	"\t\t//敵との判定\n"+
	"\t\tHack.monster.forEach(function(item) {\n"+
	"\t\t\tif( ( (parseInt(touchX/32) * 32 >= item.x && parseInt(touchX/32) * 32 <= item.x - item.sideWidth + item.width) ||\n"+
	"\t\t\t \t( (parseInt(touchX/32)+1) * 32 >= item.x + item.sideWidth && (parseInt(touchX/32)+1) * 32 <= item.x - item.sideWidth + item.width) || \n"+
	"\t\t\t \t( parseInt(touchX/32) * 32 <= item.x + item.sideWidth && (parseInt(touchX/32)+1) * 32 >= item.x + item.sideWidth) ) &&\n"+
	"\t\t\t\t( (parseInt(touchY/32) * 32 >= item.y + item.headHeight && parseInt(touchY/32) * 32 < item.y + item.footHeight) || \n"+
	"\t\t\t\t( (parseInt(touchY/32)+1) * 32 >= item.y + item.headHeight && (parseInt(touchY/32)+1) * 32 < item.y + item.footHeight) ||\n"+
	"\t\t\t\t( parseInt(touchY/32) * 32 <= item.y + item.headHeight && (parseInt(touchY/32)+1) * 32 >= item.y + item.headHeight) ) ){\n"+
	"\t\t\t\tboolCollided = true;\n"+
	"\t\t\t}\n"+
	"\t\t});\n"+
	"\t\t//ブロックとの判定\n"+
	"\t\tHack.Blocks.forEach(function(item) {\n"+
	"\t\t\tif(touchX >= item.x && touchX <= item.x + item.width &&\n"+
	"\t\t\t\ttouchY >= item.y && touchY <= item.y + item.height){\n"+
	"\t\t\t\tfor(var i = 0;i < Hack.Blocks.length;i++){\n"+
	"\t\t\t\t\tif(item.x === Hack.Blocks[i].x && item.y === Hack.Blocks[i].y && item.frame <= 1){\n"+
	"\t\t\t\t\t\t//クリック位置にブロックがあれば消去する\n"+
	"\t\t\t\t\t\tHack.Blocks.splice(i, 1);\n"+
	"\t\t\t\t\t\tHack.defaultParentNode.removeChild(item);\n"+
	"\t\t\t\t\t\tmakeCounter++;\n"+
	"\t\t\t\t\t\tbreak;\n"+
	"\t\t\t\t\t}\n"+
	"\t\t\t\t}\n"+
	"\t\t\t\tboolCollided = true;\n"+
	"\t\t\t}\n"+
	"\t\t});\n"+
	"\t\t//何もなければブロックを作る\n"+
	"\t\tif(!boolCollided && makeCounter >= 1 && touchMode === 'Create'){\n"+
	"\t\t\tvar B_obj = Hack.makeWall(32 * parseInt(touchX / 32), 32 * parseInt(touchY / 32) );\n"+
	"\t\t\tHack.Blocks.push(B_obj);\n"+
	"\t\t\tmakeCounter--;\n"+
	"\t\t}\n"+
	"\t});\n"+
	"\t//操作終了時にマウス座標を初期化\n"+
	"\tgame.rootScene.addEventListener('touchend', function(e){\n"+
	"\t\ttouchX = Hack.player.x + Hack.player.width / 2;\n"+
	"\t\ttouchY = Hack.height;\n"+
	"\t});\n"+
	"\t//プレイヤーの誘導先の座標 ドラッグ中、継続処理\n"+
	"\tgame.rootScene.addEventListener('touchmove', function(e){\n"+
	"\t\tif(Hack.gamestate == 1){this.removeEventListener('touchmove', arguments.callee);return;}\n"+
	"\t\ttouchX = e.localX + cam.x;\n"+
	"\t\ttouchY = e.localY + cam.y;\n"+
	"\t});\n\n"+

	"\t//ゴールの継続処理\n"+
	"\tHack.goal.on('enterframe', function(event) {\n"+
	"\t\t//ゴールした時\n"+
	"\t\tif(Hack.goal.x + Hack.goal.width/2 >= Hack.player.x + 6 && Hack.goal.x + Hack.goal.width/2 <= Hack.player.x + Hack.player.width - 6 && \n"+
	"\t\t\tHack.goal.y + Hack.goal.height/2 >= Hack.player.y + Hack.player.headHeight && \n"+
	"\t\t\tHack.goal.y + Hack.goal.height/2 <= Hack.player.y + Hack.player.footHeight && Hack.player.OnBlocks && Hack.getkey){\n"+
	"\t\t\tgame.assets[BGM].stop();//BGMを止める\n"+
	"\t\t\tHack.player.useInput = false;\n"+
	"\t\t\tHack.player.useInduction = false;\n"+
	"\t\t\tHack.player.velocity.x = 0;\n"+
	"\t\t\tHack.player.velocity.y = 0;\n"+
	"\t\t\tHack.player.x = Hack.goal.x + Hack.goal.width/2 - Hack.player.width/2;\n"+
	"\t\t\tHack.player.frame = [9,9,9,10,10,10,11,11,11,10,10,10];//ゴール時のアニメーション\n"+
	"\t\t\tHack.player.tl.fadeOut(20);\n"+
	"\t\t\tHack.gamestate = 2;//ゲームクリア\n"+
	"\t\t\tHack.gameclear();\n"+
	"\t\t}\n"+
	"\t});\n"+
	"\t//鍵の継続処理\n"+
	"\tHack.key.on('enterframe', function(event) {\n"+
	"\t\t//鍵をとったとき\n"+
	"\t\tif(Hack.key.x + Hack.key.width/2 >= Hack.player.x + 6 && Hack.key.x + Hack.key.width/2 <= Hack.player.x + Hack.player.width - 6 && \n"+
	"\t\t\tHack.key.y + Hack.key.height/2 >= Hack.player.y + Hack.player.headHeight && \n"+
	"\t\t\tHack.key.y + Hack.key.height/2 <= Hack.player.y + Hack.player.footHeight){\n"+
	"\t\t\tHack.getkey = true;\n"+
	"\t\t\tHack.goal.frame = [1,1,1,1,1,5,5,5,5,5,9,9,9,9,9,13,null];//ゴールの扉が開く\n"+
	"\t\t\tHack.defaultParentNode.removeChild(Hack.key);//鍵を消す\n"+
	"\t\t}\n"+
	"\t});\n"+
	"\t//情報バーの継続処理\n"+
	"\tHack.bar.on('enterframe', function(){\n"+
	"\t\tif(Hack.gamestate == 0){\n"+
	"\t\t\tHack.displayTime = Hack.limitTime - Math.floor( game.frame/game.fps );\n"+
	"\t\t}\n"+
	"\t\t//時間切れの処理\n"+
	"\t\tif(Hack.displayTime <= 0){\n"+
	"\t\t\tHack.player.hp = 0;\n"+
	"\t\t}\n"+
	"\t});\n"+
	"\t//プレイヤーの継続処理\n"+
	"\tHack.player.on('enterframe',function(){\n"+
	"\t\t//死亡処理\n"+
	"\t\tif(Hack.player.hp <= 0){\n"+
	"\t\t\tHack.player.tl.fadeOut(5).then(function(){Hack.defaultParentNode.removeChild(Hack.player);});\n"+
	"\t\t\tHack.gamestate = 1;\n"+
	"\t\t\tHack.gameover();\n"+
	"\t\t}\n"+
	"\t});\n"+
	"\tHack.hint = 'null';//魔導書の中身\n"+
	"\tHack.gamestate = 0;\n"+
	"};\n";

	input =
	{
		x: 0,
		y: 0
	};

	cam =
	{
		x: 0,
		y: 0
	}

	arrayframe = [-1,0,4,10];

	Hack.gamestate = -1;

	touchX=0,touchY=0;
	touchMode = 'Induction';// 'Induction' or 'Create'
	makeCounter = 0;

	game.onload = game.onload || function() {

		Hack.width = 32 * 15;
		Hack.height = 32 * 10;
		Hack.limitTime = 120;
		Hack.defaultParentNode = new enchant.Group(); // prepear to scroll
		if(game.assets[BGM] !== undefined){
			if(game.assets[BGM].src){
				game.assets[BGM].play();
				game.assets[BGM].src.loop = true;
			}
		}

		Hack.backgroundImage = Hack.createMovingSprite(480, 320, {
			x: 0, y: 0,
			image: game.assets['etolier/01sougen.jpg'],
			frame: [0],
			useGravity: false, useGround: false, useInput: false, useInduction: false
		});

		Hack.monster = [];
		Hack.Blocks = [];

		Hack.MapBlocks([
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,1,0,0,0,1,0,0,0,0,0,0, 0,0,0,2,0,0,1,1,1,0,0,2,0,0,0],
			[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, 2,2,2,2,3,3,3,3,3,3,3,2,2,2,2]
		], Hack.Blocks, true);

		Hack.goal = Hack.createMovingSprite(96, 64, {
			x: 32 * 27, y: 32 * 7,
			image: game.assets['dot_art_world/SC-Door-Entce03.png'],
			frame: [1],
			useGravity: false, useGround: false, useInput: false, useInduction: false
		});

		Hack.key = Hack.createMovingSprite(32, 32, {
			x: 32 * 22, y: 32 * 2,
			image: game.assets['enchantjs/x2/icon0.png'],
			frame: [33],
			useGravity: false, useGround: false, useInput: false, useInduction: false
		});
		Hack.key.rotate(180);
		Hack.getkey = false;

		Hack.monster[0] = Hack.makeMonster(320, 0, 2,true, true, false, false, 46, 26, 8);

		Hack.player = Hack.createMovingSprite(40, 56, {
			x: 64, y: 0,
			image: game.assets['hackforplay/dot_syuj.png'],
			frame: [7],
			useGravity: true, useGround: true, useInput: false, useInduction: true, footHeight: 54, headHeight: 12, sideWidth: 6
		});
		Hack.player.hp = 1; // player's hit point
		touchX = Hack.player.x;
		touchY = Hack.height;

		Hack.bar = Hack.createMovingSprite(32 * 15, 48, {
			x: 0, y: 0,
			image: game.assets['dots_design/bg10_3.gif'],
			frame: [0],
			useGravity: false, useGround: false, useInput: false, useInduction: false
		});
		Hack.bar_blocks = Hack.createMovingSprite(32, 32, {
			x: 0, y: 0,
			image: game.assets['enchantjs/x2/map2.png'],
			frame: [0],
			useGravity: false, useGround: false, useInput: false, useInduction: false
		});

		Hack.bar_blocknum = new Label();
		Hack.bar_blocknum.font = "32px fantasy";
		Hack.bar_blocknum.color = "#0000ff";
		Hack.bar_time = new Label();
		Hack.bar_time.font = "32px fantasy";
		Hack.bar_time.color = "#0000ff";
		Hack.defaultParentNode.addChild(Hack.bar_blocknum);
		Hack.defaultParentNode.addChild(Hack.bar_time);

		game.rootScene.addEventListener('touchstart', function(e){
			if(Hack.gamestate == 1){this.removeEventListener('touchstart', arguments.callee);return;}
			touchX = e.localX + cam.x;
			touchY = e.localY + cam.y;
			boolCollided = false;
			touchMode = 'Create';
			if( e.localY < 64){
				boolCollided = true;
			}
			if(touchX >= Hack.player.x + Hack.player.sideWidth && touchX <= Hack.player.x - Hack.player.sideWidth + Hack.player.width &&
				touchY  >= Hack.player.y + Hack.player.headHeight && touchY < Hack.player.y + Hack.player.footHeight){
				touchMode = 'Induction';
				boolCollided = true;
			}
			else if( ( (parseInt(touchX/32) * 32 >= Hack.player.x + Hack.player.sideWidth && parseInt(touchX/32) * 32 <= Hack.player.x - Hack.player.sideWidth + Hack.player.width) ||
			 	( (parseInt(touchX/32)+1) * 32 >= Hack.player.x + Hack.player.sideWidth && (parseInt(touchX/32)+1) * 32 <= Hack.player.x - Hack.player.sideWidth + Hack.player.width) ||
			 	( parseInt(touchX/32) * 32 <= Hack.player.x + Hack.player.sideWidth && (parseInt(touchX/32)+1) * 32 >= Hack.player.x + Hack.player.sideWidth) ) &&
				( (parseInt(touchY/32) * 32 >= Hack.player.y + Hack.player.headHeight && parseInt(touchY/32) * 32 < Hack.player.y + Hack.player.footHeight) ||
				( (parseInt(touchY/32)+1) * 32 >= Hack.player.y + Hack.player.headHeight && (parseInt(touchY/32)+1) * 32 < Hack.player.y + Hack.player.footHeight) ) ){
				boolCollided = true;
			}
			else if( ( (parseInt(touchX/32) * 32 >= Hack.goal.x + 1 && parseInt(touchX/32) * 32 <= Hack.goal.x + Hack.goal.width - 1) ||
			 	(parseInt(touchX/32)+1) * 32 >= Hack.goal.x + 1 && (parseInt(touchX/32)+1) * 32 <= Hack.goal.x + Hack.goal.width - 1) &&
				( (parseInt(touchY/32) * 32 >= Hack.goal.y + 1 && parseInt(touchY/32) * 32 <= Hack.goal.y + Hack.goal.height - 1) ||
				( (parseInt(touchY/32)+1) * 32 >= Hack.goal.y + 1 && (parseInt(touchY/32)+1) * 32 <= Hack.goal.y + Hack.goal.height - 1) ) ){
				boolCollided = true;
			}
			Hack.monster.forEach(function(item) {
				if( ( (parseInt(touchX/32) * 32 >= item.x && parseInt(touchX/32) * 32 <= item.x - item.sideWidth + item.width) ||
				 	( (parseInt(touchX/32)+1) * 32 >= item.x + item.sideWidth && (parseInt(touchX/32)+1) * 32 <= item.x - item.sideWidth + item.width) ||
				 	( parseInt(touchX/32) * 32 <= item.x + item.sideWidth && (parseInt(touchX/32)+1) * 32 >= item.x + item.sideWidth) ) &&
					( (parseInt(touchY/32) * 32 >= item.y + item.headHeight && parseInt(touchY/32) * 32 < item.y + item.footHeight) ||
					( (parseInt(touchY/32)+1) * 32 >= item.y + item.headHeight && (parseInt(touchY/32)+1) * 32 < item.y + item.footHeight) ||
					( parseInt(touchY/32) * 32 <= item.y + item.headHeight && (parseInt(touchY/32)+1) * 32 >= item.y + item.headHeight) ) ){
					boolCollided = true;
				}
			});
			Hack.Blocks.forEach(function(item) {
				if(touchX >= item.x && touchX <= item.x + item.width &&
					touchY >= item.y && touchY <= item.y + item.height){
					for(var i = 0;i < Hack.Blocks.length;i++){
						if(item.x === Hack.Blocks[i].x && item.y === Hack.Blocks[i].y && item.frame <= 1){
							Hack.Blocks.splice(i, 1);
							Hack.defaultParentNode.removeChild(item);
							makeCounter++;
							break;
						}
					}
					boolCollided = true;
				}
			});
			if(!boolCollided && makeCounter >= 1 && touchMode === 'Create'){
				var B_obj = Hack.makeWall(32 * parseInt(touchX / 32), 32 * parseInt(touchY / 32) );
				Hack.Blocks.push(B_obj);
				makeCounter--;
			}
		});
		game.rootScene.addEventListener('touchend', function(e){
			touchX = Hack.player.x + Hack.player.width / 2;
			touchY = Hack.height;
		});
		game.rootScene.addEventListener('touchmove', function(e){
			if(Hack.gamestate == 1){this.removeEventListener('touchmove', arguments.callee);return;}
			touchX = e.localX + cam.x;
			touchY = e.localY + cam.y;
		});

		Hack.goal.on('enterframe', function(event) {
			if(Hack.goal.x + Hack.goal.width/2 >= Hack.player.x + 6 && Hack.goal.x + Hack.goal.width/2 <= Hack.player.x + Hack.player.width - 6 &&
				Hack.goal.y + Hack.goal.height/2 >= Hack.player.y + Hack.player.headHeight &&
				Hack.goal.y + Hack.goal.height/2 <= Hack.player.y + Hack.player.footHeight && Hack.player.OnBlocks && Hack.getkey && Hack.gamestate == 0){
				game.assets[BGM].stop();
				Hack.player.useInput = false;
				Hack.player.useInduction = false;
				Hack.player.velocity.x = 0;
				Hack.player.velocity.y = 0;
				Hack.player.x = Hack.goal.x + Hack.goal.width/2 - Hack.player.width/2;
				Hack.player.frame = [9,9,9,10,10,10,11,11,11,10,10,10];
				Hack.player.tl.fadeOut(20);
				Hack.gamestate = 2;
				Hack.gameclear();
			}

		});
		Hack.key.on('enterframe', function(event) {
			if(Hack.key.x + Hack.key.width/2 >= Hack.player.x + 6 && Hack.key.x + Hack.key.width/2 <= Hack.player.x + Hack.player.width - 6 &&
				Hack.key.y + Hack.key.height/2 >= Hack.player.y + Hack.player.headHeight &&
				Hack.key.y + Hack.key.height/2 <= Hack.player.y + Hack.player.footHeight){
				Hack.getkey = true;
				Hack.goal.frame = [1,1,1,1,1,5,5,5,5,5,9,9,9,9,9,13,null];
				Hack.defaultParentNode.removeChild(Hack.key);
			}
		});
		Hack.bar.on('enterframe', function(){
			if(Hack.gamestate == 0){
				Hack.displayTime = Hack.limitTime - Math.floor( game.frame/game.fps );
			}

			if(Hack.displayTime <= 0){
				Hack.player.hp = 0;
			}
		});
		/*スクロール座標*/
		Hack.player.on('enterframe',function(){
		   	if(Hack.player.hp <= 0){
				Hack.player.tl.fadeOut(5).then(function(){Hack.defaultParentNode.removeChild(Hack.player);});
				Hack.gamestate = 1;
				Hack.gameover();
			}
		});
		Hack.hint = 'null';
		Hack.gamestate = 0;
	};

	game.onenterframe = game.onenterframe || function() {
		if(Hack.gamestate < 0){return;}
		if(game.assets[BGM] !== undefined){
			if(!game.assets[BGM].src){
				game.assets[BGM].play();
			}
		}

		if(Hack.player.x > 224 && Hack.player.x < Hack.width - 256){
		  		cam.x = Hack.player.x - 224;
	  	}
		else if(Hack.player.x <= 224){
			cam.x = 0;
	   	}
	   	var Py = parseInt(Hack.player.y/32) * 32;
	  	if(Py > Hack.height - 192){
			cam.y = Hack.height - 320;
	   	}
	   	else if(Py > 96){
	   		cam.y = Py - 128;
	   	}
		game.rootScene.x = -1 * cam.x;
		game.rootScene.y = -1 * cam.y;
		Hack.backgroundImage.x = cam.x;
		Hack.backgroundImage.y = cam.y + 48;
		Hack.bar.x = cam.x;
		Hack.bar.y = cam.y;
		Hack.bar_blocks.x = cam.x + 370;
		Hack.bar_blocks.y = cam.y + 8;
		Hack.bar_blocknum.x = cam.x + 410;
		Hack.bar_blocknum.y = cam.y + 4;
		Hack.bar_blocknum.text = '× ' + makeCounter;
		Hack.bar_time.x = cam.x + 200;
		Hack.bar_time.y = cam.y + 6;
		Hack.bar_time.text = 'Time: ' + Hack.displayTime;
	};

	// Environments and classes
	//Hack.groundHeight = 32 * 10; // define ground distance from Y=0
	Hack.gravity = { x: 0, y: 1 };
	Hack.MovingSprite = enchant.Class.create(enchant.Sprite, {
		initialize: function(width, height) {
			enchant.Sprite.call(this, width, height);
			this.useInput = false;
			this.useInduction = false;
			this.OnGround = false;
			this.OnBlocks = false;
			this.OnY = 0;
			this.velocity = { x: 0, y: 0 };
		},
		onenterframe: function() {
			var obj = this;
			obj.OnBlocks = false;
			Hack.Blocks.forEach(function(item) {
				if(Math.abs(obj.x+obj.sideWidth-item.x) <= (obj.width-obj.sideWidth*2+item.width)/2 &&
					Math.abs(obj.y+obj.headHeight-item.y) <= (obj.footHeight+item.height)/2){
					if( (obj.x + obj.width/4*3 > item.x && obj.x + obj.width/4 < item.x + item.width) &&
						obj.y + obj.footHeight >= item.y + item.width/2 && obj.y < item.y - item.height/2 &&  item.frame === 10){
							obj.hp--;
							return;
					}
					if(obj.y + obj.footHeight >= item.y && obj.y < item.y - item.height){
						if(( (obj.x + obj.width/4*3 > item.x && obj.x + obj.width/4 < item.x + item.width) ||
							(item.series === 3 || (obj.x < item.x && item.series === 1) || (obj.x > item.x && item.series === 2)) ) && item.frame !== 10){
							obj.OnBlocks = true;
							obj.velocity.y = 0;
							obj.OnY = item.y;
							obj.y = item.y - obj.footHeight;
						}
						else if(item.frame !== 10){
							obj.OnBlocks = false;
							if(obj.x < item.x){
								obj.velocity.x = 0;
								obj.x = item.x - obj.width + obj.sideWidth;
							}
							else{
								obj.velocity.x = 0;
								obj.x = item.x + item.width - obj.sideWidth;
							}
						}
					}
					else if(obj.x + obj.width - obj.sideWidth >= item.x && obj.x + obj.width <= item.x + 10){
						obj.velocity.x = 0;
						obj.x = item.x - obj.width + obj.sideWidth;
						if(obj.direction !== undefined)obj.direction = -1;
					}
					else if(obj.x + obj.sideWidth <= item.x + item.width && obj.x >= item.x + item.width - 10){
						obj.velocity.x = 0;
						obj.x = item.x + item.width - obj.sideWidth;
						if(obj.direction !== undefined)obj.direction = 1;
					}
					else if(obj.y + obj.headHeight <= item.y + item.height && obj.y > item.y){
						obj.velocity.y = 0;
						obj.y = item.y + item.height - obj.headHeight;
					}
				}
			});

			if (this.useGround) {
				if(this.useGravity){
					this.velocity.x += Hack.gravity.x;
					this.velocity.y += Hack.gravity.y;
				}
				var foot = this.y + (this.footHeight || this.height);
				if (foot >= Hack.height) {
					this.OnGround = true;
					this.y = Hack.height - (this.footHeight || this.height);
					this.velocity.y = 0;
				}
				if (this.x < 0) {
					this.x = 0;
					this.velocity.x = 0;
					if(obj.direction !== undefined)obj.direction = 1;
				}
				if (this.x + this.width >= Hack.width) {
					this.x = Hack.width - this.width;
					this.velocity.x = 0;
					if(obj.direction !== undefined)obj.direction = -1;
				}
				if(this.y + this.headHeight < 0){
					this.y = -this.headHeight;
					this.velocity.y = 0;
				}
				if(this.OnBlocks){
					this.y = this.OnY - this.footHeight;
					this.velocity.y = 0;
				}
			}
			// get a foot on the ground

			if(this.useInput){
				if (game.input.up && (this.OnGround || this.OnBlocks) ){
					this.OnBlocks = false;
					this.OnGround = false;
					this.velocity.y = -10;
				}
    	   		if(game.input.right){
        			this.velocity.x = 3;
   		       		this.frame = 7;
   		       	}
    	   	   	else if(game.input.left){
   		       		this.velocity.x = -3;
   		       		this.frame = 4;
		       	}
		       	else{
		       		this.velocity.x = 0;
		       	}
	    	}

	    	if(this.useInduction && touchMode === 'Induction'){
	    		if(this.y + this.headHeight > touchY && (this.OnGround || this.OnBlocks) ){
	    			this.OnBlocks = false;
					this.OnGround = false;
					this.velocity.y = -10;
	    		}
	    		if(this.x + this.width < touchX){
	    			this.velocity.x = 3;
   		       		this.frame = 7;
	    		}
	    		else if(this.x > touchX){
	    			this.velocity.x = -3;
   		       		this.frame = 4;
	    		}
	    		else{
		       		this.velocity.x = 0;
		       	}
	    	}
	    	if(this.direction !== undefined){
	    		if(this.direction === 1){
					this.velocity.x = 1;
				}
				else{
					this.velocity.x = -1;
				}
			}

	    	this.moveBy(this.velocity.x, this.velocity.y);
	    },
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

	Hack.makeWall = function( _x, _y, _frame, _useGravity, _useGround, _useInput, _useInduction, _footHeight) {
	    var wall = Hack.createMovingSprite(32, 32, {
		x: _x || 0, y: _y || 0,
		image: game.assets['enchantjs/x2/map2.png'],
		frame: _frame || 0,
		useGravity: _useGravity || false,
		useGround:  _useGround  || false,
		useInput: _useInput || false,
		useInduction: _useInduction || false,
		footHeight: _footHeight || 32
		});
		wall.on('enterframe', function(){
			wall.series = 0;
			if(wall.frame === 1){
				wall.frame = 0;
			}
			if(wall.frame === 3){
				wall.frame = 4;
			}
			Hack.Blocks.forEach(function(item) {
				if(wall.x === item.x){
					if(wall.y - 32 === item.y){
						if(wall.frame === 0)wall.frame = 1;
						if(wall.frame === 4)wall.frame = 3;
					}
				}
				if(wall.y === item.y){
					if(wall.series === 3 || (wall.x - 32 === item.x && wall.series === 2 ) || (wall.x + 32 === item.x && wall.series === 1)){
						wall.series = 3;
					}
					else{
						if(wall.x - 32 === item.x && item.frame !== 10){
							wall.series = 1;
						}
						if(wall.x + 32 === item.x && item.frame !== 10){
							wall.series = 2;
						}
					}
				}
			});
			if(wall.frame === 10){
				wall.series = 0;
			}
		});
		return wall;
	}

	Hack.makeMonster = function (_x, _y, _frame, _useGravity, _useGround, _useInput, _useInduction, _footHeight, _headHeight, _sideWidth) {
		var monster = Hack.createMovingSprite(48, 48, {
			x: _x || 0, y: _y || 0,
			image: game.assets['enchantjs/monster1.gif'],
			frame: _frame || [2, 2, 2, 3, 3, 3],
			useGravity: _useGravity || false,
			useGround: _useGround|| false,
			useInput: _useInput || false,
			useInduction: _useInduction || false,
			footHeight: _footHeight || 48,
			headHeight: _headHeight || 0,
			sideWidth: _sideWidth || 0,
			hp: 1,
			direction: 1
		});
		monster.on('enterframe', function(){
			if(monster != Hack.player && monster.within(Hack.player, 24)){
				Hack.player.hp--;
			}
			if(monster.hp <= 0){
				monster.tl.fadeOut(5).then(function(){Hack.defaultParentNode.removeChild(monster);});
			}
		});
		return monster;
	}

	Hack.MapBlocks = function(map, array, sizebool){
		for(var x = 0; x < map[0].length; x++){
			for(var y = 0; y < map.length; y++){
				if(map[y][x] >= 1){
					var block = Hack.makeWall(32 * x, 32 * y, arrayframe[map[y][x]]);
					array.push(block);
				}
			}
		}
		if(sizebool){
			Hack.width = map[0].length * 32;
			Hack.height = map.length * 32;
		}
	};

});