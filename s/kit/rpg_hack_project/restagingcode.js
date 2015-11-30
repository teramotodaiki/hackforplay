window.addEventListener('load', function () {

	Hack.restagingCode =
"// Game start\n"+
"game.onload = function () {\n"+
"\n"+
"\tvar map = Hack.maps['room1'];\n"+
"\tmap.load(); // Load Map;  Hack.defaultParentNode == map.scene\n"+
"\n"+
"\n"+
"\t// ゴール\n"+
"\tvar item1 = new MapObject(0);\n"+
"\titem1.locate(14, 5, 'room1');\n"+
"\titem1.onplayerenter = function () {\n"+
"\t\t// ゲームクリア\n"+
"\t\tHack.gameclear();\n"+
"\t\tHack.player.destroy();\n"+
"\t};\n"+
"\n"+
"\n"+
"\t// ( Keep this line -- ここはけさないでね ) //\n"+
"\n"+
"\n"+
"\t// プレイヤー（騎士）\n"+
"\tvar player = Hack.player = new Player();\n"+
"\tplayer.locate(3, 5);\n"+
"\n"+
"};\n"+
"\n"+
"// Before game start\n"+
"Hack.onload = function () {\n"+
"\n"+
"\tMapObject.Dictionaly = {\n"+
"\t\t'Warp': 324,\t\t'WarpRed': 325,\t\t'WarpGreen': 326,\t'WarpYellow': 327,\n"+
"\t\t'Pot': 400,\t\t\t'Rock': 401,\t\t'UpStair': 402,\n"+
"\t\t'Box': 420,\t\t\t'Flower': 421,\t\t'DownStair': 422,\n"+
"\t\t'Trap': 440,\t\t'UsedTrap': 441,\t'Step': 442,\n"+
"\t\t'Castle': 500,\t\t'Village': 501,\t\t'Cave': 502,\n"+
"\t\t'Tree': 520,\t\t'Table': 521,\t\t'OpenedBox': 522,\n"+
"\t\t'Beam': 540,\t\t'Diamond': 560,\t\t'Sapphire': 561,\n"+
"\t\t'Ruby': 562,\t\t'Heart': 563,\t\t'Skull': 564,\n"+
"\t\t'Coin': 565,\t\t'Star': 566,\t\t'Key': 567\n"+
"\t};\n"+
"\n"+
"\tHack.maps = [];\n"+
"\n"+
"\t// room1\n"+
"\tHack.maps['room1'] = new RPGMap(32, 32);\n"+
"\tHack.maps['room1'].imagePath = 'enchantjs/x2/map1.gif';\n"+
"\tHack.maps['room1'].bmap.loadData([\n"+
"\t\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
"\t\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
"\t\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
"\t\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
"\t\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
"\t\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
"\t\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
"\t\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
"\t\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],\n"+
"\t\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322]\n"+
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
"\n"+
"\n"+
"\t// < Keep this line -- ここはけさないでね > //\n"+
"\n"+
"};\n"+
"\n"+
"// EnchantBook\n"+
"Hack.hint =\n"+
"\t\"//  -            =\\n\"+\n"+
"\t\"// -  BASIC CODE  =\\n\"+\n"+
"\t\"//  -            =\\n\"+\n"+
"\t\"Hack.player.locate(6, 5, 'room1');  // Teleportation\\n\"+\n"+
"\t\"Hack.player.direction = 2; // Turn\\n\"+\n"+
"\t\"Hack.player.atk = 10;      // Power Up\\n\"+\n"+
"\t\"\\n\"+\n"+
"\t\"\\n\"+\n"+
"\t\"//  *            +\\n\"+\n"+
"\t\"// *  EXTRA CODE  +  Remove // to use.\\n\"+\n"+
"\t\"//  *            +   // をけして つかおう!\\n\"+\n"+
"\t\"\\n\"+\n"+
"\t\"// Hack.changeMap('room1');\\n\"+\n"+
"\t\"// Hack.log('wwwwwwww');\\n\"+\n"+
"\t\"\\n\"+\n"+
"\t\"\\n\";\n"+
"\n";

});