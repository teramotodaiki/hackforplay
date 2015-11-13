window.addEventListener('load', function () {

	Hack.restagingCode =
"// Game start\n"+
"game.onload = function () {\n"+
"\n"+
"\tvar map = Hack.maps['room1'];\n"+
"\tmap.load(); // Load Map;  Hack.defaultParentNode == map.scene\n"+
"\n"+
"\t// スライム\n"+
"\tvar blueSlime = new BlueSlime();\n"+
"\tblueSlime.locate(9, 5);\n"+
"\n"+
"\t// イモムシ\n"+
"\tvar insect = new Insect();\n"+
"\tinsect.locate(8, 1);\n"+
"\n"+
"\t// うろうろする\n"+
"\tinsect.onenterframe = function () {\n"+
"\t\t\n"+
"\t\t// When enterframe... つねに\n"+
"\t\tif (this.behavior === BehaviorTypes.Idle) {\n"+
"\t\t\t// Idel (まっている）とき\n"+
"\t\t\tthis.behavior = BehaviorTypes.Walk;\n"+
"\t\t\tthis.tl.clear().then(function () {\n"+
"\t\t\t\tthis.direction *= -1; // Turn\n"+
"\t\t\t}).moveBy(this.direction * 4 * 32, 0 * 32, 120).delay(60).then(function() {\n"+
"\t\t\t\tthis.behavior = BehaviorTypes.Idle;\n"+
"\t\t\t});\n"+
"\t\t}\n"+
"\t\t\n"+
"\t};\n"+
"\n"+
"\t// クモ\n"+
"\tvar spider = new Spider();\n"+
"\tspider.locate(7, 5);\n"+
"\n"+
"\t// コウモリ\n"+
"\tvar bat = new Bat();\n"+
"\tbat.locate(6, 5);\n"+
"\t// むかってくる\n"+
"\tbat.onenterframe = function () {\n"+
"\t\t\n"+
"\t\t// When enterframe... つねに\n"+
"\t\tif (this.behavior === BehaviorTypes.Idle) {\n"+
"\t\t\t// Idel (まっている）とき\n"+
"\t\t\tthis.behavior = BehaviorTypes.Walk;\n"+
"\t\t\tvar x = Math.sign(Hack.player.x - this.x);\n"+
"\t\t\tvar y = Math.sign(Hack.player.y - this.y);\n"+
"\t\t\tthis.tl.clear().then(function () {\n"+
"\t\t\t\tthis.scaleX = x < 0 ? 1 : -1; // Turn\n"+
"\t\t\t}).moveBy(x * 32, y * 32, 40).delay(40).then(function() {\n"+
"\t\t\t	this.behavior = BehaviorTypes.Idle;\n"+
"\t\t\t});\n"+
"\t\t}\n"+
"\t\t\n"+
"\t};\n"+
"\n"+
"\t// ドラゴン\n"+
"\tvar dragon = new Dragon();\n"+
"\tdragon.locate(5, 5);\n"+
"\n"+
"\t// ミノタウロス\n"+
"\tvar minotaur = new Minotaur();\n"+
"\tminotaur.locate(4, 5);\n"+
"\n"+
"\t// 男の子\n"+
"\tvar boy = new Boy();\n"+
"\tboy.locate(5, 6);\n"+
"\t// ことば\n"+
"\tboy.onattacked = function () {\n"+
"\t\tHack.log('Hey!');\n"+
"\t};\n"+
"\t\n"+
"\t// 女の子\n"+
"\tvar girl = new Girl();\n"+
"\tgirl.locate(6, 6);\n"+
"\t// ２タイプの ことば\n"+
"\tvar talkType = 0;\n"+
"\tgirl.onattacked = function () {\n"+
"\t\tif (talkType === 0) {\n"+
"\t\t\tHack.log('マジで？');\n"+
"\t\t\ttalkType = 1;\n"+
"\t\t} else {\n"+
"\t\t\tHack.log('ヤバい！');\n"+
"\t\t\ttalkType = 0;\n"+
"\t\t}\n"+
"\t};\n"+
"\t\n"+
"\t// 女の人\n"+
"\tvar woman = new Woman();\n"+
"\twoman.locate(7, 6);\n"+
"\t// JSONでダンプ\n"+
"\twoman.onattacked = function () {\n"+
"\t\tHack.log('Hello', 'World！', { age: this.age });\n"+
"\t};\n"+
"\n"+
"\t// のぼりかいだん\n"+
"\tvar stair = new MapObject('UpStair');\n"+
"\tstair.locate(1, 7);\n"+
"\tstair.onplayerenter = function () {\n"+
"\t\t\n"+
"\t\t// When enter... ふまれたら...\n"+
"\t\tHack.changeMap('room2');\n"+
"\t\t\n"+
"\t};\n"+
"\n"+
"\t// トゲのわな\n"+
"\tvar trap = new MapObject('Trap');\n"+
"\ttrap.locate(2, 5);\n"+
"\ttrap.onplayerenter = function () {\n"+
"\t\t\n"+
"\t\t// When enter... ふまれたら...\n"+
"\t\tthis.frame = MapObject.Dictionaly['UsedTrap'];\n"+
"\t\tHack.Attack.call(this, 2, 5, 1);\n"+
"\t\t\n"+
"\t};\n"+
"\ttrap.onplayerleave = function () {\n"+
"\t\t\n"+
"\t\t// When leave... はなれたら\n"+
"\t\tthis.frame = MapObject.Dictionaly['Trap'];\n"+
"\t\t\n"+
"\t};\n"+
"\n"+
"\t// ワープゆか\n"+
"\tvar warp = new MapObject(93);\n"+
"\twarp.locate(1, 3);\n"+
"\twarp.onplayerenter = function () {\n"+
"\t\n"+
"\t\t// When enter... ふまれたら...\n"+
"\t\tHack.player.locate(10, 3);\n"+
"\t\n"+
"\t};\n"+
"\n"+
"\t// プレイヤー（騎士）\n"+
"\tvar player = Hack.player = new Player();\n"+
"\tplayer.locate(1, 5);\n"+
"\n"+
"\t// room2 に行ったとき\n"+
"\tHack.maps['room2'].onload = function () {\n"+
"\t\t\n"+
"\t\t// くだりかいだん\n"+
"\t\tvar stair2 = new MapObject('DownStair');\n"+
"\t\tstair2.locate(1, 7);\n"+
"\t\tstair2.onplayerenter = function () {\n"+
"\t\t\t\n"+
"\t\t\t// When enter... ふまれたら...\n"+
"\t\t\tHack.changeMap('room1');\n"+
"\t\t\t\n"+
"\t\t};\n"+
"\t\t\n"+
"\t};\n"+
"\n"+
"};\n"+
"\n"+
"// Before game start\n"+
"Hack.onload = function () {\n"+
"\n"+
"\tMapObject.Dictionaly = {\n"+
"\t\t'Pot': 400,\t\t\t'Rock': 401,\t\t'UpStair': 402,\n"+
"\t\t'Box': 420,\t\t\t'Flower': 421,\t\t'DownStair': 422,\n"+
"\t\t'Trap': 440,\t\t'UsedTrap': 441,\t'Step': 442,\n"+
"\t\t'Castle': 500,\t\t'Village': 501,\t\t'Cave': 502,\n"+
"\t\t'Tree': 520,\t\t'Table': 521\n"+
"\t};\n"+
"\n"+
"\tHack.maps = [];\n"+
"\tHack.maps['room1'] = new RPGMap(32, 32);\n"+
"\tHack.maps['room1'].imagePath = 'enchantjs/x2/map1.gif';\n"+
"\tHack.maps['room1'].bmap.loadData([\n"+
"\t\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
"\t\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
"\t\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
"\t\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
"\t\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
"\t\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
"\t\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
"\t\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
"\t\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],\n"+
"\t\t[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1]\n"+
"\t]);\n"+
"\tHack.maps['room1'].cmap = [\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]\n"+
"\t];\n"+
"\tHack.maps['room2'] = new RPGMap(32, 32);\n"+
"\tHack.maps['room2'].imagePath = 'enchantjs/x2/map1.gif';\n"+
"\tHack.maps['room2'].bmap.loadData([\n"+
"\t\t[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],\n"+
"\t\t[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],\n"+
"\t\t[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],\n"+
"\t\t[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],\n"+
"\t\t[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],\n"+
"\t\t[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],\n"+
"\t\t[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],\n"+
"\t\t[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],\n"+
"\t\t[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],\n"+
"\t\t[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]\n"+
"\t]);\n"+
"\tHack.maps['room2'].cmap = [\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]\n"+
"\t];\n"+
"};\n"+
"\n"+
"// EnchantBook\n"+
"Hack.hint = \n"+
"\t\"//  -            =\\n\"+\n"+
"\t\"// -  BASIC CODE  =\\n\"+\n"+
"\t\"//  -            =\\n\"+\n"+
"\t\"Hack.player.locate(5, 5);  // Teleportation\\n\"+\n"+
"\t\"Hack.player.direction = 2; // Turn\\n\"+\n"+
"\t\"\\n\"+\n"+
"\t\"\\n\"+\n"+
"\t\"//  *            +\\n\"+\n"+
"\t\"// *  EXTRA CODE  +  Remove // to use.\\n\"+\n"+
"\t\"//  *            +   // をけして つかおう!\\n\"+\n"+
"\t\"\\n\"+\n"+
"\t\"// Hack.changeMap('room2');\\n\"+\n"+
"\t\"// Hack.log('wwwwwwww');\\n\"+\n"+
"\t\"\\n\"+\n"+
"\t\"\\n\";\n"+
"\n";

});