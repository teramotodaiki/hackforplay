window.addEventListener('load', function () {

	var game = enchant.Core.instance;

	// settings
	Hack.ringTime = 0.2;

	game.onload = game.onload || function () {

		var cometSprite = new Sprite(game.width, game.height);
		cometSprite.image = new Surface(game.width, game.height);
		game.rootScene.addChild(cometSprite);

		Hack.comet = new Comet();
		Hack.comet.on('enterframe', function  () {
			// Draw Comet
			if (this.draw) {
				this.draw(cometSprite.image.context);
			}
		});
		game.rootScene.addChild(Hack.comet);

	};

	var Comet = Class(Entity, {

		initialize: function () {
			Entity.call(this);

			this.moveTo(100, 100);
			this.veloctiy = { x: 200, y: -200 };

			this.lastTime = new Date().getTime();
		},
		onenterframe: function () {
			var currentTime = new Date().getTime();
			var t = (currentTime - this.lastTime) / 1000;
			this.lastTime = currentTime;

			this.x += this.veloctiy.x * t;
			this.y += this.veloctiy.y * t;

			if (this.x < 0) {
				this.x = -this.x;
				this.veloctiy.x *= -1;
			}
			if (this.x > game.width) {
				this.x = game.width - (this.x - game.width);
				this.veloctiy.x *= -1;
			}
			if (this.y < 0) {
				this.y = -this.y;
				this.veloctiy.y *= -1;
			}
			if (this.y > game.height) {
				this.y = game.height - (this.y - game.height);
				this.veloctiy.y *= -1;
			}

			// Ringを吐き出す
			if (game.frame % 15 === 0) {
				var ring = new Ring(this.x, this.y);
				game.rootScene.addChild(ring);
			}
		},
		draw: function (context) {
			// draw comet
			context.fillStyle = 'rgba(0,0,0,0.1)';
			context.fillRect(0, 0, game.width, game.height);
			context.fillStyle = 'rgba(0,100,255,1)';
			context.fillRect(this.x - 1, this.y - 1, 2, 2);
		}
	});

	var Ring = Class(Sprite, {
		initialize: function (x, y) {
			Sprite.call(this, 80, 80);
			this.moveBy(x - 40, y - 40);
			this.image = new Surface(this.width, this.height);
		},
		onenterframe: function () {
			var ctx = this.image.context;
			var r = this.width / 2;
			var t = (this.age / game.fps) / Hack.ringTime;

			if (t < 1) {
				ctx.beginPath();
				ctx.arc(r, r, (r - 1) * t, 0, Math.PI * 2, true);
				ctx.fillStyle = 'rgba(0,200,255,1)';
				ctx.fill();
				ctx.closePath();
			} else if (t <= 4) {
				// Ok
				var end_t = 4 - t;
				ctx.clearRect(0, 0, this.width, this.height);
				ctx.beginPath();
				ctx.arc(r, r, (r - 1) * t, 0, Math.PI * 2, true);
				ctx.fillStyle = 'rgba(0,200,255,' + end_t + ')';
				ctx.fill();
				ctx.closePath();
			} else if (this.scene) {
				game.rootScene.removeChild(this);
			}
		}
	});

});