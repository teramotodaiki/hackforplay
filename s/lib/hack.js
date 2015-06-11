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
function saveImage () {
	var canvas = document.getElementById('enchant-stage').firstChild.firstChild;
	var data = canvas.toDataURL();
	sessionStorage.setItem('image', data);
    window.parent.postMessage('thumbnail', '/');
}
function screenShot () {
	window.parent.postMessage('screenshot', '/');
	window.saveImage();
}

window.addEventListener('load', function() {
    enchant();
    var game = new enchant.Core(480, 320);
    game.start();
    game.addEventListener('load', function(){
		var label = new enchant.Label('game start!');
		game.rootScene.addChild(label);
    });
});