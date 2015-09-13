$(function () {

	$('.load-pavilion').on('click', function() {
		var id = $(this).data('id');
		var loading = $(this).button('loading');

		$('.pavilion-info .quest-info-entity').remove();

		// クエストリストのロード
		$.post('../levelmake/getquestlist.php', {
			'id': id
		}, function(data, textStatus, xhr) {
			loading.button('reset');

			(data ? $.parseJSON(data).quests : []).forEach(function(quest, index) {

				var questEntity = $('.pavilion-info .quest-info-sample').clone(true, true);

				// クエストの生成
				questEntity.removeClass('quest-info-sample hidden').addClass('quest-info-entity');
				questEntity.find('#QuestInfo').val(quest.Type);
				questEntity.find('form[data-query="updateQuest"]').data('id', quest.ID);

				quest.levels.forEach(function(level) {

					var levelEntity = questEntity.find('.level-wrapper-sample').clone(true, true);
					levelEntity.removeClass('hidden level-wrapper-sample').addClass('level-wrapper-entity');
					levelEntity.find('.PlayOrder').text(level.PlayOrder);
					levelEntity.find('#LevelInfo').val(level.StageID);
					levelEntity.find('form[data-query="updateLevel"]').data('id', level.ID);
					questEntity.find('.quest-body-2').append(levelEntity);

				});

				questEntity.appendTo('.pavilion-info .pavilion-body-1');

			});

		});
	});

	// Update quest
	$('.pavilion-info form[data-query="updateQuest"]').submit(function(event) {
		event.preventDefault();

		var loading = $(this).find('button[type="submit"]').button('loading');
		var form = $(this);
		form.find('.form-group').removeClass('has-success has-error');
		form.find('.form-control-feedback').removeClass('glyphicon-ok glyphicon-remove');

		$.post('../levelmake/updatequest.php', {
			'id': $(this).data('id'),
			'type': $(this).find('#QuestInfo').val()
		}, function(data, textStatus, xhr) {
			loading.button('reset');

			switch (data) {
				case "success":
					form.find('.form-group').addClass('has-success has-feedback');
					form.find('.form-control-feedback').addClass('glyphicon-ok');
					break;
				case "invalid-id":
					alert('Error: Invalid ID');
				case "invalid-type":
				default:
					form.find('.form-group').addClass('has-error has-feedback');
					form.find('.form-control-feedback').addClass('glyphicon-remove');
					break;
			}
		});
	});

	// Update level
	$('.pavilion-info form[data-query="updateLevel"]').submit(function(event) {
		event.preventDefault();

		var loading = $(this).find('button[type="submit"]').button('loading');
		var form = $(this);
		form.find('.form-group').removeClass('has-success has-error');
		form.find('.form-control-feedback').removeClass('glyphicon-ok glyphicon-remove');

		$.post('../levelmake/updatelevel.php', {
			'id': $(this).data('id'),
			'stageid': $(this).find('#LevelInfo').val()
		}, function(data, textStatus, xhr) {
			loading.button('reset');

			switch (data) {
				case "success":
					form.find('.form-group').addClass('has-success has-feedback');
					form.find('.form-control-feedback').addClass('glyphicon-ok');
					break;
				case "invalid-id":
					alert('Error: Invalid ID');
				case "invalid-stageid":
				default:
					console.log('error', data);
					form.find('.form-group').addClass('has-error has-feedback');
					form.find('.form-control-feedback').addClass('glyphicon-remove');
					break;
			}
		});
	});

});