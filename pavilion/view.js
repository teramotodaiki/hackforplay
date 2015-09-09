$(function () {

	// サンプルの取得
	$item = $('.quest-item-sample');

	// レイアウト
	result.Quests.forEach(function(item, index) {
		var current = $item.clone(true, true);
		current.removeClass('hidden');
		current.find('.item-ID').text(item.ID);
		current.find('.item-QuestThumbnail').attr('src', item.Levels[0].Thumbnail);
		current.find('.item-Modal').data('index', index);

		this.append(current);

	}, $item.parent());

	// クエストモーダル
	$('#questModal').on('show.bs.modal', function(event) {

		var index = $(event.relatedTarget).data('index');

		if (result.Quests[index]) {

			$('#questModal .row').children().remove();
			result.Quests[index].Levels.forEach(function(item) {
				var $div = $('<div>').addClass('col-xs-4');
				var $img = $('<img>').addClass('img-responsive').attr('src', item.Thumbnail);

				$div.append($img);
				$('#questModal .row').append($div);

			});
		}

	});
});