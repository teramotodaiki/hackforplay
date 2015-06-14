function saveImage () {
	var canvas = document.getElementById('enchant-stage').firstChild.firstChild;
	sessionStorage.setItem('image', canvas ? canvas.toDataURL() : null);
	window.parent.postMessage('thumbnail', '/');
}
function screenShot () {
	window.parent.postMessage('screenshot', '/');
	window.saveImage();
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
			this.enchantBook._element.contentWindow.postMessage(message, '/');
		});
	}else{
		Hack.enchantBook._element.contentWindow.postMessage(message, '/');
	}
}
function __H4PENV__SENDCODE () {
	// 互換性を残すための関数
}

// set eval
window.addEventListener('message', function (e) {
	if(e.origin === window.location.protocol + '//' + window.location.host){
		try {
			var game = enchant ? enchant.Core.instance : undefined;
			eval(e.data);
		} catch (exception) {
			console.log(exception);
			Hack.log('Error:', exception.__proto__.name, exception);
		}
	}
});

window.addEventListener('load', function() {
    enchant();
    var game = new enchant.Core(480, 320);
    game.preload(['img/clear.png', 'img/gameover.png', 'img/button_retry.png']);

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
	switch (__H4PENV__MODE) {
		case 'restaging':
		case 'replay':
		case 'extend':
			window.postMessage(sessionStorage.getItem('restaging_code'), "/");
			break;
	}

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
		var values = [];
		for (var i = arguments.length - 1; i >= 0; i--) {
			switch(typeof arguments[i]){
				case 'object': values[i] = JSON.stringify(arguments[i]); break;
				default: values[i] = arguments[i] + ''; break;
			}
		}
		this.textarea.text += (this.textarea.text !== '' ? '\n' : '') + values.join(' ');
		this.textarea.show();
	};

	Hack.clearLog = function() {
		this.textarea.text = '';
	};

	// enchantBook
	Hack.enchantBook = (function(){
		// scope: new Entity

		window.hint = '// test value';
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
	};

	Hack.closeEditor = function(){
		if (!this.enchantBook) return;
		this.enchantBook.scale(1, 1);
		this.enchantBook.tl.scaleTo(0, 1, 7, enchant.Easing.BACK_EASEIN).then(function() {
			this.enchantBook.visible = false;
		});
	};

	Hack.createLabel = function(text, prop) {
		return (function () {
			this.text = text;
			if (prop) {
				Object.keys(prop).forEach(function(key) {
					this[key] = prop[key];
				}, this);
			}
			game.rootScene.addChild(this);
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
			game.rootScene.addChild(this);
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

		}).call(Hack.createSprite(game.width, game.height), arguments);
	};

	Hack.gameclear = function() {
		if (__H4PENV__MODE === 'official' && __H4PENV__NEXT) {
			Hack.overlay('black').tl.then(function(){
				this.opacity = 0;
			}).fadeIn(30, enchant.Easing.LINEAR).then(function() {
                window.parent.postMessage('clear', '/');
			});
		}else{
			Hack.overlay('img/clear.png').tl.then(function() {
				this.opacity = 0;
			}).fadeIn(30, enchant.Easing.LINEAR);
		}

		Hack.gameclear = function(){};
		Hack.gameover = function(){};
	};

	Hack.gameover = function() {
		var lay = Hack.overlay('rgba(0,0,0,0.4)', 'img/gameover.png');
		lay.opacity = 0;
		lay.tl.fadeIn(30, enchant.Easing.LINEAR).then(function() {
			Hack.createSprite(128, 32, {
				image: game.assets['img/button_retry.png'],
				x: 176, y: 320
			}).tl.then(function() {
				this.ontouchstart = function() {
					location.reload();
				};
			}).moveTo(176, 270, 10);
		});

		Hack.gameclear = function(){};
		Hack.gameover = function(){};
	};

	Object.defineProperty(Hack, 'restagingCode', {
		configurable: true,
		enumerable: true,
		get: function(){
			return sessionStorage.getItem('restaging_code');
		},
		set: function(code){
			switch (__H4PENV__MODE) {
				case 'official':
				case 'extend':
					sessionStorage.setItem('restaging_code', code);
					window.parent.postMessage('replace_code', '/');
					break;
			}
		}
	});

	window.postMessage("Hack.dispatchEvent(new Event('load'));", "/"); // Hack.onloadのコール
	window.postMessage("enchant.Core.instance.start();", "/"); // game.onloadのコール

    game.addEventListener('load', function(){

    });
});