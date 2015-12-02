window.addEventListener('load', function () {

	Hack.restagingCode = function () {
		// Game start
		game.onload = function () {

			var map = Hack.maps['room1'];
			map.load(); // Load Map;  Hack.defaultParentNode == map.scene


			// ゴール
			var item1 = new MapObject(0);
			item1.locate(14, 5, 'room1');
			item1.onplayerenter = function () {
				// ゲームクリア
				Hack.gameclear();
				Hack.player.destroy();
			};


			// ( Keep this line -- ここはけさないでね ) //


			// プレイヤー（騎士）
			var player = Hack.player = new Player();
			player.locate(3, 5);

		};

		// Before game start
		Hack.onload = function () {

			MapObject.Dictionaly = {
				'Warp': 324,		'WarpRed': 325,		'WarpGreen': 326,	'WarpYellow': 327,
				'Pot': 400,			'Rock': 401,		'UpStair': 402,
				'Box': 420,			'Flower': 421,		'DownStair': 422,
				'Trap': 440,		'UsedTrap': 441,	'Step': 442,
				'Castle': 500,		'Village': 501,		'Cave': 502,
				'Tree': 520,		'Table': 521,		'OpenedBox': 522,
				'Beam': 540,		'Diamond': 560,		'Sapphire': 561,
				'Ruby': 562,		'Heart': 563,		'Skull': 564,
				'Coin': 565,		'Star': 566,		'Key': 567
			};

			Hack.maps = [];

			// room1
			Hack.maps['room1'] = new RPGMap(32, 32);
			Hack.maps['room1'].imagePath = 'enchantjs/x2/map1.gif';
			Hack.maps['room1'].bmap.loadData([
				[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],
				[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],
				[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],
				[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],
				[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],
				[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],
				[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],
				[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],
				[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],
				[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322]
			]);
			Hack.maps['room1'].cmap = [
				[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
				[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
				[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
				[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
				[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
				[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
				[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
				[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
				[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
				[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
			];


			// < Keep this line -- ここはけさないでね > //

		};

		// EnchantBook
		Hack.hint =
			"//  -            =\n"+
			"// -  BASIC CODE  =\n"+
			"//  -            =\n"+
			"Hack.player.locate(6, 5, 'room1');  // Teleportation\n"+
			"Hack.player.direction = 2; // Turn\n"+
			"Hack.player.atk = 10;      // Power Up\n"+
			"\n"+
			"\n"+
			"//  *            +\n"+
			"// *  EXTRA CODE  +  Remove // to use.\n"+
			"//  *            +   // をけして つかおう!\n"+
			"\n"+
			"// Hack.changeMap('room1');\n"+
			"// Hack.log('wwwwwwww');\n"+
			"\n"+
			"\n";

	};
});