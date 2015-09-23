window.addEventListener('load', function () {

	Hack.music = 'tail_of_comet/testmusic.mp3';

	var game = enchant.Core.instance;
	game.preload(Hack.music);

	// settings
	Hack.ringTime = 0.2;
	Hack.delayTime = 4;
	Hack.BPM = 171;
	Hack.note8Millisecons = 30000 / Hack.BPM;
	Hack.notes = [1,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0];
	Hack.nextNote = 0;
	Hack.nextBar = 0;

	game.onload = game.onload || function () {

		var cometSprite = new Sprite(game.width, game.height);
		cometSprite.image = new Surface(game.width, game.height);
		game.rootScene.addChild(cometSprite);

		Hack.comet = new Comet(cometSprite.image.context);
		game.rootScene.addChild(Hack.comet);

		Hack.ui = new Label('start');
		Hack.ui.moveTo(40, 300);
		Hack.ui.color = 'rgb(100,100,100)';
		Hack.ui.ontouchend = function () {
			if (Hack.isMusicStarted) {
				Hack.dispatchEvent(new Event('presspause'));
				this.text = 'start';
			} else {
				Hack.dispatchEvent(new Event('pressstart'));
				this.text = 'pause';
			}
		};
		game.rootScene.addChild(Hack.ui);

	};

	Hack.isMusicStarted = false;
	Hack.isCometMoving = true;

	Hack.onpressstart = Hack.onpressstart || function () {
		var sound = game.assets[Hack.music];
		if (sound) {
			// Comet move to initialized point
			if (Hack.isCometMoving) {
				Hack.comet.setup();
			}
			Hack.isCometMoving = true;
			Hack.isMusicStarted = true;
			sound.play();
		}
	};

	Hack.onpresspause = Hack.onpresspause || function () {
		var sound = game.assets[Hack.music];
		if (sound) {
			sound.pause();
			Hack.isMusicStarted = false;
			Hack.isCometMoving = false;
		}
	};

	var Comet = Class(Entity, {
		initialize: function (context) {
			Entity.call(this);
			this.context = context;
			this.setup();
		},
		setup: function () {
			// ====> Coded by user
			this.moveTo(100, 100);
			this.velocity = { x: 200, y: -200 };

			this.setupTime = this.lastTime = new Date().getTime();
		},
		onenterframe: function () {
			var currentTime = new Date().getTime();
			var t = (currentTime - this.lastTime) / 1000;
			this.lastTime = currentTime;

			if (!Hack.isCometMoving) return;

			this.lastX = this.x;
			this.lastY = this.y;

			if (this.update) this.update((currentTime - this.setupTime) / 1000, enchant.Core.instance);

			this.x += this.velocity.x * t;
			this.y += this.velocity.y * t;

			if (this.x < 0) {
				this.x = -this.x;
				this.velocity.x *= -1;
			}
			if (this.x > game.width) {
				this.x = game.width - (this.x - game.width);
				this.velocity.x *= -1;
			}
			if (this.y < 0) {
				this.y = -this.y;
				this.velocity.y *= -1;
			}
			if (this.y > game.height) {
				this.y = game.height - (this.y - game.height);
				this.velocity.y *= -1;
			}

			if (this.draw) {
				this.draw(this.context, enchant.Core.instance);
			}

			if (!Hack.isMusicStarted) return;

			// Ringを吐き出す
			var spend = currentTime - this.setupTime - (Hack.nextBar * Hack.note8Millisecons * 16);
			spend += (Hack.ringTime - Hack.delayTime) * 1000;
			if (spend >= Hack.note8Millisecons * Hack.nextNote) {
				if (Hack.notes[Hack.nextNote]) {
					// 鳴らす
					var ring = new Ring(this.x, this.y);
					game.rootScene.addChild(ring);
				}
				// ひとつ進む
				Hack.nextNote ++;
				if (Hack.nextNote >= Hack.notes.length){
					Hack.nextNote = 0;
					Hack.nextBar ++;
				}
			}
		},
		update: function (time, game) {

		},
		draw: function (context, game) {
			// ====> Coded by user
			// draw comet
			context.fillStyle = 'rgba(0,0,0,0.1)';
			context.fillRect(0, 0, game.width, game.height);
			context.strokeStyle = 'rgba(0,100,255,1)';
			context.beginPath();
			context.moveTo(this.lastX, this.lastY);
			context.lineTo(this.x, this.y);
			context.closePath();
			context.stroke();
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