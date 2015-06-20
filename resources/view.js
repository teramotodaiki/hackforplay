$(function() {

	var $item = $('<div>').addClass('col-md-4 col-sm-6').append(
		$('<div>').addClass('thumbnail').append(
			$('<img>').addClass('image')
		).append(
			$('<div>').addClass('caption').append(
				$('<h3>').addClass('src')
			).append(
				$('<dl>').append(
					$('<dt>').text('Size')
				).append(
					$('<dd>').addClass('size')
				).append(
					$('<dt>').text('Example of use')
				).append(
					$('<dd>').append(
						$('<a>').addClass('use').attr('target', '_blank')
					)
				)
			).append(
				$('<button>').addClass('btn btn-primary').attr({
					'type': 'button',
					'data-toggle': 'modal',
					'data-target': '#useModal'
				}).text('Use this')
			).append(
				$('<button>').addClass('btn btn-info').attr({
					'type': 'button',
					'data-toggle': 'modal',
					'data-target': '#useModal'
				}).css({
					'display': 'none'
				}).text('View frames')
			)
		)
	);

	var $parent = $('#anchor-enchantjs .row');
	[['../img/lp.jpg', '817x1917', '空のステージ', '../s?id=303']].forEach(function(param) {
		var item = $item.clone(true);
		item.find('.image').attr('src', param[0]);
		item.find('.src').text(param[0].substr(3));
		item.find('.size').text(param[1]);
		item.find('.use').text(param[2]).attr('href', param[3]);

		$parent.append(item);
	});

});