window.addEventListener('load', function () {

	Hack.restagingCode = function () {
		// Game start
		game.onload = function () {

			var map = Hack.maps['map1'];
			map.load(); // Load Map;  Hack.defaultParentNode == map.scene


			// ( Keep this line -- ここはけさないでね ) //


			// プレイヤー（騎士）
			var player = Hack.player = new Player();
			player.locate(3, 5);
			player.hp = 3;
			player.onbecomedead = function () {
				Hack.gameover();
			};

		};

		// Before game start
		Hack.onload = function () {

			MapObject.dictionary = {
				clay: 320,		clayWall: 340,	clayFloor: 323,
				stone: 321,		stoneWall: 341,	stoneFloor: 342,
				warp: 324,		warpRed: 325,
				warpGreen: 326,	warpYellow: 327,
				magic: 328,		usedMagic: 329,
				pot: 400,		rock: 401,		upStair: 402,
				box: 420,		flower: 421,	downStair: 422,
				trap: 440,		usedTrap: 441,	step: 442,
				castle: 500,	village: 501,	cave: 502,
				tree: 520,		table: 521,		openedBox: 522,
				beam: 540,		diamond: 560,	sapphire: 561,
				ruby: 562,		heart: 563,		skull: 564,
				coin: 565,		star: 566,		key: 567,
				bomb: 580,		coldBomb: 581,	egg: 582,
				poo: 583
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

		// Score up/Score down
		Hack.onscorechange = function () {

			// [ Keep this line -- ここはけさないでね ] //

		};

		// EnchantBook
		Hack.hint = function () {
			//  -            =
			// -  BASIC CODE  =
			//  -            =
			Hack.player.locate(6, 5);  // Teleportation
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