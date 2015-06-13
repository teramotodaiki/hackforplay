// Typing game

// とりあえず実装も全部書いてしまうが、このへんは改造コードに書くべき
// textarea拡張用のメソッドをいくつか用意してやるといいかもしれない（splitやjoinは複雑だしfor文を必須にしたくない）
// スペース区切りのやつをシャッフルしてN個表示とか。
// 大文字小文字の区別付きで、入力された「文字」をとるのとかいいかも

window.addEventListener('load', function() {

	// ====> game.phpに移植予定
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

	Hack.clearLog = function() {
		this.textarea.text = '';
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
	// <==== game.phpに移植予定

	enchant.ENV.PREVENT_DEFAULT_KEY_CODES = [];
	var game = enchant.Core.instance;

	var binded_key = ' '.charCodeAt(0);
	game.keybind(binded_key, 'a'); // aボタンはスペースキー

	Hack.log('Press space key to start the Typing Game!!');
	Hack.log('スペースキーを押して、タイピングゲームを始めよう!!');
	Hack.started = false;

	// ====> 改造コードへ
	Hack.restagingCode =
	"Hack.onload = function() {\n"+
	"\tHack.pressStartKey(' ');\n"+
	"\tHack.clearLog();\n"+
	"\tHack.log('Press space key to start the Typing Game!!');\n"+
	"\tHack.log('スペースキーを押して、タイピングゲームを始めよう!!');\n"+
	"\n"+
	"\tHack.started = false;\n"+
	"};\n"+
	"\n"+
	"Hack.onpressstart = function() {\n"+
	"\tHack.shuffleAndLog('apple grape orange pineapple strawberry banana');\n"+
	"\n"+
	"\tHack.started = true;\n"+
	"\tHack.startTime = enchant.Core.instance.getElapsedTime();\n"+
	"};\n"+
	"\n"+
	"Hack.onkeydown = function() {\n"+
	"\tif (Hack.started !== true) return;\n"+
	"\n"+
	"\tif (Hack.getPreviousKey === Hack.textarea.text[0]) {\n"+
	"\t\tHack.textarea.text = Hack.textarea.text.substr(1);\n"+
	"\t}\n"+
	"\tif (Hack.textarea.text === '') {\n"+
	"\t\tHack.dispatchEvent(new enchant.Event('endgame'));\n"+
	"\t}\n"+
	"};\n"+
	"\n"+
	"Hack.onendgame = function() {\n"+
	"\tHack.endTime = enchant.Core.instance.getElapsedTime();\n"+
	"\tHack.textarea.hide();\n"+
	"\n"+
	"\tHack.clearLabel = Hack.createLabel([\n"+
	"\t\t'CLEAR!! Your time:',\n"+
	"\t\tHack.endTime - Hack.startTime,\n"+
	"\t\t'sec'\n"+
	"\t].join('<br>'), {\n"+
	"\t\tx: 140,\n"+
	"\t\ty: 100,\n"+
	"\t\twidth: 200,\n"+
	"\t\tcolor: '#fff',\n"+
	"\t\tfont: 'bold x-large/150% sans-serif'\n"+
	"\t});\n"+
	"\tenchant.Core.instance.pause();\n"+
	"};\n";
	// <==== 改造コード

	Hack.onpressstart = Hack.onpressstart || function() {
		Hack.shuffleAndLog('apple grape orange pineapple strawberry banana');

		Hack.started = true;
		Hack.startTime = enchant.Core.instance.getElapsedTime();
	};

	Hack.onendgame = Hack.onendgame || function() {
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
			color: '#fff',
			font: 'bold x-large/150% sans-serif'
		});
		enchant.Core.instance.pause();
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

});