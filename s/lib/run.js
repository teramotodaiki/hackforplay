window.addEventListener('load', function() {

	var game = enchant.Core.instance;
	game.preload(['img/map2.png', 'img/chara0.png', 'img/monster1.gif', 'img/monster2.gif', 'img/monster3.gif', 'img/monster4.gif']);

	var binded_key = ' '.charCodeAt(0);
	game.keybind(binded_key, 'a'); // aボタンはスペースキー

	Hack.textarea.backgroundColor = 'rgba(0,20,40,0.5)';

	// ====> 改造コードへ
	Hack.restagingCode =
	"game.onload = function() {\n"+
	"\tHack.pressStartKey(' ');\n"+
	"\tHack.defaultParentNode = new enchant.Group(); // prepear to scroll\n"+
	"\n"+
	"\tHack.createScrollMap([\n"+
	"\t\t[22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],\n"+
	"\t\t[21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21],\n"+
	"\t\t[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],\n"+
	"\t\t[19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19],\n"+
	"\t\t[18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18],\n"+
	"\t\t[18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18],\n"+
	"\t\t[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n"+
	"\t\t[ 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],\n"+
	"\t\t[ 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],\n"+
	"\t\t[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]\n"+
	"\t]);\n"+
	"\n"+
	"\tHack.player = Hack.createMovingSprite(48, 48, {\n"+
	"\t\tx: 64, y: 160,\n"+
	"\t\timage: game.assets['img/chara0.png'],\n"+
	"\t\tframe: [25, 25, 25, 24, 24, 24, 25, 25, 25, 26, 26, 26],\n"+
	"\t\tuseGravity: true, useGround: true, footHeight: 48\n"+
	"\t});\n"+
	"\tHack.player.hp = 3; // player's hit point\n"+
	"\tHack.player.isDamaged = false; // damaged flag\n"+
	"\n"+
	"\tHack.monster = [];\n"+
	"\tHack.monster[0] = makeMonster(1, 400, 154);\n"+
	"\tHack.monster[1] = makeMonster(1, 800, 154);\n"+
	"\tHack.monster[2] = makeMonster(1,1200, 154);\n"+
	"\tHack.monster[3] = makeMonster(1,1600, 154);\n"+
	"\tHack.monster[4] = makeMonster(1,2000, 154);\n"+
	"\tHack.monster[5] = makeMonster(1,2400, 154);\n"+
	"};\n"+
	"\n"+
	"function makeMonster (_number, _x, _y, _frame, _useGravity, _useGround, _footHeight) {\n"+
	"\treturn Hack.createMovingSprite(48, 48, {\n"+
	"\t\tx: _x || 0, y: _y || 0,\n"+
	"\t\timage: game.assets['img/monster' + (_number || 1) + '.gif'],\n"+
	"\t\tframe: _frame || [2, 2, 2, 3, 3, 3],\n"+
	"\t\tuseGravity: _useGravity || true,\n"+
	"\t\tuseGround:  _useGround  || true,\n"+
	"\t\tfootHeight: _footHeight || 32\n"+
	"\t});\n"+
	"}\n";

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
			image: game.assets['img/chara0.png'],
			frame: [25, 25, 25, 24, 24, 24, 25, 25, 25, 26, 26, 26],
			useGravity: true, useGround: true, footHeight: 48
		});
		Hack.player.hp = 3; // player's hit point
		Hack.player.isDamaged = false; // damaged flag

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

	game.onenterframe = function() {
		if (!Hack.started) return;

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
				if (Hack.player.within(enemy, 20)) {
					// ouch!!
					Hack.player.hp--;
					Hack.player.isDamaged = true; // damaged flag

					if (Hack.player.hp <= 0) {
						Hack.gameover();
						Hack.started = false;
						Hack.player.velocity = { x: 0, y: 0 };
						Hack.player.tl.fadeOut(10);
					} else {
						var saveFrame = Hack.player._originalFrameSequence;
						Hack.player.frame = [-1, -1, 24, 24];

						window.setTimeout(function() {
							// 3 second left...
							Hack.player.isDamaged = false;
							Hack.player.frame = saveFrame;
						}, 3000);
					}
					return;
				}
			});
		}

	};

	// Environments and classes
	Hack.groundHeight = 32 * 6; // define ground height by
	console.log('set gravity force');
	Hack.gravityForce = { x: 0, y: 1 };
	Hack.MovingSprite = enchant.Class.create(enchant.Sprite, {
		initialize: function(width, height) {
			enchant.Sprite.call(this, width, height);
			this.velocity = { x: 0, y: 0 };
		},
		onenterframe: function() {
			// gravity
			if (this.useGravity) {
				var mass = this.mass || 1;
				this.velocity.x += Hack.gravityForce.x / mass;
				this.velocity.y += Hack.gravityForce.y / mass;
			}
			// move
			this.moveBy(this.velocity.x, this.velocity.y);
			// get a foot on the ground
			if (this.useGround) {
				var foot = this.y + (this.footHeight || this.height);
				if (foot >= Hack.groundHeight) {
					this.velocity.y = 0;
					this.y = Hack.groundHeight - (this.footHeight || this.height);
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

	function makeMonster (_number, _x, _y, _frame, _useGravity, _useGround, _footHeight) {
		return Hack.createMovingSprite(48, 48, {
			x: _x || 0, y: _y || 0,
			image: game.assets['img/monster' + (_number || 1) + '.gif'],
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
			Hack.backgroundImage[x].image = game.assets['img/map2.png'];
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