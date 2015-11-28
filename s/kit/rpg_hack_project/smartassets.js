window.addEventListener('load', function () {
	Hack.on('load', function() {
		this.smartAssets = [
		{
			image: 'kit/rpg_hack_project/smartAssets/warp.png',
			identifier: '()',
			variables: ['item'],
			lines: [
			"// ワープゆか",
			"var item = new MapObject('Warp');",
			"item.locate(5, 3);"]
		}
		];
	});
});