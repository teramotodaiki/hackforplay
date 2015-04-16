<!-- HTML -->
<!DOCTYPE html>
<html>
<head prefix="og: http://ogp.me/ns#">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>あそべるプログラミング hackforplay</title>
	<?php require_once '../library.php' ?>
	<!-- Open graph protocol -->
	<meta property="og:title" content="あそべるプログラミング HackforPlay"/>
	<meta property="og:description" content="プログラミングをゲームで学ぼう。小中学生向けの教育ゲーム ハックフォープレイ"/>
	<meta property="og:image" content="http://hackforplay.xyz/img/ogimg.jpg"/>
	<meta property="og:url" content="http://hackforplay.xyz"/>
	<meta property="og:type" content="game"/>
	<meta property="og:site_name" content="あそべるプログラミング HackforPlay"/>
	<script type="text/javascript" charset="utf-8">
	$(function(){
		$(".h4p_item-title>h4").each(function(){
			var size = 37;
			var txt = $(this).text();
			var suffix = '…';
			var b = 0;
			for(var i = 0; i < txt.length; i++) {
		    	b += txt.charCodeAt(i) <= 255 ? 0.5 : 1;
			    if (b > size) {
			    	txt = txt.substr(0, i) + suffix;
			    	break;
			    }
			}
			$(this).text(txt);
		});
	});
	</script>
</head>
<body class="">
	<?php require_once '../analyticstracking.php' ?>
	<?php require_once '../fb-root.php' ?>
	<?php require_once '../view/header.php'; ?>
	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<div class="row h4p_box">
					<div class="col-md-12 h4p_box-header">
						<h3>投稿されたステージ一覧</h3>
					</div>
					<div class="col-md-12 h4p_box-main">
						<div class="row">
							<!-- stages list with PHP -->
							<?php foreach ($allstages as $key => $item) :
							if($item['type'] == "1") : // replay stage
							$id		= $item['id'];
							$title 	=  $item['title'];
							$count	= $item['playcount'];
							$attr 	= in_array($id, $cleared) ? "h4p_item-cleared" : "";
							$thumb  = $item['restaging']['thumbnail'];
							if($thumb == NULL){
								$thumb = "/s/".$item['path']."thumb.png";
							}
							$author = $item['restaging']['author'];
							?>
							<a href="/s?id=<?php echo $id ?>" title="<?php echo $title; ?> by <?php echo $author; ?>" target="_blank">
								<div class="col-md-4 col-xs-6 h4p_item <?php echo $attr ?>">
									<div class="h4p_item-thumbnail">
										<span class="h4p_item-src"><?php echo $thumb; ?></span>
									</div>
									<div class="h4p_item-title">
										<h4><?php echo $title; ?></h4>
									</div>
									<div class="h4p_item-footer">
										<p>作成者：<b><?php echo $author; ?></b></p>
										<p>プレイ回数：<b><?php echo $count."回"; ?></b></p>
									</div>
								</div>
							</a>
							<?php endif; endforeach; ?>
						</div>
					</div>
					<div class="col-md-12 h4p_box-footer">
					</div>
				</div>
			</div>
			<div class="col-md-12">
				<div class="row h4p_box">
					<div class="col-md-12 h4p_box-header">
						<h3>空のステージ</h3>
					</div>
					<div class="col-md-12 h4p_box-main">
						<div class="row">
							<!-- stages list with PHP -->
							<?php
							// [[id1, size1], [id2, size2] ... ]
							$more_stage_list = array(
								array(1001,4), array(1002,4)
							);
							foreach ($more_stage_list as $key => $value) {
								$item = $allstages[$value[0]];
								$size = $value[1];
								include 'item.php';
							}
							?>
						</div>
					</div>
				</div>
	  		</div>
		</div>
	</div>
	<?php require_once '../view/footer.php' ?>
</body>
</html>