window.addEventListener('load', function() {

	var game = enchant.Core.instance;
	game.preload(['img/map2.png', 'img/monster1.gif', 'img/monster2.gif', 'img/monster3.gif', 'img/monster4.gif']);

	var binded_key = ' '.charCodeAt(0);
	game.keybind(binded_key, 'a'); // aボタンはスペースキー

	Hack.textarea.backgroundColor = 'rgba(0,20,40,0.5)';

	// ===>

	function makeMonster (_number, _x, _y) {
		var monster = Hack.createMovingSprite(48, 48, {
			x: _x, y: _y, image: game.assets['img/monster' + _number + '.gif'],
			frame: [2, 2, 2, 3, 3, 3],
			useGravity: true, useGround: true, footHeight: 32
		});
		return monster;
	}

	game.onload = function() {

		Hack.defaultParentNode = new enchant.Group(); // prepear to scroll

		Hack.backgroundImage = [];
		for (var i = 0; i < 16; i++) {
			Hack.backgroundImage[i] = new enchant.Map(32, 32);
			Hack.backgroundImage[i].image = game.assets['img/map2.png'];
			Hack.backgroundImage[i].loadData([
				[22],[21],[20],[19],[18],[18],[0],[1],[1],[1]
			]);
			Hack.backgroundImage[i].x = i * 32;
			Hack.defaultParentNode.addChild(Hack.backgroundImage[i]);
		}

		Hack.player = Hack.createMovingSprite(48, 48, {
			x: 64, y: 160, scaleX: -1,
			image: game.assets['img/monster4.gif'],
			frame: [4, 4, 4, 3, 3, 3, 4, 4, 4, 5, 5, 5],
			useGravity: true, useGround: true, footHeight: 32
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

		// scroll
		Hack.defaultParentNode.x = - (Hack.player.x - 64);
		Hack.backgroundImage.forEach(function(item) {
			if (item.x + item.parentNode.x <= -32) {
				item.x += game.width + 32;
			}
		});

		//damage
		if (!Hack.player.isDamaged) {
			Hack.monster.forEach(function(enemy) {
				if (Hack.player.intersect(enemy)) {
					// ouch!!
					Hack.player.hp--;
					Hack.player.isDamaged = true; // damaged flag

					if (Hack.player.hp <= 0) {
						Hack.gameover();
					} else {
						var saveFrame = Hack.player._originalFrameSequence;
						Hack.player.frame = [-1, -1, 3, 3];

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