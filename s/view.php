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
$youtube	= $stage['YouTubeID'];
$origin_id = NULL;
$mode 	= filter_input(INPUT_GET, "mode");
if(!isset($mode)){
	$mode 	= $stage['Mode'];
}
if($stage['Mode'] === "replay"){
	$code = $project['Data'];
	$code = preg_replace("/\\\\/", "\\\\\\\\", $code);
	$code = preg_replace("/\n/", "\\n", $code);
	$code = preg_replace("/\"/", "\\\"", $code);
}
$retry 	= filter_input(INPUT_GET, "retry", FILTER_VALIDATE_BOOLEAN);
$directly_restaging	= filter_input(INPUT_GET, 'directly_restaging', FILTER_VALIDATE_BOOLEAN);
// Questモードの場合、$nextは次のLevel.IDをあらわす
if ($mode === 'quest') {
	// 1以上ならつづきをあらわす。0以下なら最後のステージであることをあらわす
	$next	= $level_next ? $level_next['ID'] : 0;
}
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
	<?php require_once '../externalcodes.php'; ?>
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
		s('path', "<?php echo $path; ?>" || '0');
		s('next', "<?php echo $next; ?>" || '0');
		s('mode', "<?php echo $mode; ?>");
		s('game_mode', "<?php echo $mode; ?>");
		s('retry', "<?php echo $retry; ?>");
		s('origin_id', "<?php echo $origin_id; ?>");
		s('src', "<?php echo $src;  ?>");
		s('youtube', "<?php echo $youtube;  ?>");
		s('title', "<?php echo $title;  ?>");
		s('author', "<?php echo $author;  ?>");
		s('directly_restaging', "<?php echo $directly_restaging;  ?>");
<?php if(isset($level)): ?>
		s('level', "<?php echo $level['ID']; ?>");
		s('playorder', "<?php echo $level['PlayOrder']; ?>");
<?php endif; ?>
<?php if(isset($pavilion)): ?>
		s('pavilion', "<?php echo $pavilion['ID']; ?>");
<?php endif; ?>
<?php if (isset($reporting_requirements)) : ?>
		s('reporting_requirements', "<?php echo $reporting_requirements; ?>");
<?php endif; ?>
<?php if (isset($reporting_restaged)) : ?>
		s('reporting_restaged', "<?php echo $reporting_restaged; ?>");
<?php endif; ?>
<?php if(isset($code)): ?>
		s('replay_code', "<?php echo $code; ?>");
<?php endif; ?>
	})();
	</script>
	<script src="view.js" type="text/javascript" charset="utf-8"></script>
	<?php if ($id >= 101 && $id <= 106) : ?>
	<script src="tutorialtracking.js" type="text/javascript" charset="utf-8"></script>
	<?php endif; ?>
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
	<div class="modal fade" id="youtubeModal" tabindex="-1" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
	    			<h4>Introduction Video // ステージの せつめい</h4>
				</div>
			    <div class="modal-body">
					<div id="embed-content" src=""></div>
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
					<div class="col-xs-10 h4p_restaging_button">
						<button type="button" class="btn btn-block btn-lg btn-primary">
							<span>ステージ改造コードを実行</span>
						</button>
					</div>
					<div class="col-xs-2 h4p_save_button">
						<button type="button" class="btn btn-block btn-lg btn-info" data-loading-text="保存中…">
							<span>保存</span>
						</button>
					</div>
				</div>
			</div>
			<div id="scroll-anchor" class="col-xs-12"></div>
			<div class="col-xs-12 h4p_alerts"></div>
			<div class="col-xs-12 h4p_game no-padding" style="display:block">
				<div class="h4p_credit hidden">
					<div class="box-half-top">
						<h4 class="hasnext-true credit-timeline credit-timeline-0 hidden">STAGE <span class="PlayOrder"></span></h4>
						<h3 class="hasnext-false credit-timeline credit-timeline-0 hidden">FINAL STAGE</h3>
					</div>
					<div class="box-half-bottom">
						<h1 class="credit-timeline credit-timeline-1">「<span class="Title"></span>」</h1>
						<h2 class="credit-timeline credit-timeline-1">by <span class="Author"></span></h2>
					</div>
				</div>
				<iframe src="" frameborder="0"></iframe>
			</div>
			<div class="col-xs-12 h4p_clear text-center" style="display:none">
				<div class="row">
					<div class="col-xs-12">
						<img class="h4p_clear-img" src="img/clear.png" alt="">
					</div>
					<div class="col-xs-12 h4p_clear-next">
					<?php if($next !== NULL) : // exist next stage ?>
						<a href="/s?id=<?php echo $next; ?>" style="display: block;" title="つぎのステージへ">
							<img src="img/button_next.png" height="48" width="266" alt="">
						</a>
					<?php elseif($id == 106) : // last stage of tutirial ?>
						<div class="">
							<h3>クリアおめでとうございます！</h3>
							<p>とっておきの ほうしゅう が とどきました</p>
							<a href="../getaccount/" class="btn btn-success btn-lg" title="Get"><h3>うけとる</h3></a>
						</div>
					<?php endif; ?>
					</div>
				</div>
			</div>
			<div class="col-xs-12 h4p_publish" style="display:none">
				<button type="button" class="btn btn-block btn-lg btn-success" data-toggle="modal" data-target="#inputModal" data-loading-text="送信中...">
					この改造ステージを投稿する
				</button>
				<div class="h4p_published-info text-center hidden">
					<p class="text-muted">ご投稿ありがとうございました。内容を確認いたしますので、しばらくお待ち下さい。</p>
					<div class="panel panel-default">
						<div class="panel-body">
							<h4 class="panel-title">このステージをほかの人にもシェアしましょう！</h4>
						</div>
						<div class="panel-body">
							<iframe id="stage-share-frame" src="" height="40" width="450"></iframe>
						</div>
					</div>
					<a href="../" title="もどる" class="h4p_publish-return btn btn-lg btn-block">もどる</a>
				</div>
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
					<div class="col-xs-12 col-sm-6 h4p_info-datail">
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
						<button type="button" class="btn btn-restage btn-lg btn-block begin_restaging" title="改造する">
							<span class="glyphicon glyphicon-wrench"></span>
							改造する
						</button>
					</div>
					<div class="col-xs-6 col-sm-3 h4p_info-retry">
						<button class="btn btn-retry btn-lg btn-block" role="button" href="#" title="もういちど">
							<span class="glyphicon glyphicon-repeat"></span>
							もういちど
						</button>
					</div>
					<?php if ($explain !== NULL && $explain !== '') : ?>
					<div class="col-xs-12 h4p_info-explain">
						<p class="overflow-auto"><?php echo $explain; ?></p>
					</div>
					<?php endif; ?>
					<div class="col-xs-12 h4p_share-buttons">
						<ul class="list-inline">
							<li><a class="twitter-share-button" data-count="none">Tweet</a></li>
							<li><div class="fb-share-button" data-layout="button"></div></li>
							<li><div class="h4p-link-button"><span class="glyphicon glyphicon-paperclip"></span>URL</div></li>
						</ul>
					</div>
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
	<div class="container container-tab hidden">
		<div class="row">
			<div class="col-xs-12 no-padding">
				<div class="h4p_tab-top h4p_alignment-trigger">
					<img src="img/tab_top.png" height="100" width="60" alt="">
				</div>
			</div>
			<div class="col-xs-12 no-padding h4p_alignment-trigger">
				<div class="h4p_tab-middle"></div>
			</div>
			<div class="col-xs-12 no-padding h4p_alignment-trigger">
				<div class="h4p_tab-bottom">
					<img src="img/tab_bottom.png" height="20" width="70" alt="">
				</div>
			</div>
		</div>
	</div>
	<div class="container container-youtube hidden">
		<div class="row">
			<div class="col-xs-12 h4p_youtube-frame">
				<div id="kit-embed-content" src=""></div>
			</div>
		</div>
	</div>
	<div class="container container-assets hidden">
		<div class="row">
			<div class="asset-wrapper-sample col-lg-2 col-md-3 col-sm-4 col-xs-6 hidden">
				<div class="wrapper overflow-hidden">
					<p class="caption text-center hidden"></p>
					<img>
				</div>
			</div>
		</div>
	</div>
</body>
</html>