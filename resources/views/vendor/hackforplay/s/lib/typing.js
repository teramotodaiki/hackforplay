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

	// ====> 改造コードへ
	Hack.restagingCode =
"/**\n"+
" * ようこそ クリエイターさん！\n"+
" *\n"+
" * このせかいでは、あなたがゲームをつくるクリエイターです\n"+
" * 「#1」や「#2」…をみつけたら、ぜひ かきかえてみてください！\n"+
" *\n"+
" * かきかえたら、「ステージ改造コードを実行」ボタンをおしてみましょう\n"+
" *\n"+
" * Let's create your game!!\n"+
" *\n"+
"*/\n"+
"\n"+
"// onload ... さいしょにじっこうされるイベント\n"+
"Hack.onload = function() {\n"+
"\tHack.pressStartKey(' ');\n"+
"\tHack.clearLog();\n"+
"\n"+
"\t// #1 はいけい の いろ\n"+
"\t//   ... 0 みっつで くろいろ をあらわしている\n"+
"\tHack.overlay('rgb(  0,  0,  0)');\n"+
"\n"+
"\t// #2 さいしょに がめんにでてくる もじ\n"+
"\tHack.log('Press space key to start the Typing Game!!');\n"+
"\tHack.log('スペースキーを押して、タイピングゲームを始めよう!!');\n"+
"\n"+
"\tHack.started = false;\n"+
"};\n"+
"\n"+
"// onpressstart ... スペースキーがおされたら じっこうされるイベント\n"+
"Hack.onpressstart = function() {\n"+
"\t\n"+
"\t// #3 タイピングゲームにつかうもじを スペースキーでくぎって にゅうりょく\n"+
"\tHack.shuffleAndLog('apple grape orange pineapple strawberry banana');\n"+
"\n"+
"\tHack.started = true;\n"+
"\tHack.startTime = enchant.Core.instance.getElapsedTime();\n"+
"};\n"+
"\n"+
"// onkeydown ... なにかキーがおされたら じっこうされるイベント\n"+
"Hack.onkeydown = function() {\n"+
"\tif (Hack.started !== true) return;\n"+
"\n"+
"\t// おされたキーが テキストエリアの さいしょのもじとおなじなら\n"+
"\tif (Hack.getPreviousKey === Hack.textarea.text[0]) {\n"+
"\t\t// テキストエリアを ひともじ なくす\n"+
"\t	Hack.textarea.text = Hack.textarea.text.substr(1);\n"+
"\t}\n"+
"\t\n"+
"\tif (Hack.textarea.text === '') {\n"+
"\t\t// テキストエリアが から になったら、onendgameイベントをよびだす\n"+
"\t	Hack.dispatchEvent(new enchant.Event('endgame'));\n"+
"\t}\n"+
"};\n"+
"\n"+
"// onendgame ... すべてのもじを うちおわったら じっこうされるイベント\n"+
"Hack.onendgame = function() {\n"+
"\tHack.endTime = enchant.Core.instance.getElapsedTime();\n"+
"\tHack.textarea.hide();\n"+
"\n"+
"\t// #4 さいごに でてくる もじ\n"+
"\t// \n"+
"\t// Hack.endTime - Hack.startTime,\n"+
"\t//   ... おわったじかん - はじまったじかん で、かかったじかんを けいさんする\n"+
"\t// \n"+
"\t// color: 'rgb(255,255,255)',\n"+
"\t//   ... 255 みっつで しろいろ をあらわす\n"+
"\t//\n"+
"\t// x: 140,\n"+
"\t// y: 100,\n"+
"\t//   ... もじの いち をきめる ひだりから 140 うえから 100\n"+
"\t//\n"+
"\tHack.clearLabel = Hack.createLabel([\n"+
"\t\t'CLEAR!! Your time:',\n"+
"\t\tHack.endTime - Hack.startTime,\n"+
"\t\t'sec'\n"+
"\t].join('<br>'), {\n"+
"\t\tx: 140,\n"+
"\t\ty: 100,\n"+
"\t\twidth: 200,\n"+
"\t\tcolor: 'rgb(255,255,255)',\n"+
"\t\tfont: 'bold x-large/150% sans-serif'\n"+
"\t});\n"+
"\tHack.onendgame = function(){};\n"+
"};\n";
	// <==== 改造コード

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

});