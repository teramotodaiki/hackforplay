var emphasizeHint = function(){};
(function(){
	var Hack = {};
	Object.defineProperty(window, 'Hack', {
		configurable: true,
		enumerable: true,
		get: function(){
			return Hack;
		}
	});

	var browserback_by_key = false;
	$(document).on('keydown', function(event) {
		if (event.keyCode === 8) {
			browserback_by_key = true;
			setTimeout(function() {
				browserback_by_key = false;
			}, 10);
		}
	});
	$(window).on('beforeunload', function(event) {
		if (browserback_by_key) {
			return 'ゲームは ほぞんされて いません\nまえの ページに もどりますか？';
		}
	});

	// Coreの生成がおわったときに呼び出される関数
	var coreGeneratedEvents = [];

	(function task () {
		if (enchant.Core.instance) {
			coreGeneratedEvents.forEach(function(item) {
				item();
			});
		} else {
			setTimeout(task, 10);
		}
	})();

	coreGeneratedEvents.push(function() {
		game.on('load', function() {
			var pad = new Pad();
			pad.moveTo(20, 200);
			pad.onenterframe = function() {
				game.rootScene.addChild(this);
			};
			game.rootScene.addChild(pad);
			Hack.pad = pad;

			var apad = new APad();
			apad.moveTo(100, 180);
			apad.outside.scale(0.5, 0.5);
			apad.inside.visible = false;
			apad.onenterframe = function() {
				game.rootScene.addChild(this);
			};
			apad.on('touchstart', function(event) {
				game.dispatchEvent(new Event('abuttondown'));
			});
			game.rootScene.addChild(apad);
			Hack.apad = apad;
		});
	});

	// ゲームメニュー
	coreGeneratedEvents.push(function() {

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
		var opener = new Sprite(32, 32);
		opener.moveTo(438, 10);
		menuGroup.addChild(opener);
		Object.defineProperty(Hack, 'menuOpener', {
			get: function() {
				return opener;
			}
		});


		Hack.openMenu = function() {
			if (visible) return;
			visible = true;

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

		Hack.closeMenu = function() {
			if (!visible) return;
			visible = false;

			overlay.tl.fadeOut(6);

			GUIParts.forEach(function(item, index) {
				item.tl.fadeOut(8, enchant.Easing.BACK_EASEIN).and().moveTo(opener.x, opener.y, 8, enchant.Easing.BACK_EASEIN);
				item.touchEnabled = false;
			});
		};
		// ヒントの強調
		emphasizeHint = function() {
			// ヒントのスプライトを取得
			GUIParts.filter(function(item) {
				return item._image._css.indexOf('hackforplay/menu-button-hint') !== -1;
			}).forEach(function(item) {
				var endFlag = false;
				item.on('enterframe', function() {
					if (endFlag) this.scale(1, 1);
					else {
						var s = Math.sin(game.getElapsedTime() * 8) / 4 + 1.25;
						this.scaleX = this.scaleY = s;
					}
				});
				item.on('touchstart', function() {
					endFlag = true;
					this.scaleX = this.scaleY = 1;
				});
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
			menuGroup.addChild(opener);

			// 改造を始めるボタン
			addGUIParts(game.assets['hackforplay/menu-button-restage.png'], function() {
				var id = sessionStorage.getItem('stage_param_id') >> 0;
				return __H4PENV__MODE !== 'restaging' && !(101 <= id && id <= 106);
			}, function() {
				window.parent.postMessage('begin_restaging', '/');
			});
			// ヒントを表示するボタン
			addGUIParts(game.assets['hackforplay/menu-button-hint.png'], function() {
				return sessionStorage.getItem('stage_param_youtube');
			}, function() {
				window.parent.postMessage('show_hint', '/');
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
				window.parent.postMessage('show_comment', '/');
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
				var item = new Sprite(32, 32);
				item.image = _image;
				item.opacity = 0;
				item.visible = _condition();
				item.condition = _condition;
				item.touchEnabled = false;
				item.ontouchend = function() {
					this.tl.scaleTo(1.1, 1.1, 3).scaleTo(1, 1, 3).then(function() {
						_touchEvent();
					});
				};
				menuGroup.addChild(item);

				GUIParts.push(item);
			}
		});
	});

})();