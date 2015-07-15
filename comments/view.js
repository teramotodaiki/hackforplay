$(function(){

	// ユーザー情報取得
	var user_id = sessionStorage.getItem('view_user_id');
	checkSigninSession(function(result){
		if (result === 'success') {
			$.post('../stage/fetchrecentcommentsbyauthor.php', {
				'start': 0,
				'length': 10,
				'attendance-token': sessionStorage.getItem('attendance-token')
			}, function(data, textStatus, xhr) {
				switch(data){
					case 'no-session':
					case 'parse-error':
						$('#signinModal').modal('show');
						break;
					default:
						var result = JSON.parse(data);
						result.values.forEach(function(item) {

							$(this).append(
								$('<div>').text(item.Message)
							);

						}, $('.h4p_comment-list'));
						break;
				}
			});
		}
	});

});