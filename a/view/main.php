<!-- HTML -->
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>あそべるプログラミング hackforplay</title>
	<?php require_once '../library.php' ?>
	<script type="text/javascript" charset="utf-8">
	$(function(){
		$("button.accept-button").on('click', function() {
			$(this).attr('disabled', 'disabled');
			var $div = $(this).parent();
			$.post('../makestage.php', {
	            'stage_name':$div.children('.stage_name').text(),
	            'restaging_id':$div.children('.rid').text()
	        }, function(data, textStatus, xhr) {
	        	if(data !== "") console.log(data);
	        	if(textStatus !== "success") console.log(textStatus);
	        	else location.href = "/a";
	        });
		});
		$("button.code-button").on('click', function() {
			var code = $(this).parent().children('.code').text();
			$('.modal-body>pre').text(code);
		});

	});
	</script>
</head>
<body class="">
	<?php require_once '../analyticstracking.php' ?>
	<?php require_once '../fb-root.php' ?>
	<?php require_once '../view/header.php'; ?>
	<!-- Modal -->
	<div class="modal fade" id="codeModal" tabindex="-1" role="dialog" aria-labelledby="codeModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
	    		<div class="modal-header">
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		    	</div>
			    <div class="modal-body">
			    	<pre style="font-family: monospace;"></pre>
			    </div>
	    		<div class="modal-footer">
	        		<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
	    		</div>
			</div>
		</div>
	</div>
	<!-- contents -->
	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<div class="row h4p_box">
					<div class="col-md-12 h4p_box-header">
						<h3>管理者メニュー</h3>
					</div>
					<div class="col-md-12 h4p_box-main">
						<div class="row">
							<!-- stages list with PHP -->
							<?php foreach ($restagingcodes as $key => $value) :
							 ?>
							<div class="col-md-3" style="border: 1px solid rgb(224, 224, 224); padding:10px">
								<img src="<?php echo $value['thumbnail']; ?>" style="width:100%;" alt="">
								<h4 class="stage_name"><?php echo $value['stage_name']; ?></h4>
								<h5><?php echo $value['author']; ?></h5>
								<h5><?php echo $value['time']; ?></h5>
								<span class="rid hidden"><?php echo $value['id']; ?></span>
								<span class="code hidden"><?php echo $value['code']; ?></span>
								<button type="button" class="btn btn-primary btn-block accept-button">Accept</button>
								<button type="button" class="btn btn-success btn-block code-button" data-toggle="modal" data-target="#codeModal">Code</button>
							</div>
							<?php endforeach; ?>
						</div>
					</div>
					<div class="col-md-12 h4p_box-footer">
					</div>
				</div>
			</div>
			<div class="col-md-12">
				<div class="row h4p_box">
					<div class="col-md-12 h4p_box-header">
						<h3>改造ステージ</h3>
					</div>
					<div class="col-md-12 h4p_box-main">
						<div class="row">
							<!-- stages list with PHP -->
							<?php foreach ($allstages as $key => $item) :
							if($item['type'] == "replay") :
							$id		= $item['id'];
							$title 	= $item['title'];
							$count	= $item['playcount'];
							$attr 	= in_array($id, $cleared) ? "h4p_item-cleared" : "";
							$thumb  = $item['restaging']['thumbnail'];
							if($thumb == NULL){
								$thumb = "/s/".$item['path']."thumb.png";
							}
							?>
							<a href="/s?id=<?php echo $id ?>" title="<?php echo $title; ?>">
								<div class="col-md-4 h4p_item <?php echo $attr ?>">
									<div class="h4p_item-thumbnail">
										<span class="h4p_item-src"><?php echo $thumb; ?></span>
									</div>
									<div class="h4p_item-title">
										<h4><?php echo $title; ?></h4>
									</div>
									<div class="h4p_item-footer">
										プレイ回数：<b><?php echo $count."回"; ?></b>
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
		</div>
	</div>
	<?php require_once '../view/footer.php' ?>
</body>
</html>