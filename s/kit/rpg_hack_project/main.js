window.addEventListener('load', function () {

	var game = enchant.Core.instance;
	game.preload('enchantjs/monster1.gif', 'enchantjs/monster2.gif', 'enchantjs/monster3.gif', 'enchantjs/monster4.gif', 'enchantjs/bigmonster1.gif', 'enchantjs/bigmonster2.gif', 'enchantjs/x2/map1.gif', 'enchantjs/x1.5/chara0.png', 'enchantjs/x1.5/chara5.png', 'hackforplay/enchantbook.png');
	game.keybind(' '.charCodeAt(0), 'a');

	Hack.onload = Hack.onload || function () {

		MapObject.Dictionaly = {
			'Warp': 324,		'WarpRed': 325,		'WarpGreen': 326,	'WarpYellow': 327,
			'Pot': 400,			'Rock': 401,		'UpStair': 402,
			'Box': 420,			'Flower': 421,		'DownStair': 422,
			'Trap': 440,		'UsedTrap': 441,	'Step': 442,
			'Castle': 500,		'Village': 501,		'Cave': 502,
			'Tree': 520,		'Table': 521,		'OpenedBox': 522
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
			if (next === undefined) {
				Hack.log(mapName + ' は、まだつくられていない');
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
			return item.mapX === x && item.mapY === y;
		}).forEach(function (item) {
			var e = new Event('attacked');
			e.attacker = this;
			e.damage = damage || 0;
			item.dispatchEvent(e);
		}, this);
	};

});
