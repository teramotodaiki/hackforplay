var onYouTubeIframeAPIReady = null;
$(function(){
	var focus_on_game = true; // focus mode -> game
	// ゲーム画面にフォーカスする
	setInterval(function(){
		var game = $(".h4p_game>iframe").get(0);
		if(	game !== undefined && game !== document.activeElement && focus_on_game){
			var source = "refocus();";	// フォーカスを戻すメソッドをゲーム側で呼び出す
			game.contentWindow.postMessage(source, '/');
		}
	}, 100);
	// モーダル表示中は、モーダルにフォーカスする
	$('.modal').on('shown.bs.modal', function() {
		focus_on_game = false;
	});
	$('.modal').on('hide.bs.modal', function() {
		focus_on_game = true;
	});
	// ゲームフレームを横幅基本で3:2にする
	var width = $(".h4p_game").width();
	// frame.phpを経由して、getParam('src')のページをincludeさせる
	var gameSrc = encodeURIComponent(getParam('src'));
	$(".h4p_game").height(width/1.5)
		.children('iframe').attr({
			'src': 'frame.php?file=' + gameSrc + '&path=' + getParam('path') + '&next=' + getParam('next') + '&mode=' + getParam('mode'),
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
				if (data) $(".stage-thumbnail").attr('src', data);
				break;
			case "screenshot":
				$("#screenshotModal").modal("show");
				// このあと"thumbnail"を呼び出す
				break;
			case "replace_code":
				var code = sessionStorage.getItem('restaging_code');
				jsEditor.setValue(code);
				break;
			case "hint_popover":
				$('.h4p_hint-button').popover('show');
				break;
		}
	});

	// tag list view
	$.post('../stage/getaglist.php', {

	} , function(data, textStatus, xhr) {
		switch (data) {
			case '':
			case 'parse-error':
				$('.h4p_stage-tag-list').append('Sorry, But load failed // よみこみに しっぱいしました ごめんなさい');
				break;
			default:
				var result = JSON.parse(data);

				// 先頭が偏らないようランダムを加える (swap)
				var headIndex = Math.random() * result.values.length >> 0;
				var tmp = result.values[0];
				result.values[0] = result.values[headIndex];
				result.values[headIndex] = tmp;

				result.values.forEach(function(item) {

					$(this).append(
						$('<label>').addClass('radio-inline').append(
							$('<input>').attr({
								'type': 'radio',
								'name': 'comment-tag'
							}).val(item.IdentifierString)
						).append(
							$('<p>').addClass('label').text(item.DisplayString).css('background-color', item.LabelColor)
						)
					);

				}, $('.h4p_stage-tag-list'));

				$('.h4p_stage-tag-list input').first().attr('checked', true);
				break;
		}
	});

	// leave comment then take
	$('#commentModal').on('show.bs.modal', function () {
		// canvas to image
		var game = $(".h4p_game>iframe").get(0);
		var source = "saveImage();";
		game.contentWindow.postMessage(source, '/');

		$(this).find('#leave-comment').button('reset');
	});

	$('#commentModal #leave-comment').on('click', function(event) {

		var tag_value = $('#commentModal input[name="comment-tag"]:checked').val();
		var message_value = $('#commentModal #comment-message').val();
		var loading = $(this).button('loading');
		$('#commentModal #comment-alert-message').addClass('hidden');

		// submit
		var timezone = new Date().getTimezoneString();
		$.post('../stage/addcommentandtag.php',{
			'stageid' : getParam('id'),
			'message': message_value,
			'tags': tag_value,
			'thumb': sessionStorage.getItem('image') || null,
			'timezone': timezone,
			'attendance-token': sessionStorage.getItem('attendance-token')
		}, function(data, textStatus, xhr) {
			switch (data) {
				case 'missing-message':
					$('#commentModal #comment-alert-message').removeClass('hidden');
					loading.button('reset');
					break;
				case 'missing-stage':
				case 'already-comment':
				case 'database-error':
				case '':
					// コメントのリロード
					getCommentTask(function() {
						loading.button('reset');
						$('#commentModal').modal('hide');
					});
					break;
			}
		});

	});

	// コメントを取得
	function getCommentTask(callback) {

		$('.h4p_comment-add').addClass('hidden');
		$('.h4p_my-comment').addClass('hidden');

		$.post('../stage/getmycommentbyid.php', {
			'stageid' : getParam('id'),
			'attendance-token' : sessionStorage.getItem('attendance-token')
		} , function(data, textStatus, xhr) {

			switch(data) {
				case 'parse-error':
				case '':
					break;
				case 'no-session':
				case 'not-found':
					$('.h4p_comment-add').removeClass('hidden');
					break;
				default:
					var result = JSON.parse(data);

					var $comment = $('.h4p_my-comment').removeClass('hidden');
					$comment.find('.h4p_comment-trash').data('id', result.ID);
					$comment.find('.comment-tag').text(result.Tags[0].DisplayString).css('background-color', result.Tags[0].LabelColor);
					$comment.find('.comment-message').text(result.Message);
					$comment.find('.comment-thumb').attr('src', result.Thumbnail);
					break;
			}
			if (callback)
				callback();
		});
	}
	getCommentTask();

	$('.h4p_my-comment .h4p_comment-trash').on('click', function(event) {

		// コメントの削除
		var message = $('.h4p_my-comment .comment-message').text();
		if (confirm(message + '\n\nこのメッセージを さくじょ します')) {

			// 削除の実行
			$.post('../stage/removecommentbyid.php', {
				'comment_id': $('.h4p_my-comment .h4p_comment-trash').data('id'),
				'attendance-token' : sessionStorage.getItem('attendance-token')
			} , function(data, textStatus, xhr) {
				switch (data) {
					case 'no-session':
						$('#signinModal').modal('show');
						break;
					case 'not-found':
					case 'database-error':
						alert('エラー\nさくじょ できなかった');
						break;
					case 'success':
						$('.h4p_comment-add').removeClass('hidden');
						$('.h4p_my-comment').addClass('hidden');
						break;
				}
			});
		}
	});

	// HackforPlay RePlay (then externalizing the code)
	// 読み込み時の処理
	var jsEditor = CodeMirror.fromTextArea($('textarea[name=restaging_code]').get(0), {
		mode: "javascript",
		lineNumbers: true,
		indentUnit: 4,
		autoClossBrackets: true
	});
	jsEditor.on('beforeChange', function(cm, change) {
		if (change.origin === "undo" && cm.doc.historySize().undo === 0) {
			// Ctrl+Zの押し過ぎで、全部消えてしまうのをふせぐ
			change.cancel();
		}
	});
	var $div = $("div.h4p_restaging_editor");
	jsEditor.setSize($div.width(), $div.height());
	if(getParam('mode') !== "restaging"){
		$(".h4p_restaging").hide();
		$(".h4p_while-restaging").hide();
	}
	// ステージ改造中、画面遷移するとき注意をうながす
	var alert_on_unload = false;
	$(window).on('beforeunload', function(event) {
		if(alert_on_unload){
			return "せいさくちゅう の ステージ は「マイページ」に ほぞん されています。\nただし「ステージ改造コードを実行」を おしてから  へんこうした ぶぶんは ほぞん されません";
		}else{
			event.preventDefault();
		}
	});

	(function(){
		var beginRestaging = function(){
			alert_on_unload = true;
			$(".h4p_restaging").fadeIn("fast", function() {
				var storage_key = getParam('retry') === '1' ? 'retry_code' : 'restaging_code';
				var code = sessionStorage.getItem(storage_key);
				if(code !== null){
					jsEditor.setValue(code);
				}
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
				location.href = '/s?id='+getParam('id') + '&mode=restaging&retry=true';
			});
			$(".h4p_restaging_button").on('click', function() {
				// RUN (Add &mode=restaging)
				var loading = $(this).find('button');
				jsEditor.save();
				var code = jsEditor.getTextArea().value;
				sessionStorage.setItem('restaging_code', code);
				alert_on_unload = false;
				var currentTime = new Date().getTime();
				var updateTask = function(){
					loading.button('loading');
					// Update data
					var token = sessionStorage.getItem('project-token');
					var timezone = new Date().getTimezoneString();
					$.post('../project/updatefromtoken.php', {
						'token': token,
						'data': code,
						'source_stage_id': getParam('id'),
						'timezone': timezone,
						'attendance-token': sessionStorage.getItem('attendance-token')
					}, function(data, textStatus, xhr) {
						loading.button('reset');
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
							case 'no-update':
							case 'success':
								location.href = "/s?id=" + getParam('id') + "&mode=restaging";
								break;
						}
					});
				};
				if(sessionStorage.getItem('project-token') === null){
					// プロジェクトが作られていないので、作成
					makeProject(updateTask);
				}else{
					updateTask();
				}
			});
			$(".h4p_while-restaging").show();
		};
		var makeProject = function(callback){
			// 残っているトークンを破棄
			sessionStorage.removeItem('project-token');
			var code = sessionStorage.getItem('restaging_code');
			var timezone = new Date().getTimezoneString();
			$.post('../project/makefromstage.php', {
				'stageid': getParam('id'),
				'timezone': timezone,
				'attendance-token': sessionStorage.getItem('attendance-token')
			}, function(data, textStatus, xhr) {
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
						if(callback !== undefined){
							callback();
						}
						break;
				}
			});
		};
		switch(getParam('mode')){
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
					var explain = $('#stage-explain').val();
					if(title === ""){ $("#stage-name_alert").show('fast'); }
					if(title !== ""){
						$("#inputModal").modal('hide');
						$(this).button('loading');
						jsEditor.save();
						var code = jsEditor.getTextArea().value;
						var timezone = new Date().getTimezoneString();
						$.post('../project/publishreplaystage.php', {
							'token': sessionStorage.getItem('project-token'),
							'thumb': sessionStorage.getItem('image') || null,
							'path': getParam('path'),
							'title': title,
							'explain': explain,
							'timezone': timezone,
							'attendance-token': sessionStorage.getItem('attendance-token')
						} , function(data, textStatus, xhr) {
							$('#publish-button').button('reset');
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
									$('.h4p_publish button').text('Thank you for your ReStaging!!').attr('disabled', 'disabled').append($('<p>').text('ご投稿ありがとうございました。内容を確認いたしますので、しばらくお待ち下さい。'));
									$(".h4p_publish-return").show();
									alert_on_unload = false; // 遷移時の警告を非表示
									break;
							}
						});
					}
				});
				scrollToAnchor();
				break;
			case "replay":
				// replay mode (load javascript-code and run it)
				sessionStorage.setItem('restaging_code', getParam('replay_code'));
				$(".begin_restaging").on('click', function() {
					beginRestaging();
					makeProject();
				});
				break;
			case "extend":
				// extend mode (extends restaging-code in tutorial)
				beginRestaging();
				scrollToAnchor('.h4p_restaging');
				break;
		}
	})();
	(function(){
		// チュートリアル
		var stage_id = getParam('id');
		if(101 <= stage_id && stage_id <= 106){
			// 改造ボタン非表示
			$(".h4p_info-restaging>button").hide();
		}
		// ステージ改造のチュートリアル
		if(201 <= stage_id && stage_id <= 206){
			// この改造ステージを投稿する->次のステージへ
			$(".h4p_publish button").text('次のステージへ')
			.attr({
				'data-toggle': '',
				'data-target': ''
			}).on('click', function() {
				// sessionStorageに保管→EXTENDCODEに送られるように
				jsEditor.save();
				var code = jsEditor.getTextArea().value;
				sessionStorage.setItem('extend_code', code);
				alert_on_unload = false;
				location.href = "/s?id=" + getParam('next') + "&mode=extend";
			});
		}
	})();

	// Twitter OAuthログイン
	$('.login-with-twitter').on('mousedown', function(event) {
		// clickイベントより先に呼び出されるので、色々仕込みができる

		// restaging中ならrestaging_codeを保管する処理を行う
		jsEditor.save();
		var code = jsEditor.getTextArea().value;
		if (code !== '') {

			$(this).data('login_successed', '/s?id=' + getParam('id') + '&mode=restaging');
			alert_on_unload = false; // 警告を出さない
			sessionStorage.setItem('restaging_code', code);
		}
	});


	function getParam(key){
		return sessionStorage.getItem('stage_param_'+key) || '';
	}

	// YouTube等によるキットの説明
	(function() {
		// 説明すべきコンテンツが存在するかどうか
		var embed_content = getParam('youtube');
		if (embed_content === '') return;

		$('.h4p_hint-button').removeClass('hidden'); // ヒントアイコンを表示

		// アイコンをクリックするとconfirmがひらき、モーダルをひらける
		$('.h4p_hint-button').on('click', function() {
			if (confirm('A video description will be opened if you press the [OK]. // OK を クリックすると ヒントの ビデオが ひらかれます')) {
				$('.h4p_hint-button').popover('hide');
				$('#youtubeModal').modal('show');
			}
		});

		// 開かれたときにまだYouTubeがロードされていない場合、ロードを開始する
		var player;
		var body_width = 270; // 仮の幅 実際はモーダルの幅に合わせる
		$('#youtubeModal').on('show.bs.modal', function() {

			if (!player) {
				// YouTube Frame API をロード
				$('<script>').attr('src', 'https://www.youtube.com/iframe_api').prependTo('body');
				onYouTubeIframeAPIReady = function() {
					player = new YT.Player('embed-content', {
						width: body_width,
						height: 400,
						videoId: getParam('youtube')
					});
				};
			}
		}).on('shown.bs.modal', function() {

			body_width = $(this).find('.modal-body').width();
			$('#youtubeModal div#embed-content,#youtubeModal iframe#embed-content').attr({
				width: body_width,
				height: 400
			});
		});

		$('#youtubeModal').on('hide.bs.modal', function(event) {

			// モーダルを閉じた時、再生をストップする
			if (player && player.pauseVideo) {
				player.pauseVideo();
			}
		});

	})();

});