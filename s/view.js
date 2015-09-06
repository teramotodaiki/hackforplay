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
	// テキストボックスにフォーカスがあるときはゲームにフォーカスしない
	$('input,textarea').focus(function(event) {
		focus_on_game = false;
	}).blur(function(event) {
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
			case "begin_restaging":
				// ゲーム側からリステージングを開始する
				$('.begin_restaging').trigger('click');
				break;
			case "show_hint":
				// ゲーム側からヒントを表示する
				$('.h4p_hint-button').trigger('click');
				break;
			case "show_comment":
				// ゲーム側からコメントの入力画面を表示する
				$('#commentModal').modal('show');
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
		var source = "saveImage('thumbnail');";
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

					sessionStorage.setItem('stage_param_comment', ''); // no-comment
					break;
				default:
					var result = JSON.parse(data);

					var $comment = $('.h4p_my-comment').removeClass('hidden');
					$comment.find('.h4p_comment-trash').data('id', result.ID);
					$comment.find('.comment-tag').text(result.Tags[0].DisplayString).css('background-color', result.Tags[0].LabelColor);
					$comment.find('.comment-message').text(result.Message);
					$comment.find('.comment-thumb').attr('src', result.Thumbnail);

					sessionStorage.setItem('stage_param_comment', 'true'); // exist-comment
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

						sessionStorage.setItem('stage_param_comment', 'true');
						break;
					case 'success':
						$('.h4p_comment-add').removeClass('hidden');
						$('.h4p_my-comment').addClass('hidden');

						sessionStorage.setItem('stage_param_comment', '');
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
	// ステージ改造中、画面遷移するとき注意をうながすフラグ
	var alert_on_unload = false;

	(function(){
		var beginRestaging = function(){

			// frame.phpを経由して、getParam('src')のページをincludeさせる
			// モードをRestagingにする
			var gameSrc = encodeURIComponent(getParam('src'));
			$(".h4p_game").height(width/1.5).children('iframe').attr({
				'src': 'frame.php?file=' + gameSrc + '&path=' + getParam('path') + '&next=' + getParam('next') + '&mode=restaging'
			});

			// ロギングを開始
			(function() {
				// 前のトークンを削除
				sessionStorage.removeItem('restaginglog-token');

				// ロギングをサーバーで開始
				beginLog();

				var log = {}; // 初期化
				var updateInterval = 10 * 1000; // [ms]

				// ロギング
				$('.h4p_restaging_button').on('click', function() {
					log.ExecuteCount = log.ExecuteCount || 0;
					log.ExecuteCount ++;
				});
				$('.h4p_save_button').on('click', function() {
					log.SaveCount = log.SaveCount || 0;
					log.SaveCount ++;
				});
				jsEditor.on('beforeChange', function(cm, change) {
					switch (change.origin) {
					case '+input':
						change.text.forEach(function(input){
							Array.prototype.forEach.call(input, function(key) {
								if (key.match(/[0-9]/g)) {
									log.InputNumberCount = log.InputNumberCount || 0;
									log.InputNumberCount ++;
								} else if (key.match(/[a-zA-Z]/g)){
									log.InputAlphabetCount = log.InputAlphabetCount || 0;
									log.InputAlphabetCount ++;
								} else {
									log.InputOtherCount = log.InputOtherCount || 0;
									log.InputOtherCount ++;
								}
							});
						});
						break;
					case 'paste':
						log.PasteCount = log.PasteCount || 0;
						log.PasteCount ++;
						break;
					case '+delete':
					case 'cut':
						log.DeleteCount = log.DeleteCount || 0;
						log.DeleteCount ++;
						break;
					}
				});

				// 定期送信
				var lastJsonString = '';
				setInterval(function() {
					var current = JSON.stringify(log);
					if (lastJsonString !== current) {
						updateLog(function() {
							lastJsonString = current;
						}, function() {
							updateInterval *= 2; // 失敗時の対処
						});
					}
				}, updateInterval);

				// 最終送信
				window.addEventListener('beforeunload', function(event) {
					updateLog();
					if (alert_on_unload) {
						event.returnValue = "せいさくちゅう の ステージ は「マイページ」に ほぞん されています。";
					} else {
						event.preventDefault();
					}
				});

				function beginLog (successed, failed) {
					// ロギングの開始をサーバーに伝え、トークンを取得する
					$.post('../analytics/beginrestaginglog.php', {
						'stage_id': getParam('id'),
						'mode': getParam('mode')
					}, function(data, textStatus, xhr) {
						switch (data) {
							case 'error':
								if (failed) failed();
								break;
							default:
								sessionStorage.setItem('restaginglog-token', data);
								if (successed) successed();
								break;
						}
					});
				}
				function updateLog (successed, failed) {
					// ログをアップデートする
					$.post('../analytics/updaterestaginglog.php', {
						'token': sessionStorage.getItem('restaginglog-token'),
						'log': JSON.stringify(log)
					}, function(data, textStatus, xhr) {
						switch (data) {
							case 'parse-error':
								break;
							case 'invalid-token':
								// もういちどbeginLogをこころみる
								beginLog(function() {
									setTimeout(function() {
										updateLog();
									}, 1000);
								}, function() {
									if (failed) failed();
								});
								break;
							case 'error':
								if (failed) failed();
								break;
							case 'success':
								if (successed) successed();
								break;
							default:
								if (failed) failed();
								break;
						}
					});
				}

			})();

			(function() {

				// タブの描画（画面の高さにレスポンシブ）
				var old_container_height = 0;
				setInterval(function() {

					var container_height = $('.container-game').outerHeight();
					if (old_container_height !== container_height) {
						var top_height = $('.h4p_tab-top').height();
						var bottom_height = $('.h4p_tab-bottom').height();
						$('.h4p_tab-middle').height(container_height - top_height - bottom_height);

						old_container_height = container_height;
					}
				}, 100);

				// ２カラムアライメント（ゲームビュー | YouTubeビュー）
				var alignmentMode = getParam('youtube') ? 'both' : 'game'; // both(２カラム) | game(ゲーム画面のみ)
				var reload_timer = null;

				// アライメントモードの切り替え
				$('.h4p_alignment-trigger').on('click', function(event) {
					switch (alignmentMode) {
					case 'both':
						alignmentMode = 'game';
						$('.h4p_tab-top img').attr('src', 'img/tab_top_r.png');
						break;
					case 'game':
						alignmentMode = 'both';
						$('.h4p_tab-top img').attr('src', 'img/tab_top.png');
						break;
					}
					alignment();
				});

				function alignment() {

					var body_width = $(document.body).width();
					switch (alignmentMode) {
					case 'both':
						// 2カラム およそ50:50
						$('.container-game').css({
							'padding-left': '25px',
							'padding-right': '0px',
							'width': body_width / 2 >> 0
						});
						$('.container-tab').removeClass('hidden');
						var youtube_width = body_width - $('.container-game').outerWidth() - $('.container-tab').outerWidth() - 60;
						$('.container-youtube').removeClass('hidden').outerWidth(youtube_width);
						$('.h4p_youtube-frame iframe').attr({
							'width': youtube_width,
							'height': youtube_width / 1.5
						});
						$('.container-game,.container-youtube,.container-tab').css('float', 'left');
						break;
					case 'game':
						// 1カラム 100:0 ただし幅には最大値がある
						var right_space = $('.container-tab').outerWidth() + 20;
						var content_width = Math.min(800, body_width - right_space * 2);
						$('.container-game').css({
							'padding-left': (body_width - content_width) / 2 >> 0,
							'padding-right': (body_width - content_width) / 2 - right_space >> 0
						});
						$('.container-game').width(content_width);

						$('.container-tab').removeClass('hidden');
						$('.container-youtube').addClass('hidden').width(0);
						$('.container-game,.container-youtube,.container-tab').css('float', 'left');
						break;
					}

					if ($('.h4p_game>iframe').width() !== $('.container-game').width()) {
						// ゲームの幅を変更
						$('.h4p_game,.h4p_game>iframe').width($('.container-game').width()).height($('.container-game').width() / 1.5 >> 0);

						// リロード ごまかしのフェードイン
						if (reload_timer) clearTimeout(reload_timer);
						reload_timer = setTimeout(function() {
							$(".h4p_game>iframe").hide().get(0).contentWindow.postMessage('window.location.reload();', '/');
							$('.h4p_game>iframe').fadeIn('slow');
						}, 100);
					}

					// エディタの幅を変更
					setTimeout(function() {
						var $div = $("div.h4p_restaging_editor");
						jsEditor.setSize($div.width(), $div.height());
					}, 10);

				}

				// リサイズイベント
				(function() {
					var old_body_width = 0;
					$(window).on('resize', function() {
						// 幅が変わっていないときはスルー
						if (old_body_width === $(document.body).width()) return;
						alignment();
						old_body_width = $(document.body).width();
					});

				})();
				alignment();

			})();

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
				// RUN
				jsEditor.save();
				var code = jsEditor.getTextArea().value;
				sessionStorage.setItem('restaging_code', code);

				// 投稿可能状態に
				$(".h4p_publish").show();
				$("#stage-name_alert").hide();
				$("#author_alert").hide();

				// ゲームをリロード
				$('.h4p_game>iframe').get(0).contentWindow.postMessage('window.location.reload();', '/');
			});
			$('.h4p_save_button').on('click', function() {
				// Save
				var loading = $(this).find('button');

				// サムネイル生成のコールバックとしてタスクを準備
				window.addEventListener('message', (function task(e) {
					// onmessageのリスナとして登録するので識別をおこなう
					if (e.data !== 'updateProject') return;
					// 即座にリスナを解放する
					window.removeEventListener('message', task);

					if(sessionStorage.getItem('project-token') === null){
						// プロジェクトが作られていないので、作成
						loading.button('loading');
						makeProject(function() {
							updateTask(function() {
								loading.button('reset');
							});
						}, function() {
							loading.button('reset');
						});
					}else{
						loading.button('loading');
						updateTask(function() {
							loading.button('reset');
						});
					}
				}));

				// サムネイルを生成
				$('.h4p_game>iframe').get(0).contentWindow.postMessage("saveImage('updateProject');", '/');

			});

			// ビューの設定
			$(".h4p_while-restaging").show(); // UI
			$(document.body).css('background-color', 'rgb(92, 92, 92)');

			// 投稿時の設定
			$('#inputModal').on('show.bs.modal', function () {
				// サムネイルを生成
				$(".h4p_game>iframe").get(0).contentWindow.postMessage("saveImage('thumbnail');", '/');
			});

			// 投稿
			$("#publish-button").on('click', function() {

				$("#inputModal").modal('hide');
				// 必ず保存してから投稿
				$('.h4p_save_button button').button('loading');
				updateTask(function() {
					$('.h4p_save_button button').button('reset');
					publishTask();
				});
			});

			// YouTubeの設定
			if (getParam('youtube') !== '') {

				// YouTube Frame API をロード
				$('<script>').attr('src', 'https://www.youtube.com/iframe_api').prependTo('body');
				onYouTubeIframeAPIReady = function() {
					var player = new YT.Player('kit-embed-content', {
						width: $('.h4p_youtube-frame').width(),
						height: $('.h4p_youtube-frame').width() / 1.5,
						videoId: getParam('youtube')
					});
				};
			}

		};

		function makeProject (successed, failed) {
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
						if (failed !== undefined) {
							failed();
						}
						break;
					case 'invalid-stageid':
						showAlert('alert-danger', 'このステージは改造できません');
						break;
					case 'database-error':
						showAlert('alert-danger', 'エラーにより改造できませんでした');
						break;
					default:
						sessionStorage.setItem('project-token', data);
						if(successed !== undefined){
							successed();
						}
						break;
				}
			});
		}
		function updateTask (callback) {
			// Update data
			var token = sessionStorage.getItem('project-token');
			var timezone = new Date().getTimezoneString();
			jsEditor.save();
			var code = jsEditor.getTextArea().value;

			$.post('../project/updatefromtoken.php', {
				'token': token,
				'data': code,
				'source_stage_id': getParam('id'),
				'timezone': timezone,
				'thumb': sessionStorage.getItem('image') || null,
				'attendance-token': sessionStorage.getItem('attendance-token')
			}, function(data, textStatus, xhr) {

				switch(data){
					case 'no-session':
						$('#signinModal').modal('show').find('.modal-title').text('ステージを改造するには、ログインしてください');
						break;
					case 'invalid-token':
						// project-tokenがない、またはサーバー側と照合できないとき
						showAlert('alert-danger', 'プロジェクトが保存されていません。新規に作成を行いますので、しばらくお待ちください…');
						$('.h4p_save_button button').button('loading');
						var tmpCallback = callback; // callbackの発動を遅らせる
						callback = undefined; // callbackの発動を遅らせる
						makeProject(function() {
							updateTask(function() {
								showAlert('alert-success', 'プロジェクトが作成されました！');
								if (tmpCallback !== undefined) {
									tmpCallback();
								}
							});
						});
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
						break;
				}
				if (callback !== undefined) {
					callback();
				}
			});
		}
		function publishTask (callback) {

			var title = $("#stage-name").val();
			var explain = $('#stage-explain').val();
			if(title === ""){ $("#stage-name_alert").show('fast'); }
			if(title !== ""){
				$("#h4p_publish button").button('loading');
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

					$('#h4p_publish button').button('reset');

					switch(data){
						case 'no-session':
							$('#signinModal').modal('show').find('.modal-title').text('ステージを投稿するには、ログインしてください');
							break;
						case 'invalid-token':
							// project-tokenがない、またはサーバー側と照合できないとき
							showAlert('alert-danger', 'プロジェクトが見つかりません。新規に作成を行いますので、しばらくお待ちください…');
							$('.h4p_save_button button').button('loading');
							makeProject(function() {
								updateTask(function() {
									$('.h4p_save_button button').button('reset');
									showAlert('alert-success', 'プロジェクトが作成されました！もう一度投稿してください');
								}, function() {
									$('.h4p_save_button button').button('reset');
								});
							});
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
		}

		switch(getParam('mode')){
			case "official":
				// official mode (load default code from main.js)
				$(".begin_restaging").on('click', function() {
					beginRestaging();
					sessionStorage.removeItem('project-token'); // プロジェクトキーをリセット
				});
				break;
			case "restaging":
				// restaging mode (load javascript-code from sessionStorage)
				beginRestaging();
				// 投稿可能状態に
				$(".h4p_publish").show();
				$("#stage-name_alert").hide();
				$("#author_alert").hide();

				scrollToAnchor();
				break;
			case "replay":
				// replay mode (load javascript-code and run it)
				sessionStorage.setItem('restaging_code', getParam('replay_code'));
				$(".begin_restaging").on('click', function() {
					beginRestaging();
					sessionStorage.removeItem('project-token'); // プロジェクトキーをリセット
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

		$('.h4p_hint-button').on('click', function() {
			// モーダルがひらく
			$('#youtubeModal').modal('show');
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