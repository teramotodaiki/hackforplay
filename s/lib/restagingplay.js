(function(){
	var storage = sessionStorage;

	// Run restaging code
	if(	__H4PENV__MODE === "restaging" ||
		__H4PENV__MODE === "replay"){
		var reStaging = function(){
			if(__H4PENV__SETEVALFLAG){
				var code = storage.getItem('restaging_code');
				window.postMessage(code, "/");
			}
			return __H4PENV__SETEVALFLAG;
		};
		window.addEventListener('load', function(){
			var routine = function(){
				var loaded = reStaging();
				if(!loaded){
					setTimeout(routine, 100);
				}
			};
			routine();
		});
	}
	// Set default restaging code
	var _default_code;
	window.__defineGetter__('__H4PENV__DEFAULTCODE', function(){
		return _default_code;
	});
	window.__defineSetter__('__H4PENV__DEFAULTCODE', function(_code){
		_default_code = _code;
		if(__H4PENV__MODE === "official"){
			storage.setItem('restaging_code', _default_code);
		}
	});
	__H4PENV__DEFAULTCODE =
	"// ステージ改造コードを書いて、このステージを改造してやろう!!\n"+
	"// デフォルトのコードが取得できませんでした。再読み込みするか、お好きなコードから始めてください\n";

})();
