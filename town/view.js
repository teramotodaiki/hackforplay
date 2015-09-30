$(function () {

	// content-imageのロード
	(function loadAndTimelineStart () {
		var stackNum = arguments.length;
		for (var i = 0; i < arguments.length; i++) {
			arguments[i].on('load', function() {
				stackNum--;
				if (stackNum === 0) {
					// .timeline-0sから.timeline-10sまでに.timeline-activeをくわえる
					showTimeline(0);
				}
			});
		}
		function showTimeline (index) {
			$('.timeline.timeline-' + index + 's').addClass('timeline-active');
			if (index < 10) {
				setTimeout(function () {
					showTimeline(index + 1);
				}, 1000);
			}
		}
	})(
		$('.content-ground').attr('src', 'img/ground.png'),
		$('.content-restage-frame').attr('src', 'img/recent_restage_frame.png'),
		$('.content-achievement-frame').attr('src', 'img/pavilion_achievements.png'),
		$('.content-locked-frame').attr('src', 'img/pavilion_locked.png'),
		$('.content-cloud-1').attr('src', 'img/cloud1.png'),
		$('.content-cloud-2').attr('src', 'img/cloud2.png'),
		$('.content-cloud-3').attr('src', 'img/cloud3.png')
	);

	// 雲のアニメーション
	$('.content-cloud').each(function task(index, el) {
		var $el = $(el);
		var duration = Math.random() * 4000 + 8000;
		$el.css({
			left: Math.random() * 15 + '%',
			top: Math.random() * 85 + '%',
			opacity: 0
		});
		// 前半
		setTimeout(function () {
			$el.animate({
				left: '+=35%',
				opacity: 1
			}, {
				duration: duration / 2,
				easing: 'linear',
				complete: function() {
					// 後半
					$el.animate({
						left: '+=35%',
						opacity: 0
					}, {
						duration: duration / 2,
						easing: 'linear',
						complete: function () {
							task(index, this);
						}
					});
				}
			});
		}, Math.random() * 4000);
	});

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
		if (pavilion.Certified >> 0) {
			wrapper.find('.content-achievement-frame').removeClass('hidden');
			wrapper.find('.content-achievement-text').removeClass('hidden').text(pavilion.Achievements);
			wrapper.data('args', pavilion.ID);
			wrapper.addClass('button-available');
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