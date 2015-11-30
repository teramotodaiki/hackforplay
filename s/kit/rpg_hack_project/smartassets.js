window.addEventListener('load', function () {
	Hack.smartAssets = {
		buttons: [
		{
			// Map tip
			image: 'img/mapTipIndex.jpg',
			query: 'toggle',
			caption: 'enchantjs/x2/map1.gif'
		}, {
			// Grassland Map
			image: 'enchantjs/x2/map1.gif',
			trim: { x: 0, y: 0, width: 32*4, height: 32*4 },
			query: 'embed',
			identifier: '<>',
			variables: ['room'],
			counters: [],
			lines:[
			"// room",
			"Hack.maps['room'] = new RPGMap(32, 32);",
			"Hack.maps['room'].imagePath = 'enchantjs/x2/map1.gif';",
			"Hack.maps['room'].bmap.loadData([",
			"\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],",
			"\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],",
			"\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],",
			"\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],",
			"\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],",
			"\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],",
			"\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],",
			"\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],",
			"\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],",
			"\t[322,322,322,322,322,322,322,322,322,322,322,322,322,322,322]",
			"]);",
			"Hack.maps['room'].cmap = [",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]",
			"];"
			]
		}, {
			// Cave Map
			image: 'enchantjs/x2/map1.gif',
			trim: { x: 10*32, y: 0, width: 32*4, height: 32*4 },
			query: 'embed',
			identifier: '<>',
			variables: ['room'],
			counters: [],
			lines:[
			"// room",
			"Hack.maps['room'] = new RPGMap(32, 32);",
			"Hack.maps['room'].imagePath = 'enchantjs/x2/map1.gif';",
			"Hack.maps['room'].bmap.loadData([",
			"\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],",
			"\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],",
			"\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],",
			"\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],",
			"\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],",
			"\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],",
			"\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],",
			"\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],",
			"\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],",
			"\t[323,323,323,323,323,323,323,323,323,323,323,323,323,323,323]",
			"]);",
			"Hack.maps['room'].cmap = [",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]",
			"];"
			]
		}, {
			// Iron Map
			image: 'enchantjs/x2/map1.gif',
			trim: { x: 10*32, y: 4*32, width: 32*4, height: 32*4 },
			query: 'embed',
			identifier: '<>',
			variables: ['room'],
			counters: [],
			lines:[
			"// room",
			"Hack.maps['room'] = new RPGMap(32, 32);",
			"Hack.maps['room'].imagePath = 'enchantjs/x2/map1.gif';",
			"Hack.maps['room'].bmap.loadData([",
			"\t[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],",
			"\t[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],",
			"\t[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],",
			"\t[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],",
			"\t[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],",
			"\t[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],",
			"\t[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],",
			"\t[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],",
			"\t[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],",
			"\t[ 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93]",
			"]);",
			"Hack.maps['room'].cmap = [",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],",
			"\t[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]",
			"];"
			]
		}, {
			// Down Stair
			image: 'enchantjs/x2/map1.gif',
			trim: { x: 2*32, y: 21*32, width: 32, height: 32 },
			query: 'embed',
			identifier: '()',
			variables: ['item'],
			counters: ['__cnt15', '__cnt10'],
			lines: [
			"// くだりかいだん",
			"var item = new MapObject('DownStair');",
			"item.locate(__cnt15, __cnt10, 'room1');",
			"item.onplayerenter = function () {",
			"\tHack.changeMap('room2');",
			"};"]
		}, {
			// Warp
			image: 'enchantjs/x2/map1.gif',
			trim: { x: 4*32, y: 16*32, width: 32, height: 32 },
			query: 'embed',
			identifier: '()',
			variables: ['item'],
			counters: ['__cnt15', '__cnt10'],
			lines: [
			"// ワープゆか",
			"var item = new MapObject('Warp');",
			"item.locate(__cnt15, __cnt10, 'room1');",
			"item.onplayerenter = function () {",
			"\tHack.player.locate(11, 5);",
			"};"]
		}, {
			// Empty Box
			image: 'enchantjs/x2/map1.gif',
			trim: { x: 2*32, y: 26*32, width: 32, height: 32 },
			query: 'embed',
			identifier: '()',
			variables: ['item'],
			counters: ['__cnt15', '__cnt10'],
			lines: [
			"// からのたからばこ",
			"var item = new MapObject('Box');",
			"item.locate(__cnt15, __cnt10, 'room1');",
			"item.onattacked = function () {",
			"\tthis.frame = MapObject.Dictionaly['OpenedBox'];",
			"};"]
		}, {
			// Talking Woman
			image: 'enchantjs/x1.5/chara0.png',
			trim: { x: 4*48, y: 8, width: 48, height: 48 },
			query: 'embed',
			identifier: '()',
			variables: ['item'],
			counters: ['__cnt15', '__cnt10'],
			lines: [
			"// はなしをする 女の人",
			"var item = new Woman();",
			"item.locate(__cnt15, __cnt10, 'room1');",
			"item.onattacked = function () {",
			"\tHack.log('こんにちは');",
			"};"]
		}, {
			// Violent Slime
			image: 'enchantjs/monster4.gif',
			trim: { x: 2*48-4, y: 1*48, width: 48, height: 48 },
			query: 'embed',
			identifier: '()',
			variables: ['enemy'],
			counters: ['__cnt15', '__cnt10'],
			lines: [
			"// きょうぼうな スライム",
			"var enemy = new BlueSlime();",
			"enemy.locate(__cnt15, __cnt10, 'room1');",
			"enemy.onbecomeidle = function () {",
			"\tthis.attack();",
			"};"]
		}, {
			// Timid Insect
			image: 'enchantjs/monster1.gif',
			trim: { x: 2*48, y: 0*48, width: 48, height: 48 },
			query: 'embed',
			identifier: '()',
			variables: ['enemy'],
			counters: ['__cnt15', '__cnt10'],
			lines: [
			"// おくびょうな イモムシ",
			"var enemy = new Insect();",
			"enemy.locate(__cnt15, __cnt10, 'room1');",
			"enemy.onbecomeidle = function () {",
			"\tthis.turn();",
			"\tthis.walk();",
			"};"]
		}, {
			// Boss Dragon
			image: 'enchantjs/bigmonster1.gif',
			trim: { x: 8, y: 2*80-2, width: 80, height: 80 },
			query: 'embed',
			identifier: '()',
			variables: ['enemy'],
			counters: ['__cnt15', '__cnt10'],
			lines: [
			"// ドラゴン（ラスボス）",
			"var enemy = new Dragon();",
			"enemy.hp = 10;",
			"enemy.locate(__cnt15, __cnt10, 'room1');",
			"enemy.onbecomedead = function () {",
			"\tHack.gameclear();",
			"};"]
		}, {
			// Thorns Trap
			image: 'enchantjs/x2/map1.gif',
			trim: { x: 0, y: 22*32, width: 32, height: 32 },
			query: 'embed',
			identifier: '()',
			variables: ['item'],
			counters: ['__cnt15', '__cnt10'],
			lines: [
			"// ふんだら ケガする トゲのワナ",
			"var item = new MapObject('Trap');",
			"item.locate(__cnt15, __cnt10, 'room1');",
			"item.onplayerenter = function () {",
			"\tthis.frame = MapObject.Dictionaly['UsedTrap'];",
			"\tHack.Attack.call(this, this.mapX, this.mapY, 1);",
			"};",
			"item.onplayerexit = function () {",
			"\tthis.frame = MapObject.Dictionaly['Trap'];",
			"};"]
		}, {
			// Invisible Star
			image: 'enchantjs/x2/map1.gif',
			trim: { x: 6*32, y: 28*32, width: 32, height: 32 },
			query: 'embed',
			identifier: '()',
			variables: ['item'],
			counters: ['__cnt15', '__cnt10'],
			lines:[
			"// スター（むてき）",
			"var item = new MapObject('Star');",
			"item.locate(__cnt15, __cnt10, 'room1');",
			"// When enter... ふまれたら...",
			"item.onplayerenter = function () {",
			"\tvar onattacked = Hack.player.onattacked;",
			"\tHack.player.setTimeout(function () {",
			"\t\tHack.player.onattacked = onattacked;",
			"\t\tHack.player.opacity = 1;",
			"\t}, 100);",
			"\tHack.player.onattacked = null;",
			"\tHack.player.opacity = 0.5;",
			"\tthis.destroy();",
			"};"
			]
		}
		],
		counters: {
			__cnt15: {
				table: shuffle([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
			},
			__cnt10: {
				table: shuffle([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 5]) // length=11
			}
		}
	};
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
});