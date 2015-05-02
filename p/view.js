/*
Preferences のビューを更新するスクリプト
*/
$(function(){
	$('[data-toggle="tooltip"]').tooltip();

	// ユーザー情報（Ajaxで取得して、ボタンをアクティブにする）
	$('a[data-toggle="tab"][aria-controls="user"]').on('show.bs.tab', function(event) {
		var $f = $('#usersettings');
		$f.find('button').attr('disabled', true);

		$.get('../auth/getmyinfo.php', function(data) {
			console.log(data);
			switch(data){
				case 'no-session':
					$('#signinModal').modal('show');
					break;
				case 'parse-error':
					console.log(data);
					break;
				default:
					var info = jQuery.parseJSON(data);
					$f.find('#age').val(info.age);
					$f.find('input[name="gender"][value="' + info.gender + '"]').attr('checked', true);
					$f.find('#nickname').val(info.nickname);
					$f.find('button').attr('disabled', false);
					break;
			}
		});
	}).on('hide.bs.tab', function(event) {
		$('#usersettings button').attr('disabled', true);
	});
	$('a[data-toggle="tab"][aria-controls="user"]').tab('show');

	// パスワードの再設定（Validationしてボタンをアクティブにする）


	// サインインしたら、そのタブをもう一度開く
	$("#authModal,#signinModal").on('hide.bs.modal', function(){
		checkSigninSession(function(result){
			if(result === 'success'){
				// 現在のタブを再度表示（リロード）
				$('a[data-toggle="tab"][aria-expanded="true"]').tab('show');
			}
		});
	});
});