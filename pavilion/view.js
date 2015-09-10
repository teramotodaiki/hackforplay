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
			current.find('.item-Modal').data('index', index);
			current.css('background-image', 'url(img/frame_old_easy.png)');
			current.find('.achivement-cleared').attr('src', quest.Cleared ? 'img/achivement_p.png' : 'img/achivement_n.png');
			current.find('.achivement-restaged').attr('src', quest.Restaged ? 'img/achivement_p.png' : 'img/achivement_n.png');

			this.append(current);

		}, $item.parent());
	}

	// クエストを並べる
	alignmentQuests();

	// キットを並べる
	if (result.Kit) {
		var current = $('.kit-item-sample').clone(true, true);
		current.removeClass('hidden kit-item-sample').addClass('kit-item-entity');
		current.find('.Restagers').text('NaN');
		current.find('.Explain').text(result.Kit.Explain);
		current.find('.Thumbnail').attr('src', result.Kit.Thumbnail);
		current.find('.achivement-restaged').attr('src', result.Kit.Restaged ? 'img/achivement_p.png' : 'img/achivement_n.png');

		$('.kit-item-sample').parent().append(current);
	}

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

			$('#questModal .Authors').text(quest.Authors.join(', '));

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

	// キットモーダル
	$('#kitModal').on('show.bs.modal', function(event) {

		$(this).find('.Restagers').text('NaN');
		$(this).find('.Explain').text(result.Kit.Explain);
		$(this).find('.Thumbnail').attr('src', result.Kit.Thumbnail);
		$(this).find('.Title').text(result.Kit.Title);
		$(this).find('.link-restage').attr('href', '/s/?mode=restaging&id=' + result.Kit.ID);

	});
});