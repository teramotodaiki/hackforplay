$(function(){

	// コメント
	var $com =
	$('<div>').addClass('panel-body row').append(
		$('<div>').addClass('col-md-6').append(
			$('<div>').addClass('row').append(
				$('<div>').addClass('col-md-5 comment-thumbnail').append(
					$('<img>').addClass('h4p_thumbnail').height(120)
				)
			).append(
				$('<div>').addClass('col-md-2 comment-user-icon').append(
					$('<img>').addClass('img-circle comment-item-padding')
				)
			).append(
				$('<div>').addClass('col-md-5').append(
					$('<div>').addClass('text-muted comment-item-padding nickname').append(
						$('<a>')
					)
				).append(
					$('<div>').addClass('comment-item-padding hashtag').append(
						$('<a>')
					)
				)
			)
		)
	).append(
		$('<div>').addClass('col-md-6').append(
			$('<div>').addClass('row').append(
				$('<div>').addClass('col-md-12 comment-body').css('min-height', '60px')
			).append(
				$('<div>').addClass('col-md-12 comment-footer').append(
					$('<p>').addClass('label pull-right')
				)
			).append(
				$('<div>').addClass('col-md-12').append(
					$('<button>').attr('type', 'button').addClass('btn btn-link pull-right h4p_comment-trash').append(
						$('<span>').attr('aria-hidden', 'true').addClass('glyphicon glyphicon-trash')
					)
				)
			)
		)
	);

	$com.find('.h4p_comment-trash').on('click', function(event) {

		var id = $(this).data('id');
		var message = $(this).data('message');
		var $comment = $(this).parents('.panel-body').first();

		if (confirm(message + '\n\nこのメッセージを さくじょ します')) {
			$comment.hide('fast');
			$.post('../stage/rejectcommentbyid.php', {
				'comment_id': id,
				'attendance-token': sessionStorage.getItem('attendance-token')
			} , function(data, textStatus, xhr) {
				switch (data) {
					case 'no-session':
					case 'not-found':
					case 'database-error':
						$('#signinModal').modal('show');
						break;
					case 'success':
						$comment.remove();
						break;
				}
			});
		}
	});

	// ユーザー情報取得・表示
	// length: 取得する最大個数(指定しなかった場合は10)
	// callback: 取得・要素追加後、実行する関数(指定しなくてもいい)
	var loadMoreCommentTask;
	(function() {
		var loadedIndex = 0;
		(loadMoreCommentTask = function(length, callback) {
			var loadLength = length || 10;
			$.post('../stage/fetchrecentcommentsbyauthor.php', {
				'start': loadedIndex,
				'length': loadLength,
				'attendance-token': sessionStorage.getItem('attendance-token')
			}, function(data, textStatus, xhr) {
				switch(data){
					case 'no-session':
					case 'parse-error':
						$('#signinModal').modal('show');
						break;
					default:
						var result = JSON.parse(data);
						result.values.forEach(function(item, index) {

							var com = $com.clone(true, true);
							com.data('stageid', item.StageID);
							com.find('.comment-thumbnail img').attr('src', item.Thumbnail);
							if (item.Nickname) {
								if (item.ProfileImageURL) {
									com.find('.comment-user-icon img').attr('src', item.ProfileImageURL);
								} else {
									com.find('.comment-user-icon img').attr('src', item.Gender === 'male' ? '/m/icon_m.png' : '/m/icon_w.png');
								}
								com.find('.nickname a').text(item.Nickname).attr('href', '/m?id=' + item.UserID);
							}
							com.find('.hashtag a').text(item.Hashtag).attr('href', '/s?id=' + item.StageID);
							item.Message.split('\n').forEach(function (item) {
								$(this).append(
									$('<p>').addClass('comment-item-padding').text(item)
								);
							}, com.find('.comment-body'));
							if (item.Tags[0]) {
								com.find('.comment-footer p').text(item.Tags[0].DisplayString).css('background-color', item.Tags[0].LabelColor);
							}
							com.find('.h4p_comment-trash').data('id', item.ID).data('message', item.Message);
							$(this).append(com);
							$(this).append(
								$('<hr>').css('margin', '0')
							);

						}, $('.h4p_comment-list'));

						if (callback) {
							callback();
						}

						break;
				}
			});
			// カウント
			loadedIndex += loadLength;
		})();

	})();

	$('button.h4p_load-more-comment').on('click', function(event) {

		var loading = $(this).button('loading');
		loadMoreCommentTask(10, function() {
			loading.button('reset');
		});

	});

});