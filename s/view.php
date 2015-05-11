<?php
$id 	= $stage['ID'];
$path	= $stage['Path'];
$title 	= $stage['Title'];
$next 	= $stage['NextID'];
$count 	= $stage['Playcount'];
$author = $stage['Nickname'];
$author_id = $stage['UserID'];
$source_id = $stage['SourceID'];
$source_title = $stage['SourceTitle'];
// $origin_id = $stage['restaging_id'];
$origin_id = NULL;
$mode 	= filter_input(INPUT_GET, "mode");
if(!isset($mode)){
	$mode 	= $stage['Mode'];
}
if($mode === "replay"){
	$code = $project['Data'];
	$code = preg_replace("/\\\\/", "\\\\\\\\", $code);
	$code = preg_replace("/\n/", "\\n", $code);
	$code = preg_replace("/\"/", "\\\"", $code);
}
$retry 	= filter_input(INPUT_GET, "retry", FILTER_VALIDATE_BOOLEAN);
?>
<!DOCTYPE html>
<html>
<head prefix="og: http://ogp.me/ns#">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title><?php echo $title; ?> - HackforPlay</title>
	<?php require_once '../library.php' ?>
	<!-- HackforPlay RePlay -->
	<script src="editor/lib/codemirror.js" type="text/javascript"></script>
	<script src="editor/mode/javascript/javascript.js" type="text/javascript"></script>
	<script src="editor/addon/edit/closebrackets.js" type="text/javascript"></script>
	<link rel="stylesheet" href="editor/lib/codemirror.css">
	<style type="text/css" media="screen">
		.CodeMirror {
		  top: 0px;
		  left: 0px;
		  background-color: rgb(245,245,245);
		}
	</style>
</head>
<body>
	<?php include_once("../analyticstracking.php"); ?>
	<?php require_once '../sendattendance.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<?php require_once '../view/authmodal.php'; ?>
	<!-- Alert -->
	<script type="text/javascript" charset="utf-8">
	function showAlert (_class, _text) {
		$('<div>').addClass('alert').addClass(_class).attr('role', 'alert').append(
			$('<button>').addClass('close').attr({
				'type' : 'button',
				'data-dismiss': 'alert',
				'aria-label': 'Close'
			}).append(
				$('<span>').attr('aria-hidden', 'true').html('&times;')
			)
		).append(
			$('<span>').text(_text)
		).appendTo('.h4p_alerts');

		// アラートが見えるにスクロール
		scrollToAnchor();
	}
	function screenShot () {
		document.getElementsByTagName('iframe')[0].contentWindow.postMessage('screenShot()', '/');
	}
	function scrollToAnchor(){
		var top = $('#scroll-anchor').get(0).getBoundingClientRect().top;
		console.log(top);
		window.scrollBy(0, top);
	}
	</script>
	<script type="text/javascript" charset="utf-8">
	(function(){
		var s = function(key, value){
			sessionStorage.setItem('stage_param_'+key, value);
		};
		s('id', "<?php echo $id; ?>");
		s('path', "<?php echo $path; ?>");
		s('next', "<?php echo $next; ?>");
		s('mode', "<?php echo $mode; ?>");
		s('retry', "<?php echo $retry; ?>");
		s('origin_id', "<?php echo $origin_id; ?>");
		<?php if(isset($code)): ?>
		s('replay_code', "<?php echo $code; ?>");
		<?php endif; ?>
	})();
	</script>
	<script src="view.js" type="text/javascript" charset="utf-8"></script>
	<!-- Modal -->
	<div class="modal fade" id="inputModal" tabindex="-1" role="dialog" aria-labelledby="inputModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
	    		<div class="modal-header">
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			        <h4 class="modal-title" id="inputModalLabel">このステージについて入力してください</h4>
		    	</div>
			    <div class="modal-body">
			    	<form>
			        	<div class="form-group">
			    			<img class="stage-thumbnail" src="" alt="" width="240" height="160">
			        	</div>
			        	<div class="form-group">
			        		<label for="stage-name" class="control-label">ステージ名<small>（自由に決めてください）</small>:</label>
			        		<input type="text" class="form-control" id="stage-name">
			        		<p id="stage-name_alert" class="alert alert-danger">ステージ名を入力してください。</p>
			        	</div>
			        </form>
			    </div>
	    		<div class="modal-footer">
	        		<p class="alert alert-warning">特定の個人を指すキーワードや暴言などを記入すると、削除されることがあります。</p>
	        		<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
	       			<button type="button" class="btn btn-primary" id="publish-button" >投稿する</button>
	    		</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="screenshotModal" tabindex="-1" role="dialog" aria-labelledby="screenshotModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
	    			<h4>右クリックで保存してください</h4>
				</div>
			    <div class="modal-body">
			    	<img class="stage-thumbnail" src="" width="480" height="320" />
			    </div>
	    		<div class="modal-footer">
	        		<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
	    		</div>
			</div>
		</div>
	</div>
	<!-- contents -->
	<div class="container container-game">
		<div class="row">
			<div class="col-sm-12 h4p_restaging">
				<div class="row">
					<div class="col-sm-12 h4p_restaging_editor">
						<textarea name="restaging_code" value="// ステージ改造コードを書いて、このステージを改造してやろう!!"></textarea>
					</div>
					<div class="col-sm-12 h4p_restaging_button">
						<button type="button" class="btn btn-block btn-lg btn-primary ignore-attendance">
							<span>ステージ改造コードを実行</span>
						</button>
					</div>
				</div>
			</div>
			<div id="scroll-anchor" class="col-sm-12"></div>
			<div class="col-sm-12 h4p_alerts"></div>
			<div class="col-sm-12 h4p_game" style="display:block">
				<iframe src=""></iframe>
			</div>
			<div class="col-sm-12 h4p_clear text-center" style="display:none">
				<div class="row">
					<div class="col-sm-12">
						<img class="h4p_clear-img" src="img/clear.png" alt="">
					</div>
					<div class="col-sm-12 h4p_clear-next">
					<?php if($mode === "replay") : ?>
						<button type="button" class="btn btn-success btn-lg btn-block begin_restaging" title="改造する">このステージを改造する</button>
						<a href="/r" class="btn btn-success btn-lg btn-block" title="改造ステージ一覧へ">
							改造ステージ一覧へ
						</a>
					<?php elseif($mode === "restaging") : ?>
						<button class="btn btn-primary btn-lg btn-block h4p_info-retry-button ignore-attendance" role="button" title="改造コードを保存してゲームを再スタート">改造コードを保存してゲームを再スタート</button>
					<?php elseif($next !== NULL) : // exist next stage ?>
						<a href="/s?id=<?php echo $next; ?>" style="display: block;" title="つぎのステージへ">
							<img src="img/button_next.png" height="48" width="266" alt="">
						</a>
					<?php elseif($id === 106) : // last stage of tutirial ?>
						<h3>クリアおめでとうございます！</h3>
						<p>こんどは、あなたもステージを作ってみましょう</p>
						<a href="/s?id=201" class="btn btn-success btn-lg" title="今すぐ作る"><h3>今すぐ作る</h3></a>
					<?php endif; ?>
					</div>
				</div>
			</div>
			<div class="col-sm-12 h4p_publish" style="display:none">
				<button type="button" class="btn btn-block btn-lg btn-success" data-toggle="modal" data-target="#inputModal" data-loading-text="送信中...">
					この改造ステージを投稿する
				</button>
				<a href="../r" title="もどる" class="h4p_publish-return btn btn-lg btn-block" style="display:none">もどる</a>
			</div>
			<div class="col-sm-12 col-xs-12 h4p_info">
				<div class="row">
					<div class="col-sm-6 col-xs-12 h4p_info-datail">
						<p><h3 class="h4p_info-title"><?php echo $title; ?></h3></p>
						<p><span>プレイ回数：<b><?php echo $count."回"; ?></b></span></p>
						<?php if ($author_id === NULL) : ?>
						<p><span><b>公式ステージ</b></span></p>
						<?php else: ?>
						<p><span>作成者：<b><a href="../m?id=<?php echo $author_id; ?>" target="_blank"><?php echo $author; ?></a></b></span></p>
						<p><span>改造元：<b><a href="../s?id=<?php echo $source_id; ?>" target="_blank"><?php echo $source_title; ?></a></b></span></p>
						<?php endif; ?>
					</div>
					<div class="col-sm-3 col-xs-6 h4p_info-restaging">
						<button type="button" class="btn btn-success btn-lg btn-block begin_restaging" title="改造する">改造する</button>
					</div>
					<div class="col-sm-3 col-xs-6 h4p_info-retry">
						<a class="btn btn-primary btn-lg btn-block ignore-attendance" role="button" href="/s?id=<?php echo $id; ?>" title="はじめから">はじめから</a>
						<button style="display: none;" class="btn btn-primary btn-lg btn-block h4p_info-retry-button ignore-attendance" role="button" title="もう一度実行">もう一度実行</button>
					</div>
				</div>
			</div>
			<div class="col-sm-12 h4p_mapTip">
				<img src="img/mapTipIndex.jpg" alt="">
			</div>
		</div>
	</div>

</body>
</html>