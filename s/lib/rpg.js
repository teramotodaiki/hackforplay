(function(){
	var Hack = {};
	Object.defineProperty(window, 'Hack', {
		configurable: true,
		enumerable: true,
		get: function(){
			return window;
		}
	});
})();