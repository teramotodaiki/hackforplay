/*
Preferences のビューを更新するスクリプト
*/
$(function(){
	$('[data-toggle="tooltip"]').tooltip();

	/* View */

	// ユーザー情報（Ajaxで取得して、ボタンをアクティブにする）
	var getInfoTask = function(){
		$.get('../auth/getmyinfo.php', function(data) {
			console.log(data);
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
					console.log(data);
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
		$(this).find('button').attr('disabled', count < 1);
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
		$(this).find('button').attr('disabled', count < 3);
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
	}

	/* Submition */
	$('form[name="usersettings"]').submit(function(event) {
		event.preventDefault();

		var submit = $(this).find('button').button('loading');
		var nickname = $(this).find('#nickname').val();
		$.post('../auth/updateuser.php',{
			'nickname': nickname
		} , function(data, textStatus, xhr) {
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



	// _level のアラート _text を生成し、jQueryオブジェクトを返す
	function bsAlert (_level, _text) {
		var bsalert =
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
		return bsalert;
	}
});