require('enchantjs/enchant');
require('enchantjs/ui.enchant');
require('hackforplay/hack');

var game = enchant.Core.instance;
game.preload(['enchantjs/x2/map2.png', 'enchantjs/x1.5/chara0.png', 'enchantjs/monster1.gif', 'hackforplay/enchantbook.png']);

var binded_key = ' '.charCodeAt(0);
game.keybind(binded_key, 'a'); // aボタンはスペースキー

Hack.textarea.backgroundColor = 'rgba(0,20,40,0.5)';

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
	Hack.pressStartLabel = Hack.createLabel('Press o button to START<br>Press ↑ to JUMP ', {
		x: 120, y: 160, width: 400
	});

	// Pad UI via ui.enchant.js
	var pad = new Pad();
	pad.moveTo(0, 80);
	pad.onenterframe = function() {
		game.rootScene.addChild(this);
	};
	game.rootScene.addChild(pad);
	Hack.pad = pad;

	var apad = new APad();
	apad.moveTo(80, 60);
	apad.outside.scale(0.5, 0.5);
	apad.inside.visible = false;
	apad.onenterframe = function() {
		game.rootScene.addChild(this);
	};
	apad.on('touchstart', function(event) {
		game.dispatchEvent(new Event('abuttondown'));
	});
	game.rootScene.addChild(apad);
	Hack.apad = apad;
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
