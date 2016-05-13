// Module check
(function (mod) {
	if (typeof define === "function" && define.amd) {
		define(['../../modules/enchant','../../modules/ui.enchant','../../modules/hack'], mod);
	} else {
		window.addEventListener('load', mod);
	}
})(function () {

  Math.clamp = function(value, min, max) {
		return Math.max(min, Math.min(max, value));
	};

	var for2d = function(x, y, callback) {
		for (var a = 0; a < x; ++a) {
			for (var b = 0; b < y; ++b) {
				callback(a, b);
			}
		}
	};


	(function() {
		var virtual = enchant.Map.prototype.redraw;
		enchant.Map.prototype.redraw = function() {

			this._context.canvas.width = this.width;
			this._context.canvas.height = this.height;

			virtual.call(this, 0, 0, this.width, this.height);

			// console.log('redraw');

		};
	})();




	enchant.Event.RENDERED = 'rendered';


	enchant.Surface.prototype.resize = function(width, height) {

		if (this.width === width && this.height === height) return;

		this.width = this._element.width = width;
		this.height = this._element.height = height;

	};

	var Camera = enchant.Class.create(enchant.EventTarget, {
		initialize: function() {
			enchant.EventTarget.call(this);

			this.rect = {

				x: 0,
				y: 0,
				width: 0,
				height: 0

			};


			this.zoom = 1.0;

			['x', 'y', 'width', 'height'].forEach(function(key) {

				Object.defineProperty(this, key, {
					get: function() {
						return this.rect[key];
					},
					set: function(value) {
						this.rect[key] = value;
					}
				});

			}, this);



			Camera.collection.push(this);

			this.surface = new enchant.Surface(480, 320);


			this.on(enchant.Event.RENDERED, function(event) {

				if (!this.enabled) return;


				var context = enchant.Core.instance.rootScene._layers.Canvas.context;

				if (this.error) {
					this.drawError(event.surface.context);
				}

				this.drawBorder(event.surface.context);


				context.drawImage(event.surface._element, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);



			});

		},


		_debug_show: function() {


			window.open(this.surface._element.toDataURL());

		},


		enabled: true,

		getIndex: function() {
			return Camera.collection.indexOf(this);
		},

		remove: function() {
			Camera.collection.splice(this.getIndex(), 1);
		},


		clamp: true,

		border: true,
		borderColor: '#fff',
		borderLineWidth: 3,

		borderStyle: function(lineWidth, color) {
			this.borderLineWidth = lineWidth;
			this.borderColor = color;

		},

		drawBorder: function(context) {

			if (!this.enabled || !this.border) return;

			context.strokeStyle = this.borderColor;
			context.lineWidth = this.borderLineWidth;
			context.strokeRect(0, 0, this.width, this.height);

		},

		errorColor: 'rgba(0, 0, 255, .5)',
		drawError: function(context) {
			if (!this.enabled || !this.error) return;

			context.fillStyle = this.errorColor;
			context.fillRect(0, 0, this.width, this.height);

		},

		move: function(x, y) {
			this.x = x;
			this.y = y;
			return this;
		},
		resize: function(width, height) {
			this.width = width;
			this.height = height;
			return this;
		},


		render: function(context) {

			if (!this.enabled) return;

			var surface = this.surface;
			// surface.resize(this.width, this.height);


			var target = this.target;
			var map = Hack.map;

			if (!map || !target) return;

			// ターゲットが別のマップなら
			if (target.map !== map) {
				this.dispatchEvent(new enchant.Event(Camera.Event.LOSE_TARGET));
			}

			// ターゲットが死亡しているなら（親ノードがないなら）
			if (!target.parentNode) {
				this.dispatchEvent(new enchant.Event(Camera.Event.DEAD_TARGET));
			}


			var plX = target.x - target.offset.x + map.tileWidth / 2;
			var plY = target.y - target.offset.y + map.tileHeight / 2;


			// ターゲットがマップ外なら
			if (plX < 0 || plY < 0 || plX >= map.width || plY >= map.height) {
				return this.dispatchEvent(new enchant.Event(Camera.Event.LOSE_TARGET));
			}



			var zoom = 1.0 / this.zoom;

			// 画面外を表示しないように zoom を調整する
			if (this.clamp) {

				// if (zoom === Infinity) zoom = 0;

				if (this.width * zoom > map.width) {
					zoom = map.width / this.width;
				}
				if (this.height * zoom > map.height) {
					zoom = map.height / this.height;
				}

			}

			var width = this.width * zoom;
			var height = this.height * zoom;


			var left = plX - (width) / 2;
			var top = plY - (height) / 2;

			var mapWidth = map.width;
			var mapHeight = map.height;




			left = Math.clamp(left, 0, mapWidth - width);
			top = Math.clamp(top, 0, mapHeight - height);


			// カメラの領域よりマップが小さいなら位置を調整
			if (mapWidth < width) {
				left = (mapWidth - width) / 2;
			}
			if (mapHeight < height) {
				top = (mapHeight - height) / 2;
			}

			surface.context.clearRect(0, 0, this.width, this.height);




			var drawEvent = new enchant.Event(Camera.Event.DRAW);
			drawEvent.context = surface.context;
			this.dispatchEvent(drawEvent);


			surface.context.drawImage(Camera.surface._element, left, top, width, height, 0, 0, this.width, this.height);


		}




	});


	// マップと同じ大きさのサーフェイス
	// Canvas → Camera.surface → Camera.prototype.surface → Canvas の順で描画される
	Camera.surface = new enchant.Surface();

	// この中に全てのカメラがある
	Camera.collection = [];

	// カメラを並べる
	Camera.arrange = function(x, y, border, filter) {

		// 枠を表示する
		if (border === undefined ? true : border) {
			Camera.collection.forEach(function(camera) {
				camera.border = true;
			});
		}

		// 並べるカメラだけ取得
		var index = 0;
		var cameras = Camera.collection.filter(filter || function(camera) {
			return camera.enabled;
		});

		// 再配置
		for2d(y, x, function(y2, x2) {

			if (index >= cameras.length) return;

			cameras[index++].move(480 / x * x2, 320 / y * y2).resize(480 / x, 320 / y);

		});

	};



	window.Camera = Camera;


	enchant.Event.RENDERED = 'rendered';
	Camera.Event = {

		LOSE_TARGET: 'losetarget',
		DEAD_TARGET: 'deadtarget',

		DRAW: 'draw'

	};


	/*

	◇ 対象の描画が終わった瞬間に呼ばれる RENDERED イベントを追加
	node.on('render') → 描画 → node.on('rendered')

	◇ 対象が不明（ Hack.map など、中身が変わるもの）の描画イベントを取得する手段
	これがあると魔改造ステージがすごく作りやすくなる

	?.on('render', func...) // これはできない（ことはないけど闇が深い）
	// これならいける
	enchant.CanvasRenderer.instance.listener.on('render', e => {
		if (e.node !== ?) return;
		// いろいろやる
	});

	◇ enchant.CanvasRenderer.instance.override
	これに CanvasRenderingContext2D が入っていると強制的に描画対象を上書きする

	*/

	enchant.CanvasRenderer.prototype.listener = new enchant.EventTarget();
	enchant.CanvasRenderer.prototype.override = null;
	enchant.CanvasRenderer.instance.render = function(context, node, event) {

		// safari 対策
		if (!node.scene && !node._scene) return;

		// context 上書き
		context = this.override || context;

		// RENDER
		this.listener.dispatchEvent((function() {
			var event = new enchant.Event(enchant.Event.RENDER);
			event.node = node;
			return event;
		})());

		enchant.CanvasRenderer.prototype.render.call(this, context, node, event);

		// RENDERED
		this.listener.dispatchEvent((function() {
			var event = new enchant.Event(enchant.Event.RENDERED);
			event.node = node;
			return event;
		})());

		node.dispatchEvent(new enchant.Event(enchant.Event.RENDERED));

	};





	enchant.Map.prototype.cvsRender = function(ctx) {
		var core = enchant.Core.instance;
		if (this.width !== 0 && this.height !== 0) {
			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			var cvs = this._context.canvas;
			// 変更はここだけ
			ctx.drawImage(cvs, 0, 0);
			ctx.restore();
		}
	};



	// 描画開始
	enchant.CanvasRenderer.instance.listener.on('render', function(event) {
		if (!Hack.map || event.node !== enchant.Core.instance.rootScene._layers.Canvas) return;

		Camera.surface.resize(Hack.map.width, Hack.map.height);

		enchant.CanvasRenderer.instance.override = Camera.surface.context;

	});


	// シーンの描画終了
	enchant.CanvasRenderer.instance.listener.on('rendered', function(event) {
		if (!Hack.map || event.node !== Hack.map.scene) return;

		enchant.CanvasRenderer.instance.override = null;

		// 画面全体を塗る（スクショが透明になるので）
		enchant.Core.instance.rootScene._layers.Canvas.context.fillStyle = '#000';
		enchant.Core.instance.rootScene._layers.Canvas.context.fillRect(0, 0, 480, 320);


		Camera.collection.forEach(function(camera) {



			camera.render();


			camera.dispatchEvent((function() {
				var event = new enchant.Event('rendered');
				event.surface = camera.surface;
				return event;
			})());




		});



	});

  var camera = new Camera();
  camera.resize(game.width, game.height);
  camera.border = false;
  camera.zoom = 1.0;

  Hack.camera = camera;

  game.on('load', function () {

    // ターゲットが指定されていない場合はHack.playerになる
    Hack.camera.target = Hack.camera.target || Hack.player;

  	// enchant.Map.prototype.redraw 変更前にマップが読み込まれてるので再描画
  	Hack.map.bmap.redraw();

  });


});
