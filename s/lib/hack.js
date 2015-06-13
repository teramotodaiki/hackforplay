function saveImage () {
	var canvas = document.getElementById('enchant-stage').firstChild.firstChild;
	var data = canvas.toDataURL();
	sessionStorage.setItem('image', data);
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
	return Hack.enchantBook ? Hack.enchantBook._element : undefined;
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

// set eval
window.addEventListener('message', function (e) {
	if(e.origin === window.location.protocol + '//' + window.location.host){
		try {
			eval(e.data);
		} catch (exception) {
			Hack.log('Error:', exception.__proto__.name, exception);
		}
	}
});

window.addEventListener('load', function() {
    enchant();
    var game = new enchant.Core(480, 320);

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

	Hack.createLabel = function(text, prop) {
		return (function () {
			this.text = text;
			this.moveTo(prop.x || 0, prop.y || 0);
			this.width = prop.width || this.width;
			this.height = prop.height || this.height;
			this.font = prop.font || 'bold large sans-serif';
			this.color = prop.color || '#000';
			enchant.Core.instance.rootScene.addChild(this);
			return this;
		}).call(new enchant.Label());
	};

	Hack.createSprite = function(width, height, prop) {
		return (function(){
			this.image = prop.image || null;
			return this;
		}).call(new enchant.Sprite(width, height));
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