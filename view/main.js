$(function(){
	var mainSize = $(".h4p_landing-main").width();
	if(mainSize < 780) mainSize = 768;
	else if(mainSize < 1026) mainSize = 1024;
	else mainSize = 1440;

	// background-image
	jQuery.each([
		['.l-1', 'img/'+mainSize+'/topback.jpg'],
		['.l-2', 'img/lp-back-2.png'],
		['.l-1 .h4p_landing-header', 'img/'+mainSize+'/logoh4p.png'],
		['.l-3', 'img/'+mainSize+'/topreback.png'],
		['.l-4', 'img/lp-back-4.png'],
		['.l-2 .h4p_landing-header', 'img/'+mainSize+'/whats1.png'],
		['.l-3 .h4p_landing-header', 'img/'+mainSize+'/logore.png'],
		['.l-4 .h4p_landing-header', 'img/'+mainSize+'/whats2.png']
	], function(index, val) {
		var element = $(val[0]);
		var imageURL = val[1];
		var div = $("<div>").addClass('bg').prependTo(element);
		$("<img>").attr('src', imageURL).bind('load', function() {
			setTimeout(function(){
				div.css({
					'background-image': 'url('+imageURL+')',
					'z-index': index
				}).fadeIn('slow');
			}, 1000 + index * 500); // delay
		});
	});

	// button
	jQuery.each([
		[".l-1", 'img/'+mainSize+'/playbutton'],
		[".l-2", 'img/'+mainSize+'/playbutton2'],
		[".l-4", 'img/'+mainSize+'/playbutton3']
	], function(index, val) {
		var element = $(val[0]+" .h4p_landing-footer>a");
		var prefix = val[1];
		// vertical-align : middle
		element.css('line-height', element.parent().height()+'px');
		$("<img>").attr('src', prefix+'_n.png').bind('load', function() {
			setTimeout(function(){
				$("<img>").appendTo(element).attr('src', prefix+'_n.png').hover(function() {
					$(this).attr('src', prefix+'_p.png');
				}, function() {
					$(this).attr('src', prefix+'_n.png');
				}).addClass('btn-bg').fadeIn('slow');
			}, 2500 + index * 500);
		});
		$("<img>").attr('src', prefix+'_p.png'); // 押された時のボタンの画像
	});

	// スマートフォンの警告
	var sp_word = ['Mobile', 'iPhone', 'iPod', 'iPad', 'Android', 'Windows Phone', 'BlackBerry', 'Symbian'];
	sp_word.forEach(function(item){
		if (navigator.userAgent.indexOf(item) !== -1) {
			$('#spModal').modal('show');
		}
	});
});