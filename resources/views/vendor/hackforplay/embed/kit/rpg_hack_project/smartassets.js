// Module check
(function (mod) {
	if (typeof define === "function" && define.amd) {
		define(['../../modules/enchant','../../modules/ui.enchant','../../modules/hack'], mod);
	} else {
		window.addEventListener('load', mod);
	}
})(function () {
	Hack.smartAsset.append({
		id: 1,
		title: 'マップ の すうじ (enchantjs/x2/dotmat.gif)',
		image: 'img/mapTipIndex.jpg',
		query: 'toggle',
		media: 'img/mapTipIndex.jpg'
	}, {
		id: 2,
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
			Hack.maps['map__cntMap'].type = 'grassland';
		}
	}, {
		id: 3,
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
			Hack.maps['map__cntMap'].type = 'claySoil';
		}
	}, {
		id: 4,
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
			Hack.maps['map__cntMap'].type = 'flatGray';
		}
	}, {
		id: 5,
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
			item.layer = RPGMap.Layer.Under;
			item.onplayerenter = function () {
				Hack.changeMap('map2');
			};
		}
	}, {
		id: 6,
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
			item.layer = RPGMap.Layer.Under;
			item.onplayerenter = function () {
				Hack.player.locate(11, 5);
			};
		}
	}, {
		id: 7,
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
		id: 8,
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
			item.layer = RPGMap.Layer.Under;
			item.collisionFlag = false;
			item.onattacked = function () {
				this.destroy();
			};
		}
	}, {
		id: 9,
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
			item.hp = 1;
		}
	}, {
		id: 10,
		title: 'バクダンいわ',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 401, width: 32, height: 32 },
		query: 'embed',
		caption: 'しげきを あたえると ばくはつするぞ！おすなよ ぜったいに おすなよ！',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// いわ
			var item = new MapObject('rock');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onattacked = function () {
				// ばくえん
				var effect = new Effect(0, -1, 40);
				effect.locate(this.mapX, this.mapY);
				effect.collisionFlag = false;
				effect.scale(2, 2);
				effect.ontriggerenter = function (event) {
					Hack.Attack.call(this, event.mapX, event.mapY, 99);
				};
				this.destroy();
			};
		}
	}, {
		id: 11,
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
		id: 12,
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
		id: 13,
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
				delete item.onattacked;
				this.name = 'openedBox';
				// 出てくるもの　→
			};
		}
	}, {
		id: 14,
		title: 'ふしぎなツボ',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 400, width: 32, height: 32 },
		query: 'embed',
		caption: 'ランダムなアイテムがでてくる ふしぎなツボ。なんでも だせる という ウワサ',
		identifier: '()',
		variables: ['item', 'effect'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// ツボ
			var item = new MapObject('pot');
			item.locate(__cnt15, __cnt10, 'map1');
			var effect;
			item.onattacked = function () {
				// ランダムなアイテムをだす
				var name = random(['diamond', 'sapphire', 'ruby']);
				effect = new MapObject(name);
				effect.locate(this.mapX, this.mapY);
				effect.onplayerenter = function () {
					this.velocity(0, -8);
					this.force(0, 0.8);
					this.destroy(16);
				};
				this.destroy();
			};
		}
	}, {
		id: 15,
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
		id: 16,
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
		id: 17,
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
			enemy.onbecomedead = function () {
				Hack.score += 1;
			};
		}
	}, {
		id: 18,
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
			enemy.onbecomedead = function () {
				Hack.score += 1;
			};
		}
	}, {
		id: 19,
		title: 'じごくからのツカイ',
		image: 'enchantjs/monster3.gif',
		trim: { frame: 2, width: 48, height: 48 },
		query: 'embed',
		caption: 'ねらいをつけて おそってくる おそろしいコウモリ。 target に、むかってくる らしい',
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
			enemy.onbecomedead = function () {
				Hack.score += 1;
			};
		}
	}, {
		id: 20,
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
			item.layer = RPGMap.Layer.Under;
			item.onplayerenter = function () {
				this.name = 'usedTrap';
				Hack.player.hp -= 1;
				Hack.player.damageTime = 30;
			};
			item.onplayerexit = function () {
				this.name = 'trap';
			};
		}
	}, {
		id: 21,
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
		id: 22,
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
				Hack.player.hp = 0;
			};
			item.onattacked = function (event) {
				event.attacker.hp = 0;
			};
		}
	}, {
		id: 22,
		title: 'チャリンチャリン',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 565, width: 32, height: 32 },
		query: 'embed',
		caption: 'がめんを はねまわる コイン。',
		identifier: '()',
		variables: ['effect'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// コイン
			var effect = new MapObject('coin');
			effect.locate(__cnt15, __cnt10, 'map1');
			effect.velocity(1, 0);
			effect.force(0, 0.5);
			effect.ontriggerenter = function () {
				this.destroy();
				Hack.score += 1;
			};
		}
	}, {
		id: 23,
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
		id: 24,
		title: 'ふしぎなかぎ',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 567, width: 32, height: 32 },
		query: 'embed',
		caption: 'いつも ちがうところに でてくる ふしぎなかぎ。なにかと くみあわせて つかえそうだ',
		identifier: '()',
		variables: ['item'],
		code: function () {
			// かぎ
			var item = new MapObject('key');
			item.locate(random(0, 15), random(0, 10), 'map1');
			item.onplayerenter = function () {
				Hack.log('カチャリ という おと が きこえた');
				this.destroy();
			};
		}
	}, {
		id: 25,
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
			item.layer = RPGMap.Layer.Under;
			item.onplayerenter = function () {
				Hack.changeMap('map1');
			};
		}
	}, {
		id: 26,
		title: 'じげんばくだん',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 580, width: 32, height: 32 },
		query: 'embed',
		caption: 'じげんしき ばくだん と たちのぼる ばくはつの エフェクト。じかん を ちょうせい できる',
		identifier: '()',
		variables: ['item', 'effect'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// ボム
			var item = new MapObject('bomb');
			item.locate(__cnt15, __cnt10, 'map1');
			item.time = 3.0;
			item.setTimeout(function () {
				// ばくえん
				var effect = new Effect(0, -1, 40);
				effect.locate(this.mapX, this.mapY);
				effect.collisionFlag = false;
				effect.scale(2, 2);
				effect.ontriggerenter = function (event) {
					Hack.Attack.call(this, event.mapX, event.mapY, 99);
				};
				this.destroy();
			}, item.time * game.fps);
		}
	}, {
		id: 27,
		title: 'ごくえんのドラゴン',
		image: 'enchantjs/bigmonster1.gif',
		trim: { frame: 10, width: 80, height: 80 },
		query: 'embed',
		caption: 'やつが この めいきゅうの あるじ 獄炎(ごくえん) の ドラゴン だ！',
		identifier: '()',
		variables: ['enemy', 'effect'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// ドラゴン
			var enemy = new Dragon();
			enemy.hp = 10;
			enemy.locate(__cnt15, __cnt10, 'map1');
			enemy.scale(2, 2);
			enemy.setFrame('Idle', [10]);
			enemy.onbecomedead = function () {
				Hack.gameclear();
			};
			enemy.setInterval(function () {
				// ばくえん
				var effect = new Effect(-5, 5, 40, true);
				effect.collisionFlag = false;
				effect.locate(this.mapX - 2, this.mapY - 1);
				effect.force(0.1, -0.1);
				effect.ontriggerenter = function (event) {
					Hack.Attack.call(this, event.mapX, event.mapY, 1);
				};
			}, 1);
		}
	}, {
		id: 28,
		title: 'SoundCloud API',
		image: 'service/soundcloud-icon.png',
		trim: { x: 0, y: 0, width: 32, height: 32 },
		query: 'replace',
		caption: 'サウンドクラウドのAPI（エーピーアイ）をつかって、ゲームのなかで サウンドをならそう！',
		identifier: '()',
		pattern: /Hack\.openSoundCloud\(.*\)\;?/g.source,
		code: function () {
			Hack.openSoundCloud('https://soundcloud.com/nelward/splatoon-main-theme-snes-ey-remix');
		}
	}, {
		id: 29,
		title: 'SoundCloud 埋め込みプレーヤー',
		image: 'service/soundcloud-icon-black.png',
		trim: { x: 10, y: 0, width: 43, height: 43 },
		query: 'replace',
		caption: 'サウンドクラウドの埋め込みプレーヤーをつかって、サウンドをならそう！ APIでは再生できない曲も こっちでは再生できることがあるぞ。',
		identifier: '()',
		pattern: /Hack\.openExternal\(\'https?:\/\/soundcloud\.com.*\)\;?/g.source,
		code: function () {
			Hack.openExternal('https://soundcloud.com/john-sevenight/pokemon-dubstep-remix');
		}
	}, {
		id: 30,
		title: 'うれしいダイヤモンド',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 560, width: 32, height: 32 },
		query: 'embed',
		caption: 'ゲットすると、スコアになる',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// ダイヤモンド
			var item = new MapObject('diamond');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onplayerenter = function () {
				this.destroy();
				Hack.score += 1;
			};
		}
	}, {
		id: 31,
		title: 'スコアでゲームクリア',
		image: 'hackforplay/clear.png',
		trim: { x: 80, y: 0, width: 320, height: 320 },
		query: 'embed',
		caption: 'スコア１０以上のとき、ゲームクリアにせっていする',
		identifier: '[]',
		code: function () {
			// スコアでゲームクリア
			if (Hack.score >= 10) {
				Hack.gameclear();
			}
		}
	}, {
		id: 32,
		title: 'スコアで光るまほうじん',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 329, width: 32, height: 32 },
		query: 'embed',
		caption: 'スコア７以上のとき うえにのると、まほうじんが光る(だけ)',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// まほうじん
			var item = new MapObject('magic');
			item.locate(__cnt15, __cnt10, 'map1');
			item.layer = RPGMap.Layer.Under;
			item.onplayerenter = function () {
				if (Hack.score >= 7) {
					this.frame = MapObject.dictionary.usedMagic;
				}
			};
		}
	}, {
		id: 33,
		title: 'よのなか、マネー（おカネ）だ！',
		image: 'enchantjs/font0.png',
		trim: { x: 206, y: 30, width: 16, height: 16 },
		query: 'embed',
		caption: 'スコアをマネーにして、さいしょから 100 だけ もっているようにする',
		identifier: '<>',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// マネー（おカネ）にする
			Hack.scoreLabel.label = 'MONEY:';
			Hack.score = 100;
		}
	}, {
		id: 34,
		title: 'かたいからばこ',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 420, width: 32, height: 32 },
		query: 'embed',
		caption: 'スコアが足りないときは びくともしない ただの からばこ',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// かたいたからばこ
			var item = new MapObject('box');
			item.locate(__cnt15, __cnt10, 'map1');
			item.onattacked = function () {
				if (Hack.score < 5) {
					Hack.log('たからばこは びくともしない ');
				} else {
					this.frame = MapObject.dictionary.openedBox;
					Hack.log('ガチャ！たからばこが あいた！');
					// 出てくるもの　→
				}
			};
		}
	}, {
		id: 34,
		title: 'おはなやさん',
		image: 'enchantjs/x1.5/chara0.png',
		trim: { frame: 7, width: 48, height: 48 },
		query: 'embed',
		caption: 'おはなを うっている 女の子',
		identifier: '()',
		variables: ['chara', 'item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// おはなやさん
			var chara = new Girl();
			chara.locate(__cnt15, __cnt10, 'map1');
			chara.oncollided = function () {
				if (Hack.score < 100) {
					Hack.log('おはなは100エンです。おカネが たりないよ。');
				} else {
					Hack.log('おはなは100エンです。はい、どうぞ');
					Hack.score -= 100;
					// おはな
					var item = new MapObject('flower');
					item.locate(this.mapX, this.mapY + 1, 'map1');
					item.layer = RPGMap.Layer.Under;
					item.onplayerenter = function () {
						this.destroy();
					};
				}
			};
		}
	}, {
		id: 35,
		title: 'YouTube 埋め込みプレーヤー',
		image: 'service/youtube-icon.png',
		trim: { x: 0, y: 0, width: 128, height: 128 },
		query: 'replace',
		caption: 'YouTubeの埋め込みプレーヤーをつかって、ムービーを再生しよう！',
		identifier: '()',
		pattern: /Hack\.openExternal\(\'https?:\/\/(www\.)?youtube\.com.*\)\;?/g.source,
		code: function () {
			Hack.openExternal('https://www.youtube.com/watch?v=1mJ4X-hoCi8');
		}
	}, {
		id: 36,
		title: '魔道書',
		image: 'hackforplay/enchantbook.png',
		trim: { x: 0, y: 0, width: 64, height: 64 },
		query: 'embed',
		caption: '魔道書を使って、プレイヤーにもプログラミングさせよう！',
		identifier: '()',
		code: function () {
			// 魔道書
			Hack.hint = function () {
				// 君はこのステージをクリアできるか？

			};
		}
	}, {
		id: 37,
		title: 'アイテムになった魔道書',
		image: 'hackforplay/madosyo_small.png',
		trim: { x: 0, y: 0, width: 32, height: 32 },
		query: 'embed',
		caption: '拾って使える魔道書。',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// アイテムになった魔道書
			var item = new RPGObject(32, 32, 0, 0);
			item.image = game.assets['hackforplay/madosyo_small.png'];
			item.locate(__cnt15, __cnt10);
			item.onplayerenter = function	() {
				this.destroy();
				Hack.hint = function () {
					// ...まだ なにも かかれていないようだ

				};
			}
		}
	}, {
		id: 38,
		title: 'ルーレット',
		image: 'enchantjs/x2/dotmat.gif',
		trim: { frame: 562, width: 32, height: 32 },
		query: 'embed',
		caption: 'こうげきすると、ルーレットがはじまる',
		identifier: '()',
		variables: ['item'],
		counters: ['__cnt15', '__cnt10'],
		code: function () {
			// ルーレット
			var item = new MapObject('ruby');
			item.locate(__cnt15, __cnt10, 'map1');
			item.flag = true;
			item.onattacked = function () {
				if (this.flag) {
					// ルーレット開始！
					this.stop = this.setInterval(function () {
						this.name = random(['ruby','skull','poo']);
					}, 4);
					this.flag = false;
				} else {
					// ルーレット停止！
					this.stop();
					if (this.name === 'ruby') {
						Hack.score += 1; // rubyなら、SCORE + 1
					}
					if (this.name === 'skull') {
						Hack.score -= 1; // skullなら、SCORE - 1
					}
					this.flag = true;
				}
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
