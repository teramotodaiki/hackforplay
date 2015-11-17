window.addEventListener('load', function () {

	/**
	 * RPGObject
	 * To use;

	var bs = new BlueSlime();
	bs.locate(5, 5);
	bs.onplayerenter = function () {
		// When player will step on bs
		// プレイヤーが上に乗ったとき
	};
	bs.onplayerestay = function () {
		// When player still stay in bs
		// プレイヤーが上に乗っている間
	};
	bs.onplayerexit = function () {
		// When player will leave from bs
		// プレイヤーが離れたとき
	};
	bs.onattacked = function (event) {
		// When someone will attack bs
		// 攻撃されたとき
	};
	bs.onbecomeidle = function () {
		// When behavior becomes BehaviorTypes.Idle
		// まち状態になったとき
	};
	// 同様に BehaviorTypes が定義されているだけ、イベントが存在します。
	bs.onbecomewalk = function () {};
	bs.onbecomeattack = function () {};
	bs.onbecomedamaged = function () {};
	bs.onbecomedead = function () {};

	 */

	// Classes and Enums
	Object.defineProperty(window, 'BehaviorTypes',	{ get: function () { return __BehaviorTypes; }	});
	Object.defineProperty(window, 'RPGObject',		{ get: function () { return __RPGObject; }		});
	Object.defineProperty(window, 'Player',			{ get: function () { return __Player; }			});
	Object.defineProperty(window, 'EnemyBase',		{ get: function () { return __EnemyBase; }		});
	Object.defineProperty(window, 'BlueSlime',		{ get: function () { return __BlueSlime; }		});
	Object.defineProperty(window, 'Insect',			{ get: function () { return __Insect; }			});
	Object.defineProperty(window, 'Spider',			{ get: function () { return __Spider; }			});
	Object.defineProperty(window, 'Bat',			{ get: function () { return __Bat; }			});
	Object.defineProperty(window, 'Dragon',			{ get: function () { return __Dragon; }			});
	Object.defineProperty(window, 'Minotaur',		{ get: function () { return __Minotaur; }		});
	Object.defineProperty(window, 'Boy',			{ get: function () { return __Boy; }			});
	Object.defineProperty(window, 'Girl',			{ get: function () { return __Girl; }			});
	Object.defineProperty(window, 'Woman',			{ get: function () { return __Woman; }			});
    Object.defineProperty(window, 'MapObject',		{ get: function () { return __MapObject; }		});

    var game = enchant.Core.instance;

	var __BehaviorTypes = {
		None :      0,  // 無状態 (デフォルトではEventは発火されません)
		Idle :		1,	// 立ち状態
		Walk :		2,	// 歩き状態
		Attack :	4,	// 攻撃状態
		Damaged :	8,	// 被撃状態
		Dead :		16	// 死亡状態
	};

	var __RPGObject = enchant.Class(enchant.Sprite, {
		initialize: function (width, height, offsetX, offsetY) {
			Sprite.call(this, width, height);
			this.offset = { x: offsetX, y: offsetY };
			this.moveTo(game.width, game.height);
			Object.defineProperty(this, 'mapX', {
				get: function () { return (this.x - this.offset.x) / 32 >> 0; }
			});
			Object.defineProperty(this, 'mapY', {
				get: function () { return (this.y - this.offset.y) / 32 >> 0; }
			});
			this.getFrameOfBehavior = []; // BehaviorTypesをキーとしたgetterの配列
			// onbecome~ イベントで this.frame を更新するように
			Object.keys(BehaviorTypes).forEach(function (item) {
				this.on('become' + item.toLowerCase(), function () {
					var key = BehaviorTypes[item];
					var routine = this.getFrameOfBehavior[key];
					if (routine) this.frame = routine.call(this);
				});
			}, this);
			// このオブジェクトの behavior プロパティと、onbecome~イベントの発火
			var behavior = BehaviorTypes.None;
			Object.defineProperty(this, 'behavior', {
				get: function () { return behavior; },
				set: function (value) {
					var append = value & ~behavior;
					behavior = value;
					var type = Object.keys(BehaviorTypes).filter(function (item) {
						return (BehaviorTypes[item] & append) > 0;
					}).forEach(function (item) {
						// ignite 1 frame later
						this.setTimeout(function () {
							this.dispatchEvent( new Event( 'become' + item.toLowerCase() ) );
						}, 1);
					}, this);
				}
			});
			this.setTimeout(function () {
				// 1 frame later, call this.onbecomeidle
				this.behavior = BehaviorTypes.Idle;
			}, 1);
			var collisionFlag = null; // this.collisionFlag (Default:true)
			Object.defineProperty(this, 'collisionFlag', {
				get: function () {
					return collisionFlag !== null ? collisionFlag :
						!(this.onplayerenter || this._listeners['playerenter'] ||
						this.onplayerstay || this._listeners['playerstay'] ||
						this.onplayerexit || this._listeners['playerexit']);
				},
				set: function (value) { collisionFlag = value; }
			});

			Hack.defaultParentNode.addChild(this);
		},
		locate: function (fromLeft, fromTop, mapName) {
			if (mapName) {
				this.destroy();
				Hack.maps[mapName].scene.addChild(this);
			}
			this.moveTo(
				fromLeft * 32 + this.offset.x,
				fromTop * 32 + this.offset.y);
		},
		destroy: function () {
			if (this.scene) this.scene.removeChild(this);
			if (this.parentNode) this.parentNode.removeChild(this);
		},
		setFrame: function (behavior, frame) {
			// behavior is Key:number or Type:string
			// frame is Frames:array or Getter:function
			var value = typeof behavior === 'number' ? behavior : BehaviorTypes[behavior];
			(function (_local) {
				if (typeof frame === 'function') {
					this.getFrameOfBehavior[value] = _local;
				} else {
					this.getFrameOfBehavior[value] = function () {
						return _local;
					};
				}
			}).call(this, frame);
		},
		getFrame: function () {
			if (this.getFrameOfBehavior[this.behavior]) {
				return this.getFrameOfBehavior[this.behavior].call(this);
			}
			// Search nearly state
			for (var i = 32 - 1; i >= 0; i--) {
				var getter = this.getFrameOfBehavior[this.behavior & (1 << i)];
				if (getter) {
					return getter.call(this);
				}
			}
		},
		setTimeout: function (callback, wait) {
			var target = this.age + Math.min(1, wait);
			this.on('enterframe', function task () {
				if (this.age === target) {
					callback.call(this);
					this.removeEventListener('enterframe', task);
				}
			});
		},
		setInterval: function (callback, interval) {
			var current = this.age;
			this.on('enterframe', function task () {
				if ((this.age - current) % interval === 0) {
					callback.call(this);
				}
			});
		}
	});

	var __Player = enchant.Class(RPGObject, {
		initialize: function () {
			RPGObject.call(this, 48, 48, -8, -12);
			this.image = game.assets['enchantjs/x1.5/chara5.png'];
			this.hp = 2;
			this.atk = 1;
			this.enteredStack = [];
			this.on('enterframe', this.stayCheck);
			var direction = 0;
			Object.defineProperty(this, 'direction', {
				get: function () { return direction; },
				set: function (value) {
					direction = value;
					this.frame = [this.direction * 9 + (this.frame % 9)];
				}
			});
			this.setFrame(BehaviorTypes.Idle, function () {
				return [this.direction * 9 + 1];
			});
			this.setFrame(BehaviorTypes.Walk, function () {
				var a = this.direction * 9, b = a + 1, c = a + 2;
				return [a, a, a, a, b, b, b, b, c, c, c, c, b, b, b, b];
			});
			this.setFrame(BehaviorTypes.Attack, function () {
				var a = this.direction * 9 + 6, b = a + 1, c = a + 2;
				return [a, a, a, a, b, b, b, b, c, c, c, c, null];
			});
			this.setFrame(BehaviorTypes.Damaged, function () {
				var a = this.direction * 9 + 2, b = -1;
				return [a, b, b, b, a, a, a, b, b, b];
			});
			this.setFrame(BehaviorTypes.Dead, function () {
				return [this.direction * 9 + 1, null];
			});
		},
		onenterframe: function () {
			if (this.behavior === BehaviorTypes.Idle) {
				if (game.input.a) {
					this.attack();
				}
			}
			if (this.behavior === BehaviorTypes.Idle) {
				var hor = game.input.right - game.input.left;
				var ver = hor ? 0 : game.input.down - game.input.up;
				if (hor || ver) {
					// Turn
					this.direction = Hack.Vec2Dir({ x: hor, y: ver });
					// Map Collision
					if ( !Hack.map.hitTest((this.mapX + hor) * 32, (this.mapY + ver) * 32) &&
						0 <= this.mapX + hor && this.mapX + hor < 15 && 0 <= this.mapY + ver && this.mapY + ver < 10) {
						// RPGObject(s) Collision
						if (RPGObject.collection.every(function (item) {
							return !item.collisionFlag || item.mapX !== this.mapX + hor || item.mapY !== this.mapY + ver;
						}, this)) {
							this.walk(hor, ver);
						}
					}
				}
			}
		},
		walk: function (x, y) {
			this.behavior = BehaviorTypes.Walk;
			var tx = this.x + x * 32, ty = this.y + y * 32;
			this.tl.moveBy(x * 32, y * 32, 12).then(function () {
				this.behavior = BehaviorTypes.Idle;
				this.moveTo(tx, ty);
				// Dispatch playerenter Event
				RPGObject.collection.filter(function (item) {
					return item.mapX === this.mapX  && item.mapY === this.mapY;
				}, this).forEach(function (item) {
					item.dispatchEvent(new Event('playerenter'));
					this.enteredStack.push(item);
				}, this);
			});
		},
		attack: function () {
			this.behavior = BehaviorTypes.Attack;
			var len = this.getFrame().length;
			this.tl.then(function () {
				var v = Hack.Dir2Vec(this.direction);
				Hack.Attack.call(this, this.mapX + v.x, this.mapY + v.y, this.atk, v.x, v.y);
			}).delay(len).then(function () {
				this.behavior = BehaviorTypes.Idle;
			});
		},
		onattacked: function (event) {
			if( (this.behavior & (BehaviorTypes.Damaged + BehaviorTypes.Dead)) === 0 ) {
                this.hp -= event.damage;
                if(this.hp > 0){
                    this.behavior += BehaviorTypes.Damaged;
					this.tl.delay(9).then(function () {
						this.behavior = BehaviorTypes.Idle;
					});
                }else{
					this.behavior = BehaviorTypes.Dead;
					this.tl.fadeOut(10).then(function(){
						Hack.gameover();
					});
                }
            }
		},
		stayCheck: function () {
			this.enteredStack.forEach(function (item) {
				if (item.mapX === this.mapX && item.mapY === this.mapY) {
					item.dispatchEvent(new Event('playerstay'));
				} else {
					item.dispatchEvent(new Event('playerexit'));
					var index = this.enteredStack.indexOf(item);
					this.enteredStack.splice(index, 1);
				}
			}, this);
		}
	});

	var __EnemyBase = enchant.Class(RPGObject, {
		initialize: function (width, height, offsetX, offsetY) {
			RPGObject.call(this, width, height, offsetX, offsetY);
			Object.keys(BehaviorTypes).forEach(function (key) {
				this.setFrame(key, [2, null]);
			}, this);
			var direction = -1; // -1: Left, 1: Right
			Object.defineProperty(this, 'direction', {
				get: function () { return direction; },
				set: function (value) { this.scaleX = -(direction = Math.sign(value)) * Math.abs(this.scaleX); }
			});
			this.hp = 3;
			this.atk = 1;
		},
		attack: function () {
			this.behavior = BehaviorTypes.Attack;
			var len = this.getFrame().length;
			this.tl.then(function () {
				var v = { x: this.direction, y: 0 };
				Hack.Attack.call(this, this.mapX + v.x, this.mapY + v.y, this.atk, v.x, v.y);
			}).delay(len).then(function () {
				this.behavior = BehaviorTypes.Idle;
			});
		},
		onattacked: function (event) {
			if( (this.behavior & (BehaviorTypes.Damaged + BehaviorTypes.Dead)) === 0 ) {
                this.hp -= event.damage;
                if(this.hp > 0){
                    this.behavior = BehaviorTypes.Damaged;
                    this.tl.clear().delay(this.getFrame().length).then(function(){
                        this.behavior = BehaviorTypes.Idle;
                    });
                }else{
                    this.behavior = BehaviorTypes.Dead;
                    this.tl.clear().delay(this.getFrame().length).then(function(){
                        this.destroy();
                    });
                }
            }
		}
	});

	var __BlueSlime = enchant.Class(EnemyBase, {
        initialize: function(){
			EnemyBase.call(this, 48, 48, -8, -10);
			this.image = game.assets['enchantjs/monster4.gif'];
			this.setFrame(BehaviorTypes.Idle, [2, 2, 2, 2, 3, 3, 3, 3]);
			this.setFrame(BehaviorTypes.Walk, [2, 2, 2, 2, 3, 3, 3, 3]);
			this.setFrame(BehaviorTypes.Attack, [6, 6, 6, 6, 4, 4, 4, 4, 5, 5, 5, 5, 4, 4, 4, 4, null]);
			this.setFrame(BehaviorTypes.Damaged, [4, 4, 4, 4, 5, 5, 5, 5]);
			this.setFrame(BehaviorTypes.Dead, [5, 5, 5, 5, 7, 7, -1, null]);
        }
    });

	var __Insect = enchant.Class(EnemyBase, {
        initialize: function(){
			EnemyBase.call(this, 48, 48, -8, -16);
			this.image = game.assets['enchantjs/monster1.gif'];
			this.setFrame(BehaviorTypes.Idle, [2, 2, 2, 2, 3, 3, 3, 3]);
			this.setFrame(BehaviorTypes.Walk, [2, 2, 2, 2, 3, 3, 3, 3]);
			this.setFrame(BehaviorTypes.Attack, [7, 7, 7, 6, 6, 6, 6, 6, 5, 5, 5, 5, 4, 4, 4, 4, null]);
			this.setFrame(BehaviorTypes.Damaged, [4, 4, 4, 4, 5, 5, 5, 5]);
			this.setFrame(BehaviorTypes.Dead, [5, 5, 5, 5, 7, 7, -1, null]);
        }
    });

	var __Spider = enchant.Class(EnemyBase, {
        initialize: function(){
			EnemyBase.call(this, 64, 64, -16, -24);
			this.image = game.assets['enchantjs/monster2.gif'];
			this.setFrame(BehaviorTypes.Idle, [2, 2, 2, 2, 3, 3, 3, 3]);
			this.setFrame(BehaviorTypes.Walk, [2, 2, 2, 2, 3, 3, 3, 3]);
			this.setFrame(BehaviorTypes.Attack, [6, 6, 6, 7, 7, 7, 7, 7, 5, 5, 5, 5, 4, 4, 4, 4, null]);
			this.setFrame(BehaviorTypes.Damaged, [4, 4, 4, 4, 5, 5, 5, 5]);
			this.setFrame(BehaviorTypes.Dead, [5, 5, 5, 5, 7, 7, -1, null]);
        }
    });

	var __Bat = enchant.Class(EnemyBase, {
        initialize: function(){
			EnemyBase.call(this, 48, 48, -8, -18);
			this.image = game.assets['enchantjs/monster3.gif'];
			this.setFrame(BehaviorTypes.Idle, [2, 2, 2, 2, 3, 3, 3, 3]);
			this.setFrame(BehaviorTypes.Walk, [2, 2, 2, 4, 4, 4, 4, 4, 3, 3, 3, 3]);
			this.setFrame(BehaviorTypes.Attack, [9, 9, 9, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 3, 3, 4, 4, 4, 4, null]);
			this.setFrame(BehaviorTypes.Damaged, [4, 4, 4, 4, 5, 5, 5, 5]);
			this.setFrame(BehaviorTypes.Dead, [5, 5, 5, 5, 7, 7, -1, null]);
        }
    });

	var __Dragon = enchant.Class(EnemyBase, {
        initialize: function(){
			EnemyBase.call(this, 80, 80, -24, -42);
			this.image = game.assets['enchantjs/bigmonster1.gif'];
			this.setFrame(BehaviorTypes.Idle, [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
			this.setFrame(BehaviorTypes.Walk, [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3]);
			this.setFrame(BehaviorTypes.Attack, [8, 8, 8, 8, 8, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, null]);
			this.setFrame(BehaviorTypes.Damaged, [4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5]);
			this.setFrame(BehaviorTypes.Dead, [2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, -1, null]);
        }
    });

	var __Minotaur = enchant.Class(EnemyBase, {
        initialize: function(){
			EnemyBase.call(this, 80, 80, -40, -48);
			this.image = game.assets['enchantjs/bigmonster2.gif'];
			this.setFrame(BehaviorTypes.Idle, [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]);
			this.setFrame(BehaviorTypes.Walk, [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3]);
			this.setFrame(BehaviorTypes.Attack, [5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, null]);
			this.setFrame(BehaviorTypes.Damaged, [7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 6]);
			this.setFrame(BehaviorTypes.Dead, [2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, -1, null]);
        }
    });

	var __Boy = enchant.Class(RPGObject, {
        initialize: function(){
			RPGObject.call(this, 48, 48, -8, -18);
			this.image = game.assets['enchantjs/x1.5/chara0.png'];
			this.frame = 1;
        }
    });

	var __Girl = enchant.Class(RPGObject, {
        initialize: function(){
			RPGObject.call(this, 48, 48, -8, -18);
			this.image = game.assets['enchantjs/x1.5/chara0.png'];
			this.frame = 7;
        }
    });

	var __Woman = enchant.Class(RPGObject, {
        initialize: function(){
			RPGObject.call(this, 48, 48, -8, -18);
			this.image = game.assets['enchantjs/x1.5/chara0.png'];
			this.frame = 4;
        }
    });

    var __MapObject = enchant.Class(RPGObject, {
        initialize: function(frame){
            RPGObject.call(this, 32, 32, 0, 0);
            this.image = game.assets['enchantjs/x2/map1.gif'];
			if (typeof frame === 'number') {
				this.frame = frame;
			} else if (MapObject.Dictionaly && MapObject.Dictionaly[frame]) {
				this.frame = MapObject.Dictionaly[frame];
			}
        },
        onenterframe: function(){

        }
    });

});