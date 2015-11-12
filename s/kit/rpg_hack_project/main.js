window.addEventListener('load', function(){

	var game = enchant.Core.instance;
	game.preload('enchantjs/monster1.gif', 'enchantjs/monster2.gif', 'enchantjs/monster3.gif', 'enchantjs/monster4.gif', 'enchantjs/x2/map1.gif', 'enchantjs/x1.5/chara5.png', 'hackforplay/enchantbook.png');
	game.keybind(' '.charCodeAt(0), 'a');

	Hack.onload = function () {

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
			[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
			[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
			[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
			[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
			[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
			[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
			[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
			[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
			[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
			[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1]
		]);
		Hack.maps['room1'].cmap = [
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
		];
		Hack.maps['room2'] = new RPGMap(32, 32);
		Hack.maps['room2'].imagePath = 'enchantjs/x2/map1.gif';
		Hack.maps['room2'].bmap.loadData([
			[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
			[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
			[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
			[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
			[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
			[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
			[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
			[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
			[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
			[ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
		]);
		Hack.maps['room2'].cmap = [
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
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

	game.onload = function () {

        var map = Hack.maps['room1'];
        map.load(); // Load Map;  Hack.defaultParentNode == map.scene

        var blueSlime = new BlueSlime();
        blueSlime.locate(9, 5);

        var insect = new Insect();
        insect.locate(8, 5);

        var spider = new Spider();
        spider.locate(7, 5);

        var stair = new MapObject('UpStair');
        stair.locate(1, 7);
        stair.onplayerenter = function () {
			Hack.changeMap('room2');
		};

		var trap = new MapObject('Trap');
		trap.locate(2, 5);
		trap.onplayerenter = function () {
			this.frame = MapObject.Dictionaly['UsedTrap'];
		};
		trap.onplayerleave = function () {
			this.frame = MapObject.Dictionaly['Trap'];
		};
		trap.onattacked = function (event) {
		};

        var player = Hack.player = new Player();
        player.locate(1, 5);

        Hack.maps['room2'].onload = function () {
			var stair2 = new MapObject('DownStair');
			stair2.locate(1, 7);
			stair2.onplayerenter = function () {
				Hack.changeMap('room1');
			};
        };

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
			this.direction = 0;
			this.hp = 2;
			this.atk = 1;
			this.behavior = BehaviorTypes.Idle;
			this.enteredStack = [];
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
		onattacked: function (atk) {
			if( (this.behavior & (BehaviorTypes.Damaged + BehaviorTypes.Dead)) === 0 ) {
                this.hp -= atk;
                if(this.hp > 0){
                    this.behavior += BehaviorTypes.Damaged;
					this.tl.clear().hide().delay(3).show().delay(3).hide().delay(3).show().then(function () {
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
