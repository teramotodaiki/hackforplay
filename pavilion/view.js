$(function () {

	// サンプルの取得
	$item = $('.quest-item-sample');

	// レイアウト
	console.log(result.Quests);
	result.Quests.forEach(function(item) {
		var current = $item.clone(true, true);
		current.removeClass('hidden');
		current.find('.item-ID').text(item.ID);
		current.find('.item-QuestThumbnail').attr('src', item.Levels[0].Thumbnail);
		current.find('.item-Link').attr('href', '/s/?mode=quest&level=' + item.Levels[0].ID);

		this.append(current);

	}, $item.parent());
});