$(function () {

	// レイアウト
	var currentShowingType;

	$('.change-type-button').on('click', function() {
		var showingType = $(this).data('type');

		if (showingType === currentShowingType) return;
		currentShowingType = showingType;

		// 状態を保存する
		localStorage.setItem('quest-board-showing-type_' + result.PavilionID, showingType);

		// ボタンを押下状態にする
		$('.change-type-button').each(function(index, el) {
			var availability = $(el).data('type') !== showingType;
			$(el).attr({
				'disabled': !availability,
				'src': availability ? $(el).data('psrc') : $(el).data('nsrc')
			});
		});

		// クエストを並べ直す
		$('.row .quest-item-entity').remove();
		alignmentQuests();
	});

	var NumberOfQuest;
	function alignmentQuests () {
		// サンプルの取得
		$item = $('.quest-item-sample');
		var TypeString = $('.change-type-button[disabled="disabled"]').data('number');

		NumberOfQuest = 1;
		result.Quests.forEach(function(quest, index) {

			if (quest.Type !== currentShowingType) return;

			var current = $item.clone(true, true);
			current.removeClass('hidden quest-item-sample').addClass('quest-item-entity');
			current.find('.TypeString').text(TypeString);
			current.find('.Number').text(NumberOfQuest++);
			current.find('.Challengers').text(quest.Challengers);
			current.find('.Winners').text(quest.Winners);
			current.find('.Authors').text(quest.Authors.join(', '));
			current.find('.QuestThumbnail').attr('src', quest.Levels[0].Thumbnail);
			current.data('index', index);
			current.data('id', quest.ID);
			current.find('.achievement-cleared').attr('src', quest.Cleared ? 'img/achievement_p.png' : 'img/achievement_n.png');
			current.find('.achievement-restaged').attr('src', quest.Restaged ? 'img/achievement_p.png' : 'img/achievement_n.png');

			switch (quest.Type) {
				case 'easy':	current.css('background-image', 'url(' + result.EasyBg + ')'); break;
				case 'normal':	current.css('background-image', 'url(' + result.NormalBg + ')'); break;
				case 'hard':	current.css('background-image', 'url(' + result.HardBg + ')'); break;
			}

			current.hide();
			current.fadeIn('fast');

			this.append(current);

		}, $item.parent());

		// 3番目にキットを差し込む
		if (result.Kit) {
			var kit = $('.kit-item-entity');
			if (kit) {
				kit.hide();
				// クエストが２つ未満のとき（NumberOfQuestが3未満のとき）、３番目に差し込むことはできないので、２番目に差し込む
				kit.fadeIn('fast').insertAfter(NumberOfQuest < 3 ? '.row .quest-item-entity:eq(0)':'.row .quest-item-entity:eq(1)');
			}
		}
	}

	if (result.Kit) {
		var current = $('.kit-item-sample').clone(true, true);
		current.removeClass('hidden kit-item-sample').addClass('kit-item-entity');
		current.find('.Makers').text(result.Kit.Makers);
		current.find('.Explain').text(result.Kit.Explain);
		current.find('.Thumbnail').attr('src', result.Kit.Thumbnail);
		current.find('.achievement-restaged').attr('src', result.Kit.Restaged ? 'img/achievement_p.png' : 'img/achievement_n.png');
		current.css('background-image', 'url(' + result.KitBg + ')');

		$('.kit-item-sample').parent().append(current);
	}

	// 保存された状態があれば再開する
	(function () {
		var type = localStorage.getItem('quest-board-showing-type_' + result.PavilionID);
		if (type) {
			$('.change-type-button[data-type="' + type + '"]').trigger('click');
		} else {
			// デフォルト(easy)でクエストを並べる
			currentShowingType = 'easy';
			alignmentQuests();
		}
	})();

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

			$('#questModal .Authors').text(quest.Authors.join(', '));

			$('#questModal .modal-content').css('background-image', $(event.relatedTarget).css('background-image'));

			$('.modal-thumbnail-entity,.modal-arrow-entity').remove();

			var $thumbnail = $('#questModal .row .modal-thumbnail-sample');
			$thumbnail.find('.stage-frame-wrapper').on('click', function() {
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
					current.find('.stage-frame-wrapper').data('ID', level.ID);
				} else {
					current.find('.stage-frame-wrapper').css({
						'opacity': '0.5',
						'cursor': 'default'
					});
				}

				if (level.Cleared) {
					current.find('.btn-restage').attr('href', '/s/?mode=quest&directly_restaging=true&level=' + level.ID);
				} else {
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

		$('#kitModal .Restaged .' + result.Kit.Restaged + '-text').removeClass('hidden');
		$('#kitModal .Restaged .' + (!result.Kit.Restaged) + '-text').addClass('hidden');
		$('#kitModal .achievement-restaged').attr('src', result.Kit.Restaged ? 'img/achievement_p.png' : 'img/achievement_n.png');

		$(this).find('.Explain').text(result.Kit.Explain);
		$(this).find('.Thumbnail').attr('src', result.Kit.Thumbnail);
		$(this).find('.Title').text(result.Kit.Title);
		$(this).find('.modal-content').css('background-image', 'url(' + result.KitBg + ')');
		$(this).find('.modal-kit-entity .stage-frame-wrapper').on('click', function() {
			location.href = '/s/?mode=official&directly_restaging=true&id=' + result.Kit.ID + '&report=' + !result.Kit.Restaged;
		});

	});

});