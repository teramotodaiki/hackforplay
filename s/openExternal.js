// 汎用的な ExternalLinkWindow  Hack.openExternal で制御する
(function (SC, YT) {
	window.SC = undefined; // SoundCloud
  window.addEventListener('message', function (event) {
    if (event.data.query !== 'openExternal') return;
    var component;
		try {
			component = document.createElement('a');
			component.href = event.data.url;
		} catch (e) { console.error(e); return; }
		var domain = component.hostname.replace(/^www\./, '');
		var pathname = component.pathname.replace(/^\//, '');
		var $all = $('.container-open-external .item-open-external');
		var $item = $all.filter(function () {
			// 1.全く同じURL
			return $(this).hasClass('visible') && $(this).attr('data-href') === component.href;
		});
		if ($item.length > 0) return;
		$item = $all.filter(function() {
			// 2.同じドメイン ===> Override
			return $(this).hasClass('visible') && $(this).data('domain') === domain;
		}).first();
		$item = $item.length > 0 ? $item : $all.filter(function() {
			// 3.空いているところ
			return !$(this).hasClass('visible');
		}).first();
		if ($item.length === 0) return; // No empty
		var $wrapper = $item.find('.embed-frame');
		$wrapper.children().remove();
		$item.attr({
			'data-href': component.href,
			'data-domain': domain
		}).addClass('visible');
		switch (domain) {
			case 'soundcloud.com': openSoundCloud($wrapper, component.href); break;
			case 'hackforplay.xyz': openLink($wrapper, parse(component).id); break;
			case 'play.hackforplay': openLink($wrapper, pathname); break;
			case 'youtu.be': openYouTube($wrapper, pathname); break;
			case 'youtube.com': openYouTube($wrapper, parse(component).v); break;
			case 'restaging.hackforplay':
			if ( !$('.container.container-game').hasClass('restaging') ) {
				// ゲーム側からリステージングを開始する
				$('.begin_restaging').trigger('click');
			}
			$item.removeClass('visible');
			break;
			case 'error.hackforplay': openError($wrapper, parse(component)); break;
		}
	});
	function openSoundCloud ($wrapper, track_url) {
		SC.oEmbed(track_url, { auto_play: true, maxheight: $wrapper.height() }).then(function(oEmbed) {
			$wrapper.html(oEmbed.html);
			openAndAutoclose($wrapper);
		}).catch(function (error) {
			$wrapper.append(
				$('<h1>').append(
					$('<span>').addClass('label label-danger').text(error.status)
				)
			).append(
				$('<h4>').addClass('text-muted').text(error.message)
			).append(
				$('<span>').addClass('text-info').text(track_url)
			);
		});
	}
	function openLink ($wrapper, stage_id) {
		$wrapper.append(
			$('<div>').addClass('fit cover-thumbnail').css('background-image', stage_id ? ('url(../thumbnail/?stage_id=' + stage_id + ')') : 'url(../town/img/ground.png)')
		).append(
			$('<div>').addClass('fit cover-black text-center').append(
				$('<span>').addClass('glyphicon glyphicon-play-circle')
			)
		).on('click', function() {
			alert_on_unload = false; // 警告を出さない
			location.href = location.origin + '/s/?id=' + stage_id;
		}).parents('.item-open-external').addClass('opened').find('.glyphicon-remove').addClass('invisible');
	}
	function openYouTube ($wrapper, videoId) {
		var $div = $('<div>').attr('id', 'player-' + videoId).addClass('fit').appendTo($wrapper);
		var player;
		if (typeof YT.Player === 'function') {
			task();
		} else {
			window.onYouTubeIframeAPIReady = function () {
				if ($div.get(0)) task();
			};
		}
		function task () {
			player = new YT.Player($div.attr('id'), {
				width: $div.width(),
				height: $div.height(),
				videoId: videoId,
				playerVars: { autoplay: true },
				events: {
					onReady: function () { openAndAutoclose($wrapper); }
				}
			});
		}
	}
	function openError ($wrapper, error) {
		var message = decodeURIComponent(error.message);
		$wrapper.append(
			$('<div>').addClass('fit alert alert-danger').append(
				$('<h3>').text(message).append(
					$('<span>').addClass('label label-danger')
				)
			)
		).append(
			$('<div>').addClass('fit cover-alert text-center').append(
				$('<span>').addClass('glyphicon glyphicon-flash')
			)
		);
		openAndAutoclose($wrapper);
	}
	function parse (url) {
		var params = {};
		if (url.search.length > 0) {
			url.search.substr(1).split('&').forEach(function (item) {
				var parts = item.split('=');
				params[parts[0]] = decodeURIComponent(parts[1]);
			});
		}
		return params;
	}
	function openAndAutoclose ($wrapper) {
		var $item = $wrapper.parents('.item-open-external');
		$item.addClass('opened');
		var timeoutID = setTimeout(function () {
			$item.removeClass('opened');
		}, 5000);
		$item.hover(function() {
			clearTimeout(timeoutID);
		});
	}
})(window.SC, window.YT);
(function () {
	// Common view and Resize optimiser
	var oldHeight = 0, timeoutID = null, maxWindowNum = 3;
	resizeTask();
	$(window).resize(function(event) {
		var height = $('.container-open-external').height();
		if (oldHeight === height) return;
		if (timeoutID !== null) {
			clearTimeout(timeoutID);
			timeoutID = setTimeout(resizeTask, 100);
		} else {
			resizeTask();
			timeoutID = setTimeout(null, 100);
		}
	});
	function resizeTask () {
		var $container = $('.container-open-external');
		var $items = $container.find('.item-open-external');
		var marginSum = $container.height() - maxWindowNum * $items.height();
		if (marginSum >= 0) {
			// 十分なスペースがある
			var margin = Math.min(marginSum / 3 >> 0, 20);
			$items.css('margin-top', margin + 'px');
			$container.css('top', '0px');
		} else {
			// スペースが足りない（重なる）
			var overlap = -marginSum / 2 >> 0;
			$items.css('margin-top', -overlap + 'px');
			$container.css('top', overlap + 'px');
		}
		timeoutID = null;
	}
})();

$(function () {
	// Panel
	var $item =
	$('<div>').addClass('item-open-external').append(
	  $('<div>').addClass('embed-frame')
	).append(
	  $('<div>').addClass('side-menu').append(
	    $('<span>').addClass('glyphicon glyphicon-remove')
	  ).append(
	    $('<span>').addClass('glyphicon glyphicon glyphicon-pushpin')
	  ).append(
	    $('<span>').addClass('glyphicon glyphicon-chevron-right')
	  )
	).on('click', '.glyphicon-pushpin,.glyphicon-chevron-right', function() {
		$(this).parents('.item-open-external').toggleClass('opened');
	}).on('click', '.glyphicon-remove', function() {
		$(this).parents('.item-open-external').toggleClass('visible').find('.embed-frame').children().remove();
	});

	// 3 panels
	$('.container-open-external').append(
	  $item.clone(true)
	).append(
	  $item.clone(true)
	).append(
	  $item.clone(true)
	);
});
