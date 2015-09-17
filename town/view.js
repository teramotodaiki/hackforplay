$(function () {

	// content-imageのロード
	$('.content-ground').attr('src', 'img/ground.png');
	$('.content-restage-frame').attr('src', 'img/recent_restage_frame.png');
	$('.content-restage-thumbnail').attr('src', '../s/thumbs/016f2d2dccc042097085b7b6b8b10659.png');
	$('.content-achievement-frame').attr('src', 'img/pavilion_achievements.png');
	$('.content-locked-frame').attr('src', 'img/pavilion_locked.png');

	// ボタンイベントの実装
	$('.content-button').on('click', function() {
		if (!$(this).hasClass('button-available')) return;
		var query = $(this).data('query');
		var args = $(this).data('args');

		switch (query) {
		case 'pavilion':
			location.href = '../pavilion/?id=' + args;
			break;
		case 'project':
			$.post('../stage/fetchprojectbytoken.php', {
				'token': args
			} , function(data, textStatus, xhr) {
				switch(data){
				case 'no-session':
				case 'missing-project':
				case 'parse-error':
					break;
				default:
					var value = $.parseJSON(data);
					sessionStorage.setItem('project-token', args);
					sessionStorage.setItem('restaging_code', value.data);
					location.href = '/s?mode=restaging&id=' + town.recent_project.SourceStageID;
					break;
				}
			});
			break;
		}
	});

	// パビリオンの表示・解放実績
	town.pavilions.forEach(function (pavilion, index) {
		var wrapper = $('.content-pavilion-' + pavilion.LocationNumber);
		wrapper.removeClass('hidden');
		wrapper.find('.content-icon').attr('src', pavilion.Icon);
		if (pavilion.Certified) {
			wrapper.find('.content-achievement-frame').removeClass('hidden');
			wrapper.find('.content-achievement-text').removeClass('hidden').text(0);
			wrapper.data('args', pavilion.ID);
			wrapper.addClass('button-available');

			// ショートカットにリンクを追加
			$('.container-shortcut ul').append($('<li>').append($('<a>').attr({
				'href': '../pavilion/?id=' + pavilion
			}).text(pavilion.DisplayName).addClass('btn btn-link')));
		} else {
			wrapper.find('.content-locked-frame').removeClass('hidden');
			wrapper.find('.content-locked-text').removeClass('hidden').text(town.has_achievements + '/' + pavilion.RequiredAchievements);
		}
	});

	// 最後に保存したプロジェクト
	if (town.recent_project) {
		$('.content-restage').removeClass('hidden').addClass('button-available');
		$('.content-restage-thumbnail').attr('src', town.recent_project.Thumbnail);
		$('.content-restage').data('args', town.recent_project.Token);
	}

	// containerの高さは、横幅に応じて決める
	function render () {
		var container_width = $('.container-town').outerWidth(false);
		$('.container-town').height(container_width / 16 * 9); // 横長のディスプレイでは16:9
		// 縦長のディスプレイはまだ対応していない

		// content-textのline-heightを指定する
		$('.content-text').each(function(index, el) {
			$(el).css('line-height', $(el).height() + 'px');
		});
	}
	render();
	$(window).resize(render);

});