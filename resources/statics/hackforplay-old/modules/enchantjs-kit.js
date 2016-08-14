require('enchantjs/enchant');
require('enchantjs/ui.enchant');

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

// 実行中、すべての例外を親ウィンドウに投げる
function postError (error) {
  var parent = window.parent || window;
  parent.postMessage({
    query: 'error',
    value: Object.assign({}, error, {
      name: error.name || 'Error',
      message: error.message || error,
    }),
  }, parent.location.origin);
}
function tryCatchWrap (func) {
  return function () {
    try {
      return func.apply(this, arguments);
    } catch (e) {
      console.error(e);
      postError(e);
    }
  };
}
EventTarget.prototype.dispatchEvent = tryCatchWrap(EventTarget.prototype.dispatchEvent);
ActionEventTarget.prototype.dispatchEvent = tryCatchWrap(ActionEventTarget.prototype.dispatchEvent);

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
Hack.focusOnClick = true;
window.addEventListener('click', function () {
	if (Hack.focusOnClick) {
	  window.document.activeElement.blur(); // Blur an enchantBook
		window.parent.focus(); // Blur an input in parent window
		window.focus(); // focus game
	}
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
