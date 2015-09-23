window.addEventListener('load', function () {

	var game = enchant.Core.instance;

	game.onload = game.onload || function () {

		var commetSprite = new Sprite(game.width, game.height);
		commetSprite.image = new Surface(game.width, game.height);
		game.rootScene.addChild(commetSprite);

		Hack.commet = new Commet();
		Hack.commet.on('enterframe', function  () {
			// Draw Commet
			if (this.draw) {
				this.draw(commetSprite.image.context);
			}
		});
		game.rootScene.addChild(Hack.commet);

	};

	var Commet = Class(Entity, {

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
		},
		draw: function (context) {
			// draw commet
			context.fillStyle = 'rgba(0,0,0,0.1)';
			context.fillRect(0, 0, game.width, game.height);
			context.fillStyle = 'rgba(0,100,255,1)';
			context.fillRect(this.x - 1, this.y - 1, 2, 2);
		}
	});



});