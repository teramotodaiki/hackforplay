function screenShot () {
	var request = {
		query: 'capture',
		responseQuery: 'screenShot-' + (new Date()).getTime(),
	}
	window.addEventListener('message', function task (e) {
		if (e.origin === window.location.origin &&
				typeof e.data === 'object' &&
				e.data.query === request.responseQuery
			) {
			var image = new Image(e.data.width, e.data.height);
			image.src = e.data.value;
			var px = function (num) { return ' ' + (num >> 0) + 'px '; }
			console.log(image);
			console.log('%c+', [
				'font-size: 0px',
				'padding:' + px(image.height / 2) + px(image.width / 2),
				'line-height: ' + px(image.height),
				'color: transparent',
				'background: url(' + image.src + ')',
				'background-size:' + px(image.width) + px(image.height),
			].join(';'));

			window.removeEventListener('message', task);
		}
	});
	window.postMessage(request, '/');
}
function refocus () {
	window.document.activeElement.blur(); // Blur an enchantBook
	window.parent.focus(); // Blur an input in parent window
	window.focus(); // focus game
}
function getEditor() {
	return Hack.enchantBook;
}

// Module check
(function (mod) {
	if (typeof define === "function" && define.amd) {

		define(function (require, exports, module) {

			require('hackforplay/enchantjs-kit');
			window.SC = require('https://connect.soundcloud.com/sdk/sdk-3.0.0.js');

			return mod();

		});

	} else {
    mod();
	}
})(function () {

	// Eval exception catch
	(function () {
		var _eval = window.eval;
		window.eval = function () {
			try {
				_eval.apply(window, arguments);
			} catch (e) {
				if (Hack && typeof Hack.openExternal === 'function') {
					Hack.openExternal('https://error.hackforplay'+
														'?name='+e.name+
														'&message='+e.message+
														'&line='+e.line+
														'&column='+e.column+
														'&sourceURL='+encodeURIComponent(e.sourceURL));
        }
			}
		};
	})();

	// Web Messaging Evaluation
	window.addEventListener('message', function (event) {
		switch (event.data.query) {
			case 'eval':
				eval(event.data.value);
				break;
			case 'dispatch':
				Hack.dispatchEvent(new Event(event.data.value));
				break;
		}
	});

	// IE11 互換性維持
	Math.sign = Math.sign || function(x) {
		x = +x; // convert to a number
		if (x === 0 || isNaN(x)) {
			return x;
		}
		return x > 0 ? 1 : -1;
	};

	game.preload('hackforplay/clear.png', 'hackforplay/gameover.png', 'hackforplay/button_retry.png', 'hackforplay/new_button_replay.png', 'hackforplay/new_button_retry.png', 'hackforplay/menu-button-menu.png', 'hackforplay/menu-button-restage.png', 'hackforplay/menu-button-hint.png', 'hackforplay/menu-button-comment.png', 'hackforplay/menu-button-retry.png', 'hackforplay/new_button_next.png', 'hackforplay/new_button_comment.png', 'hackforplay/new_button_restage.png', 'hackforplay/achievement_p.png', 'hackforplay/achievement_n.png', 'hackforplay/new_button_town.png');

	// Hack を override
	// enchant.EventTarget.prototype のメソッドを全てHackに移植
	(function (fake) {

		Object.keys(enchant.EventTarget.prototype).forEach(function (key) {
			Hack[key] = fake[key];
		});
		Hack.initialize();

	})(new enchant.EventTarget());

	Hack.fun2str = function (func) {
		// 関数の文字列化
		if (func instanceof Function) {
			var str = func.toString().match(/^function[^\{]*\{\n?(\s*)([\s\S]*)\}$/);
			if (str !== null) {
				var indent = str[1].match(/(.*)$/)[0];
				return (str[2]).split('\n' + indent).join('\n').replace(/\s*$/, '');
			} else {
				// 切り分けのミス
				Hack.log('Hack.restagingCode hasnot set the function because hack.js is wrong. See hack.js and fix it');
			}
		}
		return '';
	};

	// textarea : 画面全体をおおう半透明のテキストエリア(DOM)
	Hack.textarea = (function(){
		// scope: new Entity

		this.width = game.width - 32;
		this.height = game.height - 32;
		this.opacity = 1;
		this.visible = false;
		this.backgroundColor = 'rgba(0,0,0,0.7)';

		this._element = window.document.createElement('textarea');
		this._element.type = 'textarea';
		this._element.setAttribute('disabled', 'disabled');
		this._element.classList.add('log');

		game.on('load', function(event) {
			game.rootScene.addChild(Hack.textarea);
		});

		Object.defineProperty(this, 'text', {
			configurable: true, enumerable: true,
			get: function () {
				return this._element.value;
			},
			set: function (text) {
				this._element.value = text;
			}
		});
		this.show = function (text) {
			if (text !== undefined) {
				this.text = String(text);
			}
			this.visible = true;
		};
		this.hide = function () {
			this.visible = false;
		};

		return this;

	}).call(new enchant.Entity());

	Hack.log = function () {
		try {
			var values = [];
			for (var i = arguments.length - 1; i >= 0; i--) {
				switch(typeof arguments[i]){
					case 'object': values[i] = JSON.stringify(arguments[i]); break;
					default: values[i] = arguments[i] + ''; break;
				}
			}
			this.textarea.text = values.join(' ') + (this.textarea.text !== '' ? '\n' : '') + this.textarea.text;
			this.textarea.show();

		} catch (e) {
			Hack.log('Error', e.message);
		}
	};

	Hack.clearLog = function() {
		this.textarea.text = '';
	};

	// enchantBook
	Hack.enchantBook = (function(){
		// scope: new Entity
		var isEditorReady = false;
		Hack.on('editorready', function () {
			isEditorReady = true;
		});

		var _hint = '';
		Object.defineProperty(Hack, 'hint', {
			configurable: true,
			enumerable: true,
			get: function(){
				return _hint;
			},
			set: function(code){
				if (isEditorReady) {
					task(code);
				} else {
					Hack.oneditorready = task.bind(this, code);
				}
				function task (value) {
					_hint = value instanceof Function ? Hack.fun2str(value) : value;
					Hack.enchantBook._element.contentWindow.postMessage({
						query: 'set',
						value: _hint
					}, '/');
					var e = new Event('hintset');
					e.value = _hint;
					e.rawValue = value;
					Hack.dispatchEvent(e);
				}
			}
		});

		Hack.on('editend', function () {
			Hack.enchantBook.tl.scaleTo(0, 1, 3, enchant.Easing.LINEAR);
			refocus();
		});

		Hack.on('editcancel', function () {
			Hack.enchantBook.tl.scaleTo(0, 1, 7, enchant.Easing.BACK_EASEIN);
			refocus();
		});

		this.width = game.width;
		this.height = game.height;
		this.visible = false;
		this._element = window.document.createElement('iframe');
		this._element.id = 'editor';
		this._element.src = 'editor/index.html';
		this._element.setAttribute('width', '480');
		this._element.setAttribute('height', '320');
		this._element.type = 'iframe';
		game.rootScene.addChild(this);
		return this;

	}).call(new enchant.Entity());

	Hack.openEditor = function(){
		if (!this.enchantBook) return;
		this.enchantBook.scale(1, 0);
		this.enchantBook.tl.scaleTo(1, 1, 7, enchant.Easing.BACK_EASEOUT); // うごきあり
		this.enchantBook.visible = true;
		this.dispatchEvent(new Event('editstart'));
	};

	Hack.closeEditor = function(){
		if (!this.enchantBook) return;
		this.enchantBook.scale(1, 1);
		this.enchantBook.tl.scaleTo(0, 1, 7, enchant.Easing.BACK_EASEIN).then(function() {
			this.visible = false;
		});
		this.dispatchEvent(new Event('editcancel'));
	};

	Hack.clearHistory = function () {
		if (!this.enchantBook) return;
			this.enchantBook._element.contentWindow.postMessage({
			query: 'clearHistory'
		}, '/');
	};

	Hack.createLabel = function(text, prop) {
		return (function () {
			this.text = text;
			if (prop) {
				Object.keys(prop).forEach(function(key) {
					this[key] = prop[key];
				}, this);
			}
			var parent = this.defaultParentNode || Hack.defaultParentNode;
			if (parent) {
				parent.addChild(this);
			}
			return this;
		}).call(new enchant.Label());
	};

	Hack.createSprite = function(width, height, prop) {
		return (function(){
			if (prop) {
				Object.keys(prop).forEach(function(key) {
					this[key] = prop[key];
				}, this);
			}
			var parent = this.defaultParentNode || Hack.defaultParentNode;
			if (parent) {
				parent.addChild(this);
			}
			return this;
		}).call(new enchant.Sprite(width, height));
	};

	// overlay
	Hack.overlay = function() {
		return (function(args){
			// scope: createSprite()

			this.image = new Surface(game.width, game.height);
			for (var i = 0; i < args.length; i++) {
				var fill = args[i];
				switch(true){
					case fill instanceof Surface:
					this.image.draw(fill, 0, 0 ,game.width, game.height);
					break;
					case game.assets[fill] instanceof Surface:
					this.image.draw(game.assets[fill], 0, 0 ,game.width, game.height);
					break;
					default:
					this.image.context.fillStyle = fill;
					this.image.context.fillRect(0, 0, game.width, game.height);
					break;
				}
			}
			return this;

		}).call(Hack.createSprite(game.width, game.height, {defaultParentNode: game.rootScene}), arguments);
	};

	(function () {
		var playing = true;

		Object.defineProperty(Hack, 'isPlaying', {
			configurable: true, enumerable: true,
			get: function () {
				return playing;
			}
		});
		// Trigger
		Hack.gameclear = function() {
			if (!playing) return;
			playing = false;
			Hack.dispatchEvent(new Event('gameclear'));
		};
		Hack.gameover = function() {
			if (!playing) return;
			playing = false;
			Hack.dispatchEvent(new Event('gameover'));
		};

		// 初期値
		Hack.ongameclear = function () {
			var lay = Hack.overlay('rgba(0,0,0,0.4)', 'hackforplay/clear.png');
			lay.opacity = 0;
			lay.moveTo(-game.rootScene.x, -game.rootScene.y);
			lay.tl.fadeIn(30, enchant.Easing.LINEAR);
		};

		Hack.ongameover = function () {
			var lay = Hack.overlay('rgba(0,0,0,0.4)', 'hackforplay/gameover.png');
			lay.opacity = 0;
			lay.moveTo(-game.rootScene.x, -game.rootScene.y);
			lay.tl.fadeIn(30, enchant.Easing.LINEAR).then(function() {
				// [RETRY]
				Hack.createSprite(165, 69, {
					x: 157-game.rootScene.x, y: 320-game.rootScene.y,
					image: game.assets['hackforplay/new_button_retry.png'],
					defaultParentNode: game.rootScene,
					ontouchend: function() {
						// [RETRY] がクリックされたとき
						location.reload(false);
					}
				}).tl.moveTo(157-game.rootScene.x, 240-game.rootScene.y, 20, enchant.Easing.CUBIC_EASEOUT);
			});
		};

		// Quest時の仮実装 (削除予定)
		Hack.__QuestGameclearNext = null;
		Hack.__QuestGameclearReport = false;
		Hack.__QuestGameclear = function () {
			// Questの実績を報告
			window.parent.postMessage('quest_clear_level', '*');

			// 演出
			var lay = Hack.overlay('rgba(0,0,0,0.4)', 'hackforplay/clear.png');
			lay.opacity = 0;
			lay.moveTo(-game.rootScene.x, -game.rootScene.y);
			lay.tl.fadeIn(30, enchant.Easing.LINEAR).then(function() {
				if (Hack.__QuestGameclearNext > 0) {
					// [NEXT]
					Hack.createSprite(165, 69, {
						x: 65-game.rootScene.x, y: 320-game.rootScene.y,
						image: game.assets['hackforplay/new_button_next.png'],
						defaultParentNode: game.rootScene,
						ontouchend: function() {
							// [NEXT] がクリックされたとき
							window.parent.postMessage('quest_move_next', '*');
						}
					}).tl.moveTo(65-game.rootScene.x, 240-game.rootScene.y, 20, enchant.Easing.CUBIC_EASEOUT);
				} else {
					// [TOWN]
					// 仮グラフィック
					Hack.createSprite(165, 69, {
						x: 65-game.rootScene.x, y: 320-game.rootScene.y,
						image: game.assets['hackforplay/new_button_town.png'],
						defaultParentNode: game.rootScene,
						ontouchend: function() {
							// [NEXT] がクリックされたとき
							window.parent.postMessage('quest_move_next', '*');
						}
					}).tl.moveTo(65-game.rootScene.x, 240-game.rootScene.y, 20, enchant.Easing.CUBIC_EASEOUT);
					if (Hack.__QuestGameclearReport) {
						// 演出
						// [Empty]
						Hack.createSprite(32, 32, {
							x: 224-game.rootScene.x, y: -32-game.rootScene.y,
							image: game.assets['hackforplay/achievement_n.png'],
							defaultParentNode: game.rootScene,
						}).tl.delay(26).moveBy(0, 92, 14, enchant.Easing.CUBIC_EASEOUT);
						// [Effect]
						Hack.createSprite(32, 32, {
							x: 224-game.rootScene.x, y: 60-game.rootScene.y,
							image: game.assets['hackforplay/achievement_p.png'],
							defaultParentNode: game.rootScene,
							scaleX: 0, scaleY: 0
						}).tl.delay(56).scaleTo(12, 12, 40).and().fadeOut(40);
						// [Entity]
						Hack.createSprite(32, 32, {
							x: 224-game.rootScene.x, y: 60-game.rootScene.y,
							image: game.assets['hackforplay/achievement_p.png'],
							defaultParentNode: game.rootScene,
							scaleX: 0, scaleY: 0
						}).tl.delay(56).scaleTo(1, 1, 8);
					}
				}
				// [COMMENT]
				Hack.createSprite(165, 69, {
					x: 250-game.rootScene.x, y: 320-game.rootScene.y,
					image: game.assets['hackforplay/new_button_comment.png'],
					defaultParentNode: game.rootScene,
					ontouchend: function() {
						// [COMMENT] がクリックされたとき
						window.parent.postMessage('show_comment', '*');
					}
				}).tl.moveTo(250-game.rootScene.x, 240-game.rootScene.y, 20, enchant.Easing.CUBIC_EASEOUT);
			});
		};
	})();

	// ClearedのLogging
	Hack.on('gameclear', function () {
		if (!Hack.stageInfo.token || !Hack.stageInfo.id) return;
		postRequest('/api/stages/' + Hack.stageInfo.id + '/plays', {
			token: Hack.stageInfo.token,
			is_cleared: 1,
		});
	});

	// ゲームメニュー
	(function() {

		var visible, overlay;

		var GUIParts = [];

		// メニュー全体を包括するグループ つねに手前に描画される
		// Hack.menuGroup でアクセスできる
		var menuGroup = new Group();
		game.rootScene.addChild(menuGroup);
		menuGroup.on('enterframe', function() {
			if (game.rootScene.lastChild !== menuGroup) {
				game.rootScene.addChild(menuGroup);
			}
			menuGroup.moveTo(-game.rootScene.x, -game.rootScene.y); // 位置合わせ
		});
		Object.defineProperty(Hack, 'menuGroup', {
			get: function() {
				return menuGroup;
			}
		});

		// Hack.menuOpenedFlag 読み取り専用プロパティ
		Object.defineProperty(Hack, 'menuOpenedFlag', {
			get: function() {
				return visible;
			}
		});

		// Hack.menuOpener Sprite 読み取り専用プロパティ
		var opener = Hack.createSprite(32, 32, {
			x: 438, y: 10,
			defaultParentNode: menuGroup
		});
		Object.defineProperty(Hack, 'menuOpener', {
			get: function() {
				return opener;
			}
		});

		// イベント Hack.onmenuopend が dispatch される
		Hack.openMenu = function() {
			if (visible) return;
			visible = true;
			Hack.dispatchEvent(new Event('menuopened'));

			// アニメーション
			overlay.tl.fadeIn(6);

			GUIParts.filter(function(item, index) {
				GUIParts[index].visible = GUIParts[index].condition();
				return GUIParts[index].visible;
			}).forEach(function(item, index) {
				item.moveTo(opener.x, opener.y);
				item.tl.hide().fadeIn(8).and().moveBy(0, 40 * index + 60, 8, enchant.Easing.BACK_EASEOUT);
				item.touchEnabled = true;
			});
		};

		// イベント Hack.onmenuclosed が dispatch される
		Hack.closeMenu = function() {
			if (!visible) return;
			visible = false;
			Hack.dispatchEvent(new Event('menuclosed'));

			overlay.tl.fadeOut(6);

			GUIParts.forEach(function(item, index) {
				item.tl.fadeOut(8, enchant.Easing.BACK_EASEIN).and().moveTo(opener.x, opener.y, 8, enchant.Easing.BACK_EASEIN);
				item.touchEnabled = false;
			});
		};

		// スプライトの初期化
		game.on('load', function() {

			// 暗めのオーバーレイ
			overlay = new Sprite(game.width, game.height);
			overlay.image =  new Surface(overlay.width, overlay.height);
			overlay.image.context.fillStyle = 'rgba(0,0,0,0.4)';
			overlay.image.context.fillRect(0, 0, overlay.width, overlay.height);
			overlay.touchEnabled = false;
			overlay.opacity = 0;
			overlay.scale(2, 2); // 動いた時に端が見えないように
			menuGroup.addChild(overlay);

			// メニューを開くボタン
			opener.image = game.assets['hackforplay/menu-button-menu.png'];
			opener.onenterframe = function() {
				this.parentNode.addChild(this); // つねに手前に表示
			};
			opener.ontouchend = function() {
				if (visible) Hack.closeMenu();
				else Hack.openMenu();
			};

			// コメント入力画面を表示するボタン
			addGUIParts(game.assets['hackforplay/menu-button-comment.png'], function() {
				return !sessionStorage.getItem('stage_param_comment'); // 存在しない場合は !'' === true
			}, function() {
				// GUIParts,overlayを100ミリ秒間非表示にする
				GUIParts.concat(overlay).forEach(function (item) {
					var visibility = item.visible;
					item.visible = false;
					setTimeout(function() {
						item.visible = visibility;
					}, 100);
				});
				window.parent.postMessage('show_comment', '*');
				setTimeout(function() {
					Hack.closeMenu();
				}, 500);
			});
			// ゲームを再スタートするボタン
			addGUIParts(game.assets['hackforplay/menu-button-retry.png'], function() {
				return true;
			}, function() {
				location.reload(false);
			});

			function addGUIParts (_image, _condition, _touchEvent) {
				GUIParts.push(Hack.createSprite(32, 32, {
					opacity: 0, image: _image,
					defaultParentNode: menuGroup,
					visible: _condition(),
					condition: _condition,
					touchEnabled: false,
					ontouchend: function() {
						this.tl.scaleTo(1.1, 1.1, 3).scaleTo(1, 1, 3).then(function() {
							_touchEvent();
						});
					}
				}));
			}

		});

	})();

	(function () {
		var __apps = [], __counters = {};
		Hack.smartAsset = {
			append: function (asset) {
				if (arguments.length > 1) {
					Array.prototype.forEach.call(arguments, function (item) {
						this.append(item);
					}, this);
				} else if (arguments.length === 1) {
					asset.lines = asset.lines || Hack.fun2str(asset.code).split('\n') || [];
					__apps.push(asset);
				}
				return this;
			},
			// @ignore
			clearAll: function () {
				__apps = [];
			},
			setCounter: function (counter) {
				if (arguments.length > 1) {
					Array.prototype.forEach.call(arguments, function (item) {
						this.setCounter(item);
					}, this);
				} else if (arguments.length === 1) {
					__counters[counter.name] = counter;
				}
				return this;
			}
		};
		Object.defineProperty(Hack.smartAsset, 'apps', {
			enumerable: true,
			get: function () { return __apps; }
		});
		Object.defineProperty(Hack.smartAsset, 'counters', {
			enumerable: true,
			get: function () { return __counters; }
		});
	})();

	Hack.openExternal = function (url) {
		if (/^https?:\/\//.exec(url) === null) {
			if (arguments.length > 1) Hack.openExternal(arguments[1]); // 互換性保持
			else return false; // 引数にURLが含まれていない
		}
		if (window !== window.parent) {
			window.parent.postMessage({
				query: 'openExternal',
				url: url
			}, '*');
		}
	};

	/**
	* Hack.openSoundCloud(url:String|id:Number[, successed:Function, failed:Function])
	* url: SoundCloud URL (like https://soundcloud.com/......)
	* id: resource ID (like 123)
	* successed: callback function (if ignore it, do AUTO PLAY)
	* failed: callback function
	* **** CAUTION This method can be called only once in the playing. ****
	*
	* Hack.soundCloudCredit
	* The group contains credit informations. parentNode === Hack.menuGroup
	*/
	(function (SC) {
		if (!SC) return;
		Hack.soundCloudCredit = new Group();
		Hack.soundCloudCredit.moveTo(0, 320);
		Hack.menuGroup.addChild(Hack.soundCloudCredit);
		SC.initialize({
			client_id: '52532cd2cd109c968a6c795b919898e8'
		});
		Hack.openSoundCloud = function (id, successed, failed) {
			if (!openSoundCloud) {
				Hack.log('Hack.openSoundCloud can be called only once in the playing');
			} else if (typeof id === 'string') {
				// Success calling
				window.parent.postMessage('use_soundcloud', '*');
				openSoundCloud('resolve/?url=' + id, successed, failed);
				openSoundCloud = null;
			} else if (typeof id === 'number') {
				// Success calling
				window.parent.postMessage('use_soundcloud', '*');
				openSoundCloud('tracks/' + id, successed, failed);
				openSoundCloud = null;
			}
		};
		function openSoundCloud (api, successed, failed) {
			var result = {};
			SC.get(api).then(function (track) {
				result.track = track;
				var allowed = ['no-rights-reserved', 'cc-by', 'cc-by-nd', 'cc-by-sa'];
				if (allowed.indexOf(track.license) === -1) {
					throw new Error('This track cannot play in hackforplay because it licensed ' + track.license + '.  You can play tracks licensed ' + allowed.join(','));
				} else {
					// Artist label
					(function () {
						this.color = 'rgb(180,180,180)';
						this.font = '12px fantasy';
						this.backgroundColor = 'rgba(0, 0, 0, 0.5)';
						this.width = 480;
						this.height = 14;
						Hack.soundCloudCredit.addChild(this);
						this.moveTo(track.artwork_url ? 32 : 0, 0);
					}).call(new Label(track.user.username));
					// Title label
					(function () {
						this.color = 'rgb(255,255,255)';
						this.font = '14px fantasy';
						this.backgroundColor = 'rgba(0, 0, 0, 0.5)';
						this.width = 480;
						this.height = 18;
						Hack.soundCloudCredit.addChild(this);
						this.moveTo(track.artwork_url ? 32 : 0, 14);
					}).call(new Label(track.title));
					(function () {
						var i = this.image = new Surface(this.width, this.height);
						Hack.soundCloudCredit.addChild(this);
						postRequest('/cache/image.php', {
							origin: track.artwork_url,
							width: i.width, height: i.height
						}, function () {
							if (this.responseText === 'NG') return;
							Surface.load(this.responseText, function (event) {
								var t = event.target;
								i.draw(t, 0, 0, t.width, t.height, 0, 0, i.width, i.height);
							});
						});
					}).call(new Sprite(32, 32));
					Hack.soundCloudCredit.tl.moveBy(0, -32, 20);
					// Streaming
					return SC.stream('/tracks/' + track.id);
				}
			}).then(function (player) {
				result.player = player;
				if (successed) successed(result);
				else player.play(); // auto play
				player.on('play-start', function(event) {
					Hack.soundCloudCredit.tl.delay(game.fps * 4).moveBy(0, 32, 20);
				});
				// Logging
				postAPILog('soundcloud', result.track.id);
			}).catch(function (message) {
				if (failed) failed(message);
				else Hack.log(message.message);
			});
		}
	})(window.SC);
	window.SC = null;

	/**
	* Hack.define
	* obj: targeting object (If omitted: Hack)
	* prop: property name (obj.----)
	* condition: if (obj.---- === condition) { predicate(); }
	*/
	Hack.define = function (obj, prop, condition, predicate) {
		var _value = null, descriptor = Object.getOwnPropertyDescriptor(obj, prop);
		if (arguments.length < 4) return Hack.define(Hack, arguments[0], arguments[1], arguments[2]);
		else if (descriptor) {
			if (!descriptor.configurable) {
				Hack.log('Cannot define prop ' + prop + '. It is NOT configurable');
			} else if (descriptor.value !== undefined && !descriptor.writable) {
				Hack.log('Cannot define prop ' + prop + '. It is NOT writable');
			} else if (descriptor.value === undefined && descriptor.set === undefined) {
				Hack.log('Cannot define prop ' + prop + '. It has NOT setter');
			} else if (descriptor.value !== undefined) {
				// Append setter
				_value = descriptor.value;
				descriptor = {
					configurable: descriptor.configurable, enumerable: descriptor.enumerable,
					get: function () { return _value; },
					set: function (value) {
						if ((_value = value) === condition && predicate instanceof Function) {
							predicate();
						}
					}
				};
			} else {
				// Extend setter
				var setter = descriptor.set;
				descriptor.set = function (value) {
					setter.call(obj, value);
					if (value === condition && predicate instanceof Function) {
						predicate();
					}
				};
			}
		} else {
			descriptor = {
				configurable: true, enumerable: true,
				get: function () { return _value; },
				set: function (value) {
					if ((_value = value) === condition && predicate instanceof Function) {
						predicate();
					}
				}
			};
		}
		Object.defineProperty(obj, prop, descriptor);
	};

	game.addEventListener('load', function(){

		var assets = {
			apps: Hack.smartAsset.apps,
			counters: Hack.smartAsset.counters,
		};
		assets = JSON.parse(JSON.stringify(assets));

		window.parent.postMessage({
			query: 'smartAsset',
			assets: assets,
		}, '*');

		if (window.parent !== window) {
			window.parent.postMessage('game_loaded', '*'); // ロードのタイミングを伝える
		}
		if (Hack.defaultParentNode) {
			game.rootScene.addChild(Hack.defaultParentNode);
		} else {
			Hack.defaultParentNode = game.rootScene;
		}
	});

	function postAPILog (service, id) {
		postRequest('../../analytics/apilog.php', {
			service: service,
			id: id,
			stage: sessionStorage.getItem('stage_param_id')
		});
	}

	function postRequest (path, params, success, error) {
		var xhttp = new XMLHttpRequest();
		xhttp.open('POST', Hack.API_ROOT.substr(0, Hack.API_ROOT.length - 5) + path, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		var serialized = Object.keys(params).map(function(key) {
			return key + '=' + params[key];
		}).join('&');
		xhttp.send(serialized);
		xhttp.onload = success;
		xhttp.onerror = error;
	}

	/**
	* Hack.css2rgb
	* style: CSS Color style / Array
	* @return [r, g, b]
	*/
	(function () {
		var ctx = new Surface(1, 1).context;
		Hack.css2rgb = function (style) {
			if (typeof style === 'string') {
				ctx.fillStyle = style;
				ctx.fillRect(0, 0, 1, 1);
				return Array.prototype.slice.call(ctx.getImageData(0, 0, 1, 1).data, 0, 3);
			} else if (style instanceof Array && style.length !== 3) {
				return [0, 0, 0].map(function(elem, index) {
					return Math.min(255, Math.max(0, style[index] || elem)) >> 0;
				});
			} else if (style instanceof Array) {
				return style;
			}
			throw new Error('Hack.css2rgb requires CSS style string or Array of number');
		};
	})();


	// javascript hint
	function looseCopy (scope, count) {
		if (['object','function'].indexOf(typeof scope) === -1 || count <= 0) return null;
		var copied = {};
		for (var prop in scope) {
			copied[prop] = looseCopy(scope[prop], count - 1);
		}
		return copied;
	}

	/**
	 * Hack._exportJavascriptHint(prop1[, prop2[,..propN]])
	 * propN: String (property in window)
	*/
	Hack._exportJavascriptHint = function () {
		var globalScope = {};
		Array.prototype.slice.call(arguments).forEach(function (prop) {
			globalScope[prop] = looseCopy(window[prop], 3);
		});
		window.parent.postMessage({
			query: 'javascriptHint', globalScope: globalScope
		}, '*');
	};

	if (!Array.prototype.fill) {
		Array.prototype.fill = function(value) {

			// Steps 1-2.
			if (this == null) {
				throw new TypeError('this is null or not defined');
			}

			var O = Object(this);

			// Steps 3-5.
			var len = O.length >>> 0;

			// Steps 6-7.
			var start = arguments[1];
			var relativeStart = start >> 0;

			// Step 8.
			var k = relativeStart < 0 ?
			Math.max(len + relativeStart, 0) :
			Math.min(relativeStart, len);

			// Steps 9-10.
			var end = arguments[2];
			var relativeEnd = end === undefined ?
			len : end >> 0;

			// Step 11.
			var final = relativeEnd < 0 ?
			Math.max(len + relativeEnd, 0) :
			Math.min(relativeEnd, len);

			// Step 12.
			while (k < final) {
				O[k] = value;
				k++;
			}

			// Step 13.
			return O;
		};
	}

	return Hack;

});
