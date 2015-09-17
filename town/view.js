$(function () {

	(function () {
		// containerの高さは、横幅に応じて決める
		function setContainerHeight () {
			var container_width = $('.container-town').outerWidth(false);
			$('.container-town').height(container_width / 16 * 9); // 横長のディスプレイでは16:9
			// 縦長のディスプレイはまだ対応していない

			// content-textのline-heightを指定する
			$('.content-text').each(function(index, el) {
				$(el).css('line-height', $(el).height() + 'px');
			});
		}
		setContainerHeight();
		$(window).resize(setContainerHeight);
	})();

	// content-imageのロード
	$('.content-ground').attr('src', 'img/ground.png');
	$('.content-pavilion-0 .content-icon').attr('src', 'img/icon/pavilion_rpg.png');
	$('.content-pavilion-1 .content-icon').attr('src', 'img/icon/pavilion_rpg.png');
	$('.content-pavilion-2 .content-icon').attr('src', 'img/icon/pavilion_rpg.png');
	$('.content-pavilion-3 .content-icon').attr('src', 'img/icon/pavilion_rpg.png');
	$('.content-restage-frame').attr('src', 'img/recent_restage_frame.png');
	$('.content-restage-thumbnail').attr('src', '../s/thumbs/016f2d2dccc042097085b7b6b8b10659.png');
	$('.content-achievement-frame').attr('src', 'img/pavilion_achievements.png');
	$('.content-locked-frame').attr('src', 'img/pavilion_locked.png');

	// 動的なテキスト
	$('.content-achievement-text').text("99");
	$('.content-locked-text').text("99/99");

});