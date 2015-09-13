$(function () {

	$('.load-pavilion').on('click', function() {
		var id = $(this).data('id');

		$('.pavilion-info .quest-info-entity').remove();

		// クエストリストのロード
		$.post('../levelmake/getquestlist.php', {
			'id': id
		}, function(data, textStatus, xhr) {

			(data ? $.parseJSON(data).quests : []).forEach(function(quest, index) {

				var questEntity = $('.pavilion-info .quest-info-sample').clone(true, true);

				// クエストの生成
				questEntity.removeClass('quest-info-sample hidden').addClass('quest-info-entity');
				questEntity.find('#QuestInfo').val(quest.Type);

				quest.levels.forEach(function(level) {

					var levelEntity = questEntity.find('.level-wrapper-sample').clone(true, true);
					levelEntity.removeClass('hidden level-wrapper-sample').addClass('level-wrapper-entity');
					levelEntity.find('.PlayOrder').text(level.PlayOrder);
					levelEntity.find('#LevelInfo').val(level.StageID);
					questEntity.find('.quest-body-2').append(levelEntity);

				});

				questEntity.appendTo('.pavilion-info .pavilion-body-1');

			});

		});
	});

});