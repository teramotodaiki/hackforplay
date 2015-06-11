window.addEventListener('load', function() {
    enchant();
    var game = new enchant.Core();
    game.start();
    game.addEventListener('load', function(){
		var label = new enchant.Label('game start!');
		game.rootScene.addChild(label);
    });
});