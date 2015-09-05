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
	$('#modal-signup-email').on('show.bs.modal', function(event) {

		var button = $(event.relatedTarget);
		var open_page_class = button.data('openpage') || '.modal-page-1';
		console.log(button, open_page_class);

		// 任意のページを表示
		$(this).find('.modal-body').addClass('hidden');
		$(this).find(open_page_class).removeClass('hidden');

	}).on('hide.bs.modal', function(event) {

	});

	// メールアドレス　メール送信前のValidation（Validationしてボタンをアクティブにする）
	$('#modal-signup-email form#signup button[type="submit"]').attr('disabled', true);
	setInputRoutine('#modal-signup-email form#signup', function(){
		var policy = $(this).find('#policy').is(':checked');
		var count = 0;
		$(this).find('input').each(function(index, el) {
			if($(el).val() === '') count++;
		});
		$(this).find('button[type="submit"]').attr('disabled', count > 0 || !policy);
	});

	// メールアドレス 仮登録
	$('#modal-signup-email form#signup').submit(function(event) {
		event.preventDefault();

		var loading = $(this).find('button[type="submit"]').button('loading');

		var email = $(this).find("#signupEmail").val();
		var nickname = $(this).find('#nickname').val();
		var gender = $(this).find('input[name="gender"]:checked').val();
		var birthday = $(this).find('#birth_year').val() + '-' + $('#birth_month').val() + '-' + $('#birth_day').val();
		var experience_days = $(this).find('#experience_days').val();
		var timezone = new Date().getTimezoneString();

		$('#signup .alert').addClass('hidden');

		console.log('signup', email, gender, nickname, birthday, experience_days, timezone);

		$.post('/auth/signupwithemail.php', {
			'email': email,
			'gender' : gender,
			'nickname' : nickname,
			'birthday' : birthday,
			'experience_days' : experience_days,
			'timezone': timezone
		}, function(data, textStatus, xhr) {
			loading.button('reset');
			switch(data){
				case "success":
					// ページ２の初期化
					$('.auth-page-2 #tmpPassword').val('');
					$('.auth-page-2 p.alert').hide();

					// ページ２を表示
					var $modal = $('#modal-signup-email');
					$modal.find('.modal-body').addClass('hidden');
					$modal.find('.modal-page-2').removeClass('hidden');
					break;
				case "reserved":
					$('#signup .alert').text('すでに登録されているメールアドレスです').removeClass('hidden');
					break;
				case "sendmail-error":
					$('#signup .alert').text('メールの送信に失敗しました').removeClass('hidden');
					break;
				default:
					$('#signup .alert').text('無効な値が含まれています').removeClass('hidden');
					break;
			}
		});
	});

	// メールアドレス 仮登録のページに戻る
	$('#modal-signup-email .auth-modal-back').on('click', function() {
		$('#modal-signup-email .modal-body').addClass('hidden');
		$('#modal-signup-email .modal-page-1').removeClass('hidden');
	});


	// メールアドレス 仮パスワード送信
	$('#modal-signup-email form#tmp').submit(function(event) {
		event.preventDefault();
		var loading = $(this).find('button[type="submit"]').button('loading');

		var password = $(this).find("#tmpPassword").val();
		var email = $("#signup #signupEmail").val();
		$('#tmp .alert').addClass('hidden');

		console.log('tmp', password, email);

		$.post('/auth/confirmpassword.php', {
			'password' : password,
			'email' : email
		}, function(data, textStatus, xhr) {
			loading.button('reset');
			switch(data){
				case "success":
					// ページ３を表示
					var $modal = $('#modal-signup-email');
					$modal.find('.modal-body').addClass('hidden');
					$modal.find('.modal-page-3').removeClass('hidden');
					break;
				case "invalid-email":
					$('#tmp .alert').text('無効なメールアドレスです ' + email).removeClass('hidden');
					break;
				case "already-confirmed":
					$('#tmp .alert').text('すでに登録が完了しています').removeClass('hidden');
					break;
				case "incorrect-password":
					$('#tmp .alert').text('パスワードが間違っています').removeClass('hidden');
					break;
				case "valid-but-failed":
					$('#tmp .alert').text('エラーにより認証ができませんでした').removeClass('hidden');
					break;
			}
		});
	});


	// メールアドレス 本パスワード設定
	$('#modal-signup-email form#setPassword').submit(function(event) {
		event.preventDefault();
		var loading = $(this).find('button[type="submit"]').button('loading');

		var password = $(this).find('#password').val();
		var confirm = $(this).find('#confirm').val();

		$('#setPassword .alert').addClass('hidden');
		$(this).find('.has-error').removeClass('has-error');

		// Password validation
		if(password.length < 8){
			$(this).find('.alert').text('安全のため、パスワードは8文字以上にしてください').removeClass('hide');
			$(this).find('#password').parents('.has-feedback').addClass('has-error');
			return;
		}
		if(password !== confirm) {
			$(this).find('.alert').text('パスワードが一致しません').removeClass('hide');
			$(this).find('#password').parents('.has-feedback').addClass('has-error');
			$(this).find('#confirm').parents('.has-feedback').addClass('has-error');
			return;
		}

		console.log(password);

		$.post('/auth/updateuserinfoimmediately.php', {
			'password' : password
		}, function(data, textStatus, xhr) {
			loading.button('reset');
			switch(data){
				case 'success':
					// ページ４を表示
					var $modal = $('#modal-signup-email');
					$modal.find('.modal-body').addClass('hidden');
					$modal.find('.modal-page-4').removeClass('hidden');
					break;
				case 'no-session':
					$('#setPassword .alert').text('ログインされていません。つぎのページでログインしてください').removeClass('hidden');
					$('#modal-signup-email .modal-page-4').removeClass('hidden');
					break;
				case 'not-immediately':
					$('#setPassword .alert').text('つぎのページでログインしてください').removeClass('hidden');
					$('#modal-signup-email .modal-page-4').removeClass('hidden');
					break;
				default:
					break;
			}
		});
	});

	// ユーティリティ

	// 'selector' element内のinputにfocusされている間のみroutineを実行し続ける処理をセット
	function setInputRoutine (selector, routine) {
		var _intervalID = null;
		var $element = $(selector);
		$element.find('input').on('focus', function() {
			clearInterval(_intervalID);
			_intervalID = setInterval(routine.bind($element.get(0)), 100);
		}).on('blur', function() {
			clearInterval(_intervalID);
		});
		$element.find('select,input').on('change', function() {
			routine.call($element.get(0));
		});
	}
});