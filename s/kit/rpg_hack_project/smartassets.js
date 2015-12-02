window.addEventListener('load', function () {
	Hack.smartAsset.append({
		// Map tip
		image: 'img/mapTipIndex.jpg',
		query: 'toggle',
		caption: 'enchantjs/x2/dotmat.gif'
	}, {
		// Grassland Map
		image: 'enchantjs/x2/dotmat.gif',
		trim: { x: 0, y: 0, width: 32*4, height: 32*4 },
		query: 'embed',
		identifier: '<>',
		variables: ['map'],
		code: function () {
			// map
			Hack.maps['map'] = new RPGMap(32, 32);
			Hack.maps['map'].imagePath = 'enchantjs/x2/dotmat.gif';
			Hack.maps['map'].bmap.loadData([
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
			Hack.maps['map'].cmap = [
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
		}
	}, {
		// Cave Map
		image: 'enchantjs/x2/dotmat.gif',
		trim: { x: 10*32, y: 0, width: 32*4, height: 32*4 },
		query: 'embed',
		identifier: '<>',
		variables: ['map'],
		counters: [],
		code: function () {
			// map
			Hack.maps['map'] = new RPGMap(32, 32);
			Hack.maps['map'].imagePath = 'enchantjs/x2/dotmat.gif';
			Hack.maps['map'].bmap.loadData([
				[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],
				[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],
				[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],
				[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],
				[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],
				[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],
				[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],
				[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],
				[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],
				[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323]
			]);
			Hack.maps['map'].cmap = [
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
		}
	}, {
		// Iron Map
		image: 'enchantjs/x2/dotmat.gif',
		trim: { x: 10*32, y: 4*32, width: 32*4, height: 32*4 },
		query: 'embed',
		identifier: '<>',
		variables: ['map'],
		counters: [],
		code: function () {
			// map
			Hack.maps['map'] = new RPGMap(32, 32);
			Hack.maps['map'].imagePath = 'enchantjs/x2/dotmat.gif';
			Hack.maps['map'].bmap.loadData([
				[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],
				[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],
				[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],
				[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],
				[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],
				[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],
				[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],
				[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],
				[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],
				[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93]
			]);
			Hack.maps['map'].cmap = [
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
		}
	}, {
		// Down Stair
		image: 'enchantjs/x2/dotmat.gif',
		trim: { x: 2*32, y: 21*32, width: 32, height: 32 },
		query: 'embed',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// くだりかいだん
			var item = new MapObject('DownStair');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onplayerenter = function () {
				Hack.changeMap(Hack.maps.next);
			};
		}
	}, {
		// Warp
		image: 'enchantjs/x2/dotmat.gif',
		trim: { x: 4*32, y: 16*32, width: 32, height: 32 },
		query: 'embed',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// ワープゆか
			var item = new MapObject('Warp');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onplayerenter = function () {
				Hack.player.locate(11, 5);
			};
		}
	}, {
		// Empty Box
		image: 'enchantjs/x2/dotmat.gif',
		trim: { x: 2*32, y: 26*32, width: 32, height: 32 },
		query: 'embed',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// からのたからばこ
			var item = new MapObject('Box');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onattacked = function () {
				this.frame = MapObject.Dictionaly['OpenedBox'];
			};
		}
	}, {
		// Talking Woman
		image: 'enchantjs/x1.5/chara0.png',
		trim: { x: 4*48, y: 8, width: 48, height: 48 },
		query: 'embed',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// はなしをする 女の人
			var item = new Woman();
			item.locate(__cnt15, __cnt10, 'map1');
			item.onattacked = function () {
				Hack.log('こんにちは');
			};
		}
	}, {
		// Violent Slime
		image: 'enchantjs/monster4.gif',
		trim: { x: 2*48-4, y: 1*48, width: 48, height: 48 },
		query: 'embed',
		identifier: '()',
		variables: ['enemy'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// きょうぼうな スライム
			var enemy = new BlueSlime();
			enemy.locate(__cnt15, __cnt10, 'map1');
			enemy.onbecomeidle = function () {
				this.attack();
			};
		}
	}, {
		// Timid Insect
		image: 'enchantjs/monster1.gif',
		trim: { x: 2*48, y: 0*48, width: 48, height: 48 },
		query: 'embed',
		identifier: '()',
		variables: ['enemy'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// おくびょうな イモムシ
			var enemy = new Insect();
			enemy.locate(__cnt15, __cnt10, 'map1');
			enemy.onbecomeidle = function () {
				this.turn();
				this.walk();
			};
		}
	}, {
		// Boss Dragon
		image: 'enchantjs/bigmonster1.gif',
		trim: { x: 8, y: 2*80-2, width: 80, height: 80 },
		query: 'embed',
		identifier: '()',
		variables: ['enemy'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// ドラゴン（ラスボス）
			var enemy = new Dragon();
			enemy.hp = 10;
			enemy.locate(__cnt15, __cnt10, 'map1');
			enemy.onbecomedead = function () {
				Hack.gameclear();
			};
		}
	}, {
		// Thorns Trap
		image: 'enchantjs/x2/dotmat.gif',
		trim: { x: 0, y: 22*32, width: 32, height: 32 },
		query: 'embed',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// ふんだら ケガする トゲのワナ
			var item = new MapObject('Trap');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onplayerenter = function () {
				this.frame = MapObject.Dictionaly['UsedTrap'];
				Hack.Attack.call(this, this.mapX, this.mapY, 1);
			};
			item.onplayerexit = function () {
				this.frame = MapObject.Dictionaly['Trap'];
			};
		}
	}, {
		// Invisible Star
		image: 'enchantjs/x2/dotmat.gif',
		trim: { x: 6*32, y: 28*32, width: 32, height: 32 },
		query: 'embed',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// スター（むてき）
			var item = new MapObject('Star');
			item.locate(__cnt15, __cnt10, 'map1');
			// When enter... ふまれたら...
			item.onplayerenter = function () {
				var onattacked = Hack.player.onattacked;
				Hack.player.setTimeout(function () {
					Hack.player.onattacked = onattacked;
					Hack.player.opacity = 1;
				}, 100);
				Hack.player.onattacked = null;
				Hack.player.opacity = 0.5;
				this.destroy();
			};
		}
	}).setCounter({
		name: '__cnt15',
		table: shuffle(fill(0, 15))
	}, {
		name: '__cnt10',
		table: shuffle(fill(0, 10).concat([(Math.random()*10) >> 0])) // length=11
	});
	function shuffle(array) {
		var m = array.length, t, i;
		while (m) {
			i = Math.floor(Math.random() * m--);
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}
		return array;
	}
	function fill (start, end) {
		var array = [];
		for (var i = start; i < end; i++) {
			array.push(i);
		}
		return array;
	}
});