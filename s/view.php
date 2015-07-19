<?php
$id 	= $stage['ID'];
$path	= $stage['Path'];
$title 	= $stage['Title'];
$explain= $stage['Explain'];
$next 	= $stage['NextID'];
$count 	= $stage['Playcount'];
$author = $stage['Nickname'];
$thumbnail	= $stage['Thumbnail'];
$author_id	= $stage['UserID'];
$source_id	= $stage['SourceID'];
$source_title = $stage['SourceTitle'];
$src	= $stage['Src'];
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
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta property="og:title" content="<?php echo $title; ?>"/>
	<meta property="og:description" content="Produced it by <?php echo $author; ?>. このゲームは「あそべるプログラミング HackforPlay」で作られた、無料のブラウザゲームです。（現時点でのプレイ回数：<?php echo $count; ?>回）"/>
	<meta property="og:image" content="https://<?php echo $_SERVER["SERVER_NAME"].$thumbnail; ?>"/>
	<meta property="og:type" content="game"/>
	<meta property="fb:admins" content="100002019469687"/>
	<meta property="fb:app_id" content="481208065364232"/>
	<meta property="og:site_name" content="<?php echo $title; ?>"/>
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
		var selector = arguments.length > 0 ? arguments[0] : '#scroll-anchor';
		var top = $(selector).get(0).getBoundingClientRect().top;
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
		s('src', "<?php echo $src;  ?>");
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
			        	<div class="form-group">
			        		<label for="stage-explain" class="control-label">ステージの説明:</label>
			        		<textarea class="form-control" id="stage-explain"></textarea>
			        		<p id="stage-explain_alert" class="alert alert-danger" style="display:none;"></p>
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
	<div class="modal fade" id="commentModal" tabindex="-1" role="dialog" aria-labelledby="commentModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
	    		<div class="modal-header">
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			        <h4 class="modal-title" id="commentModalLabel">クリエイターに おうえんメッセージ をおくりましょう</h4>
		    	</div>
			    <div class="modal-body">
			    	<form>
			        	<div class="form-group">
			    			<img class="stage-thumbnail" src="" alt="" width="240" height="160">
			        	</div>
			        	<div class="form-group">
			        		<p class="control-label"><b>ステージのタグ:</b></p>
			        		<div class="h4p_stage-tag-list">
			        		</div>
			        		<p id="comment-alert-tag" class="alert alert-danger hidden">タグをえらんでください。</p>
			        	</div>
			        	<div class="form-group">
			        		<label for="comment-message" class="control-label">メッセージ:</label>
			        		<textarea class="form-control" id="comment-message"></textarea>
			        		<p id="comment-alert-message" class="alert alert-danger hidden">Message can't become empty. // メッセージを かいてください</p>
			        	</div>
			        </form>
			    </div>
	    		<div class="modal-footer">
	        		<p class="alert alert-warning">特定の個人を指すキーワードや暴言などを記入すると、削除されることがあります。</p>
	        		<button type="button" class="btn btn-default" data-dismiss="modal">とじる</button>
	       			<button type="submit" class="btn btn-primary" id="leave-comment" data-loading-text="送信中...">コメントする</button>
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
			<div class="col-xs-12 h4p_restaging directly_floating_shadow">
				<div class="row">
					<div class="col-xs-12 h4p_restaging_editor">
						<textarea name="restaging_code" value="// ステージ改造コードを書いて、このステージを改造してやろう!!"></textarea>
					</div>
					<div class="col-xs-12 h4p_restaging_button">
						<button type="button" class="btn btn-block btn-lg btn-primary ignore-attendance" data-loading-text="保存中…">
							<span>ステージ改造コードを実行</span>
						</button>
					</div>
				</div>
			</div>
			<div id="scroll-anchor" class="col-xs-12"></div>
			<div class="col-xs-12 h4p_alerts"></div>
			<div class="col-xs-12 h4p_game" style="display:block">
				<iframe src=""></iframe>
			</div>
			<div class="col-xs-12 h4p_clear text-center" style="display:none">
				<div class="row">
					<div class="col-xs-12">
						<img class="h4p_clear-img" src="img/clear.png" alt="">
					</div>
					<div class="col-xs-12 h4p_clear-next">
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
					<?php elseif($id == 106) : // last stage of tutirial ?>
						<h3>クリアおめでとうございます！</h3>
						<p>こんどは、あなたもステージを作ってみましょう</p>
						<a href="/s?id=201" class="btn btn-success btn-lg" title="今すぐ作る"><h3>今すぐ作る</h3></a>
					<?php endif; ?>
					</div>
				</div>
			</div>
			<div class="col-xs-12 h4p_publish" style="display:none">
				<button type="button" class="btn btn-block btn-lg btn-success" data-toggle="modal" data-target="#inputModal" data-loading-text="送信中...">
					この改造ステージを投稿する
				</button>
				<a href="../r" title="もどる" class="h4p_publish-return btn btn-lg btn-block" style="display:none">もどる</a>
			</div>
			<div class="col-xs-offset-11 col-xs-1 h4p_comment-add hidden">
				<button type="button" class="btn btn-link btn-lg" data-toggle="modal" data-target="#commentModal">
					<span class="glyphicon glyphicon-comment" aria-hidden="true"></span>
				</button>
			</div>
			<div class="col-xs-12 h4p_my-comment hidden">
				<h4>おくったメッセージ</h4>
				<div class="row">
					<div class="col-xs-12 col-sm-3">
						<img class="img-responsive comment-thumb" src="" />
					</div>
					<div class="col-xs-12 col-sm-9">
						<p class="label label-success comment-tag">Beginners // かんたん</p>
						<p class="comment-message">メッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージ</p>
					</div>
					<button type="button" class="btn btn-link pull-right h4p_comment-trash">
						<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
					</button>
				</div>
			</div>
			<div class="col-xs-12 h4p_info">
				<div class="row">
					<div class="col-xs-12 h4p_info-datail">
						<p><h3 class="h4p_info-title"><?php echo $title; ?></h3></p>
						<p><span>プレイ回数：<b><?php echo $count."回"; ?></b></span></p>
						<?php if ($author_id === NULL) : ?>
						<p><span><b>公式ステージ</b></span></p>
						<?php else: ?>
						<p><span>作成者：<b><a href="../m?id=<?php echo $author_id; ?>" target="_blank"><?php echo $author; ?></a></b></span></p>
						<p><span>改造元：<b><a href="../s?id=<?php echo $source_id; ?>" target="_blank"><?php echo $source_title; ?></a></b></span></p>
						<?php endif; ?>
					</div>
					<div class="col-xs-6 col-sm-3 h4p_info-restaging">
						<button type="button" class="btn btn-success btn-lg btn-block begin_restaging" title="改造する">改造する</button>
					</div>
					<div class="col-xs-6 col-sm-3 h4p_info-retry">
						<a class="btn btn-primary btn-lg btn-block ignore-attendance" role="button" href="/s?id=<?php echo $id; ?>" title="はじめから">はじめから</a>
						<button style="display: none;" class="btn btn-primary btn-lg btn-block h4p_info-retry-button ignore-attendance" role="button" title="もう一度実行">もう一度実行</button>
					</div>
					<?php if ($explain !== NULL && $explain !== '') : ?>
					<div class="col-xs-12 h4p_info-explain">
						<p class="overflow-auto"><?php echo $explain; ?></p>
					</div>
					<?php endif; ?>
				</div>
			</div>
			<?php if ($id < 300) : ?>
			<div class="col-xs-12 h4p_mapTip h4p_while-restaging">
				<img src="img/mapTipIndex.jpg" alt="">
			</div>
			<?php else : ?>
			<div class="col-xs-6 panel panel-default h4p_while-restaging">
				<div class="panel-body text-center">
					<a class="btn btn-link btn-lg" href="../resources/" target="_blank" title="Other Resources / 他の画像をみる">Other resources / 他の画像をみる</a>
				</div>
			</div>
			<div class="col-xs-6 panel panel-default h4p_while-restaging">
				<div class="panel-body text-center">
					<a class="btn btn-link btn-lg" href="../reference/" target="_blank" title="Reference / リファレンスを見る">Reference / リファレンスを見る</a>
				</div>
			</div>
			<?php endif; ?>
		</div>
	</div>

</body>
</html>