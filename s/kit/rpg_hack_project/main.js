window.addEventListener('load', function(){

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
"\tinsect.locate(8, 5);\n"+
"\n"+
"\t// クモ\n"+
"\tvar spider = new Spider();\n"+
"\tspider.locate(7, 5);\n"+
"\n"+
"\t// コウモリ\n"+
"\tvar bat = new Bat();\n"+
"\tbat.locate(6, 5);\n"+
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
"\n"+
"\t// 女の子\n"+
"\tvar girl = new Girl();\n"+
"\tgirl.locate(6, 6);\n"+
"\n"+
"\t// 女の人\n"+
"\tvar woman = new Woman();\n"+
"\twoman.locate(7, 6);\n"+
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
"\t\t\n"+
"\t};\n"+
"\ttrap.onplayerleave = function () {\n"+
"\t\t\n"+
"\t\t// When leave... はなれたら\n"+
"\t\tthis.frame = MapObject.Dictionaly['Trap'];\n"+
"\t\t\n"+
"\t};\n"+
"\ttrap.onattacked = function (event) {\n"+
"\t\t\n"+
"\t\t// When attacked... こうげきされたら\n"+
"\t\tthis.moveBy(event.vecotr.x * 32, event.vector.y * 32);\n"+
"\t\t\n"+
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
"\t\t[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
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
"\t\t[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
"\t\t[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],\n"+
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

	var game = enchant.Core.instance;
	game.preload('enchantjs/monster1.gif', 'enchantjs/monster2.gif', 'enchantjs/monster3.gif', 'enchantjs/monster4.gif', 'enchantjs/bigmonster1.gif', 'enchantjs/bigmonster2.gif', 'enchantjs/x2/map1.gif', 'enchantjs/x1.5/chara0.png', 'enchantjs/x1.5/chara5.png', 'hackforplay/enchantbook.png');
	game.keybind(' '.charCodeAt(0), 'a');

	Hack.onload = Hack.onload || function () {

		MapObject.Dictionaly = {
			'Pot': 400,			'Rock': 401,		'UpStair': 402,
			'Box': 420,			'Flower': 421,		'DownStair': 422,
			'Trap': 440,		'UsedTrap': 441,	'Step': 442,
			'Castle': 500,		'Village': 501,		'Cave': 502,
			'Tree': 520,		'Table': 521
		};

		Hack.maps = [];
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

	};

	game.on('load', function() {
		var pad = new Pad();
		pad.moveTo(20, 200);
		pad.onenterframe = function() {
			game.rootScene.addChild(this);
		};
		game.rootScene.addChild(pad);
		Hack.pad = pad;

		var apad = new APad();
		apad.moveTo(100, 180);
		apad.outside.scale(0.5, 0.5);
		apad.inside.visible = false;
		apad.outside.buttonMode = 'a';
		apad.onenterframe = function() {
			game.rootScene.addChild(this);
		};
		game.rootScene.addChild(apad);
		Hack.apad = apad;

		// Enchant book
		Hack.enchantBookIcon = Hack.createSprite(64, 64, {
			image: game.assets['hackforplay/enchantbook.png'],
			defaultParentNode: Hack.menuGroup,
			ontouchend: function() {
				Hack.textarea.hide();
				Hack.openEditor();
			}
		});

		// Textarea
		Hack.textarea.moveTo(64, 0);
		Hack.textarea.width = 340;
		Hack.textarea.height = 32;
	});

	game.onload = game.onload || function () {

        var map = Hack.maps['room1'];
        map.load(); // Load Map;  Hack.defaultParentNode == map.scene

        var player = Hack.player = new Player();
        player.locate(1, 5);

    };

	var __BehaviorTypes = {
		Idle : 1,       // 立ち状態
		Walk : 2,       // 歩き状態
		Attack : 4,     // 攻撃状態
		Damaged : 8,    // 被撃状態
		Dead : 16       // 死亡状態
	};
	Object.defineProperty(window, 'BehaviorTypes', {
		get: function () { return __BehaviorTypes; }
	});

	var __RPGObject = enchant.Class(enchant.Sprite, {
		initialize: function (width, height, offsetX, offsetY) {
			Sprite.call(this, width, height);
			this.offset = { x: offsetX, y: offsetY };
			this.moveTo(game.width, game.height);
			Object.defineProperty(this, 'mapX', {
				get: function () { return (this.x - this.offset.x) / 32 >> 0; }
			});
			Object.defineProperty(this, 'mapY', {
				get: function () { return (this.y - this.offset.y) / 32 >> 0; }
			});
			this.collisionFlag = false;
			Hack.defaultParentNode.addChild(this);
		},
		locate: function (fromLeft, fromTop, mapName) {
			if (mapName) {
				this.destroy();
				Hack.maps[mapName].scene.addChild(this);
			}
			this.moveTo(
				fromLeft * 32 + this.offset.x,
				fromTop * 32 + this.offset.y);
		},
		destroy: function () {
			if (this.scene) this.scene.removeChild(this);
			if (this.parentNode) this.parentNode.removeChild(this);
		}
	});
	Object.defineProperty(window, 'RPGObject', {
		get: function () {
			return __RPGObject;
		}
	});

	var __Player = enchant.Class(RPGObject, {
		initialize: function () {
			RPGObject.call(this, 48, 48, -8, -12);
			this.image = game.assets['enchantjs/x1.5/chara5.png'];
			this.frame = 1;
			this.hp = 2;
			this.atk = 1;
			this.behavior = BehaviorTypes.Idle;
			this.enteredStack = [];
			var direction = 0;
			Object.defineProperty(this, 'direction', {
				get: function () { return direction; },
				set: function (value) {
					direction = value;
					this.frame = this.direction * 9 + (this.frame % 9);
				}
			});
		},
		onenterframe: function () {
			if (this.behavior === BehaviorTypes.Idle) {
				if (game.input.a) {
					this.attack();
				}
			}
			if (this.behavior === BehaviorTypes.Idle) {
				var hor = game.input.right - game.input.left;
				var ver = hor ? 0 : game.input.down - game.input.up;
				if (hor || ver) {
					// Turn
					this.direction = Vec2Dir({ x: hor, y: ver });
					this.frame = this.direction * 9 + 1;
					// Map Collision
					if ( !Hack.map.hitTest((this.mapX + hor) * 32, (this.mapY + ver) * 32) &&
						0 <= this.mapX + hor && this.mapX + hor < 15 && 0 <= this.mapY + ver && this.mapY + ver < 10) {
						// RPGObject(s) Collision
						if (RPGObject.collection.every(function (item) {
							return !item.collisionFlag || item.mapX !== this.mapX + hor || item.mapY !== this.mapY + ver;
						}, this)) {
							this.walk(hor, ver);
						}
					}
				}
			}
		},
		walk: function (x, y) {
			this.behavior = BehaviorTypes.Walk;
			var dx = x * 11, dy = y * 11; // 11 * 3 = 33. But move 32.
			var tx = this.x + x * 32, ty = this.y + y * 32;
			this.tl.then(function () {
				this.frame = this.direction * 9;
			}).moveBy(dx, dy, 4).then(function () {
				this.frame = this.direction * 9 + 1;
			}).moveBy(dx, dy, 4).then(function () {
				this.frame = this.direction * 9 + 2;
			}).moveBy(dx, dy, 4).then(function () {
				this.frame = this.direction * 9 + 1;
				this.behavior = BehaviorTypes.Idle;
				this.moveTo(tx, ty);
				// Dispatch playerleave Event
				this.enteredStack.forEach(function (item) {
					item.dispatchEvent(new Event('playerleave'));
				});
				this.enteredStack = [];
				// Dispatch playerenter Event
				RPGObject.collection.filter(function (item) {
					return item.mapX === this.mapX  && item.mapY === this.mapY;
				}, this).forEach(function (item) {
					item.dispatchEvent(new Event('playerenter'));
					this.enteredStack.push(item);
				}, this);
			});
		},
		attack: function () {
			this.behavior = BehaviorTypes.Attack;
			this.tl.then(function () {
				this.frame = this.direction * 9 + 6;
			}).delay(4).then(function () {
				this.frame = this.direction * 9 + 7;
				var v = Dir2Vec(this.direction);
				Attack.apply(this, [this.mapX + v.x, this.mapY + v.y, this.atk, v.x, v.y]);
			}).delay(4).then(function () {
				this.frame = this.direction * 9 + 8;
			}).delay(4).then(function () {
				this.frame = this.direction * 9 + 1;
				this.behavior = BehaviorTypes.Idle;
			});
		},
		onattacked: function (event) {
			if( (this.behavior & (BehaviorTypes.Damaged + BehaviorTypes.Dead)) === 0 ) {
                this.hp -= event.damage;
                if(this.hp > 0){
                    this.behavior += BehaviorTypes.Damaged;
					this.tl.clear().delay(1).hide().delay(3).show().delay(3).hide().delay(3).show().then(function () {
						this.behavior = BehaviorTypes.Idle;
					});
                }else{
					this.behavior = BehaviorTypes.Dead;
					this.tl.clear().fadeOut(10).then(function(){
						Hack.gameover();
					});
                }
            }
		}
	});
	Object.defineProperty(window, 'Player', {
		get: function () { return __Player; }
	});

	var __BlueSlime = enchant.Class(RPGObject, {
        initialize: function(){
			RPGObject.call(this, 48, 48, -8, -10);
			this.image = game.assets['enchantjs/monster4.gif'];
			this.frame = [2, 2, 2, 3, 3, 3];
			this.collisionFlag = true;
			this.hp = 3;
			this.behavior = BehaviorTypes.Idle;
        },
        onattacked: function(event){
			if( (this.behavior & (BehaviorTypes.Damaged + BehaviorTypes.Dead)) === 0 ) {
                this.hp -= event.damage;
                if(this.hp > 0){
                    this.behavior = BehaviorTypes.Damaged;
                    this.frame = [4, 4, 5, null];
                    this.tl.clear().delay(5).then(function(){
                        this.behavior = BehaviorTypes.Idle;
                        this.frame = [2, 2, 2, 3, 3, 3];
                    });
                }else{
                    this.behavior = BehaviorTypes.Dead;
                    this.frame = [5, 5, 5, 7, 7];
                    this.tl.clear().delay(5).then(function(){
                        this.destroy();
                    });
                }
            }
        }
    });
	Object.defineProperty(window, 'BlueSlime', {
		get: function () { return __BlueSlime; }
	});

	var __Insect = enchant.Class(RPGObject, {
        initialize: function(){
			RPGObject.call(this, 48, 48, -8, -16);
			this.image = game.assets['enchantjs/monster1.gif'];
			this.frame = [2, 2, 2, 3, 3, 3];
			this.collisionFlag = true;
			this.hp = 3;
			this.behavior = BehaviorTypes.Idle;
        },
        onattacked: function(event){
			if( (this.behavior & (BehaviorTypes.Damaged + BehaviorTypes.Dead)) === 0 ) {
                this.hp -= event.damage;
                if(this.hp > 0){
                    this.behavior = BehaviorTypes.Damaged;
                    this.frame = [4, 4, 5, null];
                    this.tl.clear().delay(5).then(function(){
                        this.behavior = BehaviorTypes.Idle;
                        this.frame = [2, 2, 2, 3, 3, 3];
                    });
                }else{
                    this.behavior = BehaviorTypes.Dead;
                    this.frame = [5, 5, 5, 7, 7];
                    this.tl.clear().delay(5).then(function(){
                        this.destroy();
                    });
                }
            }
        }
    });
	Object.defineProperty(window, 'Insect', {
		get: function () { return __Insect; }
	});

	var __Spider = enchant.Class(RPGObject, {
        initialize: function(){
			RPGObject.call(this, 64, 64, -16, -24);
			this.image = game.assets['enchantjs/monster2.gif'];
			this.frame = [2, 2, 2, 3, 3, 3];
			this.collisionFlag = true;
			this.hp = 3;
			this.behavior = BehaviorTypes.Idle;
        },
        onattacked: function(event){
			if( (this.behavior & (BehaviorTypes.Damaged + BehaviorTypes.Dead)) === 0 ) {
                this.hp -= event.damage;
                if(this.hp > 0){
                    this.behavior = BehaviorTypes.Damaged;
                    this.frame = [4, 4, 5, null];
                    this.tl.clear().delay(5).then(function(){
                        this.behavior = BehaviorTypes.Idle;
                        this.frame = [2, 2, 2, 3, 3, 3];
                    });
                }else{
                    this.behavior = BehaviorTypes.Dead;
                    this.frame = [5, 5, 5, 7, 7];
                    this.tl.clear().delay(5).then(function(){
                        this.destroy();
                    });
                }
            }
        }
    });
	Object.defineProperty(window, 'Spider', {
		get: function () { return __Spider; }
	});

	var __Bat = enchant.Class(RPGObject, {
        initialize: function(){
			RPGObject.call(this, 48, 48, -8, -18);
			this.image = game.assets['enchantjs/monster3.gif'];
			this.frame = [2, 2, 2, 3, 3, 3];
			this.collisionFlag = true;
			this.hp = 3;
			this.behavior = BehaviorTypes.Idle;
        },
        onattacked: function(event){
			if( (this.behavior & (BehaviorTypes.Damaged + BehaviorTypes.Dead)) === 0 ) {
                this.hp -= event.damage;
                if(this.hp > 0){
                    this.behavior = BehaviorTypes.Damaged;
                    this.frame = [4, 4, 5, null];
                    this.tl.clear().delay(5).then(function(){
                        this.behavior = BehaviorTypes.Idle;
                        this.frame = [2, 2, 2, 3, 3, 3];
                    });
                }else{
                    this.behavior = BehaviorTypes.Dead;
                    this.frame = [5, 5, 5, 7, 7];
                    this.tl.clear().delay(5).then(function(){
                        this.destroy();
                    });
                }
            }
        }
    });
	Object.defineProperty(window, 'Bat', {
		get: function () { return __Bat; }
	});

	var __Dragon = enchant.Class(RPGObject, {
        initialize: function(){
			RPGObject.call(this, 80, 80, -24, -42);
			this.image = game.assets['enchantjs/bigmonster1.gif'];
			this.frame = [2, 2, 2, 3, 3, 3];
			this.collisionFlag = true;
			this.hp = 4;
			this.behavior = BehaviorTypes.Idle;
        },
        onattacked: function(event){
			if( (this.behavior & (BehaviorTypes.Damaged + BehaviorTypes.Dead)) === 0 ) {
                this.hp -= event.damage;
                if(this.hp > 0){
                    this.behavior = BehaviorTypes.Damaged;
                    this.frame = [4, 4, 5, null];
                    this.tl.clear().delay(5).then(function(){
                        this.behavior = BehaviorTypes.Idle;
                        this.frame = [2, 2, 2, 3, 3, 3];
                    });
                }else{
                    this.behavior = BehaviorTypes.Dead;
                    this.frame = [5, 5, 5, 7, 7];
                    this.tl.clear().delay(5).then(function(){
                        this.destroy();
                    });
                }
            }
        }
    });
	Object.defineProperty(window, 'Dragon', {
		get: function () { return __Dragon; }
	});

	var __Minotaur = enchant.Class(RPGObject, {
        initialize: function(){
			RPGObject.call(this, 80, 80, -40, -48);
			this.image = game.assets['enchantjs/bigmonster2.gif'];
			this.frame = [8, 8, 8, 9, 9, 9];
			this.collisionFlag = true;
			this.hp = 4;
			this.behavior = BehaviorTypes.Idle;
        },
        onattacked: function(event){
			if( (this.behavior & (BehaviorTypes.Damaged + BehaviorTypes.Dead)) === 0 ) {
                this.hp -= event.damage;
                if(this.hp > 0){
                    this.behavior = BehaviorTypes.Damaged;
                    this.frame = [7, 7, 6, null];
                    this.tl.clear().delay(5).then(function(){
                        this.behavior = BehaviorTypes.Idle;
                        this.frame = [8, 8, 8, 9, 9, 9];
                    });
                }else{
                    this.behavior = BehaviorTypes.Dead;
                    this.frame = [7, 7, 7, 1, 0];
                    this.tl.clear().delay(5).then(function(){
                        this.destroy();
                    });
                }
            }
        }
    });
	Object.defineProperty(window, 'Minotaur', {
		get: function () { return __Minotaur; }
	});

	var __Boy = enchant.Class(RPGObject, {
        initialize: function(){
			RPGObject.call(this, 48, 48, -8, -18);
			this.image = game.assets['enchantjs/x1.5/chara0.png'];
			this.frame = 1;
			this.collisionFlag = true;
        }
    });
	Object.defineProperty(window, 'Boy', {
		get: function () { return __Boy; }
	});

	var __Girl = enchant.Class(RPGObject, {
        initialize: function(){
			RPGObject.call(this, 48, 48, -8, -18);
			this.image = game.assets['enchantjs/x1.5/chara0.png'];
			this.frame = 7;
			this.collisionFlag = true;
        }
    });
	Object.defineProperty(window, 'Girl', {
		get: function () { return __Girl; }
	});

	var __Woman = enchant.Class(RPGObject, {
        initialize: function(){
			RPGObject.call(this, 48, 48, -8, -18);
			this.image = game.assets['enchantjs/x1.5/chara0.png'];
			this.frame = 4;
			this.collisionFlag = true;
        }
    });
	Object.defineProperty(window, 'Woman', {
		get: function () { return __Woman; }
	});

    var __MapObject = enchant.Class(RPGObject, {
        initialize: function(frame){
            RPGObject.call(this, 32, 32, 0, 0);
            this.image = game.assets['enchantjs/x2/map1.gif'];
			if (typeof frame === 'number') {
				this.frame = frame;
			} else if (MapObject.Dictionaly && MapObject.Dictionaly[frame]) {
				this.frame = MapObject.Dictionaly[frame];
			}
        },
        onenterframe: function(){

        }
    });
    Object.defineProperty(window, 'MapObject', {
		get: function () { return __MapObject; }
    });

    /*
	 * RPGMap
	 * レイヤー化された切り替え可能なマップ
	 */
	var __RPGMap = enchant.Class(EventTarget, {
		initialize: function(tileWidth, tileHeight) {
			EventTarget.call(this);
			if (tileWidth === undefined) {tileWidth = 32;}
			if (tileHeight === undefined) {tileHeight = 32;}
			this.bmap = new Map(tileWidth, tileHeight); // 他のオブジェクトより奥に表示されるマップ
			this.fmap = new Map(tileWidth, tileHeight); // 他のオブジェクトより手前に表示されるマップ
			this.scene = new Group();					// マップ上に存在するオブジェクトをまとめるグループ
			// cmap==this.bmap.collisionData
			this.__defineSetter__('cmap', function(c){ this.bmap.collisionData = c; });
			this.__defineGetter__('cmap', function(){ return this.bmap.collisionData; });
			// image==this.bmap.image==this.fmap.image
			this.__defineSetter__('image', function(i){ this.bmap.image = this.fmap.image = i; });
			this.__defineGetter__('width', function(){ return this.bmap.width; }); // ==this.bmap.width
			this.__defineGetter__('height', function(){ return this.bmap.height; }); // ==this.bmap.height
			this.isLoaded = false;
		},
		load: function () {
			if (!this.image && this.imagePath) this.image = game.assets[this.imagePath];
			var a = function(n){ game.rootScene.addChild(n); };
			a(this.bmap); a(this.scene); a(this.fmap);
			Hack.map = this;
			Hack.defaultParentNode = this.scene;
			if (!this.isLoaded) {
				this.isLoaded = true;
				this.dispatchEvent(new Event('load'));
			}
			if (Hack.player) this.scene.addChild(Hack.player);
		},
		hitTest: function (x, y) {
			return this.bmap.hitTest(x, y) || this.fmap.hitTest(x, y);
		}
	});
	Object.defineProperty(window, 'RPGMap', {
		get: function () { return __RPGMap; }
	});

	Hack.changeMap = function (mapName){
		(function (current, next) {
			if(next && current !== next){
				var r = function(n){ game.rootScene.removeChild(n); };
				r(Hack.map.bmap);
				r(Hack.map.scene);
				r(Hack.map.fmap);
				next.load();
				current.dispatchEvent(new Event('leavemap'));
				next.dispatchEvent(new Event('entermap'));
			}
		})(Hack.map, Hack.maps[mapName]);

	};

	/*  Dir2Vec
		directionをforwardに変換する。 0/down, 1/left, 2/right, 3/up
	*/
	function Dir2Vec (dir) {
		switch(dir){
			case 0: return { x: 0, y: 1 };
			case 1: return { x:-1, y: 0 };
			case 2: return { x: 1, y: 0 };
			case 3: return { x: 0, y:-1 };
			default: return null;
		}
	}
	/*  Vec2Dir
		forwardをdirectionに変換する。およそのベクトルをまるめて近い向きに直す
	*/
	function Vec2Dir (vec) {
		if(vec.x === undefined || vec.y === undefined){ return null; }
		if(vec.x === 0 && vec.y === 0){ return null; }
		var deg = Math.atan2(vec.y, vec.x) / Math.PI * 180;
		if(-135 <= deg && deg <= -45){ return 3; } // up
		if( -45 <= deg && deg <=  45){ return 2; } // right
		if(  45 <= deg && deg <= 135){ return 0; } // down
		return 1; // left
	}

	function Attack (x, y, damage, pushX, pushY) {
		RPGObject.collection.filter(function (item) {
			return item.mapX === x && item.mapY === y;
		}).forEach(function (item) {
			var e = new Event('attacked');
			e.attacker = this;
			e.damage = damage || 0;
			item.dispatchEvent(e);
		}, this);
	}

});
