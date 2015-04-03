var get_local_data; // 初期値はnull.ローカルストレージからdataを取得、json parseして返す
var call_after_getData; // get_local_dataに成功したあと関数を呼び出す
(function(){
	var local_data = null;
	get_local_data = function(code_id){
		if(local_data === null){
			var l = localStorage;
			var date = l.getItem('challenge-lastdate');
			var data = l.getItem('challenge-data');
			if(date !== undefined && data !== undefined &&
				new Date(date).getDate() === (new Date()).getDate()){
				local_data = $.parseJSON(data);
			}
		}
		if(code_id === undefined) return local_data;
		else if(local_data === null) return null;
		else {
			var fetch = local_data.filter(function(element) {
				return element['id'] == code_id;
			});
			if(fetch.length > 0) return fetch[0];
			return null;
		}
	};
	call_after_getData = function(func){
		var call_func = null;
		(call_func = function(){
			if(get_local_data() === null) setTimeout(func, 100);
			else func();
		})();
	};
})();