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
function getEditor () {
	// tmp
}
function sendToEditor () {
	// tmp
}

// set eval
window.addEventListener('message', function (e) {
	if(e.origin === window.location.protocol + '//' + window.location.host){
		try {
			eval(e.data);
		} catch (exception) {
			console.error(exception);
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

	// textarea : 画面全体をおおう半透明のテキストエリア(DOM)
	Hack.textarea = (function(){
		// scope: new Entity

		this.width = game.width;
		this.height = game.height;
		this.opacity = 1;
		this.visible = false;
		this.backgroundColor = 'rgba(210,210,210,0.5)';

		this._element = window.document.createElement('textarea');
		this._element.type = 'textarea';
		this._element.setAttribute('disabled', 'disabled');

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

	// Hack.onloadのコール
	Hack.dispatchEvent(new Event('load'));

    game.start();
    game.addEventListener('load', function(){

		window.postMessage('Hack.log(0, "text", [], {});', '/');
		window.postMessage('Hack.log("next");', '/');

    });
});