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
})();