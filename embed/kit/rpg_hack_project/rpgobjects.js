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
	/**
	 * Collision Detection
	 * [Case]						: [Event]		: [Note]
	 * Kinematics ===> Kinematics	: oncollided	: Need collisionFlag is true
	 * Physics ===> Physics			: oncollided	: Need collisionFlag is true, Change velocity
	 * Physics ===> Kinematics		: ontriggered	: Ignore collisionFlag, Don't change velocity
	 * Kinematics ===> Player		: onplayerenter	: Need collisionFlag is false, Dispatch onnly kinematics
	*/

	// Classes and Enums
	Object.defineProperty(window, 'BehaviorTypes',	{ get: function () { return __BehaviorTypes; }	});
	Object.defineProperty(window, 'RPGObject',		{ get: function () { return __RPGObject; }		});
	Object.defineProperty(window, 'HumanBase',		{ get: function () { return __HumanBase; }		});
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
    Object.defineProperty(window, 'Effect',			{ get: function () { return __Effect; }			});

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
				get: function () { return (this.x - this.offset.x + 16) / 32 >> 0; }
			});
			Object.defineProperty(this, 'mapY', {
				get: function () { return (this.y - this.offset.y + 16) / 32 >> 0; }
			});
			Object.defineProperty(this, 'map', {
				get: function () {
					var parent = Object.keys(Hack.maps).filter(function (name) {
						return Hack.maps[name].scene === this.parentNode;
					}, this);
					if (parent.length === 0) return undefined;
					else return parent[0];
				}
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
				configurable: true,
				get: function () { return behavior; },
				set: function (value) {
					if (value !== behavior) {
						behavior = value;
						Object.keys(BehaviorTypes).filter(function (item) {
							// 最も大きい桁
							var contain = behavior & BehaviorTypes[item];
							return contain && behavior < contain * 2;
						}).forEach(function (item) {
							// On Becomeイベントを1フレーム後に発火
							this.setTimeout(function () {
								this.dispatchEvent( new Event( 'become' + item.toLowerCase() ) );
							}, 1);
						}, this);
					}
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
			var isKinematic = null; // this.isKinematic (Default: true)
			Object.defineProperty(this, 'isKinematic', {
				get: function () {
					return isKinematic !== null ? isKinematic :
						!(this.velocityX || this.velocityY ||
							this.accelerationX || this.accelerationY);
				},
				set: function (value) { isKinematic = value; }
			});
			// Destroy when dead
			this.on('becomedead', function() {
				this.setTimeout(function () {
					this.destroy();
				}, this.getFrame().length);
			});
			// 初期化
			this.direction = 0;
			this.forward = { x: 0, y: 0 };
			this.velocityX = this.velocityY = this.accelerationX = this.accelerationY = 0;
			this.mass = 1;

			Hack.defaultParentNode.addChild(this);
		},
		locate: function (fromLeft, fromTop, mapName) {
			if (mapName && Hack.maps[mapName]) {
				this.destroy();
				Hack.maps[mapName].scene.addChild(this);
			}
			this.moveTo(
				fromLeft * 32 + this.offset.x,
				fromTop * 32 + this.offset.y);
		},
		destroy: function (delay) {
			if (delay > 0) this.setTimeout(destroyMe, delay);
			else destroyMe.call(this);
			function destroyMe () {
				if (this.scene) this.scene.removeChild(this);
				if (this.parentNode) this.parentNode.removeChild(this);
			}
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
			return [];
		},
		setTimeout: function (callback, wait) {
			var target = this.age + Math.max(1, wait), flag = true;
			function task () {
				if (this.age === target && flag) {
					callback.call(this);
					stopTimeout.call(this);
				}
			}
			function stopTimeout () {
				flag = false;
				this.removeEventListener(task);
			}
			this.on('enterframe', task);
			return stopTimeout.bind(this);
		},
		setInterval: function (callback, interval) {
			var current = this.age, flag = true;
			function task () {
				if ((this.age - current) % interval === 0 && flag) {
					callback.call(this);
				}
			}
			function stopInterval () {
				flag = false;
				this.removeEventListener(task);
			}
			this.on('enterframe', task);
			return stopInterval.bind(this);
		},
		attack: function (count, continuous) {
			if (!continuous && (this.behavior & BehaviorTypes.Attack + BehaviorTypes.Walk)) return;
			var c = typeof count === 'number' ? count >> 0 : 1;
			var f = this.forward;
			if (continuous) {
				this.frame = [];
				this.frame = this.getFrame();
			} else this.behavior |= BehaviorTypes.Attack;
			Hack.Attack.call(this, this.mapX + f.x, this.mapY + f.y, this.atk, f.x, f.y);
			this.setTimeout(function () {
				// next step
				if (count > 1) this.attack(count - 1, true);
				else this.behavior = BehaviorTypes.Idle;
			}, this.getFrame().length);
		},
		onattacked: function (event) {
			if( (this.behavior & (BehaviorTypes.Damaged + BehaviorTypes.Dead)) === 0 ) {
				if (typeof this.hp === 'number') {
					this.hp -= event.damage;
				}
				if(this.hp <= 0){
					this.behavior = BehaviorTypes.Dead;
					Object.defineProperty(this, 'behavior', { set: function () {} }); // an-writable
				}else{
					this.behavior |= BehaviorTypes.Damaged;
					this.setTimeout(function(){
						this.behavior &= ~BehaviorTypes.Damaged;
					}, this.getFrame().length);
				}
      }
		},
		walk: function (distance, continuous) {
			if (!this.isKinematic || !continuous && (this.behavior & BehaviorTypes.Walk + BehaviorTypes.Attack)) return;
			var f = this.forward, d = typeof distance === 'number' ? distance >> 0 : 1, s = Math.sign(d);
			var _x = this.mapX + f.x * s, _y = this.mapY + f.y * s;
			// Map Collision
			var mapHit = Hack.map.hitTest(_x * 32, _y * 32) || 0 > _x || _x > 14 || 0 > _y || _y > 9;
			// RPGObject(s) Collision
			var hits = RPGObject.collection.filter(function (item) {
				return item.isKinematic && item.collisionFlag && item.mapX === _x && item.mapY === _y;
			});
			if (!mapHit && !hits.length) {
				if (continuous) {
					this.frame = [];
					this.frame = this.getFrame();
				} else this.behavior = BehaviorTypes.Walk;
				this.dispatchEvent(new Event('walkstart'));
				var move = { x: Math.round(f.x * 32 * s), y: Math.round(f.y * 32 * s) };
				var target = { x: this.x + move.x, y: this.y + move.y };
				var frame = this.getFrame().length;
				var stopInterval = this.setInterval(function () {
					this.moveBy(move.x / frame, move.y / frame);
					this.moveTo(Math.round(this.x), Math.round(this.y));
					this.dispatchEvent(new Event('walkmove'));
				}, 1);
				this.setTimeout(function () {
					this.moveTo(target.x, target.y);
					stopInterval();
					this.dispatchEvent(new Event('walkend'));
					// next step
					if (Math.abs(d) > 1) this.walk(Math.sign(d) * (Math.abs(d) - 1), true);
					else this.behavior = BehaviorTypes.Idle;
				}, frame);
			} else {
				// 直前のフレームで collided していたオブジェクトを除外
				var e = new Event('collided');
				e.map = mapHit;
				e.hits = hits.filter(function (item) {
					return !this._preventFrameHits || this._preventFrameHits.indexOf(item) < 0;
				}, this);
				e.hit = e.hits.length > 0 ? e.hits[0] : undefined;
				if (e.hit || e.map) {
					var e2 = new Event('collided');
					e2.map = false;
					e2.hits = [e2.hit = this];
					this.setTimeout(function () {
						this.dispatchEvent(e);
						e.hits.forEach(function (item) {
							item.dispatchEvent(e2);
						});
						if (continuous) this.behavior = BehaviorTypes.Idle;
					}, 1);
				}
			}
			this._preventFrameHits = hits;
		},
		velocity: function (x, y) {
			this.velocityX = x;
			this.velocityY = y;
		},
		force: function (x, y) {
			this.accelerationX = x / this.mass;
			this.accelerationY = y / this.mass;
		}
	});

    var __HumanBase = enchant.Class(RPGObject, {
		initialize: function (width, height, offsetX, offsetY) {
			RPGObject.call(this, width, height, offsetX, offsetY);
			var direction = 0;
			Object.defineProperty(this, 'direction', {
				get: function () { return direction; },
				set: function (value) {
					direction = value;
					this.frame = [this.direction * 9 + (this.frame % 9)];
				}
			});
			Object.defineProperty(this, 'forward', {
				get: function () { return Hack.Dir2Vec(direction); },
				set: function (value) { this.direction = Hack.Vec2Dir(value); }
			});
			this.hp = 3;
			this.atk = 1;
		},
		setFrameD9: function (behavior, frame) {
			var array = typeof frame === 'function' ? frame() : frame;

			this.setFrame(behavior, function () {
				var _array = [];
				array.forEach(function (item, index) {
					_array[index] = item !== null && item >= 0 ? item + this.direction * 9 : item;
				}, this);
				return _array;
			});
		},
		turn: function (count) {
			var c = typeof count === 'number' ? count % 4 + 4 : 1;
			var i = [3, 2, 0, 1][this.direction] + c; // direction to turn index
			this.direction = [2, 3, 1, 0][i%4]; // turn index to direction
		}
    });

	var __Player = enchant.Class(HumanBase, {
		initialize: function () {
			HumanBase.call(this, 48, 48, -8, -12);
			this.image = game.assets['enchantjs/x1.5/chara5.png'];
			this.enteredStack = [];
			this.on('enterframe', this.stayCheck);
			this.on('walkend', this.enterCheck);
			this.onbecomedead = function () {
				Hack.gameover();
			};
			this.setFrameD9(BehaviorTypes.Idle, [1]);
			this.setFrameD9(BehaviorTypes.Walk, [0, 0, 0, 1, 1, 1, 2, 2, 2, 1, null]);
			this.setFrameD9(BehaviorTypes.Attack, [6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, null]);
			this.setFrameD9(BehaviorTypes.Damaged, [2, -1, -1, -1, 2, 2, 2, -1, -1, -1]);
			this.setFrameD9(BehaviorTypes.Dead, [1, null]);
		},
		onenterframe: function () {
			if (!(this.behavior & BehaviorTypes.Attack + BehaviorTypes.Walk)) {
				if (game.input.a) {
					this.attack();
				}
			}
			if (!(this.behavior & BehaviorTypes.Walk + BehaviorTypes.Attack)) {
				var hor = game.input.right - game.input.left;
				var ver = hor ? 0 : game.input.down - game.input.up;
				if (hor || ver) {
					// Turn
					this.forward = { x: hor, y: ver };
					this.walk(1);
				}
			}
		},
		enterCheck: function () {
			// Dispatch playerenter Event
			RPGObject.collection.filter(function (item) {
				return item.mapX === this.mapX  && item.mapY === this.mapY;
			}, this).forEach(function (item) {
				item.dispatchEvent(new Event('playerenter'));
				this.enteredStack.push(item);
			}, this);
		},
		stayCheck: function () {
			// Dispatch playerstay/playerexit Event
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
			var direction = -1; // -1: Left, 1: Right
			Object.defineProperty(this, 'direction', {
				get: function () { return direction; },
				set: function (value) { this.scaleX = value === 0 ? this.scaleX :
					-(direction = Math.sign(value)) * Math.abs(this.scaleX); }
			});
			Object.defineProperty(this, 'forward', {
				get: function () { return { x: direction, y: 0 }; },
				set: function (value) { this.direction = value.x; }
			});
			this.hp = 3;
			this.atk = 1;
		},
		turn: function (count) {
			var c = typeof count === 'number' ? Math.ceil( Math.abs(count / 2) ) : 1;
			var i = { '-1': 1, '1': 0 }[this.direction] + c; // direction to turn index
			this.direction = [1, -1, -1, 1][i%2]; // turn index to direction
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
			this.setFrame(BehaviorTypes.Attack, [3,3,3,3,3,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,null]);
			this.setFrame(BehaviorTypes.Damaged, [7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 6]);
			this.setFrame(BehaviorTypes.Dead, [2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, -1, null]);
        }
    });

	var __Boy = enchant.Class(HumanBase, {
        initialize: function(){
			HumanBase.call(this, 48, 48, -8, -18);
			this.image = game.assets['enchantjs/x1.5/chara0.png'];
			var _0 = 0, _1 = _0 + 1, _2 = _0 + 2;
			this.setFrameD9(BehaviorTypes.Idle, [_1]);
			this.setFrameD9(BehaviorTypes.Walk, [_0, _0, _0, _0, _1, _1, _1, _1, _2, _2, _2, _2, _1, _1, _1, null]);
			this.setFrameD9(BehaviorTypes.Attack, [_0, _0, _2, _2, _1, _1, _1, _1, null]);
			this.setFrameD9(BehaviorTypes.Damaged, [_2, -1, -1, -1, _2, _2, _2, -1, -1, -1]);
			this.setFrameD9(BehaviorTypes.Dead, [_1, null]);
        }
    });

	var __Girl = enchant.Class(HumanBase, {
        initialize: function(){
			HumanBase.call(this, 48, 48, -8, -18);
			this.image = game.assets['enchantjs/x1.5/chara0.png'];
			var _0 = 6, _1 = _0 + 1, _2 = _0 + 2;
			this.setFrameD9(BehaviorTypes.Idle, [_1]);
			this.setFrameD9(BehaviorTypes.Walk, [_0, _0, _0, _0, _1, _1, _1, _1, _2, _2, _2, _2, _1, _1, _1, null]);
			this.setFrameD9(BehaviorTypes.Attack, [_0, _0, _2, _2, _1, _1, _1, _1, null]);
			this.setFrameD9(BehaviorTypes.Damaged, [_2, -1, -1, -1, _2, _2, _2, -1, -1, -1]);
			this.setFrameD9(BehaviorTypes.Dead, [_1, null]);
        }
    });

	var __Woman = enchant.Class(HumanBase, {
        initialize: function(){
			HumanBase.call(this, 48, 48, -8, -18);
			this.image = game.assets['enchantjs/x1.5/chara0.png'];
			var _0 = 3, _1 = _0 + 1, _2 = _0 + 2;
			this.setFrameD9(BehaviorTypes.Idle, [_1]);
			this.setFrameD9(BehaviorTypes.Walk, [_0, _0, _0, _0, _1, _1, _1, _1, _2, _2, _2, _2, _1, _1, _1, null]);
			this.setFrameD9(BehaviorTypes.Attack, [_0, _0, _2, _2, _1, _1, _1, _1, null]);
			this.setFrameD9(BehaviorTypes.Damaged, [_2, -1, -1, -1, _2, _2, _2, -1, -1, -1]);
			this.setFrameD9(BehaviorTypes.Dead, [_1, null]);
        }
    });

    var __MapObject = enchant.Class(RPGObject, {
        initialize: function(frame){
            RPGObject.call(this, 32, 32, 0, 0);
            this.image = game.assets['enchantjs/x2/dotmat.gif'];
			if (typeof frame === 'number') {
				this.frame = frame;
			} else if (MapObject.dictionary && MapObject.dictionary[frame]) {
				this.frame = MapObject.dictionary[frame];
			}
        },
        onenterframe: function(){

        }
    });

	var __Effect = enchant.Class(RPGObject, {
		initialize: function (velocityX, velocityY, lifetime, randomize) {
			RPGObject.call(this, 32, 32, 0, 0);
			this.image = game.assets['enchantjs/x2/effect0.png'];
			this.isKinematic = false;
			this.velocity(velocityX, velocityY);
			var frame = new Array(lifetime);
			for (var i = frame.length - 1; i >= 0; i--) {
				frame[i] = (i / lifetime * 5) >> 0;
			}
			this.frame = frame;
			this.destroy(frame.length);
			if (randomize) {
				this._random = {
					x: velocityX * 10 * Math.random(),
					y: velocityY * 10 * Math.random()
				};
				this.velocityX *= 0.5 + Math.random();
				this.velocityY *= 0.5 + Math.random();
			}
			if (Effect.lastNode && Effect.lastNode.parentNode === this.parentNode){
				this.destroy();
				Effect.lastNode.parentNode.insertBefore(this, Effect.lastNode);
			}
			Effect.lastNode = this;
		},
		locate: function (left, top) {
			RPGObject.prototype.locate.call(this, left, top);
			if (this._random) {
				this.moveBy(this._random.x, this._random.y);
			}
		}
	});

	game.on('enterframe', function() {
		var frame = game.collisionFrames || 10;
		var physicsPhantom = RPGObject.collection.filter(function (item) {
			return !item.isKinematic && !item.collisionFlag;
		});
		var physicsCollision = RPGObject.collection.filter(function (item) {
			return !item.isKinematic && item.collisionFlag;
		});

		__physicsUpdateOnFrame(1, 1, physicsPhantom);
		for (var tick = 1; tick <= frame; tick++) {
			__physicsUpdateOnFrame(tick, frame, physicsCollision);
		}
	});
	function __physicsUpdateOnFrame (tick, frame, physics) {
		physics.map(function (self, index) {
			// Physical Update
			self.velocityX += self.accelerationX / frame;
			self.velocityY += self.accelerationY / frame;
			self.x += self.velocityX / frame;
			self.y += self.velocityY / frame;
			// Intersects
			var intersects = self.intersect(RPGObject);
			intersects.splice(intersects.indexOf(self), 1); // ignore self
			// Dispatch trigger(stay|exit) event
			(self._preventFrameHits || []).filter(function (item) {
				return item.isKinematic;
			}).forEach(function (item) {
				if (intersects.indexOf(item) < 0) {
					dispatchTriggerEvent('exit', self, item);
					dispatchTriggerEvent('exit', item, self);
				} else if (tick === frame　&& !item.collisionFlag && !self.collisionFlag) {
					dispatchTriggerEvent('stay', self, item);
					dispatchTriggerEvent('stay', item, self);
				}
			});
			// Intersect on time (enter) or still intersect
			var entered = intersects.filter(function (item) {
				return !self._preventFrameHits || self._preventFrameHits.indexOf(item) < 0;
			});
			self._preventFrameHits = intersects; // Update cache
			// Dispatch triggerenter event
			entered.filter(function (item) {
				return item.isKinematic;
			}).forEach(function (item) {
				dispatchTriggerEvent('enter', self, item);
				dispatchTriggerEvent('enter', item, self);
			});
			return {
				self: self,
				hits: entered.filter(function (item) {
					return !item.isKinematic && item.collisionFlag;
				})
			};
		}).filter(function (item) {
			// ===> Physics collision
			return item.self.collisionFlag;
		}).filter(function (item) {
			var self = item.self;
			var event = item.event = new Event('collided');
			var hits = event.hits = item.hits;
			var calc = item.calc = { x: self.x, y: self.y, vx: self.velocityX, vy: self.velocityY };
			if (hits.length > 0) {
				// Hit objects
				event.hit = hits[0];
				var m1 = self.mass, m2 = hits[0].mass;
				calc.vx = ((m1 - m2) * self.velocityX + 2 * m2 * hits[0].velocityX) / (m1 + m2);
				calc.vy = ((m1 - m2) * self.velocityY + 2 * m2 * hits[0].velocityY) / (m1 + m2);
				event.map = false;
			} else {
				// Hit map
				var mapHitX = (self.velocityX < 0 && self.x <= 0 ||
					self.velocityX > 0 && self.x + self.width >= game.width),
				mapHitY = (self.velocityY < 0 && self.y <= 0 ||
					self.velocityY > 0 && self.y + self.height >= game.height);
				calc.x = mapHitX ? Math.max(0, Math.min(game.width - self.width, self.x)) : self.x;
				calc.y = mapHitX ? Math.max(0, Math.min(game.height - self.height, self.y)) : self.y;
				calc.vx = (mapHitX ? -1 : 1) * self.velocityX;
				calc.vy = (mapHitY ? -1 : 1) * self.velocityY;
				event.map = mapHitX || mapHitY;
			}
			return event.map || hits.length > 0;
		}).filter(function (item) {
			var self = item.self;
			var calc = item.calc;
			self.x = calc.x;
			self.y = calc.y;
			self.velocityX = calc.vx;
			self.velocityY = calc.vy;
			return true;
		}).forEach(function (obj) {
			obj.self.dispatchEvent(obj.event);
		});
		function dispatchTriggerEvent (type, self, hit) {
			var event = new Event('trigger' + type);
			event.hit = hit;
			event.mapX = hit.mapX;
			event.mapY = hit.mapY;
			self.dispatchEvent(event);
		}
    }
});