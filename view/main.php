<!-- HTML -->
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, maximum-scale=1.0, minimum-scale=0.5,user-scalable=yes,initial-scale=1.0" />
	<meta name="description" content="初めてのプログラミング、楽しく学びたい！ ハックフォープレイはゲームでプログラミングを学べる新しい形のオンライン教材です。体験会などを通じて多くの小学生・中学生のお子さんに遊んでいただいております。">
	<!-- Open graph protocol -->
	<meta property="og:title" content="あそべるプログラミング HackforPlay"/>
	<meta property="og:description" content="プログラミングをゲームで学ぼう。小中学生向けの教育ゲーム ハックフォープレイ"/>
	<meta property="og:image" content="http://hackforplay.xyz/img/ogimg.jpg"/>
	<meta property="og:url" content="http://hackforplay.xyz"/>
	<meta property="og:type" content="game"/>
	<meta property="og:site_name" content="あそべるプログラミング HackforPlay"/>

	<title>あそべるプログラミング hackforplay</title>
	<?php require_once 'library.php' ?>
	<link rel="stylesheet" type="text/css" href="css/landingpage.css">
	<script src="/getlocaldata.js" type="text/javascript" charset="utf-8"></script>
	<script type="text/javascript" charset="utf-8">
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

		// modal
		$(".showMoreModal").on('click', function() {
			$("#moreModal").modal('show');
		});
	});
	</script>
</head>
<body class="">
	<?php require_once 'analyticstracking.php' ?>
	<?php require_once 'fb-root.php' ?>
	<?php // require_once 'header.php'; ?>
	<!-- Modal -->
	<div class="modal fade" id="moreModal" tabindex="-1" role="dialog" aria-labelledby="moreModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
	    		<div class="modal-header">
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			    	<p>もうチュートリアルはクリアしましたか？</p>
			    	<p>まだクリアしていない方は、こちらでキホンを学びましょう！</p>
			    	<img src="s/tutorial1/thumb.png" height="80" width="120" alt=""/>
			    	<a href="s?id=101" class="btn btn-default" title="チュートリアルをプレイ">チュートリアルをプレイ</a>
		    	</div>
			    <div class="modal-body">
			    	<h3>次は、改造ステージを作ってみましょう！</h3>
			    	<p>ワークショップ参加者の方は、ここで<b>本を開いてください</b>。</p>
			    	<p>お家からアクセスしている方は、今までに作られたステージを遊んだり、タイトルの横にある「改造する」という緑色のボタンから改造ステージを作ることができます。</p>
			    </div>
	    		<div class="modal-footer">
	        		<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
	        		<a href="/r" class="btn btn-primary" title="次に進む">次に進む</a>
	    		</div>
			</div>
		</div>
	</div>
	<?php echo date("Y-m-d H:i:s"); ?>
	<div class="landingpage">
		<div class="h4p_landing l-1">
			<div class="h4p_landing-main">
				<div class="h4p_landing-header"></div>
				<div class="h4p_landing-footer">
					<a href="s?id=101" title="Play Now"></a>
				</div>
			</div>
		</div>
		<div class="h4p_landing l-2">
			<div class="h4p_landing-main">
				<div class="h4p_landing-header"></div>
				<div class="h4p_landing-footer">
					<a href="s?id=101" title="Play Now"></a>
				</div>
			</div>
		</div>
		<div class="h4p_landing l-3">
			<div class="h4p_landing-main">
				<div class="h4p_landing-header"></div>
				<div class="h4p_landing-footer"></div>
			</div>
		</div>
		<div class="h4p_landing l-4">
			<div class="h4p_landing-main">
				<div class="h4p_landing-header"></div>
				<div class="h4p_landing-footer">
					<a href="javascript:void(0)" title="Try RePlay" class="showMoreModal"></a>
				</div>
			</div>
		</div>
	</div>
	<?php require_once 'footer.php' ?>
</body>
</html>