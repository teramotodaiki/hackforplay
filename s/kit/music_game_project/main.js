window.addEventListener('load', function () {

    var game = enchant.Core.instance;

    Hack.onload = Hack.onload || function() {
        // settings
        Hack.ringTime = Hack.ringTime || 0.05;
        Hack.quota = Hack.quota || 0;
        Hack.notesInTime = Hack.notesInTime || 8;
        Hack.notes = Hack.notes || [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        Hack.music = Hack.music || {};

        if (Hack.music.name) {
            // Open music file
            Hack.music.type = 'WebAudioSound';
            Hack.music.path = 'yukison/' + Hack.music.name + '.mp3';
            Hack.coverImagePath = 'yukison/' + Hack.music.name + '-cover.png';
            game.preload(Hack.coverImagePath);
        } else if (Hack.music.track) {
            // Sound Cloud file
            Hack.music.type = 'SoundCloud';
            Hack.music.path = '/tracks/' + Hack.music.track;
        } else {
            Hack.log('Hack.music が指定されていません name または track プロパティが必要です');
        }

        Hack.soundEffectPath = (['osa/bosu19.wav','osa/clap00.wav', 'osa/coin03.wav', 'osa/metal03.wav', 'osa/metal05.wav', 'osa/on06.wav', 'osa/pi06.wav', 'osa/wood05.wav', 'osa/swing14.wav', 'osa/whistle00.wav'])[Hack.hitSE];
        game.preload(Hack.soundEffectPath);

        Object.defineProperty(Hack, 'oneNoteTime', {
            configurable: true, enumerable: true,
            get: function () {
                // note1個分の拍 [sec] 曲中は固定
                return 240 / Hack.music.BPM / Hack.notesInTime;
            }
        });
        Hack.noteCursor = 0;
        Hack.point = 0;
        Hack.noteNum = 0;
        Hack.isMusicStarted = false;
        Hack.isCometMoving = true;
    };

    game.onload = game.onload || function () {

        /**
         * Layer
         * 0: coverImage
         * 1: cometSprite
         * 2: ringParent
         * 3: touch sensor
         * 4: UI (defaultParentNode)
         */

         if (Hack.coverImagePath) {
            var coverSprite = new Sprite(game.width, game.height);
            coverSprite.image = Hack.coverOpacity > 0 ? game.assets[Hack.coverImagePath] : null;
            game.rootScene.addChild(coverSprite);
         }

        var cometSprite = new Sprite(game.width, game.height);
        cometSprite.image = new Surface(game.width, game.height);
        cometSprite.opacity = 1 - Hack.coverOpacity;
        game.rootScene.addChild(cometSprite);

        Hack.comet = new Comet(cometSprite.image.context);
        game.rootScene.addChild(Hack.comet);

        Hack.ringParent = new Group();
        game.rootScene.addChild(Hack.ringParent);

        Hack.touchSensor = new Sprite(game.width, game.height);
        Hack.touchSensor.ontouchmove =　Hack.touchSensor.ontouchstart = function (event) {
            Hack.mouseX = event.x;
            Hack.mouseY = event.y;
        };
        game.rootScene.addChild(Hack.touchSensor);

        Hack.defaultParentNode = Hack.defaultParentNode || new Group();
        var startLabel = new StartLabelUI();

        // Begin loading music
        switch (Hack.music.type) {
            case 'WebAudioSound':
            WebAudioSound.load(Hack.music.path, 'audio/mpeg', function () {
                Hack.sound = this;
                startLabel.loadSuccessed();
            }, function (exeption) {
                console.log(exeption);
                startLabel.loadFailed();
            });
            break;
            case 'SoundCloud':
            (function (SC) {
                SC.initialize({
                    // Hack移植時にServerからJSONで設定を投げるように
                    client_id: '52532cd2cd109c968a6c795b919898e8'
                });
                SC.get(Hack.music.path).then(function (track) {
                    Hack.music.BPM = Hack.music.BPM || track.bpm || 60;
                    Hack.music.intro = Hack.music.intro || 2;
                    SC.stream(Hack.music.path).then(function (player){
                        Hack.sound = new SCPlayerWrapper(player);
                        startLabel.loadSuccessed();
                    }, function (exception) {
                        console.log(exception);
                        startLabel.loadFailed();
                    });
                }, function (exception) {
                    console.log(exception);
                    startLabel.loadFailed();
                });
            })(window.SC);
            window.SC = null;
            break;
        }


    };

    Hack.onpressstart = Hack.onpressstart || function () {
        if (Hack.sound) {
            Hack.isCometMoving = true;
            Hack.isMusicStarted = true;
            Hack.sound.play();
            // Comet move to initialized point
            if (Hack.isCometMoving) {
                Hack.comet.setup();
            }
        }
    };

    Hack.onmusicend = Hack.onmusicend || function () {
        // musicをフェードアウト
        if (Hack.sound) {
            game.on('enterframe', function task () {
                Hack.sound.volume -= 0.02;
                if (Hack.sound.volume <= 0) {
                    game.removeEventListener('enterframe', task);
                    Hack.sound.pause();
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
        Hack.isCometMoving = false;
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
            this.setupTime = this.lastTime = Hack.isMusicStarted ? 0 : new Date().getTime() / 1000;
            this.commandStack = [];
            this.commandStackSeek = 0;
            this.moveTo(0, 0);
            this.velocity = { x: 0, y: 0 };
            this.force = { x: 0, y: 0 };

            if (Hack.setup) {
                Hack.setup(this);
            } else {
                this.moveTo(240, 160);
                this.velocity = { x: 200, y: -200 };
            }
        },
        onenterframe: function () {
            var currentTime = Hack.isMusicStarted ? Hack.sound.currentTime : new Date().getTime() / 1000;
            var spend = currentTime - this.setupTime;

            if (!Hack.isCometMoving) return;

            this.px = this.x;
            this.py = this.y;

            // set-On method call
            this.commandStack.forEach(function (item) {
                if (item.enabled && item.time <= spend) {
                    this['set' + item.type](item.data);
                    item.enabled = false;
                }
            }, this);
            this.commandStackSeek = spend;

            var t = currentTime - this.lastTime;
            var len = Math.max(1, 1000 * t >> 0); // tが変化しても_tがおよそ0.001になるように
            for (var i = 0; i < len; i++) {
                var _t = t / len;
                this.update(this.lastTime + _t * i);

                this.velocity.x += this.force.x * _t;
                this.velocity.y += this.force.y * _t;
                this.x += this.velocity.x * _t;
                this.y += this.velocity.y * _t;
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
            }

            this.draw(spend);

            this.lastTime = currentTime;

            if (!Hack.isMusicStarted) return;

            // 曲の長さを調べる
            if (spend > Hack.music.length) {
                Hack.dispatchEvent(new Event('musicend'));
            }

            // Ringを吐き出す rawCursorがnoteCursorを越えたら、noteCursorがひとつ進む
            var rawCursor = (spend + Hack.ringTime - Hack.music.intro) / Hack.oneNoteTime;
            if (Hack.noteCursor <= rawCursor) {
                if (Hack.notes[Hack.noteCursor % Hack.notes.length]) {
                    // 鳴らす
                    var ring = new Ring(this.x, this.y);
                }
                Hack.noteCursor ++; // ひとつ進む
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
            if (spend > Hack.ringTime * 2 && this.parentNode) {
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
                var _t = Math.max(2 - t, 0);
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
                var _t = Math.max(2 - t, 0);
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
                if (game.assets[Hack.soundEffectPath]) {
                    game.assets[Hack.soundEffectPath].play(true);
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

    var SCPlayerWrapper = Class(EventTarget, {
        initialize: function (player) {
            EventTarget.call(this);
            this.player = player;
            this.preventJSTime = new Date().getTime(); // Milliseconds
            this.preventSCTime = 0; // Milliseconds
        },
        play: function () {
            this.player.play();
        },
        pause: function () {
            this.player.pause();
        },
        volume: {
            configurable: true, enumerable: true,
            get: function () {
                return this.player.getVolume();
            },
            set: function (value) {
                this.player.setVolume(value);
            }
        },
        currentTime: {
            configurable: true, enumerable: true,
            get: function () {
                var time = this.player.currentTime();
                if (time > 0 && time === this.preventSCTime) {
                    time += new Date().getTime() - this.preventJSTime; // 補正
                } else {
                    this.preventJSTime = new Date().getTime();
                    this.preventSCTime = time;
                }
                return time / 1000;
            }
        }
    });

    // PC Input
    var stage = document.getElementById('enchant-stage');
    stage.addEventListener('mousemove', function (event) {
        Hack.mouseX = event.clientX / game.scale;
        Hack.mouseY = event.clientY / game.scale;
    });

});
