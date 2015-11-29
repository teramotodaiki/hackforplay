window.addEventListener('load', function () {
	Hack.on('load', function() {
		this.smartAssets = {
			buttons: [
			{
				// Map tip
				image: 'img/mapTipIndex.jpg',
				query: 'toggle',
				caption: 'enchantjs/x2/map1.gif'
			},
			{
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
				"item.locate(__cnt15, __cnt10);",
				"item.onplayerenter = function () {",
				"\tHack.player.locate(11, 5);",
				"};"]
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
});