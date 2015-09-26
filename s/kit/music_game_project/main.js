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
" *   testmusic  |  170  | 1.63  |           89 (258)\n"+
" *\n"+
" */\n"+
"Hack.music = {\n"+
"\tname: 'testmusic',\n"+
"\tBPM: 170,\n"+
"\tintro: 1.63,\n"+
"\tlength: 89\n"+
"};\n"+
"\n"+
"/**\n"+
" * Settings;\n"+
" * \n"+
" * ringTime:    リングがでてから はじけるまでの じかん\n"+
" * quota:       クリアするために ひつような OK の かず\n"+
" * hitSE:       OK のときの こうかおん（SE ... サウンドエフェクト）\n"+
" *\n"+
" * ringTime を おおきくすると、OK が でやすくなります\n"+
" * quota を おおきくすると、クリアが むずかしく なります\n"+
" */\n"+
"Hack.ringTime = 0.5;\n"+
"Hack.quota = 100;\n"+
"Hack.hitSE = 0;\n"+
"\n"+
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
"\t// ひだりから 0px, うえから 160px の いち\n"+
"\tcomet.x = 0;\n"+
"\tcomet.y = 160;\n"+
"\n"+
"\n"+
"\t// みぎにむかって 80 [px/sec],\n"+
"\t// うえにむかって  0 [px/sec] の はやさ\n"+
"\tcomet.velocity.x = 80;\n"+
"\tcomet.velocity.y = 0;\n"+
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
"Hack.update = function (\n"+
"\tcomet, time, x, y, px, py, speed, vx, vy,\n"+
"\tsetPosition, setSpeed, setVelocity, setForce, setNotes,\n"+
"\tsetPositionOn, setSpeedOn, setVelocityOn, setForceOn, setNotesOn) {\n"+
"\n"+
"\n"+
"\t// さいしょの テンポを せってい\n"+
"\tsetNotesOn(0, 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);\n"+
"\n"+
"\n"+
"\t// 13秒のとき、ひだりから 0 うえから 200 に、いどう\n"+
"\t// よこむきに 50 たてむきに 100 のはやさ\n"+
"\tsetPositionOn(12,   0, 160);\n"+
"\tsetSpeedOn(   12,  50, 100);\n"+
"\tsetNotesOn(   12,   1,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0);\n"+
"\n"+
"\n"+
"\t// 24秒のとき、はずむような うごき\n"+
"\tsetPositionOn(24, 320, 160);\n"+
"\tsetVelocityOn(24,-100,   0);\n"+
"\tsetForceOn(   24,   0, 400);\n"+
"\tsetNotesOn(   24,   1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0);\n"+
"\n"+
"\t// 46秒のとき、うえで はずむ うごき\n"+
"\t//setPositionOn(46,  20, 260);\n"+
"\tsetVelocityOn(46,-100,   0);\n"+
"\tsetForceOn(   46,   0,-200);\n"+
"\tsetNotesOn(   46,   0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0);\n"+
"\n"+
"\t// 60秒から 89秒（さいご）まで ずっと、なみのような うごき\n"+
"\tsetNotesOn(   60,   1,0,0,1,1,0,0,0,1,0,0,0,1,0,0,0);\n"+
"\tsetPositionOn(60, 480, 250);\n"+
"\tsetVelocityOn(60,-160,   0);\n"+
"\tif (60 < time && time < 89) {\n"+
"\t\tsetForce(0, (200 - y) * 20);\n"+
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
"Hack.draw = function (\n"+
"\tcomet, time, x, y, px, py, speed, vx, vy,\n"+
"\tline, rect, triangle, quad, point, ellipse, bezier,\n"+
"\tstroke, noStroke, strokeWeight, fill, noFill,\n"+
"\ttext, textFont, textSize, clearRect) {\n"+
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
"\tstroke(  0,  0,255);\n"+
"\n"+
"\n"+
"\t// 線を引く\n"+
"\tstrokeWeight(1);\n"+
"\tline(x, y, px, py);\n"+
"\n"+
"\n"+
"\t// 24秒よりあとで、46秒までのあいだ\n"+
"\tif (24 < time && time < 46) {\n"+
"\n"+
"\t\t// あしもとに しろい てん\n"+
"\t\tfill(255,255,255);\n"+
"\t\tpoint(x, 300);\n"+
"\n"+
"\t}\n"+
"\n"+
"\t// 46秒よりあとで、60秒までのあいだ\n"+
"\tif (46 < time && time < 60) {\n"+
"\n"+
"\t\t// たてながの うすいみずいろの だえん\n"+
"\t\tnoStroke();\n"+
"\t\tfill(  0,255,255, 0.5);\n"+
"\t\tellipse(x, 0, x - px, 320);\n"+
"\n"+
"\t}\n"+
"\n"+
"\t// 60秒よりあとで、89秒までのあいだ\n"+
"\tif (60 < time && time < 89) {\n"+
"\n"+
"\t\t// 中心から さんかく ... (240, 160) = 中心\n"+
"\t\ttriangle(240,   0, x, y, px, py);\n"+
"\t\ttriangle(240, 320, x, y, px, py);\n"+
"\n"+
"\t}\n"+
"\n"+
"\t// 全体をぼかす\n"+
"\tnoStroke();\n"+
"\tfill(  0,  0,  0,0.08);\n"+
"\trect(0, 0, 480, 320);\n"+
"\n"+
"};\n";

    Hack.music = Hack.music || {};
    console.log('main.js Hack.music set', Hack.music);


    var game = enchant.Core.instance;
    game.preload('osa/bosu10_a.wav','osa/bosu19.wav', 'osa/clap00.wav', 'osa/coin03.wav', 'osa/kachi04.wav', 'osa/metal03.wav', 'osa/metal05.wav', 'osa/on06.wav', 'osa/pi06.wav', 'osa/wood05.wav');

    // settings
    Hack.ringTime = Hack.ringTime || 0.5;
    Hack.notes = Hack.notes || [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    Hack.quota = Hack.quota || 1;
    Hack.hitSE = Hack.hitSE || -1;

    Hack.nextNote = 0;
    Hack.nextBar = 0;
    Hack.point = 0;
    Hack.noteNum = 0;
    Hack.isMusicStarted = false;
    Hack.isCometMoving = true;

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

        Hack.soundEffects = [
            game.assets['osa/bosu10_a.wav'],
            game.assets['osa/bosu19.wav'],
            game.assets['osa/clap00.wav'],
            game.assets['osa/coin03.wav'],
            game.assets['osa/kachi04.wav'],
            game.assets['osa/metal03.wav'],
            game.assets['osa/metal05.wav'],
            game.assets['osa/on06.wav'],
            game.assets['osa/pi06.wav'],
            game.assets['osa/wood05.wav']
        ];
    };

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
                        if (Hack.point > Hack.quota) {
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
            c[0] = c[0] >> 0;
            c[1] = c[1] >> 0;
            c[2] = c[2] >> 0;
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
        },
        clearRect: function (x, y, width, height) {
            /* Clear the surface. This is the HTML5 Canvas method */
            this.context.clearRect(x, y, width, height);
        }
    });

    var Comet = Class(ProcessingObject, {
        initialize: function (context) {
            ProcessingObject.call(this, 0, 0, context);
            this.velocity = { x: 0, y: 0 };
            this.force = { x: 0, y: 0 };
            this.commandStack = [];
            this.commandStackSeek = 0;
            this.setup();
        },
        setup: function () {
            this.setupTime = this.lastTime = new Date().getTime();
            this.commandStackSeek = 0;

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
            var spend = (currentTime - this.setupTime) / 1000;
            this.lastTime = currentTime;

            if (!Hack.isCometMoving) return;

            this.px = this.x;
            this.py = this.y;

            this.update(spend);

            // set-On method call
            this.commandStack.forEach(function (item) {
                if (item.enabled && item.time <= spend) {
                    this['set' + item.type](item.data);
                    item.enabled = false;
                }
            }, this);
            this.commandStackSeek = spend;

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

            this.draw(spend);

            if (!Hack.isMusicStarted) return;

            // 曲の長さを調べる
            if (spend > Hack.music.length) {
                Hack.dispatchEvent(new Event('musicend'));
            }

            // Ringを吐き出す
            var note8Millisecons = 30000 / Hack.music.BPM;
            var millisec = currentTime - this.setupTime - (Hack.nextBar * note8Millisecons * 16);
            millisec += (Hack.ringTime - Hack.music.intro) * 1000;
            if (millisec >= note8Millisecons * Hack.nextNote) {
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
            var speed = Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2));
            if (Hack.update) {
                Hack.update(this, time, this.x, this.y, this.px, this.py, speed, this.velocity.x, this.velocity.y,
                    this.setPosition.bind(this), this.setSpeed.bind(this), this.setVelocity.bind(this), this.setForce.bind(this), this.setNotes.bind(this),
                    this.setPositionOn.bind(this), this.setSpeedOn.bind(this), this.setVelocityOn.bind(this), this.setForceOn.bind(this), this.setNotesOn.bind(this));
            }
        },
        draw: function (time) {
            var speed = Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2));
            if (Hack.draw) {
                Hack.draw(this, time, this.x, this.y, this.px, this.py, speed, this.velocity.x, this.velocity.y,
                    this.line.bind(this), this.rect.bind(this), this.triangle.bind(this), this.quad.bind(this), this.point.bind(this), this.ellipse.bind(this), this.bezier.bind(this), this.stroke.bind(this), this.noStroke.bind(this), this.strokeWeight.bind(this), this.fill.bind(this), this.noFill.bind(this), this.text.bind(this), this.textFont.bind(this), this.textSize.bind(this), this.clearRect.bind(this));
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
        setPosition: function (x, y) {
            if (x.length > 0) this.setPosition(x[0], x[1]);
            else this.moveTo(x, y);
        },
        setSpeed: function () {
            if (arguments[0].length === 2) this.setSpeed(arguments[0][0], arguments[0][1]);
            else if(arguments[0].length > 0) this.setSpeed(arguments[0][0]);
            else {
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
        },
        setVelocity: function (x, y) {
            if (x.length > 0) this.setVelocity(x[0], x[1]);
            else this.velocity = { x: x, y: y };
        },
        setForce: function (x, y) {
            if (x.length > 0) this.setForce(x[0], x[1]);
            else this.force = { x: x, y: y };
        },
        setNotes: function () {
            if (arguments[0].length > 0) {
                Hack.notes = arguments[0];
            } else {
                this.setNotes(Array.prototype.slice.call(arguments));
            }
        },
        setPositionOn: function (time, args) {
            this.setOn(arguments, 'Position');
        },
        setVelocityOn: function (time, args) {
            this.setOn(arguments, 'Velocity');
        },
        setSpeedOn: function (time, args) {
            this.setOn(arguments, 'Speed');
        },
        setForceOn: function (time, args) {
            this.setOn(arguments, 'Force');
        },
        setNotesOn: function (time, args) {
            this.setOn(arguments, 'Notes');
        },
        setOn: function (mixed, type) {
            var array = mixed[1] instanceof Array ? mixed[1] : Array.prototype.slice.call(mixed, 1);
            var item = {
                time: mixed[0], data: array, type: type, enabled: true
            };
            // もう時間が過ぎていないか
            if (item.time > this.commandStackSeek) return;

            // 同じデータがないか
            var isUnique = this.commandStack.every(function (element) {
                return item.time !== element.time || item.type !== element.type ||
                        element.data.every(function (number, index) {
                            return item.data[index] !== number;
                        });
            });
            if (isUnique) {
                this.commandStack.push(item);
            }
        }
    });

    var Ring = Class(ProcessingObject, {
        initialize: function (x, y) {
            ProcessingObject.call(this, 100, 100);
            Hack.noteNum ++;
            this.moveBy(x - 50, y - 50);
            this.state = 0; // Prepare: 0, Ok: 1, Ng: 2
            this.touchEnabled = false;
            Hack.ringParent.addChild(this);
            this.bornTime = new Date().getTime();
        },
        onenterframe: function () {
            var currentTime = new Date().getTime();
            var spend = (currentTime - this.bornTime) / 1000;

            if (spend >= Hack.ringTime && this.state === 0) {
                this.judge();
            }
            if (spend > 4 && this.parentNode) {
                this.parentNode.removeChild(this);
            } else {
                this.draw(spend);
            }
        },
        draw: function (time) {
            var t = Hack.ringTime > 0 ? time / Hack.ringTime : 1;
            var w = this.width, h = this.height;
            this.clearRect(0, 0, w, h);
            switch (this.state) {
            case 0:
                this.noFill();
                this.stroke(255);
                this.ellipse(10, 10, 80, 80);
                this.stroke(0,160,255);
                this.ellipse(50 - t * 40, 50 - t * 40, t * 80, t * 80);
                break;
            case 1:
                var _t = Math.max((3 - t) / 2, 0);
                if (_t > 0) {
                    this.stroke(255 * _t, 95 * _t + 160, 255, _t);
                    this.strokeWeight(_t * 8);
                    this.noFill();
                    this.ellipse(4, 4, 92, 92);
                }
                this.fill(255, 255, 255, _t);
                this.text('OK', 43, 53);
                break;
            case 2:
                var _t = Math.max((3 - t) / 2, 0);
                if (_t > 0) {
                    this.stroke(200 - 55 * _t, 45 * _t, 0, _t);
                    this.strokeWeight(_t * 4);
                    this.noFill();
                    this.ellipse(12, 12, 76, 76);
                }
                this.fill(255, 255, 255, _t);
                this.text('NG', 43, 53);
                break;
            }
        },
        judge: function () {
            // Hack.ringTime[sec] 経過した瞬間、カーソルがRingの中にあるか
            var dx = this.x + this.width / 2 - Hack.mouseX;
            var dy = this.y + this.height / 2 - Hack.mouseY;
            if (dx * dx + dy * dy <= 40 * 40) {
                this.state = 1;
                Hack.point += 1;
                if (Hack.soundEffects[Hack.hitSE]) {
                    Hack.soundEffects[Hack.hitSE].play(true);
                }
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