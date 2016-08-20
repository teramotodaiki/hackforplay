(function(){
	// 互換性維持
	window.addEventListener('message', function (event) {
		if (event.data.query === 'smartAsset') {
			window.__smartAsset = event.data.assets
		}
	});


	var _updateTaskLastSentCode = '';
	window.beginRestaging = function(){

		$('.container.container-game').addClass('restaging');

    var token = sessionStorage.getItem('project-token');
    if (token) {
      $.ajax({
        type: 'GET',
        url: `/api/projects/${token}`
      })
      .done(function (result) {
				sessionStorage.setItem('stage_param_id', result.reserved_id);
        loadStage(result.head.raw_code);
        listChannels();
        showModInput();
        jsEditor.setValue(result.head.raw_code);
				_updateTaskLastSentCode = jsEditor.getValue('');
      })
      .fail(function () {
        alert('Load failed. プログラムが てにはいらなかった')
      });
    } else {
      var loading = $('.h4p_restaging_button button').button('loading');
      makeProject(function () {
        loading.button('reset');
        listChannels();
        showModInput();
      });
      getStage(getParam('id'))
      .done(function (result) {
        var stage = result.length ? result[0] : result;
        jsEditor.setValue(stage.script.raw_code);
      });
    }

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
		$(".h4p_restaging").fadeIn("fast");
		$(".h4p_info-footer").text("（リステージング中）");
		$(".visible-option-restage").css('visibility', 'hidden');
		$(".h4p_restaging_button").on('click', function() {

			// jsHintで syntax error を見つける
      var code = jsEditor.getValue('');
			if ('JSHINT' in window) {
				JSHINT(
					code,
					$.extend(jsEditor.state.lint.options, {
						shadow: true,
						expr: true,
						asi: true,
						elision: true,
						funcscope: true,
						notypeof: true,
						boss: true,
						supernew: true,
						"-W032": false,
						esversion: 6,
					}));
				if (JSHINT.data().errors) {
					var e = JSHINT.data().errors[0];
					window.postMessage({
						query: 'openExternal',
						url:	'https://error.hackforplay'+
									'?name=SyntaxError'+
									'&message='+e.reason+
									'&line='+e.line+
									'&column='+e.character
					}, '/');
				}
			}

			// Save
			var loading = $(this).find('button');
			loading.find('.glyphicon').toggleClass('glyphicon-save glyphicon-saved');
      loading.button('loading');

      var updating = new $.Deferred;

			if(sessionStorage.getItem('project-token') === null){
				// プロジェクトが作られていないので、作成
				makeProject(function() {
					updateTask(function() {
            updating.resolve();
					});
				}, function() {
          updating.reject();
				});
			}else{
				updateTask(function() {
          updating.resolve();
				});
			}

      $.when(updating, loadStage(code))
      .done(function () {
        loading.button('reset');
        // 投稿可能状態に
        $(".h4p_publish").show();
				$("#author_alert").hide();
      })
      .fail(function () {
        loading.button('reset');
        alert('Request failed. ほぞんに しっぱいした');
      });

		});

		// ビューの設定
		$(".h4p_while-restaging").show(); // UI
		$(document.body).css('background-color', 'rgb(92, 92, 92)');

		// 投稿時の設定
		$('#inputModal').on('show.bs.modal', function () {
			// サムネイルを生成
			capture();
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
			var smartAsset = window.__smartAsset, __counters = {};

      render();
      window.addEventListener('message', function (event) {
        if (event.data.query === 'smartAsset') {
					smartAsset = event.data.assets
          render();
        }
      });

			function render () {
					if (!smartAsset || !smartAsset.apps) return;
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

		// Cast
		$('.h4p_cast-channel .dropdown-menu').on('click', 'a', function () {
			var target = $(this);
			var channelId = target.data('id');
			var castWindow = window.open('/channels/' + channelId + '/watch', 'channel-' + channelId);
		});

		// capture-thumbnail-restaging
		$('#confirmThumbnailModal').on('show.bs.modal', function () {
			var $confirm = $(this).find('.thumbnail-update-confirm').button('loading');

			capture()
			.then(function (result) {
				// current thumbnail
				$('#confirmThumbnailModal .current-thumbnail').attr({
					alt: 'さつえいに しっぱいした',
					src: result
				});
				$confirm.button('reset');

				return getStage(getParam('id'));
			})
			.then(function (result) {
				// prevent thumbnail
				$('#confirmThumbnailModal .prevent-thumbnail').attr({
					alt: 'サムネイルが なかった',
					src: result.thumbnail
				});
			});
		});

		$('#confirmThumbnailModal .thumbnail-update-confirm').on('click', function () {
			var data_url = $('#confirmThumbnailModal .current-thumbnail').get(0).src;

			$.ajax({
				type: 'POST',
				url: '/api/thumbnails',
				data: { data_url: data_url }
			})
			.then(function (result) {
				return $.ajax({
					type: 'POST',
					url: '/api/stages/' + getParam('id'),
					data: {
						_method: 'PUT',
						thumbnail: result.url,
					}
				});
			})
			.then(function (result) {
				setStage(result);
			})
			.fail(function (err) {
				alert('サムネイルのへんこうが うまくいかなかった');
				console.error(err);
			});
		});

	};

	function makeProject (successed, failed) {
		// 残っているトークンを破棄
		sessionStorage.removeItem('project-token');
		$.ajax({
			type: 'POST',
			url: '/api/projects',
			data: { source_stage: getParam('id') },
			dataType: 'json',
		}).done(function (result) {
			if (result.token) {
				sessionStorage.setItem('project-token', result.token);
				sessionStorage.setItem('stage_param_id', result.reserved_id);
				(successed || function () {})();
			} else if (result.message) {
				showAlert('alert-danger', result.message);
			} else {
				console.error(result);
			}
		}).fail(function (xhr) {
			console.error(xhr);
		});
	}
	function updateTask (callback, resolveObject) {
		callback = callback || function () {};

		if (resolveObject === undefined) {
			capture().done(function (dataUrl) {
				updateTask(callback, {
					thumb: dataUrl,
				});
			}).fail(function (error) {
				console.log(error);
				updateTask(callback, {
					thumb: null,
				});
			});
			return;
		}

		var code = jsEditor.getValue('');
		if (code === _updateTaskLastSentCode) {
			callback();
			return;
		}

		$.ajax({
			type: 'POST',
			url: '/api/projects/' + sessionStorage.getItem('project-token'),
			data: {
				_method: 'PUT',
				script: {
					raw_code: code,
				}
			},
		})
		.done(function (result) {
			if (result.message) {
				alert(result.message);
			} else {
				callback();
				_updateTaskLastSentCode = code;
			}
		})
		.fail(function (xhr) {
			if (xhr.status === 404) {
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
			} else {
				console.error(xhr);
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
			thumb: $('#inputModal .stage-thumbnail').attr('src'),
			publish: true,
			stage_info: JSON.stringify(stage_info),
			team_id: $('#inputModal input[name="input-team"]:checked').val() || null,
			// minor_update: $('#inputModal input[name="minor-update"]').prop('checked'),
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

  function listChannels() {
    // List of channels
		$.get('/projects/'+ sessionStorage.getItem('project-token') +'/channels', {
			is_archived: false
		}, function (result) {

			result.data.forEach(function (channel) {
				var desc = channel.description;
				desc = !desc || desc.length < 10 ? desc : desc.substr(0, 9) + '…';
				$('<li>').append(
					$('<a>').data('id', channel.ID).text(desc)
				).appendTo('.h4p_cast-channel .dropdown-menu');
			});

			$('<li>').append(
				$('<a>').text('Create new channel').on('click', function () {

					$('.h4p_save_button').trigger('click');
					window.open('/channels/create?project_token=' + sessionStorage.getItem('project-token'), 'create-channel');
					return false;

				})
			).appendTo('.h4p_cast-channel .dropdown-menu');

		});
  }

  function showModInput() {
    var version = '*';
    var token = sessionStorage.getItem('project-token');
    var reqCode = ["require('~project/", token, '/', version, "');"].join('');
		$('.h4p_info-require').val(reqCode);
		$('.h4p_info-version').text(version);
  }
})();
