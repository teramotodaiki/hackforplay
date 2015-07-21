window.addEventListener('load', function() {

	var game = enchant.Core.instance;
	game.preload(['enchantjs/x2/map2.png', 'enchantjs/x1.5/chara0.png', 'enchantjs/monster1.gif', 'hackforplay/enchantbook.png']);

	var binded_key = ' '.charCodeAt(0);
	game.keybind(binded_key, 'a'); // aボタンはスペースキー

	Hack.textarea.backgroundColor = 'rgba(0,20,40,0.5)';

	// ====> 改造コードへ
	Hack.restagingCode =
"/**\n"+
" * ようこそ クリエイターさん！\n"+
" *\n"+
" * このせかいでは、あなたがゲームをつくるクリエイターです\n"+
" * 「#1」や「#2」…をみつけたら、ぜひ かきかえてみてください！\n"+
" *\n"+
" * かきかえたら、「ステージ改造コードを実行」ボタンをおしてみましょう\n"+
" *\n"+
" * Let's create your game!!\n"+
" *\n"+
"*/\n"+
"\n"+
"game.preload(['enchantjs/x2/map2.png', 'enchantjs/x1.5/chara0.png',\n"+
"\t\t\t\t'enchantjs/monster1.gif', 'enchantjs/monster3.gif',\n"+
"\t\t\t\t'hackforplay/enchantbook.png', 'enchantjs/x2/icon0.png']);\n"+
"\n"+
"game.onload = function() {\n"+
"\tHack.pressStartKey(' ');\n"+
"\tHack.defaultParentNode = new enchant.Group(); // スクロールの準備\n"+
"\tgame.rootScene.addChild(Hack.defaultParentNode); // スクロールの準備\n"+
"\n"+
"\n"+
"\t// #1 ゲームの はいけい を つくる\n"+
"\t// 0 から 22 までの すうじで かべ をつくろう\n"+
"\tHack.createScrollMap([\n"+
"\t\t[22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],\n"+
"\t\t[21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21],\n"+
"\t\t[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],\n"+
"\t\t[19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19],\n"+
"\t\t[18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18],\n"+
"\t\t[18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18],\n"+
"\t\t[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n"+
"\t\t[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],\n"+
"\t\t[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],\n"+
"\t\t[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]\n"+
"\t]);\n"+
"\n"+
"\n"+
"\tHack.monster = [];\n"+
"\n"+
"\n"+
"\t// #2 モンスターを つくる\n"+
"\t//\n"+
"\t// 0...なし\n"+
"\t// 1...いもむし\n"+
"\t// 2...コウモリ\n"+
"\t//\n"+
"\t// すうじ を かえて モンスターを おいていこう\n"+
"\t//\n"+
"\t// １れつめ [====        ]\n"+
"\tHack.m(   0,   0, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0]);\n"+
"\tHack.m(   0,  32, [0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0]);\n"+
"\tHack.m(   0,  64, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0]);\n"+
"\tHack.m(   0,  96, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);\n"+
"\tHack.m(   0, 128, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);\n"+
"\tHack.m(   0, 160, [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0]);\n"+
"\n"+
"\t// ２れつめ [    ====    ]\n"+
"\tHack.m( 800,   0, [0,0,0,0,0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);\n"+
"\tHack.m( 800,  32, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0]);\n"+
"\tHack.m( 800,  64, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);\n"+
"\tHack.m( 800,  96, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);\n"+
"\tHack.m( 800, 128, [0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);\n"+
"\tHack.m( 800, 160, [3,0,0,0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0]);\n"+
"\n"+
"\t// ３れつめ [        ====]\n"+
"\tHack.m(1600,   0, [2,0,0,0,0,2,0,2,0,0,0,2,0,0,0,2,0,0,0,0,2,0,0,0,0]);\n"+
"\tHack.m(1600,  32, [2,0,0,0,0,2,0,2,0,0,0,2,0,0,0,2,0,0,0,0,2,0,0,0,0]);\n"+
"\tHack.m(1600,  64, [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);\n"+
"\tHack.m(1600,  96, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);\n"+
"\tHack.m(1600, 128, [0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0]);\n"+
"\tHack.m(1600, 160, [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0]);\n"+
"\n"+
"\n"+
"\t// プレイヤーを作成\n"+
"\tHack.player = Hack.createMovingSprite(48, 48, {\n"+
"\t\tx: 64, y: 160,\n"+
"\t\timage: game.assets['enchantjs/x1.5/chara0.png'],\n"+
"\t\tframe: [25, 25, 25, 24, 24, 24, 25, 25, 25, 26, 26, 26],\n"+
"\t\tuseGravity: true, useGround: true, footHeight: 48,\n"+
"\t\tisDamaged: false\n"+
"\t});\n"+
"\n"+
"\n"+
"\t// #3 ゲームの ルールを つくる\n"+
"\t//\n"+
"\tHack.goal\t\t= 3000;\t// #3.1 ゴール までの きょり\n"+
"\tHack.player.hp\t= 3;\t// #3.2 プレイヤーの HP(たいりょく)\n"+
"\tHack.runSpeed\t= 4;\t// #3.3 プレイヤーの あるく はやさ\n"+
"\tHack.jumpSpeed\t= 14;\t// #3.4 プレイヤーの ジャンプの はやさ\n"+
"\n"+
"\tHack.groundHeight = 32 * 6;\t\t// #3.5 Y=0 から じめん までの たかさ（６マスぶん）\n"+
"\tHack.gravity = { x: 0, y: 1 };\t// #3.6 じゅうりょく の おおきさ\n"+
"\n"+
"\n"+
"\t// 魔道書(まどうしょ)\n"+
"\tHack.enchantBookIcon = Hack.createSprite(64, 64, {\n"+
"\t\timage: game.assets['hackforplay/enchantbook.png'],\n"+
"\t\tdefaultParentNode: game.rootScene,\n"+
"\t\tontouchend: function() {\n"+
"\t\t\tHack.openEditor(); // エディタを開く\n"+
"\t\t}\n"+
"\t});\n"+
"\n"+
"\n"+
"\t// #4 魔道書(まどうしょ) の なかみ をつくる\n"+
"\tHack.hint =\n"+
"\t'// RUN すると はやく なるぞ！\\n'+\n"+
"\t'// \\n'+\n"+
"\t'Hack.player.velocity.x += 1;';\n"+
"\n"+
"\n"+
"\t// 最初のラベル\n"+
"\tHack.pressStartLabel = Hack.createLabel('スペースキーを押してスタート<br>↑キーでジャンプ', {\n"+
"\t\tx: 120, y: 160, width: 400\n"+
"\t});\n"+
"\n"+
"\t// UI (via ui.enchant.js)\n"+
"\tvar button_light = new Button('Game Start', 'light');\n"+
"\tbutton_light.moveTo(190, 190);\n"+
"\tbutton_light.ontouchstart = function() {\n"+
"\t\tgame.rootScene.removeChild(this);\n"+
"\t\tHack.dispatchEvent(new enchant.Event('pressstart'));\n"+
"\t};\n"+
"\tgame.rootScene.addChild(button_light);\n"+
"\n"+
"};\n"+
"\n"+
"// スタート（スペースキー）を押したときに呼ばれるイベント\n"+
"Hack.onpressstart = function() {\n"+
"\tHack.started = true;\n"+
"\n"+
"\tHack.player.parentNode.addChild(Hack.player); // 手前に持ってくる\n"+
"\t// HPラベル\n"+
"\t// defaultParentNode: game.rootScene と追加することで、スクロールしないようにしている\n"+
"\tHack.hpLabel = Hack.createLabel('HP: ', {\n"+
"\t\tx: 400, y: 20, color: 'black',\n"+
"\t\tdefaultParentNode: game.rootScene\n"+
"\t});\n"+
"\tHack.hpLabel.onenterframe = function() {\n"+
"\t\tthis.text = 'HP: ' + Hack.player.hp;\n"+
"\t};\n"+
"\n"+
"\t// プレイヤーの動きの処理\n"+
"\tHack.player.velocity.x = Hack.runSpeed; // プレイヤーの速さ\n"+
"\tHack.player.on('enterframe', function(event) {\n"+
"\t\tif (game.input.up && this.y + this.footHeight >= Hack.groundHeight) {\n"+
"\t\t\tthis.velocity.y = -Hack.jumpSpeed; // ジャンプする速さ\n"+
"\t\t}\n"+
"\t});\n"+
"\n"+
"\t// UI (via ui.enchant.js)\n"+
"\tvar button_jump = new Button('↑', 'light', 24, 24);\n"+
"\tbutton_jump.moveTo(64, 190);\n"+
"\tbutton_jump.ontouchstart = function() {\n"+
"\t\tgame.input.up = true;\n"+
"\t};\n"+
"\tbutton_jump.ontouchend = function() {\n"+
"\t\tgame.input.up = false;\n"+
"\t};\n"+
"\tgame.rootScene.addChild(button_jump);\n"+
"\tHack.button_jump = button_jump;\n"+
"};\n"+
"\n"+
"// ゲーム実行中、毎フレーム呼び出されるイベント\n"+
"game.onenterframe = function() {\n"+
"\tif (!Hack.started) return; // ゲームが始まっているかどうかフラグ\n"+
"\n"+
"\t// ゴール (プレイヤーの位置が、Hack.goalを超えたら)\n"+
"\tif (Hack.player.x >= Hack.goal) {\n"+
"\t\tHack.gameclear();\n"+
"\t\tHack.started = false;\n"+
"\t\tgame.rootScene.removeChild(Hack.button_jump);\n"+
"\t}\n"+
"\n"+
"\t// プレイヤーを基準にして、画面をスクロールさせる\n"+
"\tHack.scrollRight(Hack.player.x - 64);\n"+
"\n"+
"\t// ダメージを受ける処理\n"+
"\tif (!Hack.player.isDamaged) {\n"+
"\t\tHack.monster.forEach(function(enemy) {\n"+
"\t\t\t// 当たり判定\n"+
"\t\t\tif (Hack.player.within(enemy, 20) && enemy.attack) {\n"+
"\n"+
"\t\t\t\tHack.player.hp -= enemy.attack; // いてっ!! HPが減る\n"+
"\t\t\t\tHack.player.isDamaged = enemy.attack > 0; // ダメージを受けて点滅するフラグ\n"+
"\n"+
"\t\t\t\tif (Hack.player.hp <= 0) {\n"+
"\n"+
"\t\t\t\t\t// R.I.P (安らかに眠りたまえ…)\n"+
"\t\t\t\t\tHack.gameover(); // ゲームオーバー\n"+
"\t\t\t\t\tHack.started = false;\n"+
"\t\t\t\t\tHack.player.onenterframe = null; // 'onenterframe'を消して動かないようにする\n"+
"\t\t\t\t\tHack.player.tl.fadeOut(10); // ゆっくり消える\n"+
"\t\t\t\t\tgame.rootScene.removeChild(Hack.button_jump);\n"+
"\n"+
"\t\t\t\t} else if(enemy.attack > 0) {\n"+
"\n"+
"\t\t\t\t\t// まだ生きている場合\n"+
"\t\t\t\t\tvar saveFrame = Hack.player._originalFrameSequence; // ~= player.frame\n"+
"\t\t\t\t\tHack.player.frame = [-1, -1, 24, 24]; // 点滅 (-1: 透明)\n"+
"\n"+
"\t\t\t\t\twindow.setTimeout(function() {\n"+
"\t\t\t\t\t\t// 3 秒たったら...\n"+
"\t\t\t\t\t\tHack.player.isDamaged = false;\n"+
"\t\t\t\t\t\tHack.player.frame = saveFrame; // ~= player.frame を復帰\n"+
"\t\t\t\t\t}, 3000);\n"+
"\n"+
"\t\t\t\t} else if(enemy.attack < 0) {\n"+
"\n"+
"\t\t\t\t\t// りんごなど回復アイテム\n"+
"\t\t\t\t\tif(enemy.parentNode){\n"+
"\t\t\t\t   enemy.parentNode.removeChild(enemy);\n"+
"\t\t\t\t\t}\n"+
"\t\t\t\t\tif(enemy.scene) {\n"+
"\t\t\t\t\t\tenemy.scene.removeChild(enemy);\n"+
"\t\t\t\t\t}\n"+
"\t\t\t\t\tvar index = Hack.monster.indexOf(enemy);\n"+
"\t\t\t\t\tif (index > 0) {\n"+
"\t\t\t\t\t\tconsole.log(index);\n"+
"\t\t\t\t\t\tHack.monster.splice(index, 1);\n"+
"\t\t\t\t\t}\n"+
"\n"+
"\t\t\t\t}\n"+
"\t\t\t\treturn;\n"+
"\t\t\t}\n"+
"\t\t});\n"+
"\t}\n"+
"};\n"+
"\n"+
"// 新しくモンスターをつくる関数\n"+
"function makeMonster ( _x, _y, _frame, _useGravity, _useGround, _footHeight) {\n"+
"\treturn Hack.createMovingSprite(48, 48, {\n"+
"\t\tx: _x || 0, y: _y || 0,\n"+
"\t\timage: game.assets['enchantjs/monster1.gif'],\n"+
"\t\tframe: _frame || [2, 2, 2, 3, 3, 3],\n"+
"\t\tuseGravity: _useGravity || true,\n"+
"\t\tuseGround:  _useGround  || true,\n"+
"\t\tfootHeight: _footHeight || 32,\n"+
"\t\tattack: 1\n"+
"\t});\n"+
"}\n"+
"\n"+
"\n"+
"// クラス\n"+
"\n"+
"// enchant.Spriteを継承して、動くようにしたクラス\n"+
"Hack.MovingSprite = enchant.Class.create(enchant.Sprite, {\n"+
"\tinitialize: function(width, height) {\n"+
"\t\tenchant.Sprite.call(this, width, height);\n"+
"\t\tthis.velocity = { x: 0, y: 0 };\n"+
"\t},\n"+
"\tonenterframe: function() {\n"+
"\t\t// 重力の影響をうけて速度(velocity)がかわる処理\n"+
"\t\tif (this.useGravity) {\n"+
"\t\t\tthis.velocity.x += Hack.gravity.x;\n"+
"\t\t\tthis.velocity.y += Hack.gravity.y;\n"+
"\t\t}\n"+
"\t\t// 速度の分だけ動く\n"+
"\t\tthis.moveBy(this.velocity.x, this.velocity.y);\n"+
"\t\t// 地面に足がついたときの処理\n"+
"\t\tif (this.useGround) {\n"+
"\t\t\tvar foot = this.y + (this.footHeight || this.height); // 足の高さ\n"+
"\t\t\tif (foot >= Hack.groundHeight) {\n"+
"\t\t\t\tthis.y = Hack.groundHeight - (this.footHeight || this.height); // 足をつく\n"+
"\t\t\t\tthis.velocity.y = 0; // 足がついたのでYの速さを0にする\n"+
"\t\t\t}\n"+
"\t\t}\n"+
"\t}\n"+
"});\n"+
"// MovingSpriteのオブジェクトをつくるメソッド\n"+
"Hack.createMovingSprite = function(width, height, prop) {\n"+
"\treturn (function () {\n"+
"\t// @ new Hack.MovingSprite()\n"+
"\tif (prop) {\n"+
"\t\tObject.keys(prop).forEach(function(key) {\n"+
"\t\t\tthis[key] = prop[key];\n"+
"\t\t}, this);\n"+
"\t}\n"+
"\tif (Hack.defaultParentNode) {\n"+
"\t\tHack.defaultParentNode.addChild(this);\n"+
"\t}\n"+
"\treturn this;\n"+
"\n"+
"\t}).call(new Hack.MovingSprite(width, height));\n"+
"};\n"+
"\n"+
"/* Hack.m() / Hack.makeMonsterFromMap()\n"+
" * offsetX	: mapを適用するX座標,\n"+
" * offsetY	: mapを適用するY座標,\n"+
" * map	: モンスターのkindを指定するmap\n"+
" * (kind)	: 0 => null, 1 => insect, 2 => bat, 3 => apple\n"+
"*/\n"+
"Hack.makeMonsterFromMap = function(offsetX, offsetY, map) {\n"+
"\tmap.forEach(function(kind, index) {\n"+
"\t\tswitch(kind) {\n"+
"\t\t\tcase 1:\n"+
"\t\t\t\tvar insect = Hack.createMovingSprite(48, 48, {\n"+
"\t\t\t\t\tx: offsetX + index * 32, y: offsetY,\n"+
"\t\t\t\t\timage: game.assets['enchantjs/monster1.gif'],\n"+
"\t\t\t\t\tframe: [2, 2, 2, 3, 3, 3],\n"+
"\t\t\t\t\tuseGravity: true,\n"+
"\t\t\t\t\tuseGround:  true,\n"+
"\t\t\t\t\tfootHeight: 32,\n"+
"\t\t\t\t\tattack: 1\n"+
"\t\t\t\t});\n"+
"\t\t\t\tHack.monster.push(insect);\n"+
"\t\t\t\tbreak;\n"+
"\t\t\tcase 2:\n"+
"\t\t\t\tvar bat = Hack.createMovingSprite(48, 48, {\n"+
"\t\t\t\t\tx: offsetX + index * 32, y: offsetY,\n"+
"\t\t\t\t\timage: game.assets['enchantjs/monster3.gif'],\n"+
"\t\t\t\t\tframe: [2, 2, 2, 3, 3, 3],\n"+
"\t\t\t\t\tuseGravity: false,\n"+
"\t\t\t\t\tuseGround:  true,\n"+
"\t\t\t\t\tfootHeight: 32,\n"+
"\t\t\t\t\tattack: 1\n"+
"\t\t\t\t});\n"+
"\t\t\t\tHack.monster.push(bat);\n"+
"\t\t\t\tbreak;\n"+
"\t\t\tcase 3:\n"+
"\t\t\t\tvar apple = Hack.createMovingSprite(32, 32, {\n"+
"\t\t\t\t\tx: offsetX + index * 32, y: offsetY,\n"+
"\t\t\t\t\timage: game.assets['enchantjs/x2/icon0.png'],\n"+
"\t\t\t\t\tframe: 15,\n"+
"\t\t\t\t\tuseGravity: false,\n"+
"\t\t\t\t\tuseGround:  true,\n"+
"\t\t\t\t\tfootHeight: 32,\n"+
"\t\t\t\t\tattack: -1\n"+
"\t\t\t\t});\n"+
"\t\t\t\tHack.monster.push(apple);\n"+
"\t\t\tdefault:\n"+
"\t\t\t\tbreak;\n"+
"\t\t}\n"+
"\t});\n"+
"};\n"+
"Hack.m = Hack.makeMonsterFromMap;\n";


	game.onload = game.onload || function() {
		Hack.pressStartKey(' ');
		Hack.defaultParentNode = new enchant.Group(); // prepear to scroll

		Hack.createScrollMap([
			[22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
			[21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21],
			[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
			[19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19],
			[18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18],
			[18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[ 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
			[ 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
			[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
		]);

		Hack.player = Hack.createMovingSprite(48, 48, {
			x: 64, y: 160,
			image: game.assets['enchantjs/x1.5/chara0.png'],
			frame: [25, 25, 25, 24, 24, 24, 25, 25, 25, 26, 26, 26],
			useGravity: true, useGround: true, footHeight: 48
		});
		Hack.player.hp = 3; // player's hit point
		Hack.player.isDamaged = false; // damaged flag

		Hack.monster = [];
		Hack.monster[0] = makeMonster( 400, 154);
		Hack.monster[1] = makeMonster( 800, 154);
		Hack.monster[2] = makeMonster(1200, 154);
		Hack.monster[3] = makeMonster(1600, 154);
		Hack.monster[4] = makeMonster(2000, 154);
		Hack.monster[5] = makeMonster(2400, 154);

		// 魔道書
		Hack.enchantBookIcon = Hack.createSprite(64, 64, {
			image: game.assets['hackforplay/enchantbook.png'],
			defaultParentNode: game.rootScene,
			ontouchend: function() {
				Hack.openEditor();
			}
		});
		// 魔道書の中身
		Hack.hint = 'Hack.player.velocity.x += 1; // 加速!!';

		// 最初のラベル
		Hack.pressStartLabel = Hack.createLabel('スペースキーを押してスタート<br>↑キーでジャンプ', {
			x: 120, y: 160, width: 400
		});
	};

	Hack.onpressstart = Hack.onpressstart || function() {
		Hack.started = true;

		Hack.player.parentNode.addChild(Hack.player); // bring to the front
		// {defaultParentNode: game.rootScene} means no-scroll
		Hack.hpLabel = Hack.createLabel('HP: ', {
			x: 400, y: 20, color: 'black',
			defaultParentNode: game.rootScene
		});
		Hack.hpLabel.onenterframe = function() {
			this.text = 'HP: ' + Hack.player.hp;
		};

		// move and jump
		Hack.player.velocity.x = 4;
		Hack.player.on('enterframe', function(event) {
			if (game.input.up && this.y + this.footHeight >= Hack.groundHeight) {
				this.velocity.y = -14;
			}
		});
	};

	game.onenterframe = game.onenterframe || function() {
		if (!Hack.started) return; // game started and running flag

		// goal (player.x becomes more than {Number})
		if (Hack.player.x >= 3000) {
			Hack.gameclear();
			Hack.started = false;
		}

		// scroll
		Hack.scrollRight(Hack.player.x - 64);

		//damage
		if (!Hack.player.isDamaged) {
			Hack.monster.forEach(function(enemy) {
				// collision detection
				if (Hack.player.within(enemy, 20)) {
					Hack.player.hp--; // ouch!!
					Hack.player.isDamaged = true; // damaged (flashing) flag

					if (Hack.player.hp <= 0) {
						// R.I.P
						Hack.gameover();
						Hack.started = false;
						Hack.player.onenterframe = null; // remove 'onenterframe'
						Hack.player.tl.fadeOut(10);
					} else {
						// still living
						var saveFrame = Hack.player._originalFrameSequence; // ~= player.frame
						Hack.player.frame = [-1, -1, 24, 24]; // flashing (-1: invisible)

						window.setTimeout(function() {
							// 3 秒たったら...
							Hack.player.isDamaged = false;
							Hack.player.frame = saveFrame; // walking animation
						}, 3000);
					}
					return;
				}
			});
		}
	};

	// Environments and classes
	Hack.groundHeight = 32 * 6; // define ground distance from Y=0
	Hack.gravity = { x: 0, y: 1 };
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

	function makeMonster (_x, _y, _frame, _useGravity, _useGround, _footHeight) {
		return Hack.createMovingSprite(48, 48, {
			x: _x || 0, y: _y || 0,
			image: game.assets['enchantjs/monster1.gif'],
			frame: _frame || [2, 2, 2, 3, 3, 3],
			useGravity: _useGravity || true,
			useGround: _useGround|| true,
			footHeight: _footHeight || 32
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
			Hack.backgroundImage[x].image = game.assets['enchantjs/x2/map2.png'];
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