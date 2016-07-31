var onYouTubeIframeAPIReady = null;
var jsEditor = null;
$(function(){

	// iframe ロード
	function loadStage(code) {
		var game = document.getElementById('item-embed-iframe');

		var loading = (function () {
			var deferred = new $.Deferred();
			game.onload = deferred.resolve.bind(deferred);
			game.onerror = deferred.reject.bind(deferred);
			game.src = "/embed?type=code";
			return deferred;
		})();

		var fetching = getStage(getParam('id'));

		return $.when(loading, fetching)
		.done(function (loaded, fetched) {
			var stage = fetched instanceof Array ? fetched[0] : fetched;
			game.contentWindow.postMessage({
				query: 'require',
				dependencies: [stage.implicit_mod],
				code: code || stage.script.raw_code,
			}, '/');
			return loaded;
		})
		.fail(function () {
			alert('Error! look at your console.');
			console.error(arguments);
		});
	}

	// initialize
	if (getParam('mode') !== 'restaging' && !getParam('directly_restaging')) {
		loadStage();
	}
	// reload
	$('.h4p_info .btn-retry').on('click', function() {
		loadStage();
	});

	// Backspaceキーを無効化
	document.addEventListener('keydown', function (event) {
		if (event.keyCode === 8) {
			return false;
		}
	});

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

				result.values.filter(function (item) {
					return !!item;
				}).forEach(function(item) {

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
		capture();
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
			'thumb': $('#commentModal .stage-thumbnail').attr('src'),
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
	jsEditor = CodeMirror.fromTextArea($('textarea[name=restaging_code]').get(0), {
		mode: "javascript",
		lineNumbers: true,
		scrollbarStyle: 'simple',
		indentUnit: 4,
		indentWithTabs: true,
		matchBrackets: true,
		autoCloseBrackets: true,
		foldGutter: true,
		gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
		lint: {
			sub: true,
			loopfunc: true,
			eqnull: true,
			esversion: 5,
			multistr: true,
		},
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

	// javascript-hint
	(function () {
		var globalScope = {};

		window.addEventListener('message', function (event) {
			if (!event.data || event.data.query !== 'javascriptHint') return;
			for (var variable in event.data.globalScope) {
				globalScope[variable] = event.data.globalScope[variable];
			}
		});

		jsEditor.on("change", function (cm, change) {
			var token = cm.getTokenAt(cm.getCursor());
			// 変数名,プロパティ名,キーワード及び「.」入力時のみヘルパー利用
			if (['variable','property','keyword'].indexOf(token.type) !== -1 ||
						token.state.lastType === '.') {
				CodeMirror.showHint(cm, function (cm, options) {
					options.completeSingle = false;
					options.useGlobalScope = true;
					options.globalScope = globalScope;
					var result = CodeMirror.hint.javascript(cm, options);
					(result.list || []).sort(function (a, b) {
						return a.toUpperCase() > b.toUpperCase() ? 1 : -1;
					});
					return result;
				});
			}
		});

	})();

	var $div = $("div.h4p_restaging_editor");
	jsEditor.setSize($div.width(), $div.height());
	if(getParam('mode') !== "restaging"){
		$(".h4p_restaging").hide();
		$(".h4p_while-restaging").hide();
	}
	// ステージ改造中、画面遷移するとき注意をうながすフラグ
	var alert_on_unload = false;
	window.addEventListener('beforeunload', function(event) {
		if (alert_on_unload) {
			event.returnValue = "せいさくちゅう の ステージ は「マイページ」に ほぞん されています。";
		} else {
			event.preventDefault();
		}
	});

	function getEmojiImg(item) {
		return $(emojione.shortnameToImage(`:${item.shortname}:`)).attr({
			'data-shortname': item.shortname,
			'data-emoji_id': item.id,
		});
	}

	// emojis
	function fetchEmojiSammary() {
		$.ajax({
			type: 'GET',
			url: `/api/stages/${getParam('id')}/emojis`,
			data: {
				summary: 1
			}
		})
		.done(function (result) {
			$('.h4p_info-emoji').children().remove();
			Object.keys(result).forEach(function (key) {
				$('.h4p_info-emoji').append(
					$('<span>').addClass('label label-emojispace').append(
						getEmojiImg({ shortname: key })
					).append(' ' + result[key])
				);
			});
			$('.h4p_info-emoji').append(
				$('<button>').addClass('btn btn-link').attr({
					'data-toggle': "collapse", 'data-target': ".h4p_info-emojiAll"
				}).append(
					$('<span>').addClass('glyphicon glyphicon-triangle-bottom')
				)
			);
		});
	}
	fetchEmojiSammary();

	// myemojis
	var user_id = +$('.h4p_info-myEmoji').data('userid');
	if (user_id > 0) {
		$.ajax({
			type: 'GET',
			url: `/api/stages/${getParam('id')}/emojis`,
			data: {
				user: user_id,
			},
		})
		.done(function (result) {
			result.data.forEach(function (item) {
				$('.h4p_info-myEmoji').append(getEmojiImg(item));
			});
		});

		// Emoji input
		$('.h4p_info-inputEmoji [data-toggle="popover"]').popover({
			content: function () {
				var $container = $('<div class="row">').css({
					'max-height': 220,
					'overflow-y': 'scroll',
				}).append(
					$('<div>').addClass('col-xs-12 text-center').append(
						'powerd by '
					).append(
						$('<a>').attr({
							href: '://emojione.com/demo/',
							target: '_blank',
						}).text('emojione')
					).append($('<hr>').css('margin', '0.6rem -15px 1.2rem -15px'))
				);

				var randomStart = Math.random() * (Object.keys(emojione.emojioneList).length - 2);
				[
					{ shortname: 'smile' },
					{ shortname: 'fearful' },
					{ shortname: 'heart' },
					{ shortname: 'beginner' },
					{ shortname: 'clap' },
					{ shortname: 'cool' },
					{ shortname: 'bug' },
					{ shortname: 'eyes' },
					{ shortname: 'sushi' },
				]
				.concat(
					Object.keys(emojione.emojioneList).slice(randomStart, randomStart + 3)
					.map(function (emoji) {
						return { shortname: emoji.slice(1, emoji.length - 1) };
					})
				).map(function (item) {
					return (
						$('<div>').addClass('col-xs-4 text-center').append(
							getEmojiImg(item)
							.on('click', postNewEmojiHandler)
						).append(
							$('<p>').append(`:${item.shortname}:`).css({
								'word-wrap': 'break-word',
								'margin-left': -15,
								'margin-right': -15,
							})
						)
					);
				})
				.forEach(function (elem) {
					$container.append(elem);
				});
				return $container;
			},
			html: true
		});

		function postNewEmojiHandler() {
			var shortname = $(this).data('shortname');
			$.ajax({
				type: 'POST',
				url: `/api/stages/${getParam('id')}/emojis`,
				data: {
					shortname: shortname,
				}
			})
			.done(function (result) {
				if (result.message) {
					alert(result.message + ' // えもじが いっぱいです');
				} else {
					$('.h4p_info-myEmoji').append(getEmojiImg(result));
					fetchEmojiSammary();
				}
			});
		}

		// Emoji delete
		$('.h4p_info-deleteEmoji').on('click', function () {
			var last = $('.h4p_info-myEmoji img:last-child');
			if (!last || !last.data('emoji_id')) return;

			$.ajax({
				type: 'POST',
				url: `/api/stages/${getParam('id')}/emojis/${last.data('emoji_id')}`,
				data: {
					_method: 'DELETE',
				}
			})
			.done(function () { fetchEmojiSammary(); });

			last.remove();

		});
	}

	// emoji all
	var emojiAll = [];
	function fetchEmojiAll(page) {
		page = page || 1;
		$.ajax({
			type: 'GET',
			url: `/api/stages/${getParam('id')}/emojis`,
			data: {
				page: page,
			}
		})
		.done(function (result) {
			emojiAll = emojiAll.concat(result.data);
			if (result.current_page < result.last_page) {
				fetchEmojiAll(page + 1);
			}
			result.data.forEach(function (emoji) {
				fetchUser(emoji.user_id);
			});
			renderEmojiAll();
		});
	}
	fetchEmojiAll();

	var userAll = {};
	function fetchUser(user_id) {
		if (userAll[user_id]) return;
		userAll[user_id] = { nickname: '' };
		$.ajax({
			type: 'GET',
			url: `/users/${user_id}`,
		})
		.done(function (result) {
			userAll[user_id] = result;
			renderEmojiAll();
		});
	}

	function renderEmojiAll() {
		var emojisEachUser = {};
		emojiAll.forEach(function (emoji) {
			emojisEachUser[emoji.user_id] =
				(emojisEachUser[emoji.user_id] || []).concat(emoji.shortname);
		});
		$('.h4p_info-emojiAll').children().remove();
		$('.h4p_info-emojiAll').append(
			$('<hr>')
		);
		Object.keys(emojisEachUser).map(function (user_id) {
			var $emojis = $('<span>').addClass('label label-emojispace');
			var emojis = emojisEachUser[user_id].forEach(function (shortname) {
				$emojis.append(getEmojiImg({ shortname: shortname }));
			});
			return (
				$('<div>').append(
					$emojis
				).append(
					$('<a>').attr('href', `/m/?id=${user_id}`).addClass('btn btn-link').append(
						$('<span>').text(userAll[user_id].nickname)
					)
				)
			);
		}).forEach(function ($row) {
			$('.h4p_info-emojiAll').append($row);
		});
	}

	switch(getParam('mode')){
		case "restaging":
			// restaging mode (load javascript-code from sessionStorage)
			beginRestaging();
			// 投稿可能状態に
			$(".h4p_publish").show();
			$("#author_alert").hide();

			scrollToAnchor();
			break;
		case "official":
		case "replay":
			// replay mode (load javascript-code and run it)
			sessionStorage.setItem('restaging_code', getParam('replay_code'));
			$(".begin_restaging").on('click', function() {

				// AMD need project has a script
				makeProject(function () {
					updateTask(function () {

						// Begin restaging
						beginRestaging();

					});
				});
			});
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
		case 'replay':
		case 'quest':
			// 直後にbeginRestaging
			makeProject(function () {
				updateTask(beginRestaging);
			});
			break;
		}
	}


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

// AMD Test function
function getModule() {
	return sessionStorage.getItem('project-token');
}

function setInnerModule() {
	var prefix = 'modules/~project/';
	var serial = prefix + Array.prototype.join.call(arguments, ',' + prefix);
	sessionStorage.setItem('inner-modules', serial);
	return serial;
}

function setOuterModule() {
	var prefix = 'modules/~project/';
	var serial = prefix + Array.prototype.join.call(arguments, ',' + prefix);
	sessionStorage.setItem('outer-modules', serial);
	return serial;
}

// capture the frame
function capture (value) {
	var deferred = new $.Deferred();
	var game = (document.getElementById('item-embed-iframe') || {}).contentWindow;
	var request = {
		query: 'capture',
		value: value,
		responseQuery: 'capture-' + (new Date()).getTime(),
	}

	function task (e) {
		if (typeof e.data === 'object' && e.data.query === request.responseQuery) {
			window.removeEventListener('message', task);
			deferred.resolve(e.data.value);
		}
	}

	window.addEventListener('message', task);

	// Timeout
	window.setTimeout(function () {
		if (deferred.state() === 'pending') {
			deferred.reject('Screen capture timeout. スクリーンキャプチャがタイムアウトしました');
			window.removeEventListener('message', task);
		}
	}, 2000);

	game.postMessage(request, '*');

	return deferred.done(function (dataUrl) {
		$(".stage-thumbnail").attr('src', dataUrl);
		return dataUrl;
	});
}
