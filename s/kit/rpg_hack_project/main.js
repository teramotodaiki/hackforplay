window.addEventListener('load', function () {

	var game = enchant.Core.instance;
	game.preload('enchantjs/monster1.gif', 'enchantjs/monster2.gif', 'enchantjs/monster3.gif', 'enchantjs/monster4.gif', 'enchantjs/bigmonster1.gif', 'enchantjs/bigmonster2.gif', 'enchantjs/x2/map1.gif', 'enchantjs/x2/dotmat.gif', 'enchantjs/x1.5/chara0.png', 'enchantjs/x1.5/chara5.png', 'hackforplay/enchantbook.png', 'enchantjs/icon0.png', 'enchantjs/x2/effect0.png');
	game.keybind(' '.charCodeAt(0), 'a');

	Hack.onload = Hack.onload || function () {

		Hack.maps = {};
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

	};

	Hack.on('load', function() {
		// Appending to Hack.maps
		if (Hack.maps && !Hack.maps['next']) {
			Object.defineProperty(Hack.maps, 'next', {
				get: function () {
					var next = null;
					Object.keys(Hack.maps).reduce(function (previousKey, currentKey, index) {
						next = Hack.map === Hack.maps[previousKey] ? currentKey : next;
					});
					return next;
				}
			});
		}
		if (Hack.maps && !Hack.maps['current']) {
			Object.defineProperty(Hack.maps, 'current', {
				get: function () {
					var current = null;
					Object.keys(Hack.maps).forEach(function (key) {
						current = Hack.map === Hack.maps[key] ? key : current;
					});
					return current;
				}
			});
		}
		if (Hack.maps && !Hack.maps['previous']) {
			Object.defineProperty(Hack.maps, 'previous', {
				get: function () {
					var previous = null;
					Object.keys(Hack.maps).reduceRight(function (previousKey, currentKey) {
						previous = Hack.map === Hack.maps[previousKey] ? currentKey : previous;
					});
					return previous;
				}
			});
		}

		// 互換性維持
		(function () {
			MapObject.dictionary = MapObject.dictionary || {};
			Array.prototype.filter.call(arguments, function (dictionary) {
				return typeof dictionary === 'object';
			}).forEach(function (dictionary) {
				Object.keys(dictionary).filter(function (key) {
					return !MapObject.dictionary.hasOwnProperty(key);
				}).forEach(function (key) {
					MapObject.dictionary[key] = dictionary[key];
				});
			});
		})(
		// 旧仕様ユーザー定義
		MapObject.Dictionaly,
		// 新仕様公式定義
		{
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
		});
	});

	game.on('load', function() {
		var pad = new Pad();
		pad.moveTo(20, 200);
		pad.onenterframe = function() {
			game.rootScene.addChild(this);
		};
		game.rootScene.addChild(pad);
		Hack.pad = pad;

		var apad = new APad();
		apad.moveTo(350, 200);
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

		// Life label
		Hack.lifeLabel = (function () {
			var maxhp, hp;
			maxhp = hp = this.life = Hack.player.hp;
			Object.defineProperty(Hack.player, 'hp', {
				enumerable : true,
				get: function () {
					return hp;
				},
				set: function (value) {
					maxhp = Math.max(maxhp, value);
					hp = value;
					Hack.lifeLabel.life = maxhp < Hack.lifeLabel._maxlife ? hp : (hp / maxhp) * Hack.lifeLabel._maxlife;
				}
			});
			Hack.menuGroup.addChild(this);
			return this;

		}).call(new LifeLabel(10, 72, 9));

		Hack.scoreLabel = (function (self, source) {
			Object.keys(source).filter(function(key) {
				var desc = Object.getOwnPropertyDescriptor(source, key);
				return desc !== undefined && desc.enumerable;
			}).forEach(function (key) {
				self[key] = source[key];
			});
			Hack.menuGroup.addChild(self);
			return self;
		})(new ScoreLabel(10, 88), Hack.scoreLabel);
	});

	game.onload = game.onload || function () {

        var map = Hack.maps['map1'];
        map.load(); // Load Map;  Hack.defaultParentNode == map.scene

        var player = Hack.player = new Player();
        player.locate(1, 5);

    };

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
			return this.bmap.hitTest(x, y);
		}
	});
	Object.defineProperty(window, 'RPGMap', {
		get: function () { return __RPGMap; }
	});

	Hack.changeMap = function (mapName){
		(function (current, next) {
			if (next === undefined) {
				switch (typeof mapName) {
					case 'string': Hack.log(mapName + ' は、まだつくられていない'); break;
					case 'object': Hack.log('まだ マップが つくられていないようだ'); break;
					case 'number': Hack.log(mapName + ' ではなく \'map' + mapName + '\' ではありませんか？'); break;
					default: Hack.log('Hack.changeMap(\'map2\'); の ように かいてみよう'); break;
				}
			} else if (current !== next) {
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
	Hack.Dir2Vec = function (dir) {
		switch(dir){
			case 0: return { x: 0, y: 1 };
			case 1: return { x:-1, y: 0 };
			case 2: return { x: 1, y: 0 };
			case 3: return { x: 0, y:-1 };
			default: return null;
		}
	};
	/*  Vec2Dir
		forwardをdirectionに変換する。およそのベクトルをまるめて近い向きに直す
	*/
	Hack.Vec2Dir = function (vec) {
		if(vec.x === undefined || vec.y === undefined){ return null; }
		if(vec.x === 0 && vec.y === 0){ return null; }
		var deg = Math.atan2(vec.y, vec.x) / Math.PI * 180;
		if(-135 <= deg && deg <= -45){ return 3; } // up
		if( -45 <= deg && deg <=  45){ return 2; } // right
		if(  45 <= deg && deg <= 135){ return 0; } // down
		return 1; // left
	};

	Hack.Attack = function (x, y, damage, pushX, pushY) {
		RPGObject.collection.filter(function (item) {
			return item.mapX === x && item.mapY === y && item !== this;
		}, this).forEach(function (item) {
			var e = new Event('attacked');
			e.attacker = this;
			e.damage = damage || 0;
			item.dispatchEvent(e);
		}, this);
	};

	/**
	 * Hack.score
	 * Generic scoring property
	 * Invoke Hack.onscorechange
	*/
	Object.defineProperty(Hack, 'score', {
		enumerable: true, configurable: false,
		get: function () {
			return Hack.scoreLabel.score;
		},
		set: function (value) {
			if (Hack.scoreLabel.score !== value) {
				var e = new Event('scorechange');
				e.score = Hack.scoreLabel.score = value;
				Hack.dispatchEvent(e);
			}
		}
	});
	Hack.scoreLabel = Object.create(null); // 仮オブジェクト
	Hack.score = 0; // Fire a event and Initialize score

	/* Timeline Extention
	 * become(type[, time])
	 * time フレームが経過した時、behavior typeを指定する
	*/
	enchant.Timeline.prototype.become = function (type, time) {
        this.add(new enchant.Action({
            onactionstart: function() {
				var capital = type[0].toUpperCase() + type.substr(1).toLowerCase();
				if (this instanceof RPGObject && BehaviorTypes.hasOwnProperty(capital)) {
					this.behavior = BehaviorTypes[capital];
				}
            },
            time: time || 0
        }));
		return this;
	};

	/* random
	 * Random value between min to max (Detection type)
	 * (int, int) ===> int
	 * (float, int|float) ====> float
	 * (value, value) ====> value ~ value
	 * (value) ====> 0 ~ value
	 * (Array) ====> value in Array
	 * () ====> 0 ~ 1
	*/
	window.random = window.random || function (min, max) {
		if (arguments.length === 0) return Math.random();
		if (min instanceof Array) {
			var keys = Object.keys(min);
			return min[keys[random(keys.length)]];
		}
		var _min = arguments.length >= 2 ? Math.min(min, max) : 0;
		var _sub = arguments.length >= 2 ? Math.max(min, max) - _min : min;
		if (min % 1 === 0 && (max === undefined || max % 1 === 0)) {
			return _min + Math.random() * _sub >> 0; // integer
		} else {
			return _min + Math.random() * _sub;
		}
	};

});
