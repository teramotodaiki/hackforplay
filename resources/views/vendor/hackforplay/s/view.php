<?php
$id 	= $stage['ID'];
$state	= $stage['State'];
$title 	= $stage['Title'];
$explain= $stage['Explain'];
$count 	= $stage['Playcount'];
$author = $stage['Nickname'];
$thumbnail	= $stage['Thumbnail'];
$author_id	= $stage['UserID'];
$source_id	= $stage['SourceID'];
$source_title = $stage['SourceTitle'];
$src	= $stage['Src'];
$origin_id = NULL;
$mode 	= filter_input(INPUT_GET, "mode");
$norestage = $stage['NoRestage'];
if(empty($mode)){
	$mode	= 'replay';
}
$code = $project['Data'];
$code = preg_replace("/\\\\/", "\\\\\\\\", $code);
$code = preg_replace("/\n/", "\\n", $code);
$code = preg_replace("/\"/", "\\\"", $code);
$retry 	= filter_input(INPUT_GET, "retry", FILTER_VALIDATE_BOOLEAN);
$directly_restaging	= filter_input(INPUT_GET, 'directly_restaging', FILTER_VALIDATE_BOOLEAN);
// Questモードの場合、$nextは次のLevel.IDをあらわす
// 1以上ならつづきをあらわす。0以下なら最後のステージであることをあらわす
$next = $mode === 'quest' && $level_next ? $level_next['ID'] : 0;

// Version
$version =

$mode === 'restaging' ? '*' : // 改造中は常にLatest Versionをfetch
(
isset($stage['MajorVersion'], $stage['MinorVersion']) ?
$stage['MajorVersion'] . '.' . $stage['MinorVersion'] :

'*'
);

