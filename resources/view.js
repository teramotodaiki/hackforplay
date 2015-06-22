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
['../s/hackforplay/button_next.png', [266, 48]],
['../s/hackforplay/button_retry.png', [128, 32]],
['../s/hackforplay/clear.png', [480, 320]],
['../s/hackforplay/dot_syuj.png', [ 40, 56], [3, 4]],
['../s/hackforplay/enchantbook.png', [ 64, 64]],
['../s/hackforplay/gameover.png', [480, 320]]
	].forEach(function(param) {

		var path = param[0].substr(5);

		var item = $item.clone(true);
		item.find('.image').attr('src', param[0]);
		item.find('.path').text(path);
		item.find('.size').text(param[1][0] + 'x' + param[1][1]);

		if (param[2]) {
			item.find('button[data-target="#frameModal"]').css({
				'visibility': 'visible'
			}).data('path', param[0]).data('column', param[2][0]).data('row', param[2][1]);
		}

		this.append(item);
	}, $('#anchor-hackforplay .row'));

	[
['../s/enchantjs/apad.png', [100,100]],
['../s/enchantjs/avatarBg1.png', [ 32,128],[4, 1]],
['../s/enchantjs/avatarBg2.png', [320, 50], [1, 4]],
['../s/enchantjs/avatarBg3.png', [320, 32], [1, 4]],
['../s/enchantjs/bar.png', [  1, 16]],
['../s/enchantjs/bigmonster1.gif', [ 80, 80], [4, 3]],
['../s/enchantjs/bigmonster2.gif', [ 80, 80], [4, 3]],
['../s/enchantjs/chara0.png', [ 32, 32], [9, 4]],
['../s/enchantjs/x1.5/chara0.png', [ 48, 48], [9, 4]],
['../s/enchantjs/chara1.png', [ 32, 32], [5, 3]],
['../s/enchantjs/chara2.png', [ 32, 32], [3, 1]],
['../s/enchantjs/chara3.png', [ 32, 32], [6, 4]],
['../s/enchantjs/chara4.png', [ 32, 32], [4, 1]],
['../s/enchantjs/chara5.png', [ 32, 32], [9, 4]],
['../s/enchantjs/x1.5/chara5.png', [ 48, 48], [9, 4]],
['../s/enchantjs/chara6.png', [ 32, 32], [6, 4]],
['../s/enchantjs/chara7.png', [ 32, 32], [9, 4]],
['../s/enchantjs/clear.png', [267, 48]],
['../s/enchantjs/effect0.png', [ 16, 16], [5, 1]],
['../s/enchantjs/enchant.png', [512,512]],
['../s/enchantjs/end.png', [189, 97]],
['../s/enchantjs/font0.png', [ 16, 16], [16,8]],
['../s/enchantjs/font1.png', [ 16, 16], [16,8]],
['../s/enchantjs/font2.png', [ 16, 16], [16,8]],
['../s/enchantjs/gameover.png', []],
['../s/enchantjs/icon0.png', [ 16, 16], [16,5]],
['../s/enchantjs/icon1.png', [ 16, 16], [8, 1]],
['../s/enchantjs/indicator.png', [115,115]],
['../s/enchantjs/map0.png', [ 16, 16], [16,16]],
['../s/enchantjs/x2/map0.png', [ 32, 32], [16,16]],
['../s/enchantjs/map1.png', [ 16, 16], [16,16]],
['../s/enchantjs/x2/map1.png', [ 32, 32], [16,16]],
['../s/enchantjs/map2.png', [ 16, 16], [9, 3]],
['../s/enchantjs/x2/map2.png', [ 32, 32], [9, 3]],
['../s/enchantjs/monster1.gif', [ 48, 48], [4, 2]],
['../s/enchantjs/monster2.gif', [ 64, 64], [4, 3]],
['../s/enchantjs/monster3.gif', [ 48, 48], [4, 3]],
['../s/enchantjs/monster4.gif', [ 48, 48], [4, 2]],
['../s/enchantjs/monster5.gif', [ 80, 80], [4, 3]],
['../s/enchantjs/monster6.gif', [ 64, 64], [4, 3]],
['../s/enchantjs/monster7.gif', [ 48, 48], [4, 2]],
['../s/enchantjs/pad.png', [100,100], [2, 1]],
['../s/enchantjs/space0.png', [ 32, 64]],
['../s/enchantjs/space1.png', [ 64, 64]],
['../s/enchantjs/space2.png', [ 32, 32], [4, 1]],
['../s/enchantjs/space3.png', [ 32, 32], [5, 4]],
['../s/enchantjs/start.png', [236, 48]]
	].forEach(function(param) {

		var path = param[0].substr(5);

		var item = $item.clone(true);
		item.find('.image').attr('src', param[0]);
		item.find('.path').text(path);
		item.find('.size').text(param[1][0] + 'x' + param[1][1]);

		if (param[2]) {
			item.find('button[data-target="#frameModal"]').css({
				'visibility': 'visible'
			}).data('path', param[0]).data('column', param[2][0]).data('row', param[2][1]);
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