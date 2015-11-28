window.addEventListener('load', function () {
	Hack.on('load', function() {
		this.smartAssets = [
		{
			name: 'Warp',
			variables: ['enemy'],
			lines: [
			'// きょうぼうな スライム',
			'var enemy = new BlueSlime();',
			'enemy.locate(5, 3);']
		}
		];
	});
});