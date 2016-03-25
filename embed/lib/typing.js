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

	Hack.log('Press space key to start the Typing Game!!');
	Hack.log('スペースキーを押して、タイピングゲームを始めよう!!');
	Hack.started = false;

	Hack.onpressstart = Hack.onpressstart || function() {
		Hack.shuffleAndLog('apple');

		Hack.started = true;
		Hack.startTime = enchant.Core.instance.getElapsedTime();
	};

	Hack.onendgame = Hack.onendgame || function() {
		Hack.endTime = enchant.Core.instance.getElapsedTime();
		Hack.textarea.hide();
		console.log('end');

		Hack.clearLabel = Hack.createLabel([
			'CLEAR!! Your time:',
			Hack.endTime - Hack.startTime,
			'sec'
		].join('<br>'), {
			x: 140,
			y: 100,
			width: 200,
			color: '#fff',
			font: 'bold x-large/150% sans-serif'
		});

		Hack.onendgame = function(){};
	};

	Hack.onkeydown = Hack.onkeydown || function() {
		if (Hack.started !== true) return;

		if (Hack.getPreviousKey === Hack.textarea.text[0]) {
			Hack.textarea.text = Hack.textarea.text.substr(1);
		}
		if (Hack.textarea.text === '') {
			Hack.dispatchEvent(new enchant.Event('endgame'));
		}
	};

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
		var keyCode = String.fromCharCode(event.keyCode);
		Hack.getPreviousKey = 'A' <= keyCode && keyCode <= 'Z' ? keyCode.toLowerCase() : keyCode;
		Hack.dispatchEvent(new enchant.Event('keydown'));
	});

	Hack.shuffleAndLog = function (list, count) {
		var words = list.split(' ');
		// shuffle
		for (var i = count || list.length; i >= 0; i--) {
			var index1 = (Math.random() * words.length) >> 0;
			var index2 = (Math.random() * words.length) >> 0;
			var swap = words[index1];
			words[index1] = words[index2];
			words[index2] = swap;
		}
		Hack.textarea.show(words.join(' '));
	};

	Hack.start();

});
