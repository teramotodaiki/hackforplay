window.addEventListener('load', function () {

	Hack.restagingCode = function () {
		// Game start
		game.onload = function () {

			var map = Hack.maps['map1'];
			map.load(); // Load Map;  Hack.defaultParentNode == map.scene


			// ゴール
			var item1 = new MapObject(0);
			item1.locate(14, 5, 'map1');
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
				'Clay': 320,		'ClayWall': 340,	'ClayFloor': 323,
				'Stone': 321,		'StoneWall': 341,	'StoneFloor': 342,
				'Warp': 324,		'WarpRed': 325,
				'WarpGreen': 326,	'WarpYellow': 327,
				'Pot': 400,			'Rock': 401,		'UpStair': 402,
				'Box': 420,			'Flower': 421,		'DownStair': 422,
				'Trap': 440,		'UsedTrap': 441,	'Step': 442,
				'Castle': 500,		'Village': 501,		'Cave': 502,
				'Tree': 520,		'Table': 521,		'OpenedBox': 522,
				'Beam': 540,		'Diamond': 560,		'Sapphire': 561,
				'Ruby': 562,		'Heart': 563,		'Skull': 564,
				'Coin': 565,		'Star': 566,		'Key': 567
			};

			Hack.maps = {};

			// map1
			Hack.maps['map1'] = new RPGMap(32, 32);
			Hack.maps['map1'].imagePath = 'enchantjs/x2/dotmat.gif';
			Hack.maps['map1'].bmap.loadData([
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
			Hack.maps['map1'].cmap = [
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
		Hack.hint = function () {
			//  -            =
			// -  BASIC CODE  =
			//  -            =
			Hack.player.locate(6, 5, 'map1');  // Teleportation
			Hack.player.direction = 2; // Turn
			Hack.player.atk = 10;      // Power Up


			//  *            +
			// *  EXTRA CODE  +  Remove // to use.
			//  *            +   // をけして つかおう!

			// Hack.changeMap('map1');
			// Hack.log('wwwwwwww');

		};

	};
});