/*
Preferences のform submitについてのスクリプト
*/
$(function(){
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
					bsAlert('alert-success', '更新しました').prependTo('form[name="usersettings"]');
					break;
			}
		});
	});

	// _level のアラート _text を生成し、jQueryオブジェクトを返す
	function bsAlert (_level, _text) {
		var bsalert =
		$('<div>').addClass('alert').addClass(_level).attr('role', 'alert').append(
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