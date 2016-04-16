var onYouTubeIframeAPIReady = null;
$(function(){

	// ゲームフレームを横幅基本で3:2にする
	$(".h4p_game,.h4p_credit").height($(".h4p_game").width()/1.5);
	// ゲームクリアの処理
	window.addEventListener('message', function(e){
		switch(e.data){
			case "tutorial_next_page":
				// 1~5のときは次のページへ / 6のときは getaccount へ
				if (getParam('next') >> 0) {
					location.href = '/s/?id=' + getParam('next');
				} else {
					location.href = '/getaccount/';
				}
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
				if ( !$('.container.container-game').hasClass('restaging') ) {
					// ゲーム側からリステージングを開始する
					$('.begin_restaging').trigger('click');
				}
				break;
			case "show_comment":
				// ゲーム側からコメントの入力画面を表示する
				$('#commentModal').modal('show');
				break;
			case "quest_clear_level":
				(function (callback) {
					// 報告義務はあるか？ (クエスト|レベル) に, 初挑戦した or まだクリアしていない とき true
					if (getParam('reporting_requirements')) {

						$.post('../stage/sendlevelstate.php', {
							'level': getParam('level')
						} , function(data, textStatus, xhr) {
							callback();
						});
					} else {
						callback();
					}
				})(function() {
					// 次のレベルに移動する処理を準備しておく (トリガーはゲーム側に引かせる)
					window.addEventListener('message', function (event) {
						if (event.data === 'quest_move_next') {
							// 次のレベルが存在するか
							if (getParam('next') >> 0 > 0) {
								// 次のレベルに遷移
								location.href = '/s/?mode=quest&level=' + getParam('next');
							} else {
								// (クエストコンプリート後の動線.ひろばにもどる)
								location.href = '/town/';
							}
						}
					});
				});
				break;
			case 'use_soundcloud':
			$('.brand-soundcloud').removeClass('hidden');
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
		document.getElementById('item-embed-iframe').contentWindow.postMessage({
			query: 'eval',
			value: "saveImage('thumbnail');"
		}, '/');
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

					sessionStorage.setItem('stage_param_comment', ''); // no-comment
					break;
				default:
					var result = JSON.parse(data);

					var $comment = $('.h4p_my-comment').removeClass('hidden');
					$comment.find('.h4p_comment-trash').data('id', result.ID);
					if (result.Tags.length > 0) {
						$comment.find('.comment-tag').text(result.Tags[0].DisplayString).css('background-color', result.Tags[0].LabelColor);
					}
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
						$('.h4p_my-comment').addClass('hidden');
						sessionStorage.setItem('stage_param_comment', '');
						break;
				}
			});
		}
	});

	// Share Buttons
	(function () {
		var encodedTitle = encodeURIComponent(getParam('title'));
		var URL = 'https://hackforplay.xyz/s/?id='+getParam('id');
		var encodedURL = encodeURIComponent(URL);
		$('.twitter-share-button').attr('href', 'https://twitter.com/intent/tweet?hashtags=hackforplay&text=' + encodedTitle + '&url=' + encodedURL);
		$('.fb-share-button').attr('data-href', URL);
		$('.h4p-link-button').height(22).css({
			'margin-top': '-10px',
			'padding': '1px 10px'
		}).addClass('btn btn-sm btn-default').click(function(event) {
			var input = $('<input>').attr({
				'type': 'text',
				'size': URL.length,
				'value': URL
			}).click(function(event) {
				$(this).get(0).selectionStart = 0;
				$(this).get(0).selectionEnd = URL.length;
			}).insertAfter(this);
			$(this).remove();
		});
	})();

	// HackforPlay RePlay (then externalizing the code)
	// 読み込み時の処理
	var jsEditor = CodeMirror.fromTextArea($('textarea[name=restaging_code]').get(0), {
		mode: "javascript",
		lineNumbers: true,
		scrollbarStyle: 'simple',
		indentUnit: 4,
		indentWithTabs: true,
		matchBrackets: true,
		autoCloseBrackets: true,
		foldGutter: true,
		gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
		lint: true,
		extraKeys: {
			'Ctrl-Enter': function () { $('.h4p_restaging_button').trigger('click'); },
			'Cmd-Enter': function () { $('.h4p_restaging_button').trigger('click'); },
			'Ctrl-S': function () { $('.h4p_save_button').trigger('click'); },
			'Cmd-S': function  () { $('.h4p_save_button').trigger('click'); },
			'Ctrl-Q': function(cm){ cm.foldCode(cm.getCursor()); }
		},
		foldOptions: {
			rangeFinder: CodeMirror.fold.auto,
			widget: "✧⟣❃⟢✧",
			minFoldSize: 1,
			scanUp: false
		},
		keyMap: 'sublime'
	});
	jsEditor.on('beforeChange', function(cm, change) {
		if (change.origin === "undo" && cm.doc.historySize().undo === 0) {
			// Ctrl+Zの押し過ぎで、全部消えてしまうのをふせぐ
			change.cancel();
		}
	});
	jsEditor.on('change', function(cm, change) {
		// Fix save icon
		$('.h4p_save_button .glyphicon').removeClass('glyphicon-saved').addClass('glyphicon-save');
		// Fix undo/redo icon
		var undo = $('.h4p_restaging_menu button[data-query="undo"]'),
		redo = $('.h4p_restaging_menu button[data-query="redo"]');
		if (jsEditor.historySize().undo > 1) undo.removeClass('disabled');
		else undo.addClass('disabled');
		if (jsEditor.historySize().redo) redo.removeClass('disabled');
		else redo.addClass('disabled');
	});
	(function () {
		var preventDragged = '';
		jsEditor.on('change', function (cm, change) {
			// Run on paste
			if (change.origin === 'paste' && change.text.join() === preventDragged) {
				$('.h4p_restaging_button').trigger('click');
			}
			if (change.origin === 'drag') {
				preventDragged = change.removed.join();
			}
		});
	})();
	$('.h4p_restaging_menu').on('click', 'button', function() {
		switch ($(this).data('query')) {
			case 'undo':
			jsEditor.undo();
			$('.h4p_restaging_button').trigger('click');
			break;
			case 'redo':
			jsEditor.redo();
			$('.h4p_restaging_button').trigger('click');
			break;
			case 'keybind':
			var bind = $(this).data('bind') || 'sublime';
			var text;
			switch (bind) {
				case 'sublime': bind = 'vim'; text = 'vi'; break;
				case 'vim': bind = 'emacs'; text = 'em'; break;
				default: bind = 'sublime'; text = 'st'; break;
			}
			jsEditor.setOption('keyMap', bind);
			$(this).data('bind', bind).text(text);
			break;
		}
		jsEditor.scrollIntoView(jsEditor.getCursor());
	});
	(function () {
		var button = $('.h4p_restaging_menu button[data-query="indent"]');
		button.on('click', function() {
			if (!$(this).hasClass('active')) {
				checkBracket(jsEditor, function () {
					var scroll = jsEditor.getScrollInfo();
					refactoring(jsEditor);
					jsEditor.scrollTo(scroll.left, scroll.top);
				});
			}
		});
		jsEditor.on('change', function(cm, change) {
			checkBracket(cm, function () {
				button.removeClass('disabled');
				if (button.hasClass('active') && ['+input', '*compose', 'paste'].indexOf(change.origin) > -1) {
					// { } [ ] のセットが揃っている時、自動でインデントを行う
					refactoring(cm, change);
				}
			}, function () {
				button.addClass('disabled');
			});
		});

		(function () {
			jsEditor.on('beforeChange', function task (cm, change) {
				if (change.origin === 'setValue') {
					jsEditor.off('beforeChange', task);
					window.addEventListener('message', function _task (event) {
						if (event.data === 'game_loaded') {
							window.removeEventListener('message', _task);
							checkBracket(jsEditor, function () {
								jsEditor.clearHistory();
								refactoring(jsEditor);
							}, function () {
								button.addClass('disabled');
							});
							jsEditor.execCommand('foldAll');
						}
					});
				}
			});
		})();

		function checkBracket (cm, success, failed) {
			var fullText = cm.getValue('');
			if (fullText.split('{').length === fullText.split('}').length &&
				fullText.split('[').length === fullText.split(']').length) {
				if (success) success();
			} else {
				if (failed) failed();
			}
		}
		function refactoring (cm, change) {
			var tabs = 0, cursor = cm.doc.getCursor();
			cm.getValue(false).forEach(function(elem, index) {
				var closerOnHead = elem.match(/^\s*([\}\]]+)/),
				openerNum = elem.split('{').length + elem.split('[').length - 2,
				closerNum = elem.split('}').length + elem.split(']').length - 2;
				if (closerOnHead) {
					tabs -= closerOnHead[1].length;
					closerNum -= closerOnHead[1].length;
				}
				tabs = Math.max(0, tabs);
				var replacement = elem.replace(/^\s*/g, new Array(tabs + 1).join('\t'));
				if (elem !== replacement) {
					cm.replaceRange(replacement, { line: index, ch: 0 }, { line: index });
					if (cursor.line === index) {
						cm.doc.setCursor({
							line: cursor.line,
							ch: cursor.ch + tabs - elem.match(/^\s*/g)[0].length
						});
					}
				}
				tabs += openerNum - closerNum;
			});
		}
	})();
	var $div = $("div.h4p_restaging_editor");
	jsEditor.setSize($div.width(), $div.height());
	if(getParam('mode') !== "restaging"){
		$(".h4p_restaging").hide();
		$(".h4p_while-restaging").hide();
	}
	// ステージ改造中、画面遷移するとき注意をうながすフラグ
	var alert_on_unload = false;

	(function(){
		var beginRestaging = function(isExtendMode){

			$('.container.container-game').addClass('restaging');
			if (getParam('amd-test')) {
				console.log('AMD mode using', sessionStorage.getItem('project-token'));
				document.getElementById('item-embed-iframe').src = '/embed/?mod=true&type=project&token=' + sessionStorage.getItem('project-token');
			} else {
				document.getElementById('item-embed-iframe').src = '/embed/?type=local&key=restaging_code&id=' + getParam('id');
			}

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
				$('#inputModal').on('click', '#publish-button', function() {
					log.PublishCount = log.PublishCount || 0;
					log.PublishCount ++;
					updateLog();
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
				var lastJsonString = JSON.stringify(log);
				var currentInterval = updateInterval;
				(function task () {
					var current = JSON.stringify(log);
					if (lastJsonString !== current) {
						updateLog(function() {
							lastJsonString = current;
							currentInterval = updateInterval;
						}, function() {
							currentInterval *= 2; // 失敗時の対処
						});
					}
					setTimeout(task, currentInterval);
				})();

				function beginLog (successed, failed) {
					// ロギングの開始をサーバーに伝え、トークンを取得する
					$.post('../analytics/beginrestaginglog.php', {
						'stage_id': getParam('id'),
						'mode': getParam('mode'),
						'level': getParam('level'),
						'report': getParam('reporting_restaged')
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
				var alignmentMode = 'both'; // both(２カラム) | game(ゲーム画面のみ)
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
						var W = $('.container-game').outerWidth() + $('.container-tab').outerWidth();
						$('.container-assets').removeClass('hidden').outerWidth(body_width - W - 60).css('left', W);
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
						$('.container-assets').addClass('hidden').width(0);
						break;
					}

					$('.h4p_game,.h4p_game>iframe').width($('.container-game').width()).height($('.container-game').width() / 1.5 >> 0);
					$('.container-game').css('float', 'left');

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
			});
			$(".h4p_info-footer").text("（リステージング中）");
			$(".visible-option-restage").css('visibility', 'hidden');
			$(".h4p_restaging_button").on('click', function() {
				// RUN
				jsEditor.save();
				var code = jsEditor.getTextArea().value;
				sessionStorage.setItem('restaging_code', code);

				// 投稿可能状態に
				$(".h4p_publish").show();
				$("#author_alert").hide();

				document.getElementById('item-embed-iframe').contentWindow.postMessage({
					query: 'eval',
					value: getParam('amd-test') ? 'window.location.reload(true);' : 'window.location.reload();'
				}, '/');
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

					loading.find('.glyphicon').toggleClass('glyphicon-save glyphicon-saved');
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
				document.getElementById('item-embed-iframe').contentWindow.postMessage({
					query: 'eval',
					value: "saveImage('updateProject');"
				}, '/');
			});

			// ビューの設定
			$(".h4p_while-restaging").show(); // UI
			$(document.body).css('background-color', 'rgb(92, 92, 92)');

			// 投稿時の設定
			$('#inputModal').on('show.bs.modal', function () {
				// サムネイルを生成
				document.getElementById('item-embed-iframe').contentWindow.postMessage({
					query: 'eval',
					value: "saveImage('thumbnail');"
				}, '/');
			});

			// 投稿
			(function () {
				var $form = $('#inputModal form');
				$form.submit(function(event) {
					validation(function () {
						$('#inputModal').modal('hide');
						$('.h4p_publish button').addClass('disabled');
						if(sessionStorage.getItem('project-token') === null){
							$('.h4p_publish button').removeClass('disabled');
							// プロジェクトが作られていないので、作成
							makeProject(function() {
								publishTask();
							});
						}else{
							publishTask();
						}
					}, null, false);
					return false;
				});
				var showing = false;
				$('#inputModal').on('show.bs.modal', function() {
					showing = true;
					validation(function () {
						$form.find('button[type="submit"]').removeClass('disabled');
					}, function () {
						$form.find('button[type="submit"]').addClass('disabled');
					}, true);
				}).on('hide.bs.modal', function() {
					showing = false;
				});
				function validation (success, failed, retry) {
					var values = {
						title: $form.find('.stage-name').val(),
						explain: $form.find('.stage-explain').val(),
						flag: showing
					};
					if (Object.keys(values).every(function (key) {
						return values[key];
					})) { if (success) success(); } else { if (failed) failed(); }
					if (retry) setTimeout(function () {
						validation(success, failed, showing);
					}, 100);
				}
			})();

			// Smart Assets
			(function () {
				var smartAsset = null, __counters = {};
				window.addEventListener('message', function (event) {
					if (event.data === 'game_loaded') {
						var str = sessionStorage.getItem('stage_param_smart_asset');
						smartAsset = $.parseJSON(str); // Update Smart Assets
						smartAsset.apps.forEach(function (asset, index) {
							// elementのdata-cacheと比較. eleがない:追加, eleと同じ:無視, eleと違う: 挿入後、eleを削除
							var element = $('.container-assets .smart-asset-entity').get(index),
							json = JSON.stringify(asset);
							if (element && $(element).data('cache') === json) return; // eleと同じ:無視
							var $div = this.clone(true, true).data({
								index: index,
								cache: json,
								init: 'no'
							}).toggleClass('smart-asset-sample smart-asset-entity query-' + asset.query);
							if (!element) {
								$div.appendTo(this.parent()); // eleがない:追加
							} else {
								$div.insertBefore(element);
								element.remove(); // eleと違う: 挿入後、eleを削除
							}
							// icon
							var size = $div.find('.toggle-click-false').outerHeight($div.width()).height();
							$div.find('img.icon').attr('src', asset.image).on('load', function() {
								if (asset.trim) {
									var x = asset.trim.x !== undefined ? asset.trim.x / asset.trim.width :
									asset.trim.frame % (this.width / asset.trim.width),
									y = asset.trim.y !== undefined ? asset.trim.y / asset.trim.height :
									asset.trim.frame / this.width * asset.trim.width >> 0;
									$(this).css({
										position: 'relative',
										top: '-' + (y * size >> 0) + 'px',
										left: '-' + (x * size >> 0) + 'px',
										width: this.width * size / asset.trim.width,
										height: this.height * size / asset.trim.height
									});
								} else {
									$(this).addClass('img-responsive');
								}
							});
							// preopen
							if (asset.preopen) $div.trigger('click');
						}, $('.container-assets .smart-asset-sample'));
						// Removed Assets
						$('.container-assets .smart-asset-entity').filter(function(index) {
							return index >= smartAsset.apps.length;
						}).remove();
						$('.container-assets').css('height', $('.container-assets').outerHeight());
					}
				});
				$('.container-assets').on('click', '.smart-asset-entity', function() {
					$(this).toggleClass('toggle-clicked');
					var index = $(this).data('index') >> 0;
					var asset = smartAsset.apps[index];
					var toggle = $(this).hasClass('toggle-clicked');
					var init = $(this).data('init');
					$('.container-assets .smart-asset-entity').each(function(index, el) {
						// close all
						$(el).removeClass('toggle-clicked');
					});
					if (toggle) {
						if (init === 'no') {
							$(this).trigger('init.hfp', asset).data('init', 'yes');
						}
						$(this).trigger('show.hfp', asset);
						$(this).addClass('toggle-clicked');
						// $(this).insertBefore('.smart-asset-entity:first');
					}
				}).on('init.hfp', '.query-embed,.query-replace', function(event, asset) {
					$(this).find('.title').text(asset.title);
					$(this).find('img.embed-icon').attr('src', asset.image).on('load', function() {
						var size = $(this).parent().outerHeight($(this).parent().parent().width()).height();
						if (asset.trim) {
							var x = asset.trim.x !== undefined ? asset.trim.x / asset.trim.width :
							asset.trim.frame % (this.width / asset.trim.width),
							y = asset.trim.y !== undefined ? asset.trim.y / asset.trim.height :
							asset.trim.frame / this.width * asset.trim.width >> 0;
							$(this).css({
								position: 'relative',
								top: '-' + (y * size >> 0) + 'px',
								left: '-' + (x * size >> 0) + 'px',
								width: this.width * size / asset.trim.width,
								height: this.height * size / asset.trim.height
							});
						} else {
							$(this).addClass('img-responsive');
						}
					});
					$(this).find('.embed-caption').text(asset.caption);
				}).on('click', '.embed-code', function(event) {
					return false;
				}).on('init.hfp', '.query-toggle', function(event, asset) {
					$(this).find('.title').text(asset.title);
					$(this).find('.media-image').attr('src', asset.media);
				}).on('show.hfp', '.query-embed,.query-replace', function(event, asset) {
					// Update Embed Code
					$(this).trigger('update.hfp', asset);
				}).on('click', '.query-embed button,.query-replace button', function(event) {
					var $div = $(this).parents('.query-replace,.query-embed'),
					index = $div.data('index') >> 0,
					asset = smartAsset.apps[index];
					// Pattern matching
					var code = jsEditor.getValue(''),
					matching = asset.query === 'replace' ? code.match(asset.pattern) : false;
					if (matching) {
						// Get replace pos
						var before = code.split(matching[0])[0],
						beforeLines = before.split('\n'),
						matchLines = matching[0].split('\n'),
						from = {
							line: beforeLines.length - 1,
							ch: beforeLines[beforeLines.length - 1].length
						}, to = {
							line: from.line + matching[0].split('\n').length - 1,
							ch: matchLines[matchLines.length - 1].length + 1
						};
						replaceRange($div.data('replacement'), from, to, '+input');
					} else {
						// Get embed pos
						var identifier = typeof asset.identifier === 'string' ? asset.identifier.split('') : asset.identifier,
						pos = {
							line: jsEditor.getValue(false).findIndex(function (code, index) {
								return code.search(/\/\/.*\/\//) != -1 && identifier.every(function (key) {
									return code.indexOf(key) != -1;
								});
							}),
							ch: 0
						};
						replaceRange($div.data('replacement'), pos, pos, '+input', '\n\n');
					}
					// Count up
					(asset.counters || []).forEach(function (key) {
						var cnt = __counters[key];
						cnt.index = (cnt.index + 1) % cnt.table.length;
					});
					$('.h4p_restaging_button').trigger('click');
					$(this).trigger('update.hfp', asset); // Update code
					window.__PostActivity('asset', {
						AssetID: asset.id || null,
						Registered: new Date().format('Y-m-d H:i:s.u', true),
						token: sessionStorage.getItem('project-token')
					});
					return false;
				}).on('update.hfp', '.query-embed,.query-replace', function(event, asset) {
					var code = jsEditor.getValue('');
					// Make dictionaly
					var dictionaly = (asset.variables || []).map(function(item) {
						// Variable
						for (var i = 1; i < 100000; i++) {
							if (code.match(new RegExp('(^|\\W)' + item + i + '(\\W|$)')) === null) {
								return {
									key: new RegExp('(^|\\W)' + item + '(\\W|$)', 'g'),
									value: '$1' + item + i + '$2'
								};
							}
						}
					}).concat((asset.counters || []).map(function(item) {
						// Counters
						if (smartAsset.counters[item] !== undefined) {
							var cnt = __counters[item] = (__counters[item] || smartAsset.counters[item]);
							cnt.index = cnt.index > -1 ? cnt.index : 0;
							return {
								key: item,
								value: cnt.table[cnt.index]
							};
						}
					}));
					// Translation
					var lines = asset.lines.map(function(line) {
						dictionaly.forEach(function (item) {
							line = line.replace(item.key, item.value);
						});
						return line;
					});
					$(this).data('replacement', lines.join('\n'));
					$(this).find('.embed-code').children().remove();
					lines.forEach(function (line) {
						$('<p>').text(line).appendTo(this);
					}, $(this).find('.embed-code'));
				}).affix({
					offset: {
						top: $('nav.navbar').outerHeight(true),
						bottom: function () { return -$('.container-game').outerHeight()+340; }
					}
				});
				function replaceRange (replacement, from, to, origin, suffix) {
					var replacementLines = replacement.split('\n');
					jsEditor.replaceRange(replacement.concat(suffix || ''), from, to, origin);
					jsEditor.setSelection(from, {
						line: from.line + replacementLines.length - 1,
						ch: replacementLines[replacementLines.length - 1].length + 1
					}, {
						scroll: true
					});
				}
			})();
		};

		function makeProject (successed, failed) {
			// 残っているトークンを破棄
			sessionStorage.removeItem('project-token');
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
					case 'unauthorized-restage':
						showAlert('alert-danger', 'このステージは改造できません');
						break;
					default:
						sessionStorage.setItem('project-token', data);
						if(successed !== undefined){
							successed();
						}
						if (getParam('amd-test')) {
							document.getElementById('item-embed-iframe').src = '/embed/?mod=true&type=project&token=' + sessionStorage.getItem('project-token') + '&t=' + new Date().getTime();
						}
						break;
				}
			});
		}
		function updateTask (callback) {
			// Update data
			$.post('../commit/', {
				token : sessionStorage.getItem('project-token'),
				code : jsEditor.getValue(''),
				timezone : new Date().getTimezoneString(),
				thumb : sessionStorage.getItem('image') || null,
				publish : false,
				'attendance-token' : sessionStorage.getItem('attendance-token')
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
						if (getParam('amd-test')) {
							document.getElementById('item-embed-iframe').src = '/embed/?mod=true&type=project&token=' + sessionStorage.getItem('project-token');
						}
						break;
				}
				if (callback !== undefined) {
					callback();
				}
			});
		}
		function publishTask (callback) {
			var stage_info = {
				title: $("#inputModal .stage-name").val(),
				explain: $('#inputModal .stage-explain').val(),
				source_id: getParam('id')
			};
			$(".h4p_publish button").button('loading');
			$.post('../commit/', {
				token: sessionStorage.getItem('project-token'),
				code: jsEditor.getValue(''),
				timezone: new Date().getTimezoneString(),
				thumb: sessionStorage.getItem('image') || null,
				publish: true,
				stage_info: JSON.stringify(stage_info),
				team_id: $('#inputModal input[name="input-team"]:checked').val() || null,
				'attendance-token': sessionStorage.getItem('attendance-token')
			} , function(data, textStatus, xhr) {
				$('.h4p_publish button').button('reset');
				switch(data){
					case 'no-session':
						$('#signinModal').modal('show').find('.modal-title').text('ステージを投稿するには、ログインしてください');
						break;
					case 'invalid-token':
						// project-tokenがない、またはサーバー側と照合できないとき
						showAlert('alert-danger', 'プロジェクトが見つかりません。新規に作成を行いますので、しばらくお待ちください…');
						makeProject(function() {
							publishTask(function() {
								showAlert('alert-success', '投稿が完了しました！');
							});
						});
						break;
					case 'already-published':
						showAlert('alert-danger', 'すでに投稿されたステージです');
						break;
					case 'database-error':
						showAlert('alert-danger', 'エラーにより投稿できませんでした');
						break;
					case 'unauthorized-team-publishing':
						showAlert('alert-danger', 'そのチームに投稿する権限を持っていません');
						break;
					case 'success':
						$('.h4p_publish button').text('Thank you for your ReStaging!!').attr('disabled', 'disabled').addClass('disabled');
						$(".h4p_published-info").removeClass('hidden');
						alert_on_unload = false; // 遷移時の警告を非表示
						if (callback) callback();
						break;
				}
			});
		}

		switch(getParam('mode')){
			case "official":
				// official mode (load default code from main.js)
				sessionStorage.setItem('restaging_code', getParam('replay_code'));
				$(".begin_restaging").on('click', function() {
					beginRestaging();
					makeProject();
				});
				break;
			case "restaging":
				// restaging mode (load javascript-code from sessionStorage)
				beginRestaging();
				// 投稿可能状態に
				$(".h4p_publish").show();
				$("#author_alert").hide();

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
				beginRestaging(true);
				scrollToAnchor('.h4p_restaging');
				break;
			case "quest":
				sessionStorage.setItem('restaging_code', getParam('replay_code'));
				$(".begin_restaging").on('click', function() {
					beginRestaging();
					makeProject();
				});
				if (!getParam('directly_restaging')) {
					// Show credit
					$('.container-game .h4p_game iframe').css('opacity', 0);
					$('.container-game .h4p_credit').removeClass('hidden');
					$('.container-game .h4p_credit .Title').text(getParam('title'));
					$('.container-game .h4p_credit .Author').text(getParam('author'));
					$('.container-game .h4p_credit .hasnext-' + !!(getParam('next') >> 0)).removeClass('hidden');
					$('.container-game .h4p_credit .PlayOrder').text(getParam('playorder'));

					// 順番にフェードイン
					$('.credit-timeline').hide();
					(function task (index) {
						var $element = $('.credit-timeline.credit-timeline-' + index);
						if ($element === undefined) return;
						$element.fadeIn(1000, function() {
							task(index + 1);
						});
					})(0);

					// ロードされた瞬間、ゲームを一時停止する
					var paused = false, creditVisibility = true;
					window.addEventListener('message', function(event) {
						if (event.data === 'game_loaded' && creditVisibility) {
							// ---- temporary implement ----
							var next = getParam('next') > 0 ? 'Hack.__QuestGameclearNext='+getParam('next') + '; ' : '';
							var report = getParam('reporting_requirements') ? 'Hack.__QuestGameclearNext=true; ' : '';
							$('.container-game .h4p_game iframe').get(0).contentWindow.postMessage({
								query: 'eval',
								value: 'if (Hack.__QuestGameclear) { Hack.ongameclear = Hack.__QuestGameclear; ' + next + report + ' }'
							}, '/');
							// ---- temporary implement ----
							document.getElementById('item-embed-iframe').contentWindow.postMessage({
								query: 'eval',
								value: 'game.pause()'
							}, '/');
							paused = true;
						}
					});
					// 2秒後、ゲームをフェードインする
					setTimeout(function() {
						$('.container-game .h4p_credit').addClass('hidden');
						$('.container-game .h4p_game iframe').css('opacity', 1);
						creditVisibility = false;
						if (paused) {
							document.getElementById('item-embed-iframe').contentWindow.postMessage({
								query: 'eval',
								value: 'game.resume()'
							}, '/');
						}
					}, 4000);
				}
				break;
		}

		// Directly restaging
		// 任意のステージをmode=restaging以外で読み込んだ直後にbeginRestagingするモード
		if (getParam('directly_restaging')) {
			switch (getParam('mode')) {
			case 'official':
				if (getParam('amd-test')) {
					makeProject(function () {
						updateTask(beginRestaging);
					});
				} else {
					beginRestaging();
					makeProject();
				}
				break;
			case 'replay':
			case 'quest':
				// 直後にbeginRestaging
				beginRestaging();
				sessionStorage.removeItem('project-token'); // プロジェクトキーをリセット
				break;
			}
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

	// ゲームフレームのリロード
	$('.h4p_info .btn-retry').on('click', function() {
		document.getElementById('item-embed-iframe').contentWindow.postMessage({
			query: 'eval',
			value: 'window.location.reload();'
		}, '/');
	});

	function getParam(key){
		return sessionStorage.getItem('stage_param_'+key) || '';
	}

	// Cast
	$('.h4p_cast-channel .dropdown-menu').on('click', 'a', function () {
		var target = $(this);
		var channelName = target.data('name');
		var castWindow = window.open('about:blank', 'cast');
		$.ajax({
			type: 'POST',
			url: '../cast/start.php',
			data: {
				name: channelName,
				token: sessionStorage.getItem('project-token')
			}
		}).done(function (data) {
			switch (data) {
				case 'success':
					castWindow.location.href = '/cast?name='+channelName+'&t='+new Date().getTime();
					break;
				case 'no-commit':
					$('.h4p_save_button').trigger('click');
					setTimeout(function () {
						target.trigger('click');
					}, 1000);
					break;
			}
		}).fail(function () {
			castWindow.close();
		}).always(function () {
			castWindow = null;
		});
	});

	// List of channels
	$.get('../cast/channels.php', {
		filter: true
	}, function (data) {
		var result;
		try {
			result = JSON.parse(data);
			result.forEach(function (channel) {
				$('<li>').append(
					$('<a>').data('name', channel.Name).text(channel.DisplayName+' | '+channel.Team)
				).appendTo('.h4p_cast-channel .dropdown-menu');
			});
		} catch (e) {
			console.error(e);
		}
	});


});
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}
