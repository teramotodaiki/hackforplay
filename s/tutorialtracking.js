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

	// ゲームのSTARTとCLEARをキャッチしてログを記録する
	(function() {
		var storageLogIdentifier = 'tutorial_tracking_log';
		var log_json = localStorage.getItem(storageLogIdentifier); // ログのJSON値
		var log = log_json ? $.parseJSON(log_json) : {}; // ログオブジェクト(localStorageに値がないとき、新しく作る)

		(function() {
			// トラッキングイベント

			log.values = log.values || [];

			log.values.push({
				stageid: 101,
				field: 'test',
				value: 'test value'
			});

			log_json = JSON.stringify(log);
			localStorage.setItem(storageLogIdentifier, log_json);

		})();

		Object.defineProperty(tracking, 'log', {
			get: function() {
				return log_json;
			}
		});
	})();

	$.post('../stage/logintutorial.php', {
		key: tracking.key,
		log: tracking.log
	} , function(data, textStatus, xhr) {
		console.log(data);
	});

	//
});