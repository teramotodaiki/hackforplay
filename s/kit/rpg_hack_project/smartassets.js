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
		caption: 'そうげんのマップが ついかされる。「くだりかいだん」をつかうと、つぎのマップに いけるようになる。はな や き と、あいしょうがいい',
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
		trim: { frame: 422, width: 32, height: 32 },
		query: 'embed',
		caption: 'つぎのマップに つながっている くだりせんようの かいだん。カイゾウすると、つぎのマップから つぎのつぎのマップに つなげることも…',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// かいだん
			var item = new MapObject('downStair');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onplayerenter = function () {
				Hack.changeMap('map2');
			};
		}
	}, {
		title: 'ワープゾーン',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 324, width: 32, height: 32 },
		query: 'embed',
		caption: 'ふむとワープできる すごいゆか。あかいろや みどりいろも そんざいするという うわさ',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// ワープ
			var item = new MapObject('warp');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onplayerenter = function () {
				Hack.player.locate(11, 5);
			};
		}
	}, {
		title: 'ゴールちてん',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 500, width: 32, height: 32 },
		query: 'embed',
		caption: 'あなたのかえりを まちわびている おしろ。ここへ たどりつくと ゲームクリアになる',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// ゴール
			var item = new MapObject('castle');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onplayerenter = function () {
				// ゲームクリア
				Hack.gameclear();
				Hack.player.destroy();
				Hack.log('ゲームクリアです。おめでとう！');
			};
		}
	}, {
		title: 'からばこ',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 522, width: 32, height: 32 },
		query: 'embed',
		caption: 'まえで こうげきすると かぱっとひらく (た)からばこ。なかに なにか いれられると いいんだけどね',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// たからばこ
			var item = new MapObject('box');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onattacked = function () {
				this.frame = MapObject.dictionary.openedBox;
			};
		}
	}, {
		title: 'おはなばたけ',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 421, width: 32, height: 32 },
		query: 'embed',
		caption: 'まえで こうげきすると ちってしまう はかないはな。うえを あるくことができる',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// はな
			var item = new MapObject('flower');
			item.locate(__cnt15, __cnt10, 'map1');
			item.collisionFlag = false;
			item.onattacked = function () {
				this.destroy();
			};
		}
	}, {
		title: 'キ',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 520, width: 32, height: 32 },
		query: 'embed',
		caption: 'まえで こうげきすると あっけなく おれてしまう キ。うえをあるくことは でキない',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// き
			var item = new MapObject('tree');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onattacked = function () {
				this.destroy();
			};
		}
	}, {
		title: 'みためだけでかいわ',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 401, width: 32, height: 32 },
		query: 'embed',
		caption: '２ばいのおおきさ',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// いわ
			var item = new MapObject('rock');
			item.locate(__cnt15, __cnt10, 'map1');
			item.scale(2, 2);
		}
	}, {
		title: 'いわかんのあるかべ',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 340, width: 32, height: 32 },
		query: 'embed',
		caption: 'むこうがわが すけてみえる ふしぎなかべ。 opacity （オパシティ）を ０ にすると きえてしまう',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// いわかべ
			var item = new MapObject('clayWall');
			item.locate(__cnt15, __cnt10, 'map1');
			item.opacity = 0.5;
		}
	}, {
		title: 'いしをもつかべ',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 341, width: 32, height: 32 },
		query: 'embed',
		caption: 'まえで こうげきすると しゃべる ふしぎなかべ。いっせつによると おおむかしの ざいにんが とじこめられている とか',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// いしかべ
			var item = new MapObject('stoneWall');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onattacked = function () {
				Hack.log('どうだ　おれさまは　かたいだろう！');
			};
		}
	}, {
		title: 'ただのひと',
		image: 'enchantjs/x1.5/chara0.png',
		trim: { x: 4*48, y: 8, width: 48, height: 48 },
		query: 'embed',
		caption: 'しゃべる ひと。ふだんは、うけつけのしごとを しているらしい。ずっと おなじセリフしか いえないのかな？',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// 女の人
			var item = new Woman();
			item.locate(__cnt15, __cnt10, 'map1');
			item.oncollided = function () {
				Hack.log('こんにちは。ここは 1F です');
			};
		}
	}, {
		title: 'アントレプレナー',
		image: 'enchantjs/x1.5/chara0.png',
		trim: { x: 1*48, y: 8, width: 48, height: 48 },
		query: 'embed',
		caption: 'ひたすら はしりつづける おとこのこ。めざしているところは じぶんでも よくわかっていない',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// おとこのこ
			var item = new Boy();
			item.locate(__cnt15, __cnt10, 'map1');
			item.onbecomeidle = function () {
				this.walk();
			};
			item.oncollided = function () {
				this.turn();
				this.walk();
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
		trim: { frame: 2, width: 48, height: 48 },
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
		title: 'バット',
		image: 'enchantjs/monster3.gif',
		trim: { frame: 2, width: 48, height: 48 },
		query: 'embed',
		caption: '',
		identifier: '()',
		variables: ['enemy'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// コウモリ
			var enemy = new Bat();
			enemy.locate(__cnt15, __cnt10, 'map1');
			enemy.onbecomeidle = function () {
				var target = Hack.player;
				var moveX = 32 * Math.sign(target.mapX - this.mapX);
				var moveY = 32 * Math.sign(target.mapY - this.mapY);
				this.direction = moveX;
				this.tl.become('walk').moveBy(moveX, moveY, 30).then(function () {
					Hack.Attack.call(this, this.mapX, this.mapY, this.atk);
				}).become('attack', 20).become('idle');
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
		trim: { frame: 440, width: 32, height: 32 },
		query: 'embed',
		caption: 'ふむとダメージをうける めいわくなゆか。でも たった１ダメージだね。カイゾウすると なんダメージにも できるらしい',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// トゲのワナ
			var item = new MapObject('trap');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onplayerenter = function () {
				this.frame = MapObject.dictionary.usedTrap;
				Hack.Attack.call(this, this.mapX, this.mapY, 1);
			};
			item.onplayerexit = function () {
				this.frame = MapObject.dictionary.trap;
			};
		}
	}, {
		title: 'タタリ',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 564, width: 32, height: 32 },
		query: 'embed',
		caption: 'ぜったいに ふんづけたり こうげきしたり してはいけない。ぜったいにだ',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// ドクロ
			var item = new MapObject('skull');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onplayerenter = function () {
				Hack.player.behavior = BehaviorTypes.Dead;
			};
			item.onattacked = function () {
				Hack.player.behavior = BehaviorTypes.Dead;
			};
		}
	}, {
		title: 'れいの アレ',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 566, width: 32, height: 32 },
		query: 'embed',
		caption: 'ひろってから ３びょうちょい むてきになれる アイテム。３びょうちょい＝１００フレーム？ これも、カイゾウできるらしい',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// スター（むてき）
			var item = new MapObject('star');
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
		title: 'ハート',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 563, width: 32, height: 32 },
		query: 'embed',
		caption: 'ライフを かいふくする うれしいアイテム！ += にすると プラスされる。ところで -= にすると どうなるのだろうか',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// ハート
			var item = new MapObject('heart');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onplayerenter = function () {
				Hack.player.hp += 1;
				this.destroy();
			};
		}
	}, {
		title: 'のぼりかいだん',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 402, width: 32, height: 32 },
		query: 'embed',
		caption: 'まえのマップに つながっている のぼりせんようの かいだん。なかみは くだりかいだんと たいしてかわらない',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// かいだん
			var item = new MapObject('upStair');
			item.locate(__cnt15, __cnt10, 'map2');
			item.onplayerenter = function () {
				Hack.changeMap('map1');
			};
		}
	}).setCounter({
		name: '__cnt15',
		table: [7].concat(shuffle([0,1,2,3,4,5,6,8,9,10,11,12,13,14]))
	}, {
		name: '__cnt10',
		table: [5].concat(shuffle([0,1,2,3,4,6,7,8,9].concat([(Math.random()*10) >> 0]))) // length=11
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