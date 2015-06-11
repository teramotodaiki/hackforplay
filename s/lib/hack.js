(function(){
	// Initialize
	var Hack = {};
	Object.defineProperty(window, 'Hack', {
		configurable: true,
		enumerable: true,
		get: function(){
			return Hack;
		}
	});
})();

Hack.saveImage = function(){
	var canvas = $("#enchant-stage>div").children('canvas').get(0);
	var data = canvas.toDataURL();
	sessionStorage.setItem('image', data);
    window.parent.postMessage('thumbnail', '/');
};
Hack.screenShot = function(){
	window.parent('screenshot', '/');
	saveImage();
};

window.addEventListener('load', function() {
    enchant();
    var game = new enchant.Core(480, 320);
    game.start();
    game.addEventListener('load', function(){
		var label = new enchant.Label('game start!');
		game.rootScene.addChild(label);
    });
});