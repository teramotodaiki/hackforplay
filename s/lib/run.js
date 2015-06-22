window.addEventListener('load', function() {

	var game = enchant.Core.instance;
	game.preload(['enchantjs/x2/map2.png', 'enchantjs/x1.5/chara0.png', 'enchantjs/monster1.gif', 'enchantjs/monster2.gif', 'enchantjs/monster3.gif', 'enchantjs/monster4.gif']);

	var binded_key = ' '.charCodeAt(0);
	game.keybind(binded_key, 'a'); // aボタンはスペースキー

	Hack.textarea.backgroundColor = 'rgba(0,20,40,0.5)';

	// ====> 改造コードへ
	Hack.restagingCode =
	"game.preload(['enchantjs/x2/map2.png', 'enchantjs/x1.5/chara0.png', 'enchantjs/monster1.gif', 'enchantjs/monster2.gif', 'enchantjs/monster3.gif', 'enchantjs/monster4.gif']);\n"+
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
	"\t\timage: game.assets['enchantjs/x1.5/chara0.png'],\n"+
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
	"Hack.onpressstart = function() {\n"+
	"\tHack.started = true;\n"+
	"\n"+
	"\tHack.player.parentNode.addChild(Hack.player); // bring to the front\n"+
	"\t// {defaultParentNode: game.rootScene} means no-scroll\n"+
	"\tHack.hpLabel = Hack.createLabel('HP: ', {\n"+
	"\t\tx: 400, y: 20, color: 'black',\n"+
	"\t\tdefaultParentNode: game.rootScene\n"+
	"\t});\n"+
	"\tHack.hpLabel.onenterframe = function() {\n"+
	"\t\tthis.text = 'HP: ' + Hack.player.hp;\n"+
	"\t};\n"+
	"\n"+
	"\t// move and jump\n"+
	"\tHack.player.velocity.x = 4;\n"+
	"\tHack.player.on('enterframe', function(event) {\n"+
	"\t\tif (game.input.up && this.y + this.footHeight >= Hack.groundHeight) {\n"+
	"\t\t\tthis.velocity.y = -14;\n"+
	"\t\t}\n"+
	"\t});\n"+
	"};\n"+
	"\n"+
	"game.onenterframe = function() {\n"+
	"\tif (!Hack.started) return; // game started and running flag\n"+
	"\n"+
	"\t// goal (player.x becomes more than {Number})\n"+
	"\tif (Hack.player.x >= 3000) {\n"+
	"\t\tHack.gameclear();\n"+
	"\t\tHack.started = false;\n"+
	"\t}\n"+
	"\n"+
	"\t// scroll\n"+
	"\tHack.scrollRight(Hack.player.x - 64);\n"+
	"\n"+
	"\t//damage\n"+
	"\tif (!Hack.player.isDamaged) {\n"+
	"\t\tHack.monster.forEach(function(enemy) {\n"+
	"\t\t\t// collision detection\n"+
	"\t\t\tif (Hack.player.within(enemy, 20)) {\n"+
	"\t\t\t\tHack.player.hp--; // ouch!!\n"+
	"\t\t\t\tHack.player.isDamaged = true; // damaged (flashing) flag\n"+
	"\n"+
	"\t\t\t\tif (Hack.player.hp <= 0) {\n"+
	"\t\t\t\t\t// R.I.P\n"+
	"\t\t\t\t\tHack.gameover();\n"+
	"\t\t\t\t\tHack.started = false;\n"+
	"\t\t\t\t\tHack.player.onenterframe = null; // remove 'onenterframe'\n"+
	"\t\t\t\t\tHack.player.tl.fadeOut(10);\n"+
	"\t\t\t\t} else {\n"+
	"\t\t\t\t\t// still living\n"+
	"\t\t\t\t\tvar saveFrame = Hack.player._originalFrameSequence; // ~= player.frame\n"+
	"\t\t\t\t\tHack.player.frame = [-1, -1, 24, 24]; // flashing (-1: invisible)\n"+
	"\n"+
	"\t\t\t\t\twindow.setTimeout(function() {\n"+
	"\t\t\t\t\t\t// 3 second left...\n"+
	"\t\t\t\t\t\tHack.player.isDamaged = false;\n"+
	"\t\t\t\t\t\tHack.player.frame = saveFrame; // walking animation\n"+
	"\t\t\t\t\t}, 3000);\n"+
	"\t\t\t\t}\n"+
	"\t\t\t\treturn;\n"+
	"\t\t\t}\n"+
	"\t\t});\n"+
	"\t}\n"+
	"};\n"+
	"\n"+
	"function makeMonster (_number, _x, _y, _frame, _useGravity, _useGround, _footHeight) {\n"+
	"\treturn Hack.createMovingSprite(48, 48, {\n"+
	"\t\tx: _x || 0, y: _y || 0,\n"+
	"\t\timage: game.assets['enchantjs/monster' + (_number || 1) + '.gif'],\n"+
	"\t\tframe: _frame || [2, 2, 2, 3, 3, 3],\n"+
	"\t\tuseGravity: _useGravity || true,\n"+
	"\t\tuseGround:  _useGround  || true,\n"+
	"\t\tfootHeight: _footHeight || 32\n"+
	"\t});\n"+
	"}\n"+
	"\n"+
	"\n"+
	"// Environments and classes\n"+
	"Hack.groundHeight = 32 * 6; // define ground distance from Y=0\n"+
	"Hack.gravity = { x: 0, y: 1 };\n"+
	"Hack.MovingSprite = enchant.Class.create(enchant.Sprite, {\n"+
	"\tinitialize: function(width, height) {\n"+
	"\t\tenchant.Sprite.call(this, width, height);\n"+
	"\t\tthis.velocity = { x: 0, y: 0 };\n"+
	"\t},\n"+
	"\tonenterframe: function() {\n"+
	"\t\t// move then effect from gravity\n"+
	"\t\tif (this.useGravity) {\n"+
	"\t\t\tthis.velocity.x += Hack.gravity.x;\n"+
	"\t\t\tthis.velocity.y += Hack.gravity.y;\n"+
	"\t\t}\n"+
	"\t\tthis.moveBy(this.velocity.x, this.velocity.y); // move\n"+
	"\t\t// get a foot on the ground\n"+
	"\t\tif (this.useGround) {\n"+
	"\t\t\tvar foot = this.y + (this.footHeight || this.height);\n"+
	"\t\t\tif (foot >= Hack.groundHeight) {\n"+
	"\t\t\t\tthis.velocity.y = 0;\n"+
	"\t\t\t\tthis.y = Hack.groundHeight - (this.footHeight || this.height);\n"+
	"\t\t\t}\n"+
	"\t\t}\n"+
	"\t}\n"+
	"});\n"+
	"Hack.createMovingSprite = function(width, height, prop) {\n"+
	"\treturn (function () {\n"+
	"\t\t// @ new Hack.MovingSprite()\n"+
	"\t\tif (prop) {\n"+
	"\t\t\tObject.keys(prop).forEach(function(key) {\n"+
	"\t\t\t\tthis[key] = prop[key];\n"+
	"\t\t\t}, this);\n"+
	"\t\t}\n"+
	"\t\tif (Hack.defaultParentNode) {\n"+
	"\t\t\tHack.defaultParentNode.addChild(this);\n"+
	"\t\t}\n"+
	"\t\treturn this;\n"+
	"\n"+
	"\t}).call(new Hack.MovingSprite(width, height));\n"+
	"};\n";

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
		Hack.monster[0] = makeMonster(1, 400, 154);
		Hack.monster[1] = makeMonster(1, 800, 154);
		Hack.monster[2] = makeMonster(1,1200, 154);
		Hack.monster[3] = makeMonster(1,1600, 154);
		Hack.monster[4] = makeMonster(1,2000, 154);
		Hack.monster[5] = makeMonster(1,2400, 154);
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
							// 3 second left...
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
			image: game.assets['enchantjs/monster' + (_number || 1) + '.gif'],
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
			if (Hack.defaultParentNode && item !== Hack.defaultParentNode) {
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