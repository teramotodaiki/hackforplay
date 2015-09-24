window.addEventListener('load', function () {

	// Default
	Hack.music = {
		name: 'testmusic.mp3',
		BPM: 171,
		delayTime: 1.5,
		length: 4
	};

	var game = enchant.Core.instance;

	// settings
	Hack.ringTime = 0.5;
	Hack.notes = [1,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0];
	Hack.clearPoint = 1;

	Hack.nextNote = 0;
	Hack.nextBar = 0;
	Hack.point = 0;
	Hack.noteNum = 0;

	Hack.onload = function () {
		Hack.music.path = 'tail_of_comet/' + Hack.music.name + '.mp3';
		game.preload(Hack.music.path);
	};

	game.onload = game.onload || function () {

		/**
		 * Layer
		 * 0: cometSprite
		 * 1: ringParent
		 * 2: UI (defaultParentNode)
		 */

		var cometSprite = new Sprite(game.width, game.height);
		cometSprite.image = new Surface(game.width, game.height);
		game.rootScene.addChild(cometSprite); // layer 0

		Hack.comet = new Comet(cometSprite.image.context);
		game.rootScene.addChild(Hack.comet);

		Hack.ringParent = new Group();
		game.rootScene.addChild(Hack.ringParent); // layer 1

		Hack.defaultParentNode = Hack.defaultParentNode || new Group();
		Hack.createLabel('start', {
			x: 140, y: 144, width: 200,
			color: 'rgb(255,255,255)',
			font: '32px fantasy',
			textAlign: 'center',
			ontouchend: function () {
				if (!Hack.isMusicStarted) {
					Hack.dispatchEvent(new Event('pressstart'));
					this.parentNode.removeChild(this);
				}
			}
		});
	};

	Hack.isMusicStarted = false;
	Hack.isCometMoving = true;

	Hack.onpressstart = Hack.onpressstart || function () {
		var sound = game.assets[Hack.music.path];
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

	Hack.onmusicend = Hack.onmusicend || function () {
		// musicをフェードアウト
		var sound = game.assets[Hack.music.path];
		if (sound) {
			game.on('enterframe', function task () {
				sound.volume -= 0.02;
				if (sound.volume <= 0) {
					game.removeEventListener('enterframe', task);
					sound.stop();
					Hack.isCometMoving = true;
					new ScoreLabelUI(Hack.point, Hack.noteNum);
					setTimeout(function () {
						if (Hack.point > Hack.clearPoint) {
							Hack.gameclear();
						} else {
							Hack.gameover();
						}
					}, 4000);
				}
			});
		}
		Hack.isMusicStarted = false;
	};

	var ProcessingObject = Class(Sprite, {
		initialize: function (width, height, context) {
			Sprite.call(this, width, height);
			this.context = context || (this.image = new Surface(width, height)).context;
			this.params = {
				noStroke: false, noFill: false
			};
		},
		strokeWeight: function (weight) {
			this.context.lineWidth = weight;
		},
		noStroke: function () {
			this.params.noStroke = true;
		},
		stroke: function () {
			this.params.noStroke = false;
			this.context.strokeStyle = this.args2cssColor(arguments);
		},
		line: function (x1, y1, x2, y2) {
			this.context.beginPath();
			this.context.moveTo(x1, y1);
			this.context.lineTo(x2, y2);
			this.context.closePath();
			if (!this.params.noStroke) this.context.stroke();
		},
		noFill: function () {
			this.params.noFill = true;
		},
		fill: function () {
			this.params.noFill = false;
			this.context.fillStyle = this.args2cssColor(arguments);
		},
		rect: function (x, y, width, height) {
			this.context.beginPath();
			this.context.rect(x, y, width, height);
			this.context.closePath();
			if (!this.params.noFill) this.context.fill();
			if (!this.params.noStroke) this.context.stroke();
		},
		args2cssColor: function (args) {
			var array = Array.prototype.slice.call(args);
			var c = [ 0, 0, 0, 1 ]; // RGBA
			switch (array.length) {
			case 0: break;
			case 1: c[0] = array[0]; c[1] = array[0]; c[2] = array[0]; break;
			case 2: c[0] = array[0]; c[1] = array[0]; c[2] = array[0]; c[3] = array[1]; break;
			case 3: c[0] = array[0]; c[1] = array[1]; c[2] = array[2]; break;
			case 4: c[0] = array[0]; c[1] = array[1]; c[2] = array[2]; c[3] = array[3]; break;
			default: break;
			}
			return ['rgba(', c.join(','), ')' ].join('');
		}
	});

	var Comet = Class(ProcessingObject, {
		initialize: function (context) {
			ProcessingObject.call(this, 0, 0, context);
			this.velocity = { x: 0, y: 0 };
			this.setup();
		},
		setup: function () {
			this.setupTime = this.lastTime = new Date().getTime();

			if (Hack.setup) {
				Hack.setup(this);
			} else {
				this.moveTo(240, 160);
				this.velocity = { x: 200, y: -200 };
			}
		},
		onenterframe: function () {
			var currentTime = new Date().getTime();
			var t = (currentTime - this.lastTime) / 1000;
			this.lastTime = currentTime;

			if (!Hack.isCometMoving) return;

			this.px = this.x;
			this.py = this.y;

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
				this.draw();
			}

			if (!Hack.isMusicStarted) return;

			// 曲の長さを調べる
			if ((currentTime - this.setupTime) / 1000 > Hack.music.length) {
				Hack.dispatchEvent(new Event('musicend'));
			}

			// Ringを吐き出す
			var note8Millisecons = 30000 / Hack.music.BPM;
			var spend = currentTime - this.setupTime - (Hack.nextBar * note8Millisecons * 16);
			spend += (Hack.ringTime - Hack.music.delayTime) * 1000;
			if (spend >= note8Millisecons * Hack.nextNote) {
				if (Hack.notes[Hack.nextNote]) {
					// 鳴らす
					var ring = new Ring(this.x, this.y);
				}
				// ひとつ進む
				Hack.nextNote ++;
				if (Hack.nextNote >= Hack.notes.length){
					Hack.nextNote = 0;
					Hack.nextBar ++;
				}
			}
		},
		update: function (time) {
			if (Hack.update) Hack.update(time);
		},
		draw: function () {
			if (Hack.draw) {
				Hack.draw(this);
			} else {
				// draw comet
				this.context.fillStyle = 'rgba(0,0,0,0.1)';
				this.context.fillRect(0, 0, 480, 320);
				this.context.strokeStyle = 'rgba(0,100,255,1)';
				this.context.beginPath();
				this.context.moveTo(this.px, this.py);
				this.context.lineTo(this.x, this.y);
				this.context.closePath();
				this.context.stroke();
			}
		}
	});

	var Ring = Class(Sprite, {
		initialize: function (x, y) {
			Sprite.call(this, 80, 80);
			Hack.noteNum ++;
			this.moveBy(x - 40, y - 40);
			this.image = new Surface(this.width, this.height);
			this.state = 0; // Prepare: 0, Ok: 1, Ng: 2
			this.touchEnabled = false;
			Hack.ringParent.addChild(this);
		},
		onenterframe: function () {
			var ctx = this.image.context;
			var r = this.width / 2;
			var t = (this.age / game.fps) / Hack.ringTime;

			if (t < 1) {
				ctx.clearRect(0, 0, this.width, this.height);
				// target circle
				ctx.beginPath();
				ctx.arc(r, r, r - 1, 0, Math.PI * 2, true);
				ctx.strokeStyle = 'rgba(255,255,255,1)';
				ctx.closePath();
				ctx.stroke();
				// time circle
				ctx.beginPath();
				ctx.arc(r, r, (r - 1) * t, 0, Math.PI * 2, true);
				ctx.strokeStyle = 'rgba(0,200,255,1)';
				ctx.closePath();
				ctx.stroke();
			} else if (t <= 4) {
				if (this.state === 0) {
					this.judge();
				}
				if (this.state === 1) {
					// Ok
					var end_t = 4 - t;
					ctx.clearRect(0, 0, this.width, this.height);
					ctx.beginPath();
					ctx.arc(r, r, (r - 1) * t, 0, Math.PI * 2, true);
					ctx.fillStyle = 'rgba(0,200,255,' + end_t + ')';
					ctx.closePath();
					ctx.fill();
					ctx.fillStyle = 'rgba(255,255,255,' + end_t + ')';
					ctx.textAlign = 'center';
					ctx.fillText('OK', this.width / 2, this.height / 2);
				} else {
					// Ng
					var end_t = 4 - t;
					ctx.clearRect(0, 0, this.width, this.height);
					ctx.beginPath();
					ctx.arc(r, r, (r - 1) * t, 0, Math.PI * 2, true);
					ctx.fillStyle = 'rgba(255,100,100,' + end_t + ')';
					ctx.closePath();
					ctx.fill();
					ctx.fillStyle = 'rgba(255,255,255,' + end_t + ')';
					ctx.textAlign = 'center';
					ctx.fillText('NG', this.width / 2, this.height / 2);
				}
			} else if (this.parentNode) {
				this.parentNode.removeChild(this);
			}
		},
		judge: function () {
			// Hack.ringTime[sec] 経過した瞬間、カーソルがRingの中にあるか
			if(	this.x <= Hack.mouseX && Hack.mouseX <= this.x + this.width &&
				this.y <= Hack.mouseY && Hack.mouseY <= this.y + this.height) {
				this.state = 1;
				Hack.point += 1;
			} else {
				this.state = 2;
			}
		}
	});

	var ScoreLabelUI = Class(Label, {
		initialize: function (score, notes) {
			Label.call(this, '');
			this.color = 'rgb(255,255,255)';
			this.font = '32px fantasy';
			this.textAlign = 'center';
			this.width = 200;
			this.moveTo(140, 40);
			this.prefix = ['OK ', '/', ''];
			this.score = score;
			this.notes = notes;
			this.current = 0;
			this.animFrame = 40;
			Hack.defaultParentNode.addChild(this);
		},
		onenterframe: function () {
			if (this.age < this.animFrame) {
				this.current += (this.score / this.animFrame) >> 0;
				this.text = this.prefix[0] + this.current + this.prefix[1] + this.notes + this.prefix[2];
			} else {
				this.text = this.prefix[0] + this.score + this.prefix[1] + this.notes + this.prefix[2];
			}
		}
	});

	// Input
    var stage = document.getElementById('enchant-stage');
    stage.addEventListener('mousemove', function (event) {
		Hack.mouseX = event.clientX / game.scale;
		Hack.mouseY = event.clientY / game.scale;
    });

});