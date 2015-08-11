/*
 * チュートリアルステージのクリアタイムをトラッキングする
 * 計測と推薦はすべてクライアントサイドで行う
 * localStorageにランダムなキーをおき、更新されるごとにサーバーと同期する
*/

$(function () {

	// メインオブジェクト
	var tracking = {};

	// キーの生成
	// tracking.key === key
	(function() {
		var storageKeyIdentifier = 'tutorial_tracking_key';
		var key = localStorage.getItem(storageKeyIdentifier); // ユーザの識別キー

		// キーがないとき、キーを新しく生成する
		if (!key) {
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			key = '';
			for( var i = 0; i < 32; i++ )
				key += possible.charAt(Math.floor(Math.random() * possible.length));
			localStorage.setItem(storageKeyIdentifier, key);
		}

		Object.defineProperty(tracking, 'key', {
			get: function() {
				return key;
			}
		});
	})();

	$.post('../stage/logintutorial.php', {
		key: tracking.key,
		log: '{}'
	} , function(data, textStatus, xhr) {
		console.log(data);
	});

	//
});