window.addEventListener('load', function () {
	Hack.smartAsset.append({
		title: 'マップ の すうじ (enchantjs/x2/dotmat.gif)',
		image: 'img/mapTipIndex.jpg',
		query: 'toggle',
		media: 'img/mapTipIndex.jpg'
	}, {
		title: 'つぎのマップ（そうげん）',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { x: 0, y: 0, width: 32*4, height: 32*4 },
		query: 'embed',
		caption: 'そうげんのマップが ついかされる。「くだりかいだん」をつかうと、つぎのマップに いけるようになる。はな や じゅもく と、あいしょうがいい',
		identifier: '<>',
		counters: ['__cntMap'],
		code: function () {
			// map__cntMap
			Hack.maps['map__cntMap'] = new RPGMap(32, 32);
			Hack.maps['map__cntMap'].imagePath = 'enchantjs/x2/dotmat.gif';
			Hack.maps['map__cntMap'].bmap.loadData([
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
			Hack.maps['map__cntMap'].cmap = [
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
		title: 'つぎのマップ（どうくつ）',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { x: 10*32, y: 0, width: 32*4, height: 32*4 },
		query: 'embed',
		caption: 'どうくつのマップが ついかされる。「くだりかいだん」をつかうと、つぎのマップに いけるようになる。いわ や いしかべ と、あいしょうがいい',
		identifier: '<>',
		counters: ['__cntMap'],
		code: function () {
			// map__cntMap
			Hack.maps['map__cntMap'] = new RPGMap(32, 32);
			Hack.maps['map__cntMap'].imagePath = 'enchantjs/x2/dotmat.gif';
			Hack.maps['map__cntMap'].bmap.loadData([
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
			Hack.maps['map__cntMap'].cmap = [
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
		title: 'つぎのマップ（シルバー）',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { x: 10*32, y: 4*32, width: 32*4, height: 32*4 },
		query: 'embed',
		caption: 'どうくつのマップが ついかされる。「くだりかいだん」をつかうと、つぎのマップに いけるようになる。シンプルすぎて どうつかえばいいんだろう…',
		identifier: '<>',
		counters: ['__cntMap'],
		code: function () {
			// map__cntMap
			Hack.maps['map__cntMap'] = new RPGMap(32, 32);
			Hack.maps['map__cntMap'].imagePath = 'enchantjs/x2/dotmat.gif';
			Hack.maps['map__cntMap'].bmap.loadData([
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
			Hack.maps['map__cntMap'].cmap = [
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
		title: 'くだりかいだん',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { x: 2*32, y: 21*32, width: 32, height: 32 },
		query: 'embed',
		caption: 'つぎのマップに つながっている くだりせんようの かいだん。カイゾウすると、つぎのマップから つぎのつぎのマップに つなげることも…',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// かいだん
			var item = new MapObject('DownStair');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onplayerenter = function () {
				Hack.changeMap('map2');
			};
		}
	}, {
		title: 'ワープゾーン',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { x: 4*32, y: 16*32, width: 32, height: 32 },
		query: 'embed',
		caption: 'ふむとワープできる すごいゆか。あかいろや みどりいろも そんざいするという うわさ',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// ワープ
			var item = new MapObject('Warp');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onplayerenter = function () {
				Hack.player.locate(11, 5);
			};
		}
	}, {
		title: 'からばこ',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { x: 2*32, y: 26*32, width: 32, height: 32 },
		query: 'embed',
		caption: 'まえで こうげきすると かぱっとひらく (た)からばこ。なかに なにか いれられると いいんだけどね',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// たからばこ
			var item = new MapObject('Box');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onattacked = function () {
				this.frame = MapObject.Dictionaly['OpenedBox'];
			};
		}
	}, {
		title: 'ただのひと',
		image: 'enchantjs/x1.5/chara0.png',
		trim: { x: 4*48, y: 8, width: 48, height: 48 },
		query: 'embed',
		caption: 'まえで こうげきすると しゃべる ひと。ふだんは、うけつけのしごとを しているらしい。ずっと おなじセリフしか いえないのかな？',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// 女の人
			var item = new Woman();
			item.locate(__cnt15, __cnt10, 'map1');
			item.onattacked = function () {
				Hack.log('こんにちは');
			};
		}
	}, {
		title: 'バイオレンスライム',
		image: 'enchantjs/monster4.gif',
		trim: { x: 2*48-4, y: 1*48, width: 48, height: 48 },
		query: 'embed',
		caption: 'ムチのように からだをふりまわす、キケンなスライム。idle（まっている）→attack（こうげきする）→idle…を えいえんにくりかえすだけの あわれなそんざい',
		identifier: '()',
		variables: ['enemy'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// スライム
			var enemy = new BlueSlime();
			enemy.locate(__cnt15, __cnt10, 'map1');
			enemy.onbecomeidle = function () {
				this.attack();
			};
		}
	}, {
		title: 'よわインセクト',
		image: 'enchantjs/monster1.gif',
		trim: { x: 2*48, y: 0*48, width: 48, height: 48 },
		query: 'embed',
		caption: 'にげあしは おいらの とくぎなのさ。すばやく turn（ターン）して walk（あるく）のが ひけつさ',
		identifier: '()',
		variables: ['enemy'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// インセクト
			var enemy = new Insect();
			enemy.locate(__cnt15, __cnt10, 'map1');
			enemy.onbecomeidle = function () {
				this.turn();
				this.walk();
			};
		}
	}, {
		title: 'ゴールドラゴン',
		image: 'enchantjs/bigmonster1.gif',
		trim: { x: 8, y: 2*80-2, width: 80, height: 80 },
		query: 'embed',
		caption: 'ゴールドだけど あかいドラゴン。こいつをたおすと ゴールだよ なんつって',
		identifier: '()',
		variables: ['enemy'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// ドラゴン
			var enemy = new Dragon();
			enemy.hp = 10;
			enemy.locate(__cnt15, __cnt10, 'map1');
			enemy.onbecomedead = function () {
				Hack.gameclear();
			};
		}
	}, {
		title: 'ふむと いてっ！＞＜',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { x: 0, y: 22*32, width: 32, height: 32 },
		query: 'embed',
		caption: 'ふむとダメージをうける めいわくなゆか。でも たった１ダメージだね。カイゾウすると なんダメージにも できるらしい',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// トゲのワナ
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
		title: 'れいの アレ',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { x: 6*32, y: 28*32, width: 32, height: 32 },
		query: 'embed',
		caption: 'ひろってから ３びょうちょい むてきになれる アイテム。３びょうちょい＝１００フレーム？ これも、カイゾウできるらしい',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// スター（むてき）
			var item = new MapObject('Star');
			item.locate(__cnt15, __cnt10, 'map1');
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
	}, {
		title: 'のぼりかいだん',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { x: 2*32, y: 20*32, width: 32, height: 32 },
		query: 'embed',
		caption: 'まえのマップに つながっている のぼりせんようの かいだん。なかみは くだりかいだんと たいしてかわらない',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// かいだん
			var item = new MapObject('UpStair');
			item.locate(__cnt15, __cnt10, 'map2');
			item.onplayerenter = function () {
				Hack.changeMap('map1');
			};
		}
	}).setCounter({
		name: '__cnt15',
		table: shuffle(fill(0, 15))
	}, {
		name: '__cnt10',
		table: shuffle(fill(0, 10).concat([(Math.random()*10) >> 0])) // length=11
	}, {
		name: '__cntMap',
		table: fill(2, 100)
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