$(function(){

	// ユーザー情報取得
	var user_id = sessionStorage.getItem('view_user_id');
	checkSigninSession(function(result){
		if (result === 'success') {
			$.post('../auth/getmyinfo.php',{
				'attendance-token': sessionStorage.getItem('attendance-token')
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
						$('.h4p_own-nickname').text(info.nickname);
						if (info.profile_image_url) {
							$('.h4p_own-thumbnail').attr('src', info.profile_image_url);
						} else {
							$('.h4p_own-thumbnail').attr('src', info.gender === 'male' ? 'icon_m.png' : 'icon_w.png');
						}
						break;
				}
			});
		}
	});

	// 一覧表示
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
				$('<a>').addClass('state label').attr('href', 'javascript:void(0)')
			).append(
				$('<a>').addClass('btn btn-link btn-sm hide show_reason').attr({
					'data-toggle': 'modal',
					'data-target': '#reasonModal'
				}).text('リジェクトされた理由')
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
	$item.find('.state').on('click', function() {
		$(this).off('click').off('mouseenter mouseleave');
		var state = $(this).data('state');
		var id = $(this).data('stage_id');
		var $label = $(this);
		var pattern = {
			'published' : {
				nextState : 'private',
				message : '非公開にしました'
			},
			'private' : {
				nextState : 'published',
				message : '公開しました'
			},
			'judging' : {
				nextState : 'pending',
				message : '審査を停止しました'
			},
			'queue' : {
				nextState : 'pending',
				message : '審査を停止しました'
			}
		};
		if (pattern[state] === undefined) return;
		$.post('../stage/changestate.php', {
			'stage_id': id,
			'state': pattern[state].nextState,
			'attendance-token': sessionStorage.getItem('attendance-token')
		}, function(data, textStatus, xhr) {
			$label.text(data === 'success' ? pattern[state].message : '失敗しました').removeClass('label-success label-default label-success label-warning label-primary').addClass('label-info');
		});
	});
	// ステージ一覧取得（１つ多く取得して、次のページがあるかどうか調べる）
	var view_param_length = 15;
	$.post('../stage/fetchmystage.php', {
		'start': sessionStorage.getItem('view_param_start'),
		'length': view_param_length + 1,
		'attendance-token': sessionStorage.getItem('attendance-token')
	}, function(data, textStatus, xhr) {
		if (data === 'parse-error') {
		}else{
			var result = jQuery.parseJSON(data);
			var $list = $('.h4p_stagelist.list-stage');
			if (result.values.length === 0) {
				// ひとつもステージを作成していない
				var topicView = createTopicView();
				$(topicView).appendTo($list);
			}
			var view_param_start = parseInt(sessionStorage.getItem('view_param_start'), 10);
			if (result.values.length > view_param_length) {
				// 次のページが存在する
				var next = view_param_start + view_param_length;
				$('a.go_page_next').attr('href', location.pathname + '?start=' + next);
				delete result.values[view_param_length];
			}else{
				$('a.go_page_next').remove();
			}
			if (view_param_start > 0) {
				// 前のページが存在する
				var previous = Math.max(view_param_start - view_param_length, 0);
				$('a.go_page_previous').attr('href', location.pathname + '?start=' + previous);
			}else{
				$('a.go_page_previous').remove();
			}
			result.values.forEach(function(stage){
				var item = $item.clone(true);
				item.find('.h4p_item-thumbnail').on('click', function() {
					window.open('/s?id=' + stage.id, '_blank');
				});
				if (stage.thumbnail) {
					item.find('.h4p_item-thumbnail').css('background-image', 'url(' + stage.thumbnail + ')');
				}
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
								stage.state === 'queue'		? 'label-warning' :
								stage.state === 'pending'	? 'label-primary' :
								stage.state === 'rejected'	? 'label-danger' : 'label-default');
				var label_tx = (stage.state === 'published' ? '公開中' :
								stage.state === 'judging'	? '審査中' :
								stage.state === 'queue'		? '処理中' :
								stage.state === 'pending'	? '審査停止中' :
								stage.state === 'rejected'	? 'リジェクト' : '非公開');
				var label_pt = (stage.state === 'published' ? true :
								stage.state === 'judging'	? true :
								stage.state === 'queue'		? true :
								stage.state === 'private'	? true : false);
				item.find('.state').addClass(label_lv).text(label_tx).data('state', stage.state).data('stage_id', stage.id);
				if (label_pt) {
					item.find('.state').hover(function() {
						$(this).text(
							stage.state === 'published' ? '非公開にする' :
							stage.state === 'judging'	? '審査を停止する' :
							stage.state === 'queue'		? '審査を停止する' : '公開する');
					}, function() {
						$(this).text(label_tx);
					});
				}else{
					item.find('.state').css('cursor', 'default');
				}
				if (stage.state === 'rejected') {
					var reason_json = JSON.stringify(stage.reject_reason);
					item.find('.show_reason').removeClass('hide').data({
						reason: reason_json,
						notice: stage.reject_notice
					});
				}
				item.appendTo($list);
			});
		}
	});

	// リジェクトされた理由を表示するモーダル
	var $reasonItem =
	$('<div>').addClass('alert alert-danger').append(
		$('<p>').addClass('message')
	);
	$('#reasonModal').on('show.bs.modal', function(event) {
		$(this).find('.modal-body').children().remove();
		var $button = $(event.relatedTarget);
		var reason_json = $button.data('reason');
		var reason = $.parseJSON(reason_json);
		reason.forEach(function(item){
			var reasonItem = $reasonItem.clone(true);
			reasonItem.text(item);
			reasonItem.appendTo('#reasonModal .modal-body');
		});
		$('<pre>').text($button.data('notice')).appendTo('#reasonModal .modal-body');
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

	function convertLocaleTimeString (datetimeoffset) {
		var _t = datetimeoffset.indexOf(' ');
		datetimeoffset = datetimeoffset.substr(0, _t) + 'T' + datetimeoffset.substr(_t + 1).replace(' ', '');
		var timestamp = new Date(datetimeoffset).getTime();
		var date = new Date(timestamp - 60 * 1000 * new Date().getTimezoneOffset());
		return date.toLocaleString();
	}
});
