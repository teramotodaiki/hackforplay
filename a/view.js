$(function(){
	var $item = $('<div>').addClass('col-md-12 panel').append(
		$('<div>').addClass('row panel-body').append(
			$('<div>').addClass('col-md-4').append(
				$('<div>').addClass('h4p_item-thumbnail').css({
					'margin-left':   'auto',
					'margin-right':  'auto',
					'width': 265,
					'height':176
				})
			)
		).append(
			$('<div>').addClass('col-md-4').append(
				$('<p>').append($('<span>').addClass('title').html('<a></a>'))
			).append(
				$('<p>').append($('<span>').addClass('registered').html('作成日：<b></b>'))
			).append(
				$('<p>').append($('<span>').addClass('author').html('作成者：<b><a></a></b>'))
			).append(
				$('<p>').append($('<span>').addClass('source').html('改造元：<b><a></a></b>'))
			)
		).append(
			$('<div>').addClass('col-md-4').append(
				$('<button>').addClass('btn btn-warning btn-block h4p_accept-button').data('toggle', 'modal').data('target', '#codeModal')
			).append(
				$('<button>').addClass('btn btn-danger btn-block h4p_accept-button')
			)
		)
	);

	var $list = $('.list-judging');
	var item = $item.clone(true);
	item.appendTo($list);
});