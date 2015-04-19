// bootstrapと併用するためのcss補完スクリプト

// 呼び出し処理
(function(){
	var invokeFlag = true;
	$(window).on('load resize', function() {
		invokeFlag = true;
	});
	$(function(){
		setInterval(function(){
			if(invokeFlag){
				style(jQuery);
				invokeFlag = false;
			}
		}, 100);
	});
})();

// メイン
function style ($) {
	// Headerのnav内リンク要素を垂直方向に中央寄せ
	(function(height){
		$(".nav li a").each(function() {
			$(this).css('line-height', height);
		});
	})($(".h4p_header:first").css('height'));
	// h4p_item-thumbnailの指定
	(function(){
		$("div.col-md-6 div.h4p_item-thumbnail").each(function() {
			$(this).css({
				'background-image':'url('+$(this).children('.h4p_item-src').text()+')',
				'height':$(this).width() / 1.2
			});
		});
		$("div.col-md-4 div.h4p_item-thumbnail").each(function() {
			$(this).css({
				'background-image':'url('+$(this).children('.h4p_item-src').text()+')',
				'height':$(this).width() / 1.5
			});
		});
		$("div.col-md-3 div.h4p_item-thumbnail").each(function() {
			$(this).css({
				'background-image':'url('+$(this).children('.h4p_item-src').text()+')',
				'height':$(this).width() / 1.55
			});
		});
	})();
	// navbar-centerをセンタリング
	// (function(){
	// 	$(".navbar-center").each(function() {
	// 		$(this).css('margin-left', $(this.parentNode).width()/2-$(this).width()/2);
	// 	});
	// })();
}