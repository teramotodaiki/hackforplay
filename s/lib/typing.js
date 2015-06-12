// Typing game

// とりあえず実装も全部書いてしまうが、このへんは改造コードに書くべき
// textarea拡張用のメソッドをいくつか用意してやるといいかもしれない（splitやjoinは複雑だしfor文を必須にしたくない）
// スペース区切りのやつをシャッフルしてN個表示とか。
// 大文字小文字の区別付きで、入力された「文字」をとるのとかいいかも

window.addEventListener('load', function() {

	enchant.ENV.PREVENT_DEFAULT_KEY_CODES = [];

	var game = enchant.Core.instance;
	game.on('load', function() {
		var word = ('var function window string number').split(' ');
		var container = [];
		for (var i = 0; i < 100; i++) {
			var index = (Math.random() * word.length) >> 0;
			container.push(word[index]);
		}
		Hack.textarea.show(container.join(' '));
	});

	// input
	// きちんとこのへん例外処理する
	window.addEventListener('keydown', function(event) {
		var input_cap = String.fromCharCode(event.keyCode).toUpperCase();
		var first_cap = Hack.textarea.text[0].toUpperCase();
		if (input_cap === first_cap) {
			Hack.textarea.text = Hack.textarea.text.substr(1);
		}
	});
});