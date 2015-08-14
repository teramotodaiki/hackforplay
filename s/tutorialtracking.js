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

	// ログの取得と設定
	(function() {
		var storageLogIdentifier = 'tutorial_tracking_log';
		Object.defineProperty(tracking, 'log', {
			get: function() {
				return localStorage.getItem(storageLogIdentifier); // ログのJSON値
			},
			set: function(value) {
				localStorage.setItem(storageLogIdentifier, value); // ログのJSON値
			}
		});
	})();

	(function() {

		// ゲームのSTARTをキャッチしてログを記録する
		addLog('start', (new Date().getTime() / 1000) >> 0);

		$(window).on('message', function(event) {
			if (event.originalEvent.data === 'clear') {

				// ゲームのCLEARをキャッチしてログを記録する
				addLog('clear', (new Date().getTime() / 1000) >> 0);
			}
		});

		// ヒントをみたとき、カウントされる
		$('#youtubeModal').on('show.bs.modal', function() {

			addLog('hint', (new Date().getTime() / 1000) >> 0);
		});
	})();

	// ロギング
	function addLog (_field, _value) {

		// ログオブジェクト(localStorageに値がないとき、新しく作る)
		var log = tracking.log ? $.parseJSON(tracking.log) : { values: [] };
		log.values.push({
			stageid: getParam('id'),
			field: _field,
			value: _value
		});
		tracking.log = JSON.stringify(log);

		$.post('../stage/logintutorial.php', {
			key: tracking.key,
			log: tracking.log
		} , function(data, textStatus, xhr) {
			console.log(data);
		});
	}

	// ステージパラメータを取得
	function getParam(key){
		return sessionStorage.getItem('stage_param_'+key) || '';
	}
});