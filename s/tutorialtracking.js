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
	console.log('tracking.key', tracking.key);
	console.log('localStorage key', localStorage.getItem('tutorial_logging_key'));
	(function() {
		var storageKey = 'tutorial_logging_key';
		var key = localStorage.getItem(storageKey); // ユーザの識別キー

		// キーがないとき、キーを新しく生成する
		if (!key) {
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			key = '';
			for( var i = 0; i < 32; i++ )
				key += possible.charAt(Math.floor(Math.random() * possible.length));
			localStorage.setItem(storageKey, key);
		}

		Object.defineProperty(tracking, 'key', {
			get: function() {
				return key;
			}
		});
	})();
	console.log('tracking.key', tracking.key);
	console.log('localStorage key', localStorage.getItem('tutorial_logging_key'));

	//
});