$(function(){
	var mainSize = $(".h4p_landing-main").width();
	if(mainSize < 780) mainSize = 768;
	else if(mainSize < 1026) mainSize = 1024;
	else mainSize = 1440;

	// background-image
	var bgImageList = [
		['.l-1', 'img/'+mainSize+'/topback.png'],
		['.l-1 .h4p_landing-header', 'img/'+mainSize+'/logoh4p.png']
	];
	var loadAndFadein = function(index){
		if (bgImageList.length <= index) return;
		var selector = bgImageList[index][0];
		var imageURL = bgImageList[index][1];
		var $bg = $('<div>').addClass('bg').prependTo(selector);
		$('<img>').attr('src', imageURL).on('load', function() {
			$bg.css({
				'background-image': 'url(' + imageURL + ')',
				'z-index': index
			}).fadeIn('slow', function(){
				loadAndFadein(index + 1); // next routine
			});
		});
	};
	loadAndFadein(0);

	// button
	var btnImageList = [
		[".l-1", 'img/'+mainSize+'/playbutton']
	];

	var loadAndSetPN = function(index){
		if (btnImageList.length <= index) return;
		var imageURL_n = btnImageList[index][1] + '_n.png';
		var imageURL_p = btnImageList[index][1] + '_p.png';
		var $el = $(btnImageList[index][0] + ' .h4p_landing-footer>a');
		$el.css('line-height', $el.parent().height()+'px');
		var $img =
		$("<img>").attr('src', imageURL_n).on('load', function() {
			$(this).off('load');
			$('<img>').attr('src', imageURL_p).on('load', function() {
				$(this).off('load');
				$img.hover(function() {
					$(this).attr('src', imageURL_p);
				}, function() {
					$(this).attr('src', imageURL_n);
				}).addClass('btn-bg').css('z-index', '20').fadeIn('slow', function(){
					loadAndSetPN(index + 1);
				});
				$el.append($img); // imageURL_n
			});
		});
	};
	loadAndSetPN(0);

});
