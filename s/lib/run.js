window.addEventListener('load', function() {

	var game = enchant.Core.instance;
	game.preload(['img/map2.png', 'img/monster1.gif', 'img/monster2.gif', 'img/monster3.gif', 'img/monster4.gif']);

	var binded_key = ' '.charCodeAt(0);
	game.keybind(binded_key, 'a'); // aボタンはスペースキー

	Hack.textarea.backgroundColor = '#024';

	// ===>

	function makeMonster (_number, _x, _y) {
		var monster = Hack.createSprite(48, 48, {
			x: _x, y: _y, image: game.assets['img/monster' + _number + '.gif'],
			frame: [2, 2, 2, 3, 3, 3]
		});
		return monster;
	}

	game.onload = function() {

		Hack.backgroundImage = [];
		for (var i = 0; i < 16; i++) {
			Hack.backgroundImage[i] = new enchant.Map(32, 32);
			Hack.backgroundImage[i].image = game.assets['img/map2.png'];
			Hack.backgroundImage[i].loadData([
				[22],[21],[20],[19],[18],[18],[0],[1],[1],[1]
			]);
			Hack.backgroundImage[i].x = i * 32;
			game.rootScene.addChild(Hack.backgroundImage[i]);
		}

		Hack.player = Hack.createSprite(48, 48, {
			x: 64, y: 160, scaleX: -1,
			image: game.assets['img/monster4.gif'],
			frame: [4, 4, 4, 3, 3, 3, 4, 4, 4, 5, 5, 5]
		});

		Hack.monster = [];
		Hack.monster[0] = makeMonster(1, 400, 154);
		Hack.monster[1] = makeMonster(1, 800, 154);
		Hack.monster[2] = makeMonster(1,1200, 154);
		Hack.monster[3] = makeMonster(1,1600, 154);
		Hack.monster[4] = makeMonster(1,2000, 154);
		Hack.monster[5] = makeMonster(1,2400, 154);
	};

	Hack.onpressstart = function() {
		Hack.started = true;

		game.rootScene.addChild(Hack.player); // bring to the front

		Hack.player.onenterframe = function() {
			this.x += 2;
		};
	};

	game.onenterframe = function() {
		if (!Hack.started) return;

		// scroll
		game.rootScene.x = - (Hack.player.x - 64);
		Hack.backgroundImage.forEach(function(item) {
			if (item.x + item.parentNode.x <= -32) {
				item.x += game.width + 32;
			}
		});
	};

	// <===

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