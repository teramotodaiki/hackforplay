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


// TODO: すべてのenchantモジュールをグローバルにエクスポート

// TODO: コアインスタンスを生成

// TODO: Hack.start

// TODO:
// enchant.EventTarget.prototype.distpatchEvent
// enchant.ActionEventTarget.prototype.distpatchEvent
// を try-catch で囲み、すべての例外を親ウィンドウに投げる

// TODO: リサイズ時にゲームの scale を調節

// TODO: クリック時に再度フォーカス

// TODO: 'capture' メッセージを受けてcanvasの画像を返す

// TODO: enchant.jsで利用するメンバのヒントを親ウィンドウに投げる

});
