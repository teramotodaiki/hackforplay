(function(){
	var Hack = {};
	Object.defineProperty(window, 'Hack', {
		configurable: true,
		enumerable: true,
		get: function(){
			return window;
		}
	});

	var browserback_by_key = false;
	$(document).on('keydown', function(event) {
		if (event.keyCode === 8) {
			browserback_by_key = true;
			setTimeout(function() {
				browserback_by_key = false;
			}, 10);
		}
	});
	$(window).on('beforeunload', function(event) {
		if (browserback_by_key) {
			return 'ゲームは ほぞんされて いません\nまえの ページに もどりますか？';
		}
	});

	(function task () {
		if (enchant.Core.instance) {
			game.on('load', function() {
				var pad = new Pad();
				pad.moveTo(20, 200);
				pad.onenterframe = function() {
					game.rootScene.addChild(this);
				};
				game.rootScene.addChild(pad);
				Hack.pad = pad;

				var apad = new APad();
				apad.moveTo(100, 180);
				apad.outside.scale(0.5, 0.5);
				apad.inside.visible = false;
				apad.onenterframe = function() {
					game.rootScene.addChild(this);
				};
				apad.on('touchstart', function(event) {
					game.dispatchEvent(new Event('abuttondown'));
				});
				game.rootScene.addChild(apad);
				Hack.apad = apad;
			});
		} else {
			setTimeout(task, 10);
		}
	})();

})();