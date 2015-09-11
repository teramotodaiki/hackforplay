$(function () {


	// レイアウト
	var currentShowingType = 'easy';

	$('.change-type-button').on('click', function() {
		var showingType = $(this).data('type');

		if (showingType === currentShowingType) return;
		currentShowingType = showingType;

		// クエストを並べ直す
		$('.row .quest-item-entity').remove();
		alignmentQuests();

		// ボタンを押下状態にする
		$('.change-type-button').each(function(index, el) {
			var availability = $(el).data('type') !== showingType;
			$(el).attr({
				'disabled': !availability,
				'src': availability ? $(el).data('psrc') : $(el).data('nsrc')
			});
		});
	});

	function alignmentQuests () {
		// サンプルの取得
		$item = $('.quest-item-sample');

		result.Quests.forEach(function(quest, index) {

			if (quest.Type !== currentShowingType) return;

			var current = $item.clone(true, true);
			current.removeClass('hidden quest-item-sample').addClass('quest-item-entity');
			current.find('.Number').text(index + 1);
			current.find('.Challengers').text(quest.Challengers);
			current.find('.Winners').text(quest.Winners);
			current.find('.Authors').text(quest.Authors.join(', '));
			current.find('.QuestThumbnail').attr('src', quest.Levels[0].Thumbnail);
			current.data('index', index);
			current.find('.achievement-cleared').attr('src', quest.Cleared ? 'img/achievement_p.png' : 'img/achievement_n.png');
			current.find('.achievement-restaged').attr('src', quest.Restaged ? 'img/achievement_p.png' : 'img/achievement_n.png');

			switch (quest.Type) {
				case 'easy':	current.css('background-image', 'url(' + result.EasyBg + ')'); break;
				case 'normal':	current.css('background-image', 'url(' + result.NormalBg + ')'); break;
				case 'hard':	current.css('background-image', 'url(' + result.HardBg + ')'); break;
			}

			this.append(current);

		}, $item.parent());

		// 3番目にキットを差し込む
		if (result.Kit) {
			var kit = $('.kit-item-entity');
			if (kit) {
				kit.insertAfter('.row .quest-item-entity:eq(1)');
			}
		}
	}

	if (result.Kit) {
		var current = $('.kit-item-sample').clone(true, true);
		current.removeClass('hidden kit-item-sample').addClass('kit-item-entity');
		current.find('.Restagers').text('NaN');
		current.find('.Explain').text(result.Kit.Explain);
		current.find('.Thumbnail').attr('src', result.Kit.Thumbnail);
		current.find('.achievement-restaged').attr('src', result.Kit.Restaged ? 'img/achievement_p.png' : 'img/achievement_n.png');
		current.css('background-image', 'url(' + result.KitBg + ')');

		$('.kit-item-sample').parent().append(current);
	}

	// クエストを並べる
	alignmentQuests();

	// クエストモーダル
	$('#questModal .ModalClose,#kitModal .ModalClose').attr('src', result.ModalClose);
	$('#questModal .ModalArrow').attr('src', result.ModalArrow);
	$('.stage-frame-wrapper .stage-frame').attr('src', result.StageFrame);
	$('#questModal').on('show.bs.modal', function(event) {

		var index = $(event.relatedTarget).data('index');

		(function (quest) {

			if (!quest) return;

			$('#questModal .Cleared .' + quest.Cleared + '-text').removeClass('hidden');
			$('#questModal .Cleared .' + (!quest.Cleared) + '-text').addClass('hidden');
			$('#questModal .achievement-cleared').attr('src', quest.Cleared ? 'img/achievement_p.png' : 'img/achievement_n.png');

			$('#questModal .Restaged .' + quest.Restaged + '-text').removeClass('hidden');
			$('#questModal .Restaged .' + (!quest.Restaged) + '-text').addClass('hidden');
			$('#questModal .achievement-restaged').attr('src', quest.Restaged ? 'img/achievement_p.png' : 'img/achievement_n.png');

			$('#questModal .Number').text(index + 1);

			$('#questModal .Challengers').text(quest.Challengers);
			$('#questModal .Winners').text(quest.Winners);

			$('#questModal .Authors').text(quest.Authors.join(', '));

			$('#questModal .modal-content').css('background-image', $(event.relatedTarget).css('background-image'));

			$('.modal-thumbnail-entity,.modal-arrow-entity').remove();

			var $thumbnail = $('#questModal .row .modal-thumbnail-sample').on('click', function() {
				var id = $(this).data('ID');
				if (id) location.href = '/s/?mode=quest&level=' + id;
			});
			var $arrow = $('#questModal .row .modal-arrow-sample');
			result.Quests[index].Levels.forEach(function(level, levelIndex) {
				var current = $thumbnail.clone(true, true);
				current.removeClass('hidden modal-thumbnail-sample').addClass('modal-thumbnail-entity');
				current.find('.Thumbnail').attr('src', level.Thumbnail);
				current.find('.Title').text(level.Title);

				if (level.Allowed) {
					current.data('ID', level.ID);
					current.find('.btn-restage').attr('href', '/s/?mode=restaging&id=' + level.StageID);
				} else {
					current.css({
						'opacity': '0.5',
						'cursor': 'default'
					});
					current.find('.btn-restage').addClass('disabled');
				}

				if (levelIndex > 0) {
					var arrow = $arrow.clone(true, true);
					arrow.removeClass('hidden modal-arrow-sample').addClass('modal-arrow-entity');
					this.append(arrow);
				}
				this.append(current);

			}, $('#questModal .row'));

		})(result.Quests[index]);

	});

	// キットモーダル
	$('#kitModal').on('show.bs.modal', function(event) {

		$(this).find('.Restagers').text('NaN');
		$(this).find('.Explain').text(result.Kit.Explain);
		$(this).find('.Thumbnail').attr('src', result.Kit.Thumbnail);
		$(this).find('.Title').text(result.Kit.Title);
		$(this).find('.modal-content').css('background-image', 'url(' + result.KitBg + ')');
		$(this).find('.modal-kit-entity').on('click', function() {
			location.href = '/s/?mode=restaging&id=' + result.Kit.ID;
		});

	});
});