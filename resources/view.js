$(function() {

	var $item = $('<div>').addClass('col-md-4 col-sm-6').append(
		$('<div>').addClass('thumbnail').append(
			$('<img>').addClass('image')
		).append(
			$('<div>').addClass('caption').append(
				$('<h3>').addClass('path')
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
					'data-target': '#frameModal'
				}).css({
					'visibility': 'hidden',
					'margin-left': '5px'
				}).text('View frames')
			)
		)
	);

	var $parent = $('#anchor-enchantjs .row');
	[['../img/lp.jpg', '817x1917', '空のステージ', '../s?id=303'],
	['../s/enchantjs/x1.5/chara0.png', '48x48', 'リンク', '', [4, 9]]
	].forEach(function(param) {

		var path = param[0].substr(5);

		var item = $item.clone(true);
		item.find('.image').attr('src', param[0]);
		item.find('.path').text(path);
		item.find('.size').text(param[1]);
		item.find('.use').text(param[2]).attr('href', param[3]);
		item.find('button[data-target="#useModal"]').data('path', path);

		if (param[4]) {
			item.find('button[data-target="#frameModal"]').css({
				'visibility': 'visible'
			}).data('path', param[0]).data('row', param[4][0]).data('column', param[4][1]);
		}

		$parent.append(item);
	});

	$('#useModal').on('show.bs.modal', function(event) {
		var $button = $(event.relatedTarget);
		var text = $(this).find('pre').text();
		$(this).find('pre').text(text.replace(/----.*----/g, function(match) {
			var key = match.substr(4, match.length - 8);
			return $button.data(key);
		}));
	});

	$('#frameModal').on('shown.bs.modal', function(event) {
		var $button = $(event.relatedTarget);
		var $table = $(this).find('table');

		$(this).find('.frameMap').width($(this).find('.modal-body').width());

		// load resource
		$(this).find('.frameMap img').attr('src', $button.data('path')).on('load', function() {
			// callback then loaded
			var w = $(this).parent().width();
			var h = w / this.naturalWidth * this.naturalHeight;
			$(this).parent().height(h);
			$(this).width(w);
			$(this).height(h);
			$table.width(w);
			$table.height(h);
		});

		// tile
		var row = parseInt($button.data('row'), 10);
		var column = parseInt($button.data('column'), 10);
		for (var i = 0; i < row; i++) {
			var $tl = $('<tr>').appendTo($table);
			for (var j = 0; j < column; j++) {
				$('<td>').text(i * column + j).appendTo($tl);
			}
		}
	});


});