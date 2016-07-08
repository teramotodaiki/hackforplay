$(function(){

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
	});

	var $projectItem = $('<div>').addClass('col-lg-4 col-md-6 col-sm-6 col-xs-12').append(
		$('<div>').addClass('thumbnail').append(
			$('<img>')
		).append(
			$('<div>').addClass('caption').append(
				$('<button>').addClass('btn btn-lg btn-block btn-default h4p_open-project').text('開く').attr('data-loading-text', 'データの取得中…')
			).append(
				$('<div>').addClass('h4p_title-updater').append(
					$('<span>').css('font-size', '120%').addClass('title')
				).append(
					$('<button>').addClass('btn btn-link').append(
						$('<span>').addClass('glyphicon glyphicon-edit')
					)
				)
			).append(
				$('<p>').addClass('description text-muted')
			).append(
				$('<p>').append($('<span>').addClass('registered').html('作成日時：<b></b>'))
			).append(
				$('<button>').addClass('btn btn-link btn-block h4p_delete-project').text('このプロジェクトを削除').attr('data-loading-text', 'お待ちください…')
			)
		)
	);
	var $projectItem_fixButton = $('<button>').text('元に戻す').addClass('btn btn-link btn-block h4p_fix-project');

	$projectItem.find('.h4p_open-project').on('click', function(event) {
		var loading = $(this).button('loading');
		var token = $(this).attr('project-token');
		$.post('../stage/fetchprojectbytoken.php', {
			'token': token,
			'attendance-token': sessionStorage.getItem('attendance-token')
		} , function(data, textStatus, xhr) {
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
	$projectItem.find('.h4p_delete-project').on('click', function() {
		var loading = $(this).button('loading');
		var token = $(this).attr('project-token');
		var panel = $(this).parents('.thumbnail');
		$.post('../project/deletebytoken.php', {
			'token': token,
			'attendance-token': sessionStorage.getItem('attendance-token')
		} , function(data, textStatus, xhr) {
			loading.button('reset');
			if (data === 'success') {
				panel.find('img').remove();
				panel.find('.caption').fadeOut('fast', function() {
					panel.append(
						bsAlert('alert-success', '削除できました')
					).append(
						$projectItem_fixButton.clone(true).attr('project-token', token)
					);
				});
			}else{
				panel.append(bsAlert('alert-danger', '削除に失敗しました'));
			}
		});
	});
	$projectItem_fixButton.on('click', function() {
		var loading = $(this).button('loading');
		var token = $(this).attr('project-token');
		var panel = $(this).parents('.thumbnail');
		panel.find('.alert').remove();
		$.post('../project/canceldeletionbytoken.php',{
			'token': token,
			'attendance-token': sessionStorage.getItem('attendance-token')
		}, function(data, textStatus, xhr) {
			loading.button('reset');
			if (data === 'failed'){
				panel.prepend(bsAlert('alert-danger', '削除に失敗しました'));
			}else{
				panel.prepend(bsAlert('alert-success', '元に戻しました.このページをリロードしてください'));
				panel.find('.h4p_fix-project').remove();
			}
		});
	});

	// プロジェクト一覧取得
	$.ajax({
		type: 'GET',
		url: '/api/projects',
		data: {
			page: urlParam('page')
		}
	})
	.done(function (result) {

		// pager
		$('.pagination').append(
			$('<li>').addClass('page-item ' + (result.prev_page_url ? '' : ' disabled')).append(
				$('<a>').addClass('page-link').attr({
					href: '?page=' + (result.current_page - 1),
					'aria-label': 'Previous'
				}).append(
					$('<span>').attr('aria-hidden', 'true').text('<<')
				)
			)
		);
		for (var page = 1; page <= result.last_page; page++) {
			$('.pagination').append(
				$('<li>').addClass('page-item' + (page === result.current_page ? ' active' : '')).append(
					$('<a>').addClass('page-link').attr('href', '?page=' + page).text(page)
				)
			)
		}
		$('.pagination').append(
			$('<li>').addClass('page-item' + (result.next_page_url ? '' : ' disabled')).append(
				$('<a>').addClass('page-link').attr({
					href: '?page=' + (result.current_page + 1),
					'aria-label': 'Next'
				}).append(
					$('<span>').attr('aria-hidden', 'true').text('>>')
				)
			)
		);

		var $list = $('.h4p_projectlist');
		result.data.forEach(function(project){
			var item = $projectItem.clone(true);
			item.find('.thumbnail img').attr('src', project.thumbnail || 'img/noimage.png');
			item.find('.title').text(project.title || '-');
			item.find('.description').text(project.description || '-');

			// NOTE: depricated
			var title = project.title;
			item.find('.registered b').text(convertLocaleTimeString(project.Registered));
			item.find('button').attr('project-token', project.token);

			item.appendTo($list);
		});
	})
	.fail(function (xhr) {
		console.error(xhr);
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

	function urlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
	}
});
