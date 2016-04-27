/*
 * overlay.js
 * 画面全体に色を塗りつぶすOverlayクラス Spriteを継承している
*/
var Overlay; // Overlayクラス
window.addEventListener('load', function(){
	// fillに使えるのは、Surface, String(CSS Color)のいずれか
	Overlay = enchant.Class.create(enchant.Sprite, {
		initialize: function(fill){
			var game = enchant.Game.instance;
			var w = game.width, h = game.height; // よくつかうので短くしておく
			// 最初に透明なスプライトをつくる
			enchant.Sprite.call(this, w, h);
			if (fill instanceof Surface){
				this.image = fill;
			} else {
				this.image = new Surface(w, h);
				this.image.context.fillStyle = fill;
				this.image.context.fillRect(0, 0, w, h);
			}
		}
	});
});
