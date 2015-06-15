window.addEventListener('load', function() {

	var game = enchant.Core.instance;
	game.preload(['img/map2.png']);

	Hack.textarea.backgroundColor = '#024';

	Hack.on('load', function(event) {

	});

	game.on('load', function(event) {

		Hack.backgroundImage = [];
		for (var i = 0; i < 16; i++) {
			Hack.backgroundImage[i] = new enchant.Map(32, 32);
			Hack.backgroundImage[i].image = game.assets['img/map2.png'];
			Hack.backgroundImage[i].loadData([
				[22],[21],[20],[19],[18],[18],[0],[1],[1],[1]
			]);
			Hack.backgroundImage[i].x = i * 32;
			game.rootScene.addChild(Hack.backgroundImage[i]);
		};

	});
});