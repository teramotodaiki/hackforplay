window.addEventListener('load', function () {
	Hack.on('load', function() {
		this.smartAssets = {
			buttons: [
			{
				image: 'enchantjs/x2/map1.gif',
				identifier: '()',
				variables: ['item'],
				counters: ['__cnt15', '__cnt10'],
				lines: [
				"// ワープゆか",
				"var item = new MapObject('Warp');",
				"item.locate(__cnt15, __cnt10);",
				"item.onplayerenter = function () {",
				"\tHack.player.locate(11, 5);",
				"};"]
			}
			],
			counters: {
				__cnt15: {
					init: 6,
					add: 1,
					size: 15
				},
				__cnt10: {
					init: 3,
					add: 1,
					size: 10
				}
			}
		};
	});
});