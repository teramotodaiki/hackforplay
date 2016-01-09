function saveImage (callbackText) {
	var canvas = document.getElementById('enchant-stage').firstChild.firstChild;
	sessionStorage.setItem('image', canvas ? canvas.toDataURL() : null);
	window.parent.postMessage(callbackText, '*');
}
function screenShot () {
	window.parent.postMessage('screenshot', '*');
	window.saveImage('thumbnail');
}
function refocus () {
    window.document.activeElement.blur();
    window.focus();
}
function getEditor() {
	return Hack.enchantBook;
}
function sendToEditor(message) {
	if(Hack.enchantBook === undefined){
		console.error("sendToEditor関数が呼び出されましたが、Editorが作られていなかったため、イベントリスナに追加します。");
		Hack.on('loadeditor', function(event) {
			this.enchantBook._element.contentWindow.postMessage(message, '*');
		});
	}else{
		Hack.enchantBook._element.contentWindow.postMessage(message, '*');
	}
}
function __H4PENV__SENDCODE () {
	// 互換性を残すための関数
}

// set eval
window.addEventListener('message', function (e) {
	if(e.origin === window.location.protocol + '//' + window.location.host){
		try {
			var hint = Hack ? Hack.hint : ''; // 旧RPGとの互換性を維持するための仕様(hintがないとsetHintされた時にエラー)
			var game = enchant ? enchant.Core.instance : undefined;
			eval(e.data);
		} catch (exception) {
			if (exception.sourceURL && exception.stack.indexOf('eval') !== -1) {
				// ランタイムエラー
				Hack.log('Error', exception.message);
			} else if (!exception.sourceURL) {
				// 改造コード実行直後のエラー
				Hack.log('Error', exception.message, '...on line', exception.line);
			} else {
				console.log(exception);
			}
		}
	}
});

window.addEventListener('load', function() {
    enchant();
    var game = new enchant.Core(480, 320);
    game.preload('hackforplay/clear.png', 'hackforplay/gameover.png', 'hackforplay/button_retry.png', 'hackforplay/new_button_replay.png', 'hackforplay/new_button_retry.png', 'hackforplay/menu-button-menu.png', 'hackforplay/menu-button-restage.png', 'hackforplay/menu-button-hint.png', 'hackforplay/menu-button-comment.png', 'hackforplay/menu-button-retry.png', 'hackforplay/new_button_next.png', 'hackforplay/new_button_comment.png', 'hackforplay/new_button_restage.png', 'hackforplay/achievement_p.png', 'hackforplay/achievement_n.png', 'hackforplay/new_button_town.png');

    // Hackのクラスを生成 インスタンスはget only
    var HackEnchant = enchant.Class.create(enchant.EventTarget, {
		initialize: function(){
			enchant.EventTarget.call(this);
		}
    });
    var _Hack = new HackEnchant();
	Object.defineProperty(window, 'Hack', {
		configurable: true,
		enumerable: true,
		get: function(){
			return _Hack;
		}
	});

	// evaluate restaging code
	switch (sessionStorage.getItem('stage_param_game_mode')) {
		case 'restaging':
		case 'replay':
		case 'extend':
		case 'quest':
			window.postMessage(sessionStorage.getItem('restaging_code'), "/");
			break;
	}

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

		var _hint = '// test value';
		Object.defineProperty(Hack, 'hint', {
			configurable: true,
			enumerable: true,
			get: function(){
				return _hint;
			},
			set: function(code){
				if (code instanceof Function) {
					code = Hack.fun2str(code);
				}
				_hint = code;
				sendToEditor('setEditor();');
			}
		});

		this.width = game.width;
		this.height = game.height;
		this.visible = false;
		this._element = window.document.createElement('iframe');
		this._element.id = 'editor';
		this._element.src = 'editor';
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
			this.enchantBook.visible = false;
		});
		this.dispatchEvent(new Event('editcancel'));
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

		Hack.gameclear = function() {
			if (!playing) return;
			playing = false;
			// Questの実績を報告
			if (sessionStorage.getItem('stage_param_game_mode') === 'quest') {
				window.parent.postMessage('quest_clear_level', '*');
			}

			// 演出
			var lay = Hack.overlay('rgba(0,0,0,0.4)', 'hackforplay/clear.png');
			lay.opacity = 0;
			lay.moveTo(-game.rootScene.x, -game.rootScene.y);
			lay.tl.fadeIn(30, enchant.Easing.LINEAR).then(function() {

				switch (sessionStorage.getItem('stage_param_game_mode')) {
					case 'quest':
					if (sessionStorage.getItem('stage_param_next') >> 0 > 0) {
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
						if (sessionStorage.getItem('stage_param_reporting_requirements')) {
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
					break;
					case 'official':
					case 'replay':
					// [RESTAGING]
					Hack.createSprite(165, 69, {
						x: 65-game.rootScene.x, y: 320-game.rootScene.y,
						image: game.assets['hackforplay/new_button_restage.png'],
						defaultParentNode: game.rootScene,
						ontouchend: function() {
							// [RESTAGING] がクリックされたとき
							window.parent.postMessage('begin_restaging', '*');
						}
					}).tl.moveTo(65-game.rootScene.x, 240-game.rootScene.y, 20, enchant.Easing.CUBIC_EASEOUT);
					// [RETRY]
					Hack.createSprite(165, 69, {
						x: 250-game.rootScene.x, y: 320-game.rootScene.y,
						image: game.assets['hackforplay/new_button_retry.png'],
						defaultParentNode: game.rootScene,
						ontouchend: function() {
							// [RETRY] がクリックされたとき
							location.reload(false);
						}
					}).tl.moveTo(250-game.rootScene.x, 240-game.rootScene.y, 20, enchant.Easing.CUBIC_EASEOUT);
				}
			});

			Hack.gameclear = function(){};
			Hack.gameover = function(){};
		};

		Hack.gameover = function() {
			if (!playing) return;
			playing = false;

			var lay = Hack.overlay('rgba(0,0,0,0.4)', 'hackforplay/gameover.png');
			lay.opacity = 0;
			lay.moveTo(-game.rootScene.x, -game.rootScene.y);
			lay.tl.fadeIn(30, enchant.Easing.LINEAR).then(function() {

				switch (sessionStorage.getItem('stage_param_game_mode')) {
					case 'quest':
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
					break;
					case 'official':
					case 'replay':
					// [RESTAGING]
					Hack.createSprite(165, 69, {
						x: 65-game.rootScene.x, y: 320-game.rootScene.y,
						image: game.assets['hackforplay/new_button_restage.png'],
						defaultParentNode: game.rootScene,
						ontouchend: function() {
							// [RESTAGING] がクリックされたとき
							window.parent.postMessage('begin_restaging', '*');
						}
					}).tl.moveTo(65-game.rootScene.x, 240-game.rootScene.y, 20, enchant.Easing.CUBIC_EASEOUT);
					// [RETRY]
					Hack.createSprite(165, 69, {
						x: 250-game.rootScene.x, y: 320-game.rootScene.y,
						image: game.assets['hackforplay/new_button_retry.png'],
						defaultParentNode: game.rootScene,
						ontouchend: function() {
							// [RETRY] がクリックされたとき
							location.reload(false);
						}
					}).tl.moveTo(250-game.rootScene.x, 240-game.rootScene.y, 20, enchant.Easing.CUBIC_EASEOUT);
				}
			});

			Hack.gameclear = function(){};
			Hack.gameover = function(){};
		};
	})();

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

			// 改造を始めるボタン
			addGUIParts(game.assets['hackforplay/menu-button-restage.png'], function() {
				var id = sessionStorage.getItem('stage_param_id') >> 0;
				return sessionStorage.getItem('stage_param_game_mode') !== 'restaging' && !(101 <= id && id <= 106);
			}, function() {
				window.parent.postMessage('begin_restaging', '*');
			});
			// ヒントを表示するボタン
			addGUIParts(game.assets['hackforplay/menu-button-hint.png'], function() {
				return sessionStorage.getItem('stage_param_youtube');
			}, function() {
				window.parent.postMessage('show_hint', '*');
			});
			// コメント入力画面を表示するボタン
			addGUIParts(game.assets['hackforplay/menu-button-comment.png'], function() {
				return !sessionStorage.getItem('stage_param_comment'); // 存在しない場合は !'' === true
			}, function() {
				// menuGroupを100ミリ秒間非表示にする
				menuGroup.childNodes.forEach(function(item) {
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

	Object.defineProperty(Hack, 'restagingCode', {
		configurable: true,
		enumerable: true,
		get: function(){
			return sessionStorage.getItem('restaging_code');
		},
		set: function(code){
			if (code instanceof Function) {
				code = Hack.fun2str(code);
			}
			switch (sessionStorage.getItem('stage_param_game_mode')) {
				case 'official':
				case 'extend':
					sessionStorage.setItem('restaging_code', code);
					window.parent.postMessage('replace_code', '*');
					break;
			}
		}
	});

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

	Hack.openExternal = function (type) {
		switch (type) {
			case 'restaging':
			window.parent.postMessage('begin_restaging', '/');
			break;
			case 'soundcloud':
			sessionStorage.setItem('external-soundcloud-url', arguments[1]);
			window.parent.postMessage('external-soundcloud', '/');
			break;
			case 'link':
			if (typeof arguments[1] !== 'string' || arguments[1].match(/^https?\:\/\/.*\.[a-z]+/) === null) {
				Hack.log('Invalid URL: ' + arguments[1]);
			} else {
				var param = { href: arguments[1], html: arguments[2] };
				sessionStorage.setItem('external-link-param', JSON.stringify(param));
				window.parent.postMessage('external-link', '/');
			}
			break;
		}
	};

	/**
	 * Hack.openSoundCloud(resource:String, id:Number[, successed:Function, failed:Function])
	 * resource: defaults '/tracks'
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
		Hack.openSoundCloud = function (resource, id, successed, failed) {
			var args = Array.prototype.slice.call(arguments);
			if (typeof args[0] === 'number') return Hack.openSoundCloud('/tracks', args[0], args[1], args[2]);
			else if (['/tracks'].indexOf(resource) === -1) {
				Hack.log('Hack.openSoundCloud', resource, 'is unsupported. Use: /tracks');
			} else if (!openSoundCloud) {
				Hack.log('Hack.openSoundCloud can be called only once in the playing');
			} else {
				// Success calling
				window.parent.postMessage('use_soundcloud', '/');
				openSoundCloud(resource, id, successed, failed);
				openSoundCloud = null;
			}
		};
		function openSoundCloud (resource, id, successed, failed) {
			var param = resource + '/' + id, result = {};
			SC.initialize({
				client_id: '52532cd2cd109c968a6c795b919898e8'
			});
			SC.get(param).then(function (track) {
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
						this.moveTo(track.artwork_url ? 40 : 0, 0);
					}).call(new Label(track.user.username));
					// Title label
					(function () {
						this.color = 'rgb(255,255,255)';
						this.font = '14px fantasy';
						this.backgroundColor = 'rgba(0, 0, 0, 0.5)';
						this.width = 480;
						this.height = 18;
						Hack.soundCloudCredit.addChild(this);
						this.moveTo(track.artwork_url ? 40 : 0, 14);
					}).call(new Label(track.title));
					// Artwork
					(function () {
						var i = this.image = new Surface(this.width, this.height);
						Hack.soundCloudCredit.addChild(this);
						Surface.load(track.artwork_url, function (event) {
							var t = event.target;
							i.draw(t, 0, 0, t.width, t.height, 0, 0, i.width, i.height);
						});
					}).call(new Sprite(32, 32));
					Hack.soundCloudCredit.tl.moveBy(0, -32, 20);
					// Streaming
					return SC.stream(param);
				}
			}).then(function (player) {
				result.player = player;
				if (successed) successed(result);
				else player.play(); // auto play
				player.on('play-start', function(event) {
					Hack.soundCloudCredit.tl.delay(game.fps * 4).moveBy(0, 32, 20);
				});
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

	window.postMessage("Hack.dispatchEvent(new Event('load'));", "/"); // Hack.onloadのコール
	window.postMessage("enchant.Core.instance.start();", "/"); // game.onloadのコール

	game.addEventListener('load', function(){
		// smartAssetをsessionStorageに格納する
		sessionStorage.setItem('stage_param_smart_asset', JSON.stringify(Hack.smartAsset));

		window.parent.postMessage('game_loaded', '*'); // ロードのタイミングを伝える
		if (Hack.defaultParentNode) {
			game.rootScene.addChild(Hack.defaultParentNode);
		} else {
			Hack.defaultParentNode = game.rootScene;
		}
    });
});