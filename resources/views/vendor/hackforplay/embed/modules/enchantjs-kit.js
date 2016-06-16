(function (mod) {
	if (typeof define === "function" && define.amd) {
		define(function (require, exports, module) {

      // dependencies
      require('enchantjs/enchant');
      require('enchantjs/ui.enchant');
      return mod();

		});
	} else {
		window.addEventListener('load', function () {
			mod();
		});
	}
})(function () {

// enchant.js wrapper for HackforPlay
// v0.0.1


// すべてのenchantモジュールをグローバルにエクスポート
enchant();

// コアインスタンスを生成
window.game = new Core(Hack.stageInfo.width, Hack.stageInfo.height);

// Hack.start
Hack.start = function () {
  // game start
  Hack.dispatchEvent(new Event('load'));
  game.start();
  window.focus();
};

// TODO:
// enchant.EventTarget.prototype.distpatchEvent
// enchant.ActionEventTarget.prototype.distpatchEvent
// を try-catch で囲み、すべての例外を親ウィンドウに投げる

// リサイズ時にゲームの scale を調節
document.documentElement.style.overflow = 'hidden';
window.addEventListener('resize', function () {
	var fWidth = parseInt(window.innerWidth, 10),
	fHeight = parseInt(window.innerHeight, 10);
	if (fWidth && fHeight) {
		game.scale =  Math.min(
			fWidth / game.width,
			fHeight / game.height
		);
	} else {
		game.scale = 1;
	}
});

// クリック時に再度フォーカス
window.addEventListener('click', function () {
  window.document.activeElement.blur(); // Blur an enchantBook
	window.parent.focus(); // Blur an input in parent window
	window.focus(); // focus game
});

// 'capture' メッセージを受けてcanvasの画像を返す
window.addEventListener('message', function (event) {
  if (typeof event.data === 'object' && event.data.query === 'capture') {
    var canvas;
    try {
      canvas = enchant.Core.instance.currentScene._layers.Canvas._element;
    } catch (e) {
      if (!game.ready) {
        game.on('load', send);
      }
      return;
    }
  }
  send();
  
  function send () {
    var canvas = enchant.Core.instance.currentScene._layers.Canvas._element;
    event.source.postMessage({
      query: event.data.responseQuery,
      value: canvas.toDataURL(),
      width: canvas.width,
      height: canvas.height,
    }, event.origin);
  }
});

// TODO: enchant.jsで利用するメンバのヒントを親ウィンドウに投げる

});
