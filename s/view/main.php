<?php
$id 	= $stage['ID'];
$path	= $stage['Path'];
$title 	= $stage['Title'];
$next 	= $stage['NextID'];
$count 	= $stage['Playcount'];
// $origin_id = $stage['restaging_id'];
$origin_id = NULL;
$mode 	= filter_input(INPUT_GET, "mode");
if(!isset($mode)){
	$mode 	= $stage['Mode'];
}
if($mode == "replay"){
	$code = $project['Data'];
	$code = preg_replace("/\\\\/", "\\\\\\\\", $code);
	$code = preg_replace("/\n/", "\\n", $code);
	$code = preg_replace("/\"/", "\\\"", $code);
}
$retry 	= filter_input(INPUT_GET, "retry");
?>
<!DOCTYPE html>
<html>
<head prefix="og: http://ogp.me/ns#">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title><?php echo $title; ?> - HackforPlay</title>
	<?php require_once '../library.php' ?>
	<script type="text/javascript" charset="utf-8">
	// var token = "<?php // echo $token; ?>";
	var token = "";
	var path = "<?php echo $path; ?>";
	var next = "<?php echo $next; ?>";
	var mode = "<?php echo $mode; ?>";
	var retry = "true" === "<?php echo $retry; ?>";
	var origin_id = "<?php echo $origin_id; ?>";
	<?php if(isset($code)): ?>
	var replay_code = "<?php echo $code; ?>";
	<?php endif; ?>

	$(function(){
		var focus_on_game = true; // focus mode -> game
		// ゲーム画面にフォーカスする
		setInterval(function(){
			var game = $(".h4p_game>iframe").get(0);
			if(	game !== undefined && game !== document.activeElement &&
				focus_on_game){
			    var source = "refocus();";	// フォーカスを戻すメソッドをゲーム側で呼び出す
			    game.contentWindow.postMessage(source, '/');
			}
		}, 100);
		// モーダル表示中は、モーダルにフォーカスする
		$('.modal').on('show.bs.modal', function() {
			focus_on_game = false;
		});
		$('.modal').on('hide.bs.modal', function() {
			focus_on_game = true;
		});
		// ゲームフレームを横幅基本で3:2にする
		var width = $(".h4p_game").width();
		$(".h4p_game").height(width/1.5)
			.children('iframe').attr({
				'src':'game.php?token='+token+'&path='+path+'&next='+next+'&mode='+mode,
				'width': width,
				'height': width/1.5
			});
		$(".h4p_clear").height(width/1.5);
		// ゲームクリアの処理
		window.addEventListener('message', function(e){
			switch(e.data){
				case "clear":
					$(".h4p_game").hide();
					// 一旦全部隠す
					$(".h4p_clear-img").hide();
					$(".h4p_clear-next").hide();
					// フェードイン
					$(".h4p_clear").fadeIn('slow', 'linear', function(){
						var width = $(".h4p_clear-img").css('width');
						$(".h4p_clear-img").css({'width':'100%', 'opacity':'0'})
						.animate({'width':width, 'opacity':'1'}, 'slow', function() {
							$(".h4p_clear-next").fadeIn('slow');
						});
					});
					break;
				case "thumbnail":
					var data = sessionStorage.getItem('image');
					$(".stage-thumbnail").attr('src', data);
					break;
				case "screenshot":
					$("#screenshotModal").modal("show");
					// このあと"thumbnail"を呼び出す
					break;
			};
		});

		// HackforPlay RePlay (then externalizing the code)
		// 読み込み時の処理
		var jsEditor = CodeMirror.fromTextArea($('textarea[name=restaging_code]').get(0), {
			mode: "javascript",
			lineNumbers: true,
			indentUnit: 4,
			autoClossBrackets: true
		});
		var $div = $("div.h4p_restaging_editor");
		jsEditor.setSize($div.width(), $div.height());
		if(mode !== "restaging"){
			$(".h4p_restaging").hide();
			$(".h4p_mapTip").hide();
		}
		// ステージ改造中、画面遷移するとき注意をうながす
		var alert_on_unload = false;
		$(window).on('beforeunload', function(event) {
			if(alert_on_unload){
				return "制作中のステージは保存されていません。ページを移動しますか？";
			}else{
				event.preventDefault();
			}
		});
		(function(){
			var beginRestaging = function(){
				alert_on_unload = true;
				$(".h4p_restaging").fadeIn("fast", function() {
					if (!retry) {
						var code = sessionStorage.getItem('restaging_code'); // default code (set somedir/main.js)
						if(code !== null){
							jsEditor.setValue(code); // set default code
						};
					}else{
						var code = sessionStorage.getItem('retry_code'); // retry code (temporary code)
						if(code !== null){
							jsEditor.setValue(code);
						};
					};
					$(this).hover(function() {
						focus_on_game = false; // focus on editor
					}, function() {
						if (!$('.modal').hasClass('in')) {
							focus_on_game = true; // focus on game
						}
					});
				});
				$(".h4p_info-footer").text("（リステージング中）");
				$(".h4p_info-restaging>button").hide();
				$(".h4p_info-retry>a").hide();
				$(".h4p_info-retry-button").show();
				$(".h4p_info-retry-button").on('click', function() {
					jsEditor.save();
					var code = jsEditor.getTextArea().value;
					sessionStorage.setItem('retry_code', code);
					alert_on_unload = false;
					location.href = '/s?id='+<?php echo $id; ?>+'&mode=restaging&retry=true';
				});
				$(".h4p_restaging_button").on('click', function() {
					// RUN (Add &mode=restaging)
					jsEditor.save();
					var code = jsEditor.getTextArea().value;
					sessionStorage.setItem('restaging_code', code);
					alert_on_unload = false;
					// Update data
					console.log('clicked');
					$.post('../project/updatefromtoken.php', {
						'token': sessionStorage.getItem('project-token'),
						'data': code
					}, function(data, textStatus, xhr) {
						console.log(data);
						switch(data){
							case 'no-session':
								$('#signinModal').modal('show').find('.modal-title').text('ステージを改造するには、ログインしてください');
								break;
							case 'invalid-token':
								showAlert('alert-danger', 'セッションストレージの情報が破損しています。もう一度ステージを作成し直してください');
								break;
							case 'already-published':
								showAlert('alert-danger', 'すでに投稿されたステージです');
								break;
							case 'data-is-null':
								showAlert('alert-danger', '更新するデータが破損していたため、更新されませんでした');
								break;
							case 'database-error':
								showAlert('alert-danger', 'データベースエラーにより、更新されませんでした');
								break;
							case 'success':
								location.href = "/s?id="+<?php echo $id; ?>+"&mode=restaging";
								break;
						}
					});
				});
				$(".h4p_mapTip").show();
			};
			var makeProject = function(){
				var code = sessionStorage.getItem('restaging_code');
				$.post('../project/makefromstage.php', {
					'stageid': <?php echo $id; ?>,
					'data': code
				}, function(data, textStatus, xhr) {
					console.log(data);
					switch(data){
						case 'no-session':
							$('#signinModal').modal('show').find('.modal-title').text('ステージを改造するには、ログインしてください');
							break;
						case 'invalid-stageid':
							showAlert('alert-danger', 'このステージは改造できません');
							break;
						case 'database-error':
							showAlert('alert-danger', 'エラーにより改造できませんでした');
							break;
						default:
							sessionStorage.setItem('project-token', data);
							break;
					}
				});
			}
			switch(mode){
				case "official":
					// official mode (load default code from main.js)
					$(".begin_restaging").on('click', function() {
						beginRestaging();
						makeProject();
					});
					break;
				case "restaging":
					// restaging mode (load javascript-code from sessionStorage)
					beginRestaging();
					$(".h4p_publish").show();
					$("#stage-name_alert").hide();
					$("#author_alert").hide();
					$('#inputModal').on('show.bs.modal', function () {
						// canvas to image
						var game = $(".h4p_game>iframe").get(0);
			    		var source = "saveImage();";
			    		game.contentWindow.postMessage(source, '/');
					});
					$("#publish-button").on('click', function() {
						var title = $("#stage-name").val();
						var author = $("#author").val();
						if(title === ""){ $("#stage-name_alert").show('fast'); }
						if(author === ""){ $("#author_alert").show('fast'); }
						if(title !== "" && author !== ""){
							$("#inputModal").modal('hide');
							$(".h4p_publish").children('button').attr('disabled', 'disabled');
							var data = sessionStorage.getItem('image');
							var $message = $(".h4p_publish-text");
							$message.text('送信中・・・');
							jsEditor.save();
							var code = jsEditor.getTextArea().value;

							$.post('../project/publishreplaystage.php', {
								'token': sessionStorage.getItem('project-token'),
								'thumb': data,
								'path': path,
								'title': title
							} , function(data, textStatus, xhr) {
								console.log(data);
								switch(data){
									case 'no-session':
										$('#signinModal').modal('show').find('.modal-title').text('ステージを投稿するには、ログインしてください');
										break;
									case 'invalid-token':
										showAlert('alert-danger', 'セッションストレージの情報が破損しています。もう一度ステージを作成し直してください');
										break;
									case 'already-published':
										showAlert('alert-danger', 'すでに投稿されたステージです');
										break;
									case 'database-error':
										showAlert('alert-danger', 'エラーにより投稿できませんでした');
										break;
									case 'success':
										$message.text('Thank you for your ReStaging!!');
							        	$(".h4p_publish-complete").show();
							        	$(".h4p_publish-return").show();
							        	alert_on_unload = false; // 遷移時の警告を非表示
							            break;
								}
							});
						};
					});
					break;
				case "replay":
					// replay mode (load javascript-code and run it)
					sessionStorage.setItem('restaging_code', replay_code);
					$(".begin_restaging").on('click', function() {
						beginRestaging();
						makeProject();
					});
					break;
				case "extend":
					// extend mode (extends restaging-code in tutorial)
					$(".begin_restaging").on('click', function() {
						beginRestaging();
						makeProject();
					});
					break;
			}
		})();
		(function(){
			// チュートリアル
			var stage_id = <?php echo $id; ?>;
			if(101 <= stage_id && stage_id <= 106){
				// 改造ボタン非表示
				$(".h4p_info-restaging>button").hide();
			}
			// ステージ改造のチュートリアル
			if(201 <= stage_id && stage_id <= 206){
				// この改造ステージを投稿する->次のステージへ
				$(".h4p_publish-text").text('次のステージへ');
				$(".h4p_publish>button").attr({
					'data-toggle': '',
					'data-target': ''
				}).on('click', function() {
					// sessionStorageに保管→EXTENDCODEに送られるように
					jsEditor.save();
					var code = jsEditor.getTextArea().value;
					sessionStorage.setItem('extend_code', code);
					alert_on_unload = false;
					location.href = "/s?id="+next+"&mode=extend";
				});
			}
		})();

		// tutorial中は改造するボタンを非表示にする
		(function(){
			var id = <?php echo $id; ?>;
			if(101 <= id && id <= 106){
				// Tutorial Stage
				$(".h4p_info-restaging>button").hide();
			}
		})();
	});
	function screenShot () {
		document.getElementsByTagName('iframe')[0].contentWindow.postMessage('screenShot()', '/');
	}
	</script>
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
	}
	</script>
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
	<div class="container">
		<div class="row">
			<div class="col-md-12 h4p_alerts"></div>
			<div class="col-md-12 h4p_restaging">
				<div class="row">
					<div class="col-md-12 h4p_restaging_editor">
						<textarea name="restaging_code" value="// ステージ改造コードを書いて、このステージを改造してやろう!!"></textarea>
					</div>
					<div class="col-md-12 h4p_restaging_button">
						<button type="button" class="btn btn-block btn-lg btn-primary ignore-attendance">
							<span>ステージ改造コードを実行</span>
						</button>
					</div>
				</div>
			</div>
			<div class="col-md-12 h4p_game" style="display:block">
				<iframe src=""></iframe>
			</div>
			<div class="col-md-12 h4p_clear text-center" style="display:none">
				<div class="row">
					<div class="col-md-12">
						<img class="h4p_clear-img" src="img/clear.png" alt="">
					</div>
					<div class="col-md-12 h4p_clear-next">
					<?php if($mode == "replay") : ?>
						<button type="button" class="btn btn-success btn-lg btn-block begin_restaging" title="改造する">このステージを改造する</button>
						<a href="/r" class="btn btn-success btn-lg btn-block" title="改造ステージ一覧へ">
							改造ステージ一覧へ
						</a>
					<?php elseif($mode == "restaging") : ?>
						<button class="btn btn-primary btn-lg btn-block h4p_info-retry-button ignore-attendance" role="button" title="改造コードを保存してゲームを再スタート">改造コードを保存してゲームを再スタート</button>
					<?php elseif($next != NULL) : // exist next stage ?>
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
			<div class="col-md-12 h4p_publish" style="display:none">
				<button type="button" class="btn btn-block btn-lg btn-success" data-toggle="modal" data-target="#inputModal">
					<h3 class="h4p_publish-text">この改造ステージを投稿する</h3>
					<h5 class="h4p_publish-complete text-center" style="display:none"><br>ご投稿ありがとうございました。内容を確認いたしますので、しばらくお待ち下さい。</h5>
				</button>
				<a href="../r" title="もどる" class="h4p_publish-return btn btn-lg btn-block" style="display:none">もどる</a>
			</div>
			<div class="col-md-12 h4p_info">
				<div class="row">
					<div class="col-md-6 h4p_info-datail">
						<h3 class="h4p_info-title"><?php echo $title; ?></h3>
						<span class="h4p_info-footer">プレイ回数：<b><?php echo $count."回"; ?></b></span>
					</div>
					<div class="col-md-3 h4p_info-restaging">
						<button type="button" class="btn btn-success btn-lg btn-block begin_restaging" title="改造する">改造する</button>
					</div>
					<div class="col-md-3 h4p_info-retry">
						<a class="btn btn-primary btn-lg btn-block ignore-attendance" role="button" href="/s?id=<?php echo $id; ?>" title="はじめから">はじめから</a>
						<button style="display: none;" class="btn btn-primary btn-lg btn-block h4p_info-retry-button ignore-attendance" role="button" title="もう一度実行">もう一度実行</button>
					</div>
				</div>
			</div>
			<div class="col-md-12 h4p_mapTip">
				<img src="img/mapTipIndex.jpg" alt="">
			</div>
		</div>
	</div>

</body>
</html>