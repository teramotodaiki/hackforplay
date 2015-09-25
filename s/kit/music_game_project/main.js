window.addEventListener('load', function () {

	Hack.restagingCode =
	"/**\n"+
	" * Introduction;\n"+
	" *\n"+
	" * このゲームは、すいせい（コメット）を おいかけて\n"+
	" * わっか（リング）をあつめる ゲームです\n"+
	" *\n"+
	" * おんがくの リズムにあわせて コメットをうごかし\n"+
	" * メディアアートを たいけん してみましょう\n"+
	" *\n"+
	" *\n"+
	" * Musics;\n"+
	" *\n"+
	" *      Name    |  BPM  | intro | length short (full)\n"+
	" *   testmusic  |  171  |  1.5  |          140 (258)\n"+
	" *\n"+
	" */\n"+
	"Hack.music = {\n"+
	"\tname: 'testmusic',\n"+
	"\tBPM: 171,\n"+
	"\tdelayTime: 1.5,\n"+
	"\tlength: 8\n"+
	"};\n"+
	"\n"+
	"/**\n"+
	" * setup;\n"+
	" *\n"+
	" * ゲームが はじまったときに コールされる\n"+
	" * さいしょの 位置（いち）や 速度（そくど）を きめる\n"+
	" *\n"+
	" */\n"+
	"Hack.setup = function (comet) {\n"+
	"\n"+
	"\t// ひだりから 240px, うえから 160px の いち\n"+
	"\tcomet.x = 240;\n"+
	"\tcomet.y = 160;\n"+
	"\n"+
	"\n"+
	"\t// みぎにむかって 100 [px/sec],\n"+
	"\t// したにむかって -100 [px/sec] の はやさ\n"+
	"\tcomet.velocity.x = 100;\n"+
	"\tcomet.velocity.y = -100;\n"+
	"\n"+
	"};\n"+
	"\n"+
	"/**\n"+
	" * update;\n"+
	" *\n"+
	" * ゲームが つづいているあいだ つねに コールされる\n"+
	" * time（タイム）には けいかじかんが はいっている\n"+
	" *\n"+
	" */\n"+
	"Hack.update = function (comet,time) {\n"+
	"\n"+
	"\t// 0秒〜10秒までのあいだのこと\n"+
	"\tif (time < 10) {\n"+
	"\t\tcomet.force.y = 10;\n"+
	"\n"+
	"\t}\n"+
	"\n"+
	"\t// 10秒〜40秒までのあいだのこと\n"+
	"\tif (10 < time && time < 40) {\n"+
	"\t\tcomet.force.y = 0;\n"+
	"\t\tcomet.setSpeed(200, 100);\n"+
	"\t}\n"+
	"\n"+
	"};\n"+
	"\n"+
	"/**\n"+
	" * draw;\n"+
	" *\n"+
	" * コメットの 軌跡（きせき）について かかれている\n"+
	" * いろ や ふとさ などを かえられる\n"+
	" *\n"+
	" */\n"+
	"Hack.draw = function (comet,time) {\n"+
	"\n"+
	"\t/**\n"+
	"\t * COLORS(色の作り方);\n"+
	"\t *\n"+
	"\t * white(白):    (255,255,255)\n"+
	"\t * gray(灰):     (127,127,127)\n"+
	"\t * black(黒):    (  0,  0,  0)\n"+
	"\t * red(赤):      (255,  0,  0)\n"+
	"\t * green(緑):    (  0,255,  0)\n"+
	"\t * blue(青):     (  0,  0,255)\n"+
	"\t *\n"+
	"\t * Transparent colors(透明色);\n"+
	"\t *\n"+
	"\t * light blue(明るい青):    (  0,  0,255,0.9);\n"+
	"\t * dark blue(くらい青):     (  0,  0,255,0.4);\n"+
	"\t *\n"+
	"\t * ... もっと知りたい人は、「光の三原色」について しらべよう！\n"+
	"\t * ... The three primary colors.\n"+
	"\t *\n"+
	"\t */\n"+
	"\tcomet.stroke(  0,  0,255);\n"+
	"\n"+
	"\n"+
	"\t// 線を引く\n"+
	"\tcomet.strokeWeight(1);\n"+
	"\tcomet.line(comet.x, comet.y, comet.px, comet.py);\n"+
	"\n"+
	"\n"+
	"\n"+
	"\t// 全体をぼかす\n"+
	"\tcomet.noStroke();\n"+
	"\tcomet.fill(  0,  0,  0,0.1);\n"+
	"\tcomet.rect(0, 0, 480, 320);\n"+
	"\n"+
	"};\n";

	// Default
	Hack.music = {
		name: 'testmusic',
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
		var startLabel = new StartLabelUI();

		// Begin loading music
		Hack.music.path = 'tail_of_comet/' + Hack.music.name + '.mp3';
		WebAudioSound.load(Hack.music.path, 'audio/mpeg', function () {
			Hack.sound = this;
			startLabel.loadSuccessed();
		}, function (exeption) {
			console.log(exeption);
			startLabel.loadFailed();
		});
	};

	Hack.isMusicStarted = false;
	Hack.isCometMoving = true;

	Hack.onpressstart = Hack.onpressstart || function () {
		if (Hack.sound) {
			// Comet move to initialized point
			if (Hack.isCometMoving) {
				Hack.comet.setup();
			}
			Hack.isCometMoving = true;
			Hack.isMusicStarted = true;
			Hack.sound.play();
		}
	};

	Hack.onmusicend = Hack.onmusicend || function () {
		// musicをフェードアウト
		if (Hack.sound) {
			game.on('enterframe', function task () {
				Hack.sound.volume -= 0.02;
				if (Hack.sound.volume <= 0) {
					game.removeEventListener('enterframe', task);
					Hack.sound.stop();
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
				noStroke: false, noFill: false,
				fontSize: 10, fontFamily: 'sans-selif'
			};
			this.stroke(0);
			this.fill(255);
		},
		point: function (x, y) {
			this.context.beginPath();
			this.context.rect(x, y, 1, 1);
			this.context.closePath();
			this.context.fill();
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
		line: function (x1, y1, x2, y2) {
			this.polygon(2, arguments);
		},
		triangle: function (x1, y1, x2, y2, x3, y3) {
			this.polygon(3, arguments);
		},
		quad: function (x1, y1, x2, y2, x3, y3, x4, y4) {
			this.polygon(4, arguments);
		},
		polygon: function (corner, args) {
			this.context.beginPath();
			this.context.moveTo(args[corner * 2 - 2], args[corner * 2 - 1]);
			for (var i = 0; i < corner; i++) {
				this.context.lineTo(args[i * 2], args[i * 2 + 1]);
			}
			this.context.closePath();
			if (!this.params.noFill) this.context.fill();
			if (!this.params.noStroke) this.context.stroke();
		},
		ellipse: function (x, y, width, height) {
			this.context.beginPath();
			this.context.setTransform(width, 0, 0, height, 0, 0);
			this.context.arc(x/width + 0.5, y/height + 0.5, 0.5, 0, Math.PI * 2, false);
			this.context.setTransform(1, 0, 0, 1, 0, 0);
			this.context.closePath();
			if (!this.params.noFill) this.context.fill();
			if (!this.params.noStroke) this.context.stroke();
		},
		bezier: function (x1, y1, x2, y2, x3, y3, x4, y4) {
			this.context.beginPath();
			this.context.moveTo(x1, y1);
			this.context.bezierCurveTo(x2, y2, x3, y3, x4, y4);
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
		},
		loadFont: function (text) {
			/* BFont is not exist. This method returns input text */
			return text;
		},
		textFont: function (font, size) {
			this.params.fontFamily = font;
			this.params.fontSize = size || this.params.fontSize;
			this.context.font = this.params.fontSize + 'px ' + this.params.fontFamily;
		},
		textSize: function (size) {
			this.params.fontSize = size;
			this.context.font = this.params.fontSize + 'px ' + this.params.fontFamily;
		},
		text: function (data, x, y) {
			if (!this.params.noFill) this.context.fillText(data, x, y);
		}
	});

	var Comet = Class(ProcessingObject, {
		initialize: function (context) {
			ProcessingObject.call(this, 0, 0, context);
			this.velocity = { x: 0, y: 0 };
			this.force = { x: 0, y: 0 };
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

			this.update((currentTime - this.setupTime) / 1000);

			this.velocity.x += this.force.x * t;
			this.velocity.y += this.force.y * t;

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

			this.draw((currentTime - this.setupTime) / 1000);

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
			if (Hack.update) Hack.update(this, time);
		},
		draw: function (time) {
			if (Hack.draw) {
				Hack.draw(this, time);
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
		},
		setSpeed: function () {
			switch (arguments.length) {
			case 1:
				var speed = arguments[0];
				var abs = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
				var norm = abs > 0 ? { x: this.velocity.x / abs, y: this.velocity.y / abs } : { x: 1, y: 1 };
				this.velocity = { x: norm.x * speed, y: norm.y * speed };
				break;
			case 2:
				var sign = { x: this.velocity.x >= 0 ? 1 : -1, y: this.velocity.y >= 0 ? 1 : -1 };
				this.velocity = { x: sign.x * arguments[0], y: sign.y * arguments[1] };
				break;
			default: break;
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

	var StartLabelUI = Class(Label, {
		initialize: function () {
			Label.call(this, 'Loading');
			this.color = 'rgb(255,255,255)';
			this.font = '32px fantasy';
			this.textAlign = 'center';
			this.width = 200;
			this.moveTo(140, 140);
			this.tl.fadeIn(30).fadeOut(30).loop();
			Hack.defaultParentNode.addChild(this);
		},
		loadSuccessed: function () {
			this.tl.clear().fadeIn(30);
			this.text = 'Start';
			this.ontouchend = function () {
				if (!Hack.isMusicStarted) {
					Hack.dispatchEvent(new Event('pressstart'));
					this.parentNode.removeChild(this);
				}
			};
		},
		loadFailed: function () {
			this.tl.clear().fadeIn(30);
			this.text = 'Load Failed';
			this.color = 'rgb(255,0,0)';
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