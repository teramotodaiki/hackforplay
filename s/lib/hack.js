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
function refocus () {
    window.document.activeElement.blur();
    window.focus();
}
function getEditor () {
	// tmp
}
function sendToEditor () {
	// tmp
}

window.addEventListener('load', function() {
    enchant();
    var game = new enchant.Core(480, 320);

    // Hackのクラスを生成 インスタンスはget only
    var HackEnchant = enchant.Class.create(enchant.EventTarget, {
		initialize: function(){
			enchant.EventTarget.call(this);
		}
    });
    var _Hack = new HackEnchant();
	Object.defineProperty(window, 'Hack', {
		configurable: true,
		enumerable: true,
		get: function(){
			return _Hack;
		}
	});

	// Hack.onloadのコール
	Hack.dispatchEvent(new Event('load'));

    game.start();
    game.addEventListener('load', function(){
		var label = new enchant.Label('game start!');
		game.rootScene.addChild(label);
    });
});