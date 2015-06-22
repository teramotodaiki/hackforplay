$(function() {

	var $item = $('<div>').addClass('col-md-4 col-sm-6 panel panel-default').append(
		$('<div>').addClass('panel-body').append(
			$('<div>').addClass('thumbnail').css({
				'height': '120px',
				'max-width': '100%',
				'overflow': 'hidden'
			}).append(
				$('<img>').addClass('image')
			)
		).append(
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
	);

	[
['../s/hackforplay/button_next.png', '', '', ''],
['../s/hackforplay/button_retry.png', '', '', ''],
['../s/hackforplay/clear.png', '', '', ''],
['../s/hackforplay/dot_syuj.png', '', '', ''],
['../s/hackforplay/enchantbook.png', '', '', ''],
['../s/hackforplay/gameover.png', '', '', '']
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
			}).data('path', param[0]).data('column', param[4][0]).data('row', param[4][1]);
		}

		this.append(item);
	}, $('#anchor-hackforplay .row'));

	[
['../s/enchantjs/apad.png', '', '', ''],
['../s/enchantjs/avatarBg1.png', '', '', ''],
['../s/enchantjs/avatarBg2.png', '', '', ''],
['../s/enchantjs/avatarBg3.png', '', '', ''],
['../s/enchantjs/bar.png', '', '', ''],
['../s/enchantjs/bigmonster1.gif', '', '', '', [4, 3]],
['../s/enchantjs/bigmonster2.gif', '', '', '', [4, 3]],
['../s/enchantjs/chara0.png', '', '', '', [9, 4]],
['../s/enchantjs/x1.5/chara0.png', '', '', '', [9, 4]],
['../s/enchantjs/chara1.png', '', '', ''],
['../s/enchantjs/chara2.png', '', '', ''],
['../s/enchantjs/chara3.png', '', '', ''],
['../s/enchantjs/chara4.png', '', '', ''],
['../s/enchantjs/chara5.png', '', '', '', [9, 4]],
['../s/enchantjs/x1.5/chara5.png', '', '', '', [9, 4]],
['../s/enchantjs/chara6.png', '', '', ''],
['../s/enchantjs/chara7.png', '', '', '', [9, 4]],
['../s/enchantjs/clear.png', '', '', ''],
['../s/enchantjs/effect0.png', '', '', ''],
['../s/enchantjs/enchant.png', '', '', ''],
['../s/enchantjs/end.png', '', '', ''],
['../s/enchantjs/font0.png', '', '', ''],
['../s/enchantjs/font1.png', '', '', ''],
['../s/enchantjs/font2.png', '', '', ''],
['../s/enchantjs/gameover.png', '', '', ''],
['../s/enchantjs/icon0.png', '', '', ''],
['../s/enchantjs/icon1.png', '', '', ''],
['../s/enchantjs/indicator.png', '', '', ''],
['../s/enchantjs/map0.png', '', '', ''],
['../s/enchantjs/x2/map0.png', '', '', ''],
['../s/enchantjs/map1.png', '', '', ''],
['../s/enchantjs/x2/map1.png', '', '', ''],
['../s/enchantjs/map2.png', '', '', ''],
['../s/enchantjs/x2/map2.png', '', '', ''],
['../s/enchantjs/monster1.gif', '', '', ''],
['../s/enchantjs/monster2.gif', '', '', ''],
['../s/enchantjs/monster3.gif', '', '', ''],
['../s/enchantjs/monster4.gif', '', '', ''],
['../s/enchantjs/monster5.gif', '', '', ''],
['../s/enchantjs/monster6.gif', '', '', ''],
['../s/enchantjs/monster7.gif', '', '', ''],
['../s/enchantjs/pad.png', '', '', ''],
['../s/enchantjs/space0.png', '', '', ''],
['../s/enchantjs/space1.png', '', '', ''],
['../s/enchantjs/space2.png', '', '', ''],
['../s/enchantjs/space3.png', '', '', ''],
['../s/enchantjs/start.png', '', '', '']
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
			}).data('path', param[0]).data('column', param[4][0]).data('row', param[4][1]);
		}

		this.append(item);
	}, $('#anchor-enchantjs .row'));

	$('#useModal').on('show.bs.modal', function(event) {
		var $button = $(event.relatedTarget);
		var text =
		"game.preload(['----path----']);\n"+
		"game.onenterframe = function() {\n"+
		"    createSprite(w, h, {\n"+
		"        x: 0, y: 0,\n"+
		"        image: game.assets['----path----']\n"+
		"    });\n"+
		"}\n";
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

	$('#frameModal').on('hide.bs.modal', function(event) {
		$(this).find('table').children().remove();
	});

});