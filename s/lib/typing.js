// Typing game

// とりあえず実装も全部書いてしまうが、このへんは改造コードに書くべき
// textarea拡張用のメソッドをいくつか用意してやるといいかもしれない（splitやjoinは複雑だしfor文を必須にしたくない）
// スペース区切りのやつをシャッフルしてN個表示とか。
// 大文字小文字の区別付きで、入力された「文字」をとるのとかいいかも

window.addEventListener('load', function() {

	enchant.ENV.PREVENT_DEFAULT_KEY_CODES = [];
	var game = enchant.Core.instance;

	var binded_key = ' '.charCodeAt(0);
	game.keybind(binded_key, 'a'); // aボタンはスペースキー

	// ====> 改造コードへ
	Hack.onload = function() {
		Hack.pressStartKey(' ');
		Hack.log('Press space key to start the Typing Game!!');
		Hack.log('スペースキーを押して、タイピングゲームを始めよう!!');

		Hack.started = false;
	};
	Hack.onpressstart = function() {
		var word = ('var function window String Number length call').split(' ');
		var container = [];
		for (var i = 0; i < 5; i++) {
			var index = (Math.random() * word.length) >> 0;
			container.push(word[index]);
		}
		Hack.textarea.show(container.join(' '));

		Hack.started = true;
		Hack.startTime = enchant.Core.instance.getElapsedTime();
	};
	Hack.onendgame = function() {
		Hack.endTime = enchant.Core.instance.getElapsedTime();
		Hack.textarea.hide();

		Hack.clearLabel = Hack.createLabel([
			'CLEAR!! Your time:',
			Hack.endTime - Hack.startTime,
			'sec'
		].join('<br>'), {
			x: 140,
			y: 100,
			width: 200,
			font: 'bold x-large/150% sans-serif'
		});
		enchant.Core.instance.end();
	};
	// <==== 改造コード

	Hack.pressStartKey = function(keyString) {
		var keyCode = keyString.charCodeAt(0);
		game.keyunbind(binded_key, 'a');
		game.keybind(keyCode, 'a');
		binded_key = keyCode;
	};

	game.on('abuttondown', function(event) {
		if (Hack.started) return;
		Hack.dispatchEvent(new enchant.Event('pressstart'));
	});

	// input
	// きちんとこのへん例外処理する
	window.addEventListener('keydown', function(event) {
		if (!Hack.started) return;
		var input_cap = String.fromCharCode(event.keyCode).toUpperCase();
		var first_cap = Hack.textarea.text[0].toUpperCase();
		if (input_cap === first_cap) {
			Hack.textarea.text = Hack.textarea.text.substr(1);
		}
		if (Hack.textarea.text === '') {
			Hack.dispatchEvent(new enchant.Event('endgame'));
		}
	});

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

	Hack.dispatchEvent(new enchant.Event('load')); // 本来はいらない

});