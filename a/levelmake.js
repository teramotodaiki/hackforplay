$(function () {

	$('.load-pavilion').on('click', function() {
		var id = $(this).data('id');

		$('.pavilion-info .quest-info-entity').remove();
		// $('.pavilion-info .level-wrapper-entity').remove();

		// クエストリストのロード
		(function(sampleQuest) {

			// クエストの生成
			var quest = sampleQuest.clone(true, true);
			quest.removeClass('hidden').addClass('quest-info-entity');

			(function(sampleLevel) {

				// レベルの生成
				var level = sampleLevel.clone(true, true);
				level.removeClass('hidden').addClass('level-wrapper-entity');

				sampleLevel.parent().append(level);

			})(quest.find('.level-wrapper-sample'));

			sampleQuest.parent().append(quest);

		})($('.pavilion-info .quest-info-sample'));
	});
});