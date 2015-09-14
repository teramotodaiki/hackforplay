$(function () {

	// Load/Add
	(function () {

		// Load Quest
		$('.load-pavilion').on('click', function() {
			var id = $(this).data('id');
			var loading = $(this).button('loading');
			$('.pavilion-info .query-add-quest').data('id', id);

			$('.pavilion-info .quest-info-entity').remove();

			// クエストリストのロード
			$.post('../levelmake/getquestlist.php', {
				'id': id
			}, function(data, textStatus, xhr) {
				loading.button('reset');
				(data ? $.parseJSON(data).quests : []).forEach(addQuest);
			});
		});

		// Add Quest
		$('.pavilion-info .query-add-quest').on('click', function() {
			var loading = $(this).button('loading');

			$.post('../levelmake/addquest.php', {
				'pavilion_id': $(this).data('id')
			}, function(data, textStatus, xhr) {
				loading.button('reset');

				switch (data) {
					case 'failed': loading.text('FAILED').attr('disabled', true); break;
					default:
						addQuest($.parseJSON(data));
						break;
				}
			});
		});

		// Add Level
		$('.pavilion-info .query-add-level').on('click', function() {
			var loading = $(this).button('loading');
			var container = $(this).parents('.quest-info-entity');

			$.post('../levelmake/addlevel.php', {
				'quest_id': $(this).data('id')
			}, function(data, textStatus, xhr) {
				console.log(data);
				loading.button('reset');

				switch (data) {
					case 'failed': loading.text('FAILED').attr('disabled', true); break;
					default:
						addLevel.call(container, $.parseJSON(data));
						break;
				}
			});
		});

		function addQuest(quest) {

			var questEntity = $('.pavilion-info .quest-info-sample').clone(true, true);

			// クエストの生成
			questEntity.removeClass('quest-info-sample hidden').addClass('quest-info-entity');
			questEntity.find('#Type').val(quest.Type);
			questEntity.find('#Published').prop('checked', quest.Published >> 0);
			questEntity.find('form[data-query="updateQuest"]').data('id', quest.ID);
			questEntity.find('.query-add-level').data('id', quest.ID);
			if (quest.levels.length > 0) {
				questEntity.find('.Debug').attr('href', '/s/?mode=quest&level=' + quest.levels[0].ID);
			}

			quest.levels.forEach(addLevel, questEntity);
			questEntity.appendTo('.pavilion-info .pavilion-body-1');
		}

		function addLevel (level) {
			var levelEntity = this.find('.level-wrapper-sample').clone(true, true);
			levelEntity.removeClass('hidden level-wrapper-sample').addClass('level-wrapper-entity');
			levelEntity.find('.PlayOrder').text(level.PlayOrder);
			levelEntity.find('#LevelInfo').val(level.StageID);
			levelEntity.find('form[data-query="updateLevel"]').data('id', level.ID);
			this.find('.quest-body-2').append(levelEntity);
		}

	})();

	// Update Quest
	$('.pavilion-info form[data-query="updateQuest"]').submit(function(event) {
		event.preventDefault();

		var loading = $(this).find('button[type="submit"]').button('loading');
		var form = $(this);
		form.find('.form-group').removeClass('has-success has-error');
		form.find('.form-control-feedback').removeClass('glyphicon-ok glyphicon-remove');

		$.post('../levelmake/updatequest.php', {
			'id': $(this).data('id'),
			'type': $(this).find('#Type').val(),
			'published': $(this).find('#Published').prop('checked')
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