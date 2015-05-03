/*
Preferences のビューを更新するスクリプト
*/
$(function(){
	$('[data-toggle="tooltip"]').tooltip();

	// ユーザー情報（Ajaxで取得して、ボタンをアクティブにする）
	var $f = $('form[name="usersettings"]');
	$f.find('button').attr('disabled', true);
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
					$f.find('#nickname').val(info.nickname);
					$f.find('button').attr('disabled', false);
					break;
			}
		});
	};
	getInfoTask();

	// パスワードの再設定（Validationしてボタンをアクティブにする）
	setInputRoutine($('form[name="setpassword"]').get(0), function(){
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

	// element内のinputにfocusされている間のみroutineを実行し続ける処理をセット
	function setInputRoutine (element, routine) {
		var _intervalID = null;
		$(element).find('input').on('focus', function() {
			clearInterval(_intervalID);
			_intervalID = setInterval(routine.bind(element), 100);
		}).on('blur', function() {
			clearInterval(_intervalID);
		});
	}
});