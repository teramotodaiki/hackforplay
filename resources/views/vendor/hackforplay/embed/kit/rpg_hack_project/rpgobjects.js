// Module check
(function (mod) {
	if (typeof define === "function" && define.amd) {
		define(function (require, exports, module) {

			require('enchantjs/enchant');
			require('enchantjs/ui.enchant');
			require('hackforplay/hack');
			mod();

		});
	} else {
		window.addEventListener('load', mod);
	}
})(function () {

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
	Hack.assets = Hack.assets || {};

	// [注意] BehaviorTypesは排他的なプロパティになりました
	var __BehaviorTypes = {
		None :    null,  // 無状態 (デフォルトではEventは発火されません)[deprecated]
		Idle :		'idle',	// 立ち状態
		Walk :		'walk',	// 歩き状態
		Attack :	'attack',	// 攻撃状態
		Damaged :	undefined,	// 被撃状態[deprecated]
		Dead :		'dead'	// 死亡状態
	};

	var __RPGObject = enchant.Class(enchant.Sprite, {
		initialize: function (width, height, offsetX, offsetY) {
			Sprite.call(this, width, height);
			this.offset = { x: offsetX, y: offsetY };
			this.moveTo(game.width, game.height);
			Object.defineProperty(this, 'mapX', {
				configurable: true, enumerable: true,
				get: function () { return (this.x - this.offset.x + 16) / 32 >> 0; }
			});
			Object.defineProperty(this, 'mapY', {
				configurable: true, enumerable: true,
				get: function () { return (this.y - this.offset.y + 16) / 32 >> 0; }
			});
			Object.defineProperty(this, 'map', {
				configurable: true, enumerable: true,
				get: function () {
					return this.parentNode ? this.parentNode.ref : null;
				}
			});
			var collisionFlag = null; // this.collisionFlag (Default:true)
			Object.defineProperty(this, 'collisionFlag', {
				configurable: true, enumerable: true,
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
				configurable: true, enumerable: true,
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
			this.on('hpchange', function () {
				if (this.hp <= 0) {
					this.behavior = BehaviorTypes.Dead;
				}
			});

			// direction
			this._forward = { x: 0, y: 0 };
			this.directionType = null;
			Object.defineProperty(this, 'direction', {
				configurable: true, enumerable: true,
				get: this.getDirection, set: this.setDirection
			});
			Object.defineProperty(this, 'forward', {
				configurable: true, enumerable: true,
				get: this.getForward, set: this.setForward
			});

			// 初期化
			this.velocityX = this.velocityY = this.accelerationX = this.accelerationY = 0;
			this.mass = 1;
			this.damageTime = 0;
			this.attackedDamageTime = 30; // * 1/30sec
			this.hpchangeFlag = false;
			this.on('enterframe', this.geneticUpdate);
			this.getFrameOfBehavior = {}; // BehaviorTypesをキーとしたgetterのオブジェクト
			this.behavior = BehaviorTypes.Idle; // call this.onbecomeidle
			this._layer = RPGMap.Layer.Middle;

			Hack.defaultParentNode.addChild(this);
		},
		geneticUpdate: function () {
			if (!Hack.isPlaying) return;
			// enter frame
			if (typeof this.hp === 'number') {
				this.damageTime = Math.max(0, this.damageTime - 1);
				if (this.damageTime > 0) {
					this.opacity = (this.damageTime / 2 + 1 | 0) % 2; // 点滅
				}
			}
			if (this.hpchangeFlag) {
				this.dispatchEvent(new Event('hpchange'));
				this.hpchangeFlag = false;
			}
			if (this.isBehaviorChanged) {
				// begin animation
				var routine = this.getFrameOfBehavior[this.behavior];
				if (routine) this.frame = routine.call(this);
				// becomeイベント内でbehaviorが変更された場合、
				// 次のフレームで１度だけbecomeイベントが発火します。
				this.isBehaviorChanged = false;
				this.dispatchEvent(new Event('become' + this.behavior));
			}
		},
		locate: function (fromLeft, fromTop, mapName) {
			if (mapName in Hack.maps &&
						Hack.maps[mapName] instanceof RPGMap &&
							this.map !== Hack.maps[mapName]) {
				this.destroy();
				Hack.maps[mapName].scene.addChild(this);
			}
			this.moveTo(
				fromLeft * 32 + this.offset.x,
				fromTop * 32 + this.offset.y);
		},
		destroy: function (delay) {
			if (delay > 0) this.setTimeout(_remove.bind(this), delay);
			else _remove.call(this);
			function _remove () {
				this.remove();
				if (this.shadow) this.shadow.remove();
			}
		},
		setFrame: function (behavior, frame) {
			// behavior is Type:string
			// frame is Frames:array or Getter:function
			(function (_local) {
				if (typeof frame === 'function') {
					this.getFrameOfBehavior[behavior] = _local;
				} else {
					this.getFrameOfBehavior[behavior] = function () {
						return _local;
					};
				}
			}).call(this, frame);
		},
		getFrame: function () {
			if (this.getFrameOfBehavior[this.behavior] instanceof Function) {
				return this.getFrameOfBehavior[this.behavior].call(this);
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
		attack: function () {
			if (this.behavior !== BehaviorTypes.Idle || !Hack.isPlaying) return;
			var f = this.forward;
			this.behavior = BehaviorTypes.Attack;
			Hack.Attack.call(this, this.mapX + f.x, this.mapY + f.y, this.atk, f.x, f.y);
			this.setTimeout(function () {
				this.behavior = BehaviorTypes.Idle;
			}, this.getFrame().length);
		},
		onattacked: function (event) {
			if (!this.damageTime && typeof this.hp === 'number') {
				this.damageTime = this.attackedDamageTime;
				this.hp -= event.damage;
			}
		},
		walk: function (distance, continuous) {
			if (!this.isKinematic || !continuous && this.behavior !== BehaviorTypes.Idle || !Hack.isPlaying) return;
			this.behavior = BehaviorTypes.Walk;
			var f = this.forward, d = typeof distance === 'number' ? distance >> 0 : 1, s = Math.sign(d);
			var _x = this.mapX + f.x * s, _y = this.mapY + f.y * s, tw = Hack.map.tileWidth, th = Hack.map.tileHeight;
			// Map Collision
			var mapR = Hack.map.width / tw - 1, mapB = Hack.map.height / th - 1;
			var mapHit = Hack.map.hitTest(_x * tw, _y * th) || 0 > _x || _x > mapR || 0 > _y || _y > mapB;
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
				var move = { x: Math.round(f.x * tw * s), y: Math.round(f.y * th * s) };
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
				}, frame - 1);
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
					this.dispatchEvent(e);
					e.hits.forEach(function (item) {
						item.dispatchEvent(e2);
					});
				}
				this.behavior = BehaviorTypes.Idle;
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
		},
		hp: {
			get: function () {
				return this._hp;
			},
			set: function (value) {
				if (typeof value === 'number' && value !== NaN && value !== this._hp) {
					this.hpchangeFlag = true;
					this._hp = value;
				}
			}
		},
		behavior: {
			get: function () { return this._behavior; },
			set: function (value) {
				if (typeof value === 'string') {
					this.isBehaviorChanged = true;
					this._behavior = value;
				}
			}
		},
		layer: {
			get: function () { return this._layer; },
			set: function (value) {
				if (this === Hack.player) return this._layer; // プレイヤーのレイヤー移動を禁止
				if (value === this._layer) return this._layer;

				// Range of layer
				var sortingOrder = Object.keys(RPGMap.Layer).map(function (key) {
					return RPGMap.Layer[key];
				});
				var max = Math.max.apply(null, sortingOrder);
				var min = Math.min.apply(null, sortingOrder);
				this._layer = Math.max(Math.min(value, max), min);

				// 他オブジェクトはプレイヤーレイヤーに干渉できないようにする
				if (this._layer === RPGMap.Layer.Player) {
					switch (Math.sign(value - this._layer)) {
						case 1: return this.bringOver();
						case -1: return this.bringUnder();
						default: break;
					}
				}

				this.map.layerChangeFlag = true; // レイヤーをソートする
			}
		},
		bringOver: function () {
			// 現在のレイヤーより大きいレイヤーのうち最も小さいもの
			var uppers = Object.keys(RPGMap.Layer).map(function (key) {
				return RPGMap.Layer[key];
			}, this).filter(function (layer) {
				return layer > this.layer;
			}, this);
			this.layer = uppers.length > 0 ? Math.min.apply(null, uppers) : this.layer;
			return this.layer;
		},
		bringUnder: function () {
			// 現在のレイヤーより小さいレイヤーのうち最も大きいもの
			var unders = Object.keys(RPGMap.Layer).map(function (key) {
				return RPGMap.Layer[key];
			}, this).filter(function (layer) {
				return layer < this.layer;
			}, this);
			this.layer = unders.length > 0 ? Math.max.apply(null, unders) : this.layer;
			return this.layer;
		},
		shoot: function (node, vector, speed) {
			node.collisionFlag = false;

			// 置くだけ
			if (arguments.length === 1) {
				return node.locate(this.mapX, this.mapY);
			}

			// 配列ならベクトル化
			if (Array.isArray(vector)) {
				vector = { x: vector[0], y: vector[1] };
			}

			// 正規化
			var length = Math.pow(vector.x, 2) + Math.pow(vector.y, 2);
			if (length > 0) length = 1 / length;
			vector = {
				x : vector.x * length,
				y : vector.y * length
			};

			node.locate(Math.round(this.mapX + vector.x), Math.round(this.mapY + vector.y));

			// 速度をかける
			speed = arguments.length < 3 ? 1 : speed;
			vector.x *= speed;
			vector.y *= speed;
			node.velocity(vector.x, vector.y);

			var angle = 0;

			// 対象が MapObject かつベクトルの長さが 0.0 より大きいなら
			if (node instanceof MapObject && !(vector.x === 0 && vector.y === 0)) {
				angle = 90 - Math.atan2(-vector.y, vector.x) * 180 / Math.PI;
			}

			// 速度がマイナスなら角度はそのままにする
			if (speed < 0) angle += 180;

			node._rotation = angle;

			return this;
		},
		mod: function (func) {
			func.call(this);
		},
		getForward: function () {
			return { x: this._forward.x, y: this._forward.y };
		},
		setForward: function (value) {
			var vec =
				value instanceof Array ? { x: value[0], y: value[1] } :
				'x' in value && 'y' in value ? { x: value.x, y: value.y } :
				this._forward;
			var norm = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
			if (norm > 0) {
				this._forward = { x: vec.x / norm, y: vec.y / norm };
			}
			switch (this.directionType) {
				case 'single':
					var rad = Math.atan2(this._forward.y, this._forward.x);
					var enchantRot = rad / Math.PI * 180 + 90; // 基準は上,時計回りの度数法
					this.rotation = (enchantRot + 360) % 360;
					break;
				case 'double':
					if (this._forward.x !== 0) {
						this.scaleX = -Math.sign(this._forward.x) * Math.abs(this.scaleX);
					}
					break;
				case 'quadruple':
					var dir = Hack.Vec2Dir(this._forward);
					this.frame = [dir * 9 + (this.frame % 9)];
					break;
			}
		},
		getDirection: function () {
			switch (this.directionType) {
				case 'double':
					return this.forward.x;
				case 'quadruple':
					return Hack.Vec2Dir(this.forward);
			}
		},
		setDirection: function (value) {
			switch (this.directionType) {
				case 'double':
					this.forward = [Math.sign(value) || -1, 0];
					return;
				case 'quadruple':
					this.forward = Hack.Dir2Vec(value);
					break;
			}
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
			var c, i;
			switch (this.directionType) {
				case 'double':
					c = typeof count === 'number' ? Math.ceil( Math.abs(count / 2) ) : 1;
					i = { '-1': 1, '1': 0 }[this.direction] + c; // direction to turn index
					this.direction = [1, -1, -1, 1][i%2]; // turn index to direction
					break;
				case 'quadruple':
					c = typeof count === 'number' ? count % 4 + 4 : 1;
					i = [3, 2, 0, 1][this.direction] + c; // direction to turn index
					this.direction = [2, 3, 1, 0][i%4]; // turn index to direction
					break;
			}
		}

	});

  var __HumanBase = enchant.Class(RPGObject, {
		initialize: function (width, height, offsetX, offsetY) {
			RPGObject.call(this, width, height, offsetX, offsetY);
			this.hp = 3;
			this.atk = 1;

			this.directionType = 'quadruple';
			this.forward = [0, 1];
		}
  });

	Hack.assets.knight = function () {
		this.image = game.assets['enchantjs/x1.5/chara5.png'];
		this.width = 48; this.height = 48; this.offset = { x: -8, y: -12 };
		this.setFrameD9(BehaviorTypes.Idle, [1]);
		this.setFrameD9(BehaviorTypes.Walk, [0, 0, 0, 1, 1, 1, 2, 2, 2, 1, null]);
		this.setFrameD9(BehaviorTypes.Attack, [6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, null]);
		this.setFrameD9(BehaviorTypes.Damaged, [2, -1, -1, -1, 2, 2, 2, -1, -1, -1]);
		this.setFrameD9(BehaviorTypes.Dead, [1, null]);
		this.directionType = 'quadruple';
		this.forward = [0, 1];
	};
	Hack.assets.darkKnight = function () {
		this.image = game.assets['enchantjs/x1.5/chara7.png'];
	};
	var __Player = enchant.Class(RPGObject, {
		initialize: function () {
			RPGObject.call(this);
			this.mod(Hack.assets.knight);

			this.enteredStack = [];
			this.on('enterframe', this.stayCheck);
			this.on('walkend', this.enterCheck);
			this._layer = RPGMap.Layer.Player;

			this.hp = 3; this.atk = 1;
		},
		onenterframe: function () {
			if (!Hack.isPlaying) return;
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
					this.forward = [hor, ver];
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

			this.directionType = 'double';
			this.forward = [-1, 0];
			this.hp = 3;
			this.atk = 1;
		}
	});

	Hack.assets.slime = function () {
		this.image = game.assets['enchantjs/monster4.gif'];
		this.width = 48; this.height = 48; this.offset = { x: -8, y: -10 };
		this.setFrame(BehaviorTypes.Idle, [2, 2, 2, 2, 3, 3, 3, 3]);
		this.setFrame(BehaviorTypes.Walk, [2, 2, 2, 2, 3, 3, 3, 3]);
		this.setFrame(BehaviorTypes.Attack, [6, 6, 6, 6, 4, 4, 4, 4, 5, 5, 5, 5, 4, 4, 4, 4, null]);
		this.setFrame(BehaviorTypes.Damaged, [4, 4, 4, 4, 5, 5, 5, 5]);
		this.setFrame(BehaviorTypes.Dead, [5, 5, 5, 5, 7, 7, 7, null]);
		this.directionType = 'double';
		this.forward = [-1, 0];
	};
	var __BlueSlime = enchant.Class(RPGObject, {
    initialize: function(){
			RPGObject.call(this);
			this.mod(Hack.assets.slime);
			this.hp = 3; this.atk = 1;
    }
  });

	Hack.assets.insect = function () {
		this.image = game.assets['enchantjs/monster1.gif'];
		this.width = 48; this.height = 48; this.offset = { x: -8, y: -16 };
		this.setFrame(BehaviorTypes.Idle, [2, 2, 2, 2, 3, 3, 3, 3]);
		this.setFrame(BehaviorTypes.Walk, [2, 2, 2, 2, 3, 3, 3, 3]);
		this.setFrame(BehaviorTypes.Attack, [7, 7, 7, 6, 6, 6, 6, 6, 5, 5, 5, 5, 4, 4, 4, 4, null]);
		this.setFrame(BehaviorTypes.Damaged, [4, 4, 4, 4, 5, 5, 5, 5]);
		this.setFrame(BehaviorTypes.Dead, [5, 5, 5, 5, 7, 7, 7, null]);
		this.directionType = 'double';
		this.forward = [-1, 0];
	};
	var __Insect = enchant.Class(RPGObject, {
    initialize: function(){
			RPGObject.call(this);
			this.mod(Hack.assets.insect);
			this.hp = 3; this.atk = 1;
    }
  });

	Hack.assets.spider = function () {
		this.image = game.assets['enchantjs/monster2.gif'];
		this.width = 64; this.height = 64; this.offset = { x: -16, y: -24 };
		this.setFrame(BehaviorTypes.Idle, [2, 2, 2, 2, 3, 3, 3, 3]);
		this.setFrame(BehaviorTypes.Walk, [2, 2, 2, 2, 3, 3, 3, 3]);
		this.setFrame(BehaviorTypes.Attack, [6, 6, 6, 7, 7, 7, 7, 7, 5, 5, 5, 5, 4, 4, 4, 4, null]);
		this.setFrame(BehaviorTypes.Damaged, [4, 4, 4, 4, 5, 5, 5, 5]);
		this.setFrame(BehaviorTypes.Dead, [5, 5, 5, 5, 7, 7, 7, null]);
		this.directionType = 'double';
		this.forward = [-1, 0];
	};
	var __Spider = enchant.Class(RPGObject, {
    initialize: function(){
			RPGObject.call(this);
			this.mod(Hack.assets.spider);
			this.hp = 3; this.atk = 1;
    }
  });

	Hack.assets.bat = function () {
		this.image = game.assets['enchantjs/monster3.gif'];
		this.width = 48; this.height = 48; this.offset = { x: -8, y: -18 };
		this.setFrame(BehaviorTypes.Idle, [2, 2, 2, 2, 3, 3, 3, 3]);
		this.setFrame(BehaviorTypes.Walk, [2, 2, 2, 4, 4, 4, 4, 4, 3, 3, 3, 3]);
		this.setFrame(BehaviorTypes.Attack, [9, 9, 9, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 3, 3, 4, 4, 4, 4, null]);
		this.setFrame(BehaviorTypes.Damaged, [4, 4, 4, 4, 5, 5, 5, 5]);
		this.setFrame(BehaviorTypes.Dead, [5, 5, 5, 5, 7, 7, 7, null]);
		this.directionType = 'double';
		this.forward = [-1, 0];
	};
	Hack.assets.shadowMod = function () {
		// shadow
		this.shadow = this.shadow || new Sprite(32, 32);
		this.shadow.ref = this;
		this.shadow.layer = RPGMap.Layer.Shadow;
		this.shadow.image = game.assets['enchantjs/shadow.gif'];
		this.shadow.offset = { x: (this.width-this.shadow.width)/2, y: this.height-this.shadow.height };
		this.shadow.scale(this.width/64, this.height/64);
		this.parentNode.addChild(this.shadow);
		this.map.layerChangeFlag = true;
		this.on('added', function () {
			this.parentNode.addChild(this.shadow);
			this.map.layerChangeFlag = true;
		});
		this.shadow.on('enterframe', function () {
			var o = this.offset;
			this.moveTo(this.ref.x + o.x, this.ref.y + o.y);
		});
	};
	var __Bat = enchant.Class(RPGObject, {
    initialize: function(){
			RPGObject.call(this);
			this.mod(Hack.assets.bat);
			this.mod(Hack.assets.shadowMod);
			this.hp = 3; this.atk = 1;
    }
  });

	Hack.assets.dragon = function () {
		this.image = game.assets['enchantjs/bigmonster1.gif'];
		this.width = 80; this.height = 80; this.offset = { x: -24, y: -42 };
		this.setFrame(BehaviorTypes.Idle, [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
		this.setFrame(BehaviorTypes.Walk, [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3]);
		this.setFrame(BehaviorTypes.Attack, [8, 8, 8, 8, 8, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, null]);
		this.setFrame(BehaviorTypes.Damaged, [4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5]);
		this.setFrame(BehaviorTypes.Dead, [2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, null]);
		this.directionType = 'double';
		this.forward = [-1, 0];
	};
	var __Dragon = enchant.Class(RPGObject, {
    initialize: function(){
			RPGObject.call(this);
			this.mod(Hack.assets.dragon);
			this.hp = 3; this.atk = 1;
    }
  });

	Hack.assets.minotaur = function () {
		this.image = game.assets['enchantjs/bigmonster2.gif'];
		this.width = 80; this.height = 80; this.offset = { x: -40, y: -48 };
		this.setFrame(BehaviorTypes.Idle, [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]);
		this.setFrame(BehaviorTypes.Walk, [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3]);
		this.setFrame(BehaviorTypes.Attack, [3,3,3,3,3,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,null]);
		this.setFrame(BehaviorTypes.Damaged, [7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 6]);
		this.setFrame(BehaviorTypes.Dead, [2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, null]);
	};
	var __Minotaur = enchant.Class(RPGObject, {
	  initialize: function(){
			RPGObject.call(this);
			this.mod(Hack.assets.minotaur);
			this.hp = 3; this.atk = 1;
    }
  });

	Hack.assets.boy = function () {
		this.image = game.assets['enchantjs/x1.5/chara0.png'];
		this.width = 48; this.height = 48; this.offset = { x: -8, y: -18 };
		var _0 = 0, _1 = _0 + 1, _2 = _0 + 2;
		this.setFrameD9(BehaviorTypes.Idle, [_1]);
		this.setFrameD9(BehaviorTypes.Walk, [_0, _0, _0, _0, _1, _1, _1, _1, _2, _2, _2, _2, _1, _1, _1, null]);
		this.setFrameD9(BehaviorTypes.Attack, [_0, _0, _2, _2, _1, _1, _1, _1, null]);
		this.setFrameD9(BehaviorTypes.Damaged, [_2, -1, -1, -1, _2, _2, _2, -1, -1, -1]);
		this.setFrameD9(BehaviorTypes.Dead, [_1, null]);
		this.directionType = 'quadruple';
		this.forward = [0, 1];
	};
	var __Boy = enchant.Class(RPGObject, {
    initialize: function(){
			RPGObject.call(this);
			this.mod(Hack.assets.boy);
			this.hp = 3; this.atk = 1;
    }
	});

	Hack.assets.girl = function () {
		this.image = game.assets['enchantjs/x1.5/chara0.png'];
		this.width = 48; this.height = 48; this.offset = { x: -8, y: -18 };
		var _0 = 0, _1 = _0 + 1, _2 = _0 + 2;
		this.setFrameD9(BehaviorTypes.Idle, [_1]);
		this.setFrameD9(BehaviorTypes.Walk, [_0, _0, _0, _0, _1, _1, _1, _1, _2, _2, _2, _2, _1, _1, _1, null]);
		this.setFrameD9(BehaviorTypes.Attack, [_0, _0, _2, _2, _1, _1, _1, _1, null]);
		this.setFrameD9(BehaviorTypes.Damaged, [_2, -1, -1, -1, _2, _2, _2, -1, -1, -1]);
		this.setFrameD9(BehaviorTypes.Dead, [_1, null]);
		this.directionType = 'quadruple';
		this.forward = [0, 1];
	};
	var __Girl = enchant.Class(RPGObject, {
	  initialize: function(){
			RPGObject.call(this);
			this.mod(Hack.assets.girl);
			this.hp = 3; this.atk = 1;
    }
  });

	Hack.assets.woman = function () {
		this.image = game.assets['enchantjs/x1.5/chara0.png'];
		this.width = 48; this.height = 48; this.offset = { x: -8, y: -18 };
		var _0 = 3, _1 = _0 + 1, _2 = _0 + 2;
		this.setFrameD9(BehaviorTypes.Idle, [_1]);
		this.setFrameD9(BehaviorTypes.Walk, [_0, _0, _0, _0, _1, _1, _1, _1, _2, _2, _2, _2, _1, _1, _1, null]);
		this.setFrameD9(BehaviorTypes.Attack, [_0, _0, _2, _2, _1, _1, _1, _1, null]);
		this.setFrameD9(BehaviorTypes.Damaged, [_2, -1, -1, -1, _2, _2, _2, -1, -1, -1]);
		this.setFrameD9(BehaviorTypes.Dead, [_1, null]);
		this.directionType = 'quadruple';
		this.forward = [0, 1];
	};
	var __Woman = enchant.Class(RPGObject, {
    initialize: function(){
			RPGObject.call(this);
			this.mod(Hack.assets.woman);
			this.hp = 3; this.atk = 1;
    }
	});

  var __MapObject = enchant.Class(RPGObject, {
		initialize: function(value){
		  RPGObject.call(this, 32, 32, 0, 0);
		  this.image = game.assets['enchantjs/x2/dotmat.gif'];
			if (typeof value === 'number') {
				this.frame = value;
			} else {
				this.name = value;
			}
			this.directionType = 'single';
			this.forward = [0, -1];
		},
		name: {
			get: function () {
				var search = '';
				Object.keys(MapObject.dictionary).forEach(function (key) {
					if (MapObject.dictionary[key] === this.frame) {
						search = key;
					}
				}, this);
				return search;
			},
			set: function (key) {
				if (MapObject.dictionary.hasOwnProperty(key)) {
					this.frame = MapObject.dictionary[key];
				}
			}
		},
    onenterframe: function(){

    }
  });

	Hack.assets.enchantBookItem = function () {
		this.image = game.assets['hackforplay/madosyo_small.png'];
		this.width = 32; this.height = 32; this.offset = { x: 0, y: 0 };
		this.directionType = 'single';
		this.forward = [0, -1];
	};

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
		locate: function (left, top, effect) {
			RPGObject.prototype.locate.call(this, left, top, effect);
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
