$(function () {

	// サンプルの取得
	$item = $('.quest-item-sample');

	// レイアウト
	result.Quests.forEach(function(item, index) {
		var current = $item.clone(true, true);
		current.removeClass('hidden');
		current.find('.Number').text(index + 1);
		current.find('.Challengers').text(item.Challengers);
		current.find('.Winners').text(item.Winners);
		current.find('.Authors').text(item.Authors);
		current.find('.QuestThumbnail').attr('src', item.Levels[0].Thumbnail);
		current.find('.item-Modal').data('index', index);

		this.append(current);

	}, $item.parent());

	// クエストモーダル
	$('#questModal').on('show.bs.modal', function(event) {

		var index = $(event.relatedTarget).data('index');

		(function (quest) {

			if (!quest) return;

			$('#questModal .Cleared .' + quest.Cleared + '-text').removeClass('hidden');
			$('#questModal .Cleared .' + (!quest.Cleared) + '-text').addClass('hidden');

			$('#questModal .Restaged .' + quest.Restaged + '-text').removeClass('hidden');
			$('#questModal .Restaged .' + (!quest.Restaged) + '-text').addClass('hidden');

			$('#questModal .Number').text(index + 1);

			$('#questModal .Challengers').text(quest.Challengers);
			$('#questModal .Winners').text(quest.Winners);

			console.log(quest.Authors);
			$('#questModal .Authors').text(quest.Authors);

			$('#questModal .row').children().remove();
			result.Quests[index].Levels.forEach(function(level) {
				var $div = $('<div>').addClass('col-xs-4');
				var $img = $('<img>').addClass('img-responsive').attr('src', level.Thumbnail);
				var $p = $('<p>').addClass('text-center').text(level.Title);
				var $a = $('<a>').attr('href', '/s/?mode=quest&level=' + level.ID);
				if (!level.Allowed) $a.css('opacity', '0.5').attr('href', '#');

				$div.append($img);
				$div.append($p);
				$a.append($div);
				$('#questModal .row').append($a);
			});

		})(result.Quests[index]);

	});
});