$(function () {

	// ログインページへのリンク
	$('.modal').on('hide.bs.modal', function() {
		$('.panel-after-signup').removeClass('hidden').hide().fadeIn('slow');
	});

	// ペーパーログイン
	$('#modal-signup-paper').on('show.bs.modal', function() {
		// ページ１を表示
		$(this).find('.modal-body').addClass('hidden');
		$(this).find('.modal-page-1').removeClass('hidden');
	}).on('hide.bs.modal', function(event) {
		// メモがでているときの警告
		if (!$(this).find('.modal-page-2').hasClass('hidden')) {
			if (confirm('メモ できましたか？\nいちど とじたら もう いっしょう みることは できません')) {
				// 情報を削除
				$(this).find('.paper-id').text('');
				$(this).find('.paper-password').text('');
			} else {
				event.preventDefault();
			}
		}
	});

	// ペーパーログイン　サインアップ
	$('#modal-signup-paper .modal-page-1 .modal-page-next').on('click', function() {
		// サインアップ
		var timezone = new Date().getTimezoneString();
		var loading = $(this).button('loading');

		$.post('../auth/signupwithpaper2.php', {
			'timezone': timezone
		} , function(data, textStatus, xhr) {
			loading.button('reset');
			$('#modal-signup-paper .modal-page-1').addClass('hidden');
			$('#modal-signup-paper .modal-page-2').removeClass('hidden').hide();
			$('#modal-signup-paper .modal-page-2').fadeIn();

			switch (data) {
				case 'parse-error':
					break;
				default:
					var result = JSON.parse(data);
					$('#modal-signup-paper .paper-id').text(result.id);
					$('#modal-signup-paper .paper-password').text(result.password);
					break;
			}
		});
	});

	// メールアドレス
	$('#modal-signup-email').on('show.bs.modal', function() {
		// ページ１を表示
		$(this).find('.modal-body').addClass('hidden');
		$(this).find('.modal-page-1').removeClass('hidden');

	}).on('hide.bs.modal', function(event) {

	});

	// メールアドレス 仮登録
	$('#modal-signup-email form#signup').submit(function(event) {
		event.preventDefault();

		// ページ２を表示
		var $modal = $('#modal-signup-email');
		$modal.find('.modal-body').addClass('hidden');
		$modal.find('.modal-page-2').removeClass('hidden');
	});

	// メールアドレス 仮パスワード送信
	$('#modal-signup-email form#tmp').submit(function(event) {
		event.preventDefault();

		// ページ３を表示
		var $modal = $('#modal-signup-email');
		$modal.find('.modal-body').addClass('hidden');
		$modal.find('.modal-page-3').removeClass('hidden');
	});

	// メールアドレス 本パスワード設定
	$('#modal-signup-email form#setPassword').submit(function(event) {
		event.preventDefault();

		// ページ４を表示
		var $modal = $('#modal-signup-email');
		$modal.find('.modal-body').addClass('hidden');
		$modal.find('.modal-page-4').removeClass('hidden');
	});
});