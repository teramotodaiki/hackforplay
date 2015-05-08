$(function(){

	// ユーザー情報取得
	var user_id = sessionStorage.getItem('view_user_id');
	checkSigninSession(function(result){
		if (result === 'success') {
			$.post('../auth/getuserinfobyid.php',{
				'id': user_id
			}, function(data, textStatus, xhr) {
				switch(data){
					case 'no-session':
						$('#signinModal').modal('show');
						break;
					case 'missing-user':
						bsAlert('ユーザーID #' + user_id + ' は存在しません)').appendTo('.h4p_alert');
						break;
					case 'parse-error':
						bsAlert('ユーザー情報の取得に失敗しました').addClass('alert-danger').appendTo('.h4p_alert');
						break;
					default:
						var info = $.parseJSON(data);
						$('.h4p_user-nickname').text(info.nickname);
						$('.h4p_user-thumbnail').attr('src', info.gender === 'man' ? 'tmpthumb_man.png' : 'tmpthumb_woman.png');
						break;
				}
			});
		}
	});

	// 一覧表示
	var view_mode = sessionStorage.getItem('view_mode');
	// インスタンス
	var $item = $('<div>').addClass('col-lg-4 col-md-6 col-sm-6 col-xs-12 h4p_item').append(
	).append(
		$('<div>').addClass('h4p_item-frame h4p_item-transform').append(
			$('<img>').addClass('h4p_item-inner').attr('src', '../img/cassette/inner_tab.png')
		)
	).append(
		$('<div>').addClass('h4p_item-frame h4p_item-front h4p_item-transform').append(
			$('<div>').addClass('h4p_item-frame h4p_item-thumbnail').css({
				'top':   41,
				'left':  47,
				'width': 265,
				'height':176,
				'border-top-left-radius': '4px 4px',
				'border-top-right-radius': '4px 4px',
			})
		).append(
			$('<div>').addClass('h4p_item-frame').css({
				'top':   217,
				'left':   47,
				'width': 265,
				'height':126,
				'padding': '5px 5px',
				'background-color': 'rgb(255,255,255)',
				'border-bottom-left-radius': '12px 12px',
				'border-bottom-right-radius': '4px 4px'
			}).append(
				$('<p>').addClass('title').css('margin', '8px 0').append($('<a>'))
			).append(
				$('<p>').append($('<span>').addClass('author').html('作成者：<b><a></a></b>'))
			).append(
				$('<p>').append($('<span>').addClass('playcount').html('プレイ回数：<b>回</b>'))
			).append(
				$('<p>').append($('<span>').addClass('source').html('改造元：<b><a></a></b>'))
			).append(
				$('<span>').addClass('state label')
			)
		)
	);
	// マウスオーバーイベント
	$item.find('.h4p_item-front').hover(function() {
		$(this).parent().find('.h4p_item-inner').attr('src', '../img/cassette/inner_notab.png');
		$(this).parent().find('.h4p_item-transform').addClass('transform-on');
	}, function() {
		$(this).parent().find('.h4p_item-inner').attr('src', '../img/cassette/inner_tab.png');
		$(this).parent().find('.h4p_item-transform').removeClass('transform-on');
	});
	// ステージ一覧取得
	var api_fetchstages = view_mode === 'ownview' ? '../stage/fetchmystage.php' : '../stage/fetchstagesbyuserid.php';
	$.post(api_fetchstages, {
		'userid' : user_id,
		'length': 15
	}, function(data, textStatus, xhr) {
		// console.log(data);
		if (data === 'parse-error') {
		}else{
			var result = jQuery.parseJSON(data);
			var $list = $('.h4p_stagelist.list-stage');
			result.values.forEach(function(stage){
				var item = $item.clone(true);
				item.find('.h4p_item-thumbnail').css('background-image', 'url(' + stage.thumbnail + ')');
				item.find('.title a').attr({
					href: '/s?id=' + stage.id,
					title: stage.title,
					target: '_blank'
				}).text(stage.title.length < 25 ? stage.title : stage.title.substr(0, 23) + '…');
				item.find('.author').remove();
				item.find('.playcount b').prepend(stage.playcount);
				if (stage.source_mode === 'replay') {
					item.find('.source a').attr({
						href: '/s?id=' + stage.source_id,
						title: stage.source_title,
						target: '_blank'
					}).text(stage.source_title);
				}else{
					item.find('.source').text('オリジナルステージ');
				}
				var label_lv = (stage.state === 'published' ? 'label-success' :
								stage.state === 'judging'	? 'label-warning' :
								stage.state === 'rejected'	? 'label-danger' : 'label-default');
				var label_tx = (stage.state === 'published' ? '公開中' :
								stage.state === 'judging'	? '審査中' :
								stage.state === 'rejected'	? 'リジェクト' : '非公開');
				item.find('.state').addClass(label_lv).text(label_tx);

				item.appendTo($list);
			});
		}
	});

	$projectItem = $('<div>').addClass('col-lg-6 col-md-12 panel panel-default').append(
		$('<div>').addClass('panel-heading').append(
			$('<pre>').addClass('panel-title')
		)
	).append(
		$('<div>').addClass('panel-body').append(
			$('<p>').append($('<span>').addClass('registered').html('作成日時：<b></b>'))
		).append(
			$('<p>').append($('<span>').addClass('source').html('改造元：<b></b>'))
		).append(
			$('<button>').addClass('btn btn-lg btn-block btn-default').text('開く').attr('data-loading-text', 'データの取得中…')
		)
	);

	$projectItem.find('button').on('click', function(event) {
		var loading = $(this).button('loading');
		var token = $(this).attr('project-token');
		$.post('../stage/fetchprojectbytoken.php', {
			'token': token
		} , function(data, textStatus, xhr) {
			console.log(data);
			loading.button('reset');
			switch(data){
				case 'no-session':
					$('#signinModal').modal('show');
					break;
				case 'missing-project':
					break;
				case 'parse-error':
					break;
				default:
					var value = jQuery.parseJSON(data);
					sessionStorage.setItem('project-token', token);
					sessionStorage.setItem('restaging_code', value.data);
					location.href = '/s?id=' + value.source_id + '&mode=restaging';
					break;
			}
		});
	});

	// プロジェクト一覧取得
	$.post('../stage/fetchmyproject.php',{
		'length': 15
	}, function(data, textStatus, xhr) {
		switch(data){
			case 'no-session':
				$('#signinModal').modal('show');
				break;
			case 'parse-error':
				bsAlert('alert-danger', 'データの取得に失敗しました').append('#h4p_projectlist');
				break;
			default:
				var result = jQuery.parseJSON(data);
				var $list = $('.h4p_projectlist');
				result.values.forEach(function(project){
					var item = $projectItem.clone(true);
					item.find('.panel-title').text(project.data);
					var title = project.source_mode === 'replay' ? 'Re:' + project.source_title : 'オリジナルステージ';
					item.find('.source b').text(title.length > 38 ? (title.substr(0, 37) + '…') : title);
					item.find('.registered b').text(project.registered);
					item.find('.panel-body button').attr('project-token', project.token);

					item.appendTo($list);
				});
				break;
		}
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