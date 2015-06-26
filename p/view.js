/*
Preferences のビューを更新するスクリプト
*/
$(function(){
	$('[data-toggle="tooltip"]').tooltip();

	/* View */

	// ユーザー情報（Ajaxで取得して、ボタンをアクティブにする）
	var getInfoTask = function(){
		$.post('../auth/getmyinfo.php', {
			'attendance-token': sessionStorage.getItem('attendance-token')
		}, function(data, textStatus, xhr) {
			switch(data){
				case 'no-session':
					$('#signinModal').modal('show');
					$("#authModal,#signinModal").on('hide.bs.modal', function(){
						checkSigninSession(function(result){
							if(result === 'success'){
								getInfoTask();
							}
						});
					});
					break;
				case 'parse-error':
					break;
				default:
					var info = jQuery.parseJSON(data);
					var $form = $('form[name="usersettings"]');
					$form.find('#nickname').val(info.nickname);
					userDefault.nickname = info.nickname;
					break;
			}
		});
	};
	getInfoTask();

	// ユーザー情報の変更（ひとつでもuserDefaultと違っていたらボタンをアクティブにする）
	var userDefault = {};
	setInputRoutine('form[name="usersettings"]', function(){
		var count = 0;
		if ($(this).find('#nickname').val() !== userDefault.nickname) {
			count++;
		}
		$(this).find('button[type="submit"]').attr('disabled', count < 1);
	});

	// パスワードの再設定（Validationしてボタンをアクティブにする）
	setInputRoutine('form[name="setpassword"]', function(){
		var count = 0;
		$(this).find('input[type="password"]').each(function(index, el) {
			// Validation
			if (el.value.length < 8) {
				$(el).parents('.form-group').addClass('has-error');
			}else{
				$(el).parents('.form-group').removeClass('has-error');
				count++;
			}
		});
		$(this).find('button[type="submit"]').attr('disabled', count < 3);
	});

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
		$element.find('select').on('change', function() {
			routine.call($element.get(0));
		});
	}

	/* Submition */
	$('form[name="usersettings"]').submit(function(event) {
		event.preventDefault();

		var submit = $(this).find('button[type="submit"]').button('loading');
		var nickname = $(this).find('#nickname').val();
		var changed = {
			'attendance-token': sessionStorage.getItem('attendance-token')
		};
		if (nickname !== userDefault.nickname) { changed.nickname = nickname; }

		$.post('../auth/updateuser.php', changed , function(data, textStatus, xhr) {
			submit.button('reset');
			switch(data){
				case 'no-session':
					$('#signinModal').modal('show');
					break;
				case 'success':
					userDefault.nickname = nickname;
					setTimeout(function(){
						// Validationにかからないよう、100ミリ秒待って非アクティブ化
						submit.attr('disabled', true);
					}, 100);
					bsAlert('alert-success', '更新しました').prependTo('form[name="usersettings"]');
					break;
			}
		});
	});

	$('form[name="setpassword"]').submit(function(event) {
		event.preventDefault();

		var $f = $(this);
		var submit = $f.find('button[type="submit"]').button('loading');
		var current = $f.find('#current').val();
		var password = $f.find('#password').val();
		var confirm = $f.find('#confirm').val();
		if (password.length < 8) {
			bsAlert('alert-danger', '8文字以上のパスワードを設定してください').prependTo($f);
			return;
		}else if(password !== confirm){
			bsAlert('alert-danger', '入力されたパスワードが一致していません').prependTo($f);
			return;
		}

		$.post('../auth/updatepassword.php', {
			'current': current,
			'password': password,
			'attendance-token': sessionStorage.getItem('attendance-token')
		}, function(data, textStatus, xhr) {
			submit.button('reset');
			switch(data){
				case 'no-session':
					$('#signinModal').modal('show');
					break;
				case 'invalid-password':
					bsAlert('alert-danger', '入力されたパスワードはお使いいただけません').prependTo($f);
					break;
				case 'incorrect-password':
					bsAlert('alert-danger', '現在のパスワードが間違っています').prependTo($f);
					break;
				case 'update-failed':
					bsAlert('alert-danger', 'エラーによりパスワードを設定できませんでした').prependTo($f);
					break;
				case 'success':
					bsAlert('alert-success', 'パスワードを変更しました').prependTo($f);
					$f.find('input').val('');
					setTimeout(function(){
						// Validationにかからないよう、100ミリ秒待って非アクティブ化
						submit.attr('disabled', true);
					}, 100);
					break;
			}
		});
	});

	// Twitterとの連携を解除する OAuth認証を行う
	$('.disconnect-twitter-account').on('click', function(event) {
		var user_id = sessionStorage.getItem('view_user_id');
		var authed = 'disconnecttotwitter.php?user_id=' + user_id;
		location.href = '../loginwithtwitter.php?authed=' + encodeURIComponent(authed);
	});

	// _level のアラート _text を生成し、jQueryオブジェクトを返す
	function bsAlert (_level, _text) {
		var _bsalert =
		$('<div>').addClass('alert alert-dismissible fade in').addClass(_level).attr('role', 'alert').append(
			$('<button>').addClass('close').attr({
				'type' : 'button',
				'data-dismiss': 'alert',
				'aria-label': 'Close'
			}).append(
				$('<span>').attr('aria-hidden', 'true').html('&times;')
			)
		).append(
			$('<span>').text(_text)
		);
		return _bsalert;
	}
});