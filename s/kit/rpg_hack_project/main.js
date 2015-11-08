window.addEventListener('load', function(){

	var game = enchant.Core.instance;
	game.preload('enchantjs/monster4.gif', 'enchantjs/x2/map1.png', 'enchantjs/x1.5/chara5.png');

	Hack.onload = function () {
		Hack.maps = [];
		Hack.maps['floor'] = new RelationalMap(32, 32);
		Hack.maps['floor'].imagePath = 'enchantjs/x2/map1.png';
		Hack.maps['floor'].bmap.loadData([
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
		Hack.maps['floor'].cmap = [
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
		apad.onenterframe = function() {
			game.rootScene.addChild(this);
		};
		apad.on('touchstart', function(event) {
			game.dispatchEvent(new Event('abuttondown'));
		});
		game.rootScene.addChild(apad);
		Hack.apad = apad;
	});

	game.onload = function () {

        var map = Hack.maps['floor'];
        map.load();                 // Load map

        Hack.defaultParentNode = new Group();
        map.scene.addChild(Hack.defaultParentNode);

/*
        blueSlime = new BlueSlime('blueSlime'); // make blue slime
        map.scene.addChild(blueSlime);
        blueSlime.locate(9, 5);

        var stair = new Stair('stair');
        map.scene.addChild(stair);
        stair.locate(13, 5);
*/
        var player = new Player(); // make player
        Hack.defaultParentNode.addChild(player);
        player.locate(1, 5); // move position

    };

    var Player = enchant.Class(enchant.Sprite, {

		initialize: function () {
			Sprite.call(this, 48, 48);
			this.image = game.assets['enchantjs/x1.5/chara5.png'];
			this.frame = 1;
			this.imageOffset = { x: -8, y: -12 };
			this.walking = false;
		},
		locate: function (fromLeft, fromTop) {
			this.moveTo(
				fromLeft * 32 + this.imageOffset.x,
				fromTop * 32 + this.imageOffset.y);
		},
		walk: function (x, y) {
			this.walking = true;
			this.direction = Vec2Dir({ x: x, y: y });
			var dx = x * 8, dy = y * 8;
			this.tl.then(function () {
				this.frame = this.direction * 9;
			}).moveBy(dx, dy, 3).then(function () {
				this.frame = this.direction * 9 + 1;
			}).moveBy(dx, dy, 3).then(function () {
				this.frame = this.direction * 9 + 2;
			}).moveBy(dx, dy, 3).then(function () {
				this.frame = this.direction * 9 + 1;
				this.walking = false;
			}).moveBy(dx, dy, 3);
		},
		onenterframe: function () {
			if (!this.walking) {
				var hor = game.input.right - game.input.left;
				var ver = hor ? 0 : game.input.down - game.input.up;
				if (hor || ver) {
					this.walk(hor, ver);
				}
			}
		}

    });
/*
    var BlueSlime = enchant.Class(Behaviour, {
        initialize: function(_namae){
            Behaviour.call(this, {
                namae: _namae,
                image: path+'monster4.gif',
                width:48, height:48,
                dx: -8, dy: -10
            });
            this.width = this.height = 32;
            this.collider.y = 0;
            this.sprite.frame = [2, 2, 2, 3, 3, 3];
            this.hp = 3;
            this.behavior = BehaviorTypes.Idle;
            this.isPublic = false;
            this.useMessage = false;
        },
        damage : function(atk){
            if( this.behavior !== BehaviorTypes.Damaged &&
                this.behavior !== BehaviorTypes.Dead){
                this.hp -= atk;
                if(this.hp > 0){
                    this.behavior = BehaviorTypes.Damaged;
                    this.sprite.frame = [4, 4, 5, null];
                    this.tl.clear().delay(5).then(function(){
                        this.behavior = BehaviorTypes.Idle;
                        this.sprite.frame = [2, 2, 2, 3, 3, 3];
                    });
                }else{
                    this.behavior = BehaviorTypes.Dead;
                    this.sprite.frame = [5, 5, 5, 7, 7];
                    this.tl.clear().delay(5).then(function(){
                        this.destroy();
                    });
                }
            }
        }
    });

    var Stair = enchant.Class(Behaviour, {
        initialize: function(_namae){
            Behaviour.call(this, {
                namae: _namae,
                image: 'img/map1.gif',
                draw: 422
            });
            this.cleared = false;
            this.useMessage = false;
            this.collisionFlag = false; // no collision detection
        },
        onenterframe: function(){
            if(this.intersect(env.player)){
                if(!this.cleared){
                    this.cleared = true;
                    clear(__H4PENV__TOKEN);
                }
            }
        }
    });
*/
    /*
	 * rmap.js (RelationalMap)
	 * ある位置で他のマップとつながっている、切り替え可能なマップ
	 */
	var RelationalMap = function(tileWidth, tileHeight) {
		if (tileWidth === undefined) {tileWidth = 32;}
		if (tileHeight === undefined) {tileHeight = 32;}
		this.bmap = new Map(tileWidth, tileHeight); // 他のオブジェクトより奥に表示されるマップ
		this.fmap = new Map(tileWidth, tileHeight); // 他のオブジェクトより手前に表示されるマップ
		this.scene = new Group();					// マップ上に存在するオブジェクトをまとめるグループ
		// cmap=this.bmap.collisionData
		this.__defineSetter__('cmap', function(c){ this.bmap.collisionData = c; });
		this.__defineGetter__('cmap', function(){ return this.bmap.collisionData; });
		// image=this.bmap.image=this.fmap.image
		this.__defineSetter__('image', function(i){ this.bmap.image = this.fmap.image = i; });
		this.__defineGetter__('width', function(){ return this.bmap.width; }); // this.bmap.widthのシノニム
		this.__defineGetter__('height', function(){ return this.bmap.height; }); // this.bmap.heightのシノニム
		this.rels = []; // from, name, toで記述
		this.callback = function(){};
		this.checkTile = function(x, y, z){};
		this.hitTest = function(x, y){ return this.bmap.hitTest(x, y) || this.fmap.hitTest(x, y); };
		this.getRel = function(x, y){ var t; this.rels.forEach(function(r){ if((x==r.from.x)&&(y==r.from.y)){ t=r; } }); return t; };
		this.load = function(){
			if (this.imagePath) this.image = game.assets[this.imagePath];
			var a = function(n){ game.rootScene.addChild(n); };
			a(this.bmap); a(this.scene); a(this.fmap); Hack.map = this;
		};
	};
	function changeMap(rel){
		var next = maps[rel.name];
		if(next !== Hack.map){
			var f = function(n, m){ game.rootScene.insertBefore(n, m); game.rootScene.removeChild(m); };
			f(next.bmap, Hack.map.bmap);
			f(next.scene, Hack.map.scene);
			f(next.fmap, Hack.map.fmap);

			// next.scene.addChild(Hack.player);
			Hack.map = next;
		}
		// Hack.player.locate(rel.to.x, rel.to.y);
		next.callback();
	}

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

});