$require = isset($token) ? "require('~project/$token/$version');" : 'Error';
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
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/codemirror.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/mode/javascript/javascript.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/edit/matchbrackets.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/edit/closebrackets.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/dialog/dialog.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/search/searchcursor.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/search/search.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/keymap/sublime.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/keymap/emacs.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/keymap/vim.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/scroll/simplescrollbars.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/fold/foldcode.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/fold/foldgutter.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/fold/brace-fold.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/comment/comment.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/jshint/2.9.2/jshint.min.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/lint/lint.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/lint/javascript-lint.js" type="text/javascript"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/hint/show-hint.js" charset="utf-8"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/hint/javascript-hint.js" charset="utf-8"></script>
	<script src="https://connect.soundcloud.com/sdk/sdk-3.0.0.js" type="text/javascript"></script>
	<script src="https://www.youtube.com/iframe_api" type="text/javascript"></script>
	<script src="//cdn.jsdelivr.net/emojione/2.2.5/lib/js/emojione.min.js"></script>
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/codemirror.css">
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/dialog/dialog.css">
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/scroll/simplescrollbars.css">
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/fold/foldgutter.css">
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/lint/lint.css">
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/addon/hint/show-hint.css">
	<link rel="stylesheet" href="//cdn.jsdelivr.net/emojione/2.2.5/assets/css/emojione.min.css"/>
	<link rel="stylesheet" href="../css/cmcolor.css">
	<style type="text/css" media="screen">
		.CodeMirror {
			top: 0px;
			left: 0px;
			background-color: rgb(245,245,245);
			line-height: 1.2;
		}
		.CodeMirror-dialog.CodeMirror-dialog-top {
			/* box-shadow */
			box-shadow:rgba(0, 0, 0, 0.65098) 0px 0px 8px -1px;
			-webkit-box-shadow:rgba(0, 0, 0, 0.65098) 0px 0px 8px -1px;
			-moz-box-shadow:rgba(0, 0, 0, 0.65098) 0px 0px 8px -1px;
		}
		div.CodeMirror span.CodeMirror-matchingbracket {
			color: #000;
			border-bottom: 1px solid black;
		}
		.CodeMirror-foldgutter-open:after {
			color: blue;
			text-shadow: #b9f 1px 1px 2px, #b9f -1px -1px 2px, #b9f 1px -1px 2px, #b9f -1px 1px 2px;
			content: "❃";
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
		var prefix = 'stage_param_';
		var s = function(key, value){
			sessionStorage.setItem(prefix+key, value);
		};
		window.getParam = function (key) {
			return sessionStorage.getItem(prefix+key) || '';
		}
		s('id', "<?php echo $id; ?>");
		s('next', "<?php echo $next; ?>" || '0');
		s('mode', "<?php echo $mode; ?>");
		s('game_mode', "<?php echo $mode; ?>");
		s('state', "<?php echo $state; ?>")
		s('retry', "<?php echo $retry; ?>");
		s('origin_id', "<?php echo $origin_id; ?>");
		s('src', "<?php echo $src;  ?>");
		s('title', "<?php echo $title;  ?>");
		s('author', "<?php echo htmlspecialchars($author);  ?>");
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
	<script type="text/javascript">
	document.body.classList.add('<?php echo $norestage ? 'option-restage-NG' : 'option-restage-OK'; ?>');
	document.body.classList.add('<?php echo $session_userid ? 'option-session-OK' : 'option-session-NG'; ?>');
	</script>
	<script src="loadStage.js" type="text/javascript" charset="utf-8"></script>
	<script src="view.js" type="text/javascript" charset="utf-8"></script>
	<script src="openExternal.js" type="text/javascript" charset="utf-8"></script>
	<script src="getStage.js" type="text/javascript" charset="utf-8"></script>
	<script src="beginRestaging.js" type="text/javascript" charset="utf-8"></script>
	<script src="/activity/post.js" type="text/javascript"></script>
	<!-- Modal -->
	<div class="modal fade" id="inputModal" tabindex="-1" role="dialog" aria-labelledby="inputModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
	    		<div class="modal-header">
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			        <h4 class="modal-title" id="inputModalLabel">このステージについて入力してください</h4>
		    	</div>
		    	<form>
				    <div class="modal-body">
			        	<div class="form-group">
			    			<img class="stage-thumbnail" src="" alt="" width="240" height="160">
			        	</div>
			        	<div class="form-group">
			        		<label class="control-label">ステージ名<small>（自由に決めてください）</small>:</label>
			        		<input type="text" class="form-control stage-name">
			        	</div>
			        	<div class="form-group">
			        		<label class="control-label">ステージの説明:</label>
			        		<textarea class="form-control stage-explain"></textarea>
			        	</div>
								<?php if (isset($publishable_teams) && count($publishable_teams)): ?>
								<div class="form-group">
									<label class="control-label">チームとして投稿:</label>
									<div class="radio">
										<label>
											<input type="radio" name="input-team" value="" checked>
											自分のステージとして投稿
										</label>
									</div>
									<?php foreach ($publishable_teams as $key => $team): ?>
									<div class="radio">
										<label>
											<input type="radio" name="input-team" value="<?php echo $team['ID']; ?>">
											<b><?php echo $team['DisplayName']; ?></b>として投稿
										</label>
									</div>
									<?php endforeach; ?>
								</div>
								<?php endif; ?>
				    </div>
				    <div class="modal-footer">
		        		<p class="alert alert-warning">
		        			特定の個人を指すキーワードや暴言などを記入すると、削除されることがあります。
		        		</p>
		        		<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
		       			<button type="submit" class="btn btn-lg btn-primary disabled">投稿する</button>
				    </div>
		        </form>
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
					<div class="col-xs-12 h4p_restaging_menu">
						<div class="btn-group menu-left" role="group">
							<button type="button" class="btn btn-sm btn-default" data-query="undo">
								<span class="glyphicon glyphicon-menu-left"></span>
							</button>
							<button type="button" class="btn btn-sm btn-default" data-query="redo">
								<span class="glyphicon glyphicon-menu-right"></span>
							</button>
						</div>
						<div class="btn-group menu-right faint-menu" role="group">
							<button type="button" class="btn btn-sm btn-default" data-query="keybind">
								st
							</button>
						</div>
						<div class="btn-group menu-right faint-menu" role="group">
							<button type="button" class="btn btn-sm btn-default active" data-toggle="button" data-query="indent">
								<span class="glyphicon glyphicon-indent-left"></span>
							</button>
						</div>
					</div>
					<div class="col-xs-12 h4p_restaging_editor">
						<textarea name="restaging_code" value="// ステージ改造コードを書いて、このステージを改造してやろう!!"></textarea>
					</div>
					<div class="col-xs-12 h4p_restaging_button">
						<button type="button" class="btn btn-block btn-lg btn-primary" data-loading-text="...">
							<span class="glyphicon glyphicon-console"></span>
							<span>うごかす</span>
						</button>
					</div>
					<div class="col-xs-2 h4p_save_button" style="display: none">
						<button type="button" class="btn btn-block btn-lg btn-info" >
							<span class="glyphicon glyphicon-save"></span>
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
				<iframe id="item-embed-iframe" src="" frameborder="0" class="fit"></iframe>
			</div>
			<div class="col-xs-12 h4p_publish" style="display:none">
				<button type="button" class="btn btn-block btn-lg btn-success" data-toggle="modal" data-target="#inputModal" data-loading-text="送信中..." data-backdrop="false">
					<ruby>完成<rt>かんせい</rt></ruby>
					<span class="glyphicon glyphicon-send"></span>
				</button>
				<div class="h4p_published-info text-center hidden">
					<p class="text-muted">ご投稿ありがとうございました。内容を確認いたしますので、しばらくお待ち下さい。</p>
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
					<!-- Title, Owner -->
					<div class="col-xs-12 h4p_info_datail">
						<h3 class="h4p_info-title">
							<?php echo htmlspecialchars($title); ?>
							<?php if ($author_id === NULL) : ?>
							<span class="badge">official (公式)</span>
							<?php else: ?>
							<a href="../m?id=<?php echo $author_id; ?>" target="_blank">
								<span class="badge" style="background-color: #337ab7">
									<span class="glyphicon glyphicon-user"></span>
									<?php echo htmlspecialchars($author); ?>
								</span>
							</a>
							<?php endif; ?>
						</h3>
					</div>
					<!-- Version, Playcount, SourceTitle -->
					<div class="col-xs-12">
						<span class="badge" style="background-color: #5bc0de">
							ver.
							<span class="h4p_info-version"><?php echo $version; ?></span>
						</span>
						<span class="badge" style="background-color: #f0ad4e">
							<span class="glyphicon glyphicon-signal"></span>
							<?php echo $count; ?>
						</span>
						<?php if ($author_id !== NULL) : ?>
						<a href="../s?id=<?php echo $source_id; ?>" target="_blank">
							<span class="badge" style="background-color: #362f3c">
								<span class="glyphicon glyphicon-wrench"></span>
									<?php echo htmlspecialchars($source_title); ?>
							</span>
						</a>
						<?php endif; ?>
					</div>
					<!-- emoji summary -->
					<div class="col-xs-12 h4p_info-emoji"></div>
					<!-- emoji all -->
					<div class="col-xs-12 h4p_info-emojiAll collapse" style="max-height: 140px; overflow-y: scroll"></div>
					<!-- emoji input -->
					<div class="col-xs-12 h4p_info-inputEmoji text-right visible-option-session">
						<h4>
							<span
								class="h4p_info-myEmoji label label-emojispace"
								data-userid="<?php echo $session_userid; ?>"></span>
							<button type="button" class="btn btn-link h4p_info-deleteEmoji">
								<span class="glyphicon glyphicon-remove-circle"></span>
							</button>
							<span data-container="body" data-toggle="popover" data-placement="bottom"
								style="cursor: pointer">
								<img class="emojione" src="//cdn.jsdelivr.net/emojione/assets/png/1f600.png?v=2.2.5" alt="😀" />
							</span>
						</h4>
					</div>
					<!-- Explain -->
					<?php if ($explain !== NULL && $explain !== '') : ?>
					<div class="col-xs-12 h4p_info-explain">
						<p class="overflow-auto"><?php echo htmlspecialchars($explain); ?></p>
					</div>
					<?php endif; ?>
				</div>
			</div>

			<div class="col-xs-12 h4p_info">
				<div class="row">
					<!-- require code -->
					<div class="col-xs-12 col-sm-6">
						<div class="input-group">
							<span class="input-group-addon" id="basic-addon1">MOD</span>
							<input
								class="h4p_info-require form-control"
								type="text"
								value="<?php echo $require; ?>"
								rows="1"
								onClick="this.select();"
								/>
						</div>
					</div>
					<div class="col-xs-12 col-sm-6">
						<ul class="list-inline">
							<!-- ReStage -->
							<li class="visible-option-restage">
								<button type="button" class="btn btn-restage btn-lg btn-block begin_restaging visible-option-session" title="改造する">
									<span class="glyphicon glyphicon-wrench"></span>
									改造する
								</button>
							</li>
							<!-- Retry -->
							<li>
								<button class="btn btn-retry btn-lg btn-block" role="button" href="#" title="もういちど">
									<span class="glyphicon glyphicon-repeat"></span>
									もういちど
								</button>
							</li>
						</ul>
					</div>
					<!-- Share -->
					<div class="col-xs-12 col-sm-6 h4p_share-buttons">
						<ul class="list-inline">
							<li><a class="twitter-share-button" data-count="none">Tweet</a></li>
							<li><div class="fb-share-button" data-layout="button"></div></li>
							<li><div class="h4p-link-button"><span class="glyphicon glyphicon-paperclip"></span>URL</div></li>
						</ul>
					</div>
					<!-- Action -->
					<div class="col-xs-12 col-sm-6">
						<?php if ($cast_enabled) : ?>
						<div class="h4p_cast-channel dropup">
							<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<span class="glyphicon glyphicon-eject"></span>
								チャンネル
							</button>
							<ul class="dropdown-menu"></ul>
						</div>
						<?php endif; ?>
					</div>
					<!-- Brand -->
					<div class="col-xs-12 hidden brand-soundcloud">
						<a href="http://soundcloud.com"><img src="../img/powered_by_soundcloud.png" height="64" width="64" alt=""></a>
					</div>
				</div>
			</div>

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
	<div class="container container-assets hidden">
		<div class="row">
			<div class="smart-asset-sample">
				<div class="smart-asset-wrapper toggle-click-false overflow-hidden">
					<img class="icon">
				</div>
				<div class="smart-asset-wrapper toggle-click-true scroll-y">
					<div class="row">
						<div class="col-xs-12 visible-query-embed visible-query-toggle visible-query-replace">
							<h4 class="title"></h4>
						</div>
						<div class="col-xs-12 visible-query-toggle">
							<div class="media-wrapper">
								<img class="media-image img-responsive"></img>
							</div>
						</div>
						<div class="col-xs-3">
							<div class="overflow-hidden embed-frame visible-query-embed visible-query-replace">
								<img class="embed-icon"></img>
							</div>
						</div>
						<div class="col-xs-9">
							<p class="visible-query-embed visible-query-replace embed-caption"></p>
						</div>
						<div class="col-xs-8">
							<button type="button" class="btn btn-lg btn-block btn-primary visible-query-embed visible-query-replace">
								つかう
							</button>
						</div>
						<div class="col-xs-12">
							<div class="embed-code visible-query-embed visible-query-replace scroll-x"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="container-open-external affix"></div>
	<?php include_once '../intercom.php'; ?>
</body>
</html>
