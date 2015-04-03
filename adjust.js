/*
$(window).on('load resize', function(){
	// 兄弟ノードの幅を計算し、余ったスペースにボックスの幅を合わせる
	$(".width-fit").each(function(){
		var container = this.offsetParent;
		var width = container.offsetWidth;
		var me = this;
		$(container).children().each(function() {
			if(me !== this) width -= this.offsetWidth;
		});
		width = Math.min(width, this.offsetHeight * 1.5);
		$(this).width(width); // 自分のwidthを設定
		console.log(width);
	});

	// containerクラスをもつ要素の高さを設定する
	// 親へ親へと設定する必要があるため、ここでは3回繰り返している
	for (var i = 3; i > 0; i--) {
		$(".container").each(function(index) {
			var $last = $(this).children('*:last');
			$(this).height(parseInt($last.css('margin-top')) + $last.position().top + $last.get(0).offsetHeight);
		});
	}
});
$(function(){
	$(".label").hover(function() {
		$(this).stop().animate({'opacity':'1', 'border-radius':'60px'}, 'fast');
    }, function() {
		$(this).stop().animate({'opacity':'0.7', 'border-radius':'0px'}, 'fast');
    });
	$(".poster").each(function(index, el) {
		var path = el.id;
		$(el).css('background-image', 'url(/s/'+path+'thumb.png)');
	});
});
*/