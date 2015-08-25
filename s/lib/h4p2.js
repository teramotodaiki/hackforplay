/*
 * h4p2.js
 * hackforplay2の基盤。基本的には書き換えない。
 * ただし、汎用的に必要だと認められるコードはh4p2.jsに移す。
 */

enchant();
var game, maps = [], env = {};
window.addEventListener('load', function(){
	game = new Core(480, 320);
	game.fps = 15;
    game.preload ('img/map_lizzy.png', 'img/chara0.png', 'img/pc.gif', 'img/close.png', 'img/clear.png', 'img/dot_syuj.png','img/chara5.png', 'img/map1.gif', 'img/gameover.png', 'img/enchantbook.png', 'img/icon0.png', 'img/button_retry.png', 'hackforplay/menu-button-menu.png', 'hackforplay/menu-button-restage.png', 'hackforplay/menu-button-hint.png', 'hackforplay/menu-button-comment.png', 'hackforplay/menu-button-retry.png');
    // game.keybind(" ".charCodeAt(0), 'b'); // bボタンはスペースキー
    game.keybind(" ".charCodeAt(0), 'a'); // aボタンはスペースキー

    loadMap();
});

// IE9-10対応
if(!Object.__defineGetter__ && Object.defineProperty) {
    Object.defineProperty(Object.prototype, "__defineGetter__", {
        enumerable: false, configurable: true, value: function(name, func){
            Object.defineProperty(this, name, {
                get: func, enumerable: true, configurable: true
            });
        }
    });
    Object.defineProperty(Object.prototype, "__defineSetter__", {
        enumerable: false, configurable: true, value: function(name, func){
            Object.defineProperty(this, name, {
                set: func, enumerable: true, configurable: true
            });
        }
    });
}

/*
	エクストラステージ「エナムレーション」
*/
var BehaviorTypes = {// 状態の定義
    Idle : 0,       // 立ち状態
    Walk : 1,       // 歩き状態
    Attack : 2,     // 攻撃状態
    Damaged : 3,    // 被撃状態
    Dead : 4        // 死亡状態
};

/*
    エクストラステージ「グローバルメソッド」
*/

/*  Attack(positionX, positionY, damage)
    そのマップ位置にいるBehaviourに対してダメージを与える
*/
function Attack (_x, _y, _damage, _effect) {
    if(_x === undefined || _y === undefined){
        console.error("HackforPlay Error: function Attack() requires 3 arguments like Attack(x, y, damage (, effect));");
    }
    var collider = {
        x: parseInt(_x) * 32,
        y: parseInt(_y) * 32,
        width: 32,
        height: 32
    };
    // Attacking process
    var damage = _damage === undefined ? 1 : _damage;
    env.map.scene.childNodes.forEach(function(item){
        if(item.damage !== undefined){
            if(item.intersect !== undefined && item.intersect(collider)){ // collision detection
                item.damage(damage); // attack!!
            }
        }
    });
    // effect
    if(_effect !== undefined && _effect instanceof Behaviour){
        _effect.locate(_x, _y);
    }
}
/*  Dir2Vec
    directionをforwardに変換する。 0/down, 1/left, 2/right, 3/up
*/
function Dir2Vec (dir) {
    switch(dir){
        case 0: return { x: 0, y: 1 };
        case 1: return { x:-1, y: 0 };
        case 2: return { x: 1, y: 0 };
        case 3: return { x: 0, y:-1 };
        default: return null;
    }
}
/*  Vec2Dir
    forwardをdirectionに変換する。およそのベクトルをまるめて近い向きに直す
*/
function Vec2Dir (vec) {
    if(vec.x === undefined || vec.y === undefined){ return null; }
    if(vec.x === 0 && vec.y === 0){ return null; }
    var deg = Math.atan2(vec.y, vec.x) / Math.PI * 180;
    if(-135 <= deg && deg <= -45){ return 3; } // up
    if( -45 <= deg && deg <=  45){ return 2; } // right
    if(  45 <= deg && deg <= 135){ return 0; } // down
    return 1; // left
}
/*
	エクストラステージ「コンストラクタ」
*/
// var behaviours = [];
var Behaviour = enchant.Class.create(enchant.Group, {
    initialize: function(obj){
        // behaviours.push(this);
        enchant.Group.call(this);
        // プライベート変数
        var namae = obj.namae;
        // プロパティ
        this.kokoro = "なにも　わからなかった"; // miru()したときの内容（これはデフォルト）
        this.useMessage     = true; // プレイヤーがふれたとき、メッセージを出すかどうか
        this.collisionFlag  = true; // プレイヤーがぶつかるかどうか
        this.message = "";          // 出現するメッセージの内容（getterにして関数呼び出しさせるなど。）
        this.radius = 32;               // 吹き出しが出現する範囲
        this.hp     = 10; // HP
        this.atk    = 1; // 攻撃力
        // スプライト（当たり判定などに影響する、もっとも大事な要素）
        if(obj.width === undefined) obj.width = 32;     // デフォルト
        if(obj.height === undefined) obj.height = 32;
        if(obj.dx === undefined) obj.dx = 0;
        if(obj.dy === undefined) obj.dy = 0;
        this.sprite = new Sprite(obj.width, obj.height);        // スプライト（キャラの画像）
        if(obj.draw === undefined) this.sprite.image = game.assets[obj.image];
        else this.spriteAsTiles(game.assets[obj.image], obj.draw);  // sprite.frameと同じ設定（配列も指定可）
        this.sprite.moveTo(obj.dx, obj.dy);
        this.addChild(this.sprite);
        // その他の要素
        this.balloon = new Label("？");
        this.balloon.textAlign = "center";
        this.balloon.opacity = 0;
        this.addChild(this.balloon);
        this.balloon.moveTo((obj.width-this.balloon.width)/2+obj.dx, -this.balloon.height+obj.dy);
        // setter/getter
        this.__defineGetter__('namae',      function(){ if(this.useMessage) return namae; else return null; });
        this.__defineGetter__('center',     function(){ var s = this.sprite;
                                                return { x: this.x + s.x + s.width / 2, y: this.y + s.y + s.height / 2 }; });
        var collider = new Entity();        // あたり判定（相対位置とサイズを持つ空のエンティティ）
        this.addChild(collider);
        collider.moveBy(obj.dx, obj.dy);    // デフォルトのあたり判定（スプライトと同じ）
        collider.width = obj.width;
        collider.height = obj.height;
        this.__defineGetter__('collider',   function(){ return collider; });
        this.__defineSetter__('collider',   function(a){ collider.x = a.x; collider.y = a.y;
                                                collider.width=a.width; collider.height=a.height; });
        this.__defineGetter__('width',      function(){ return collider.width; }); // widthはコライダの幅を返す
        this.__defineSetter__('width',      function(a){ var w = collider.width; // コライダは中央寄せ.スプライトも倍率拡大
            if (w===0) { collider.width = this.sprite.width = a; }
            else if (this.sprite.width===0) { collider.width = a; }
            else { collider.x += (w-a)/2; collider.width = a; this.sprite.scaleX *= collider.width/w; } });
        this.__defineGetter__('height',      function(){ return collider.height; }); // heightはコライダの高さを返す
        this.__defineSetter__('height',      function(a){ var h = collider.height; // コライダは中央寄せ.スプライトも倍率拡大
            if (h===0) { collider.height = this.sprite.height = a; }
            else if (this.sprite.height===0) { collider.height = a; }
            else { collider.y += (h-a)/2; collider.height = a; this.sprite.scaleY *= collider.height/h; } });
        // direction/forward 0/down, 1/left, 2/right, 3/up
        var direction = 0;
        this.__defineGetter__('direction',  function(){ return direction; });
        this.__defineSetter__('direction',  function(d){
            if(0 <= d && d < 4){ direction = parseInt(d); }
            else{ console.error("HackforPlay Error: Behaviour.direction can be set 0, 1, 2 or 3."); }
        });
        this.__defineGetter__('forward',    function(){ return Dir2Vec(direction); });
        this.__defineSetter__('forward',  function(){
            if(arguments.x === undefined || arguments.y === undefined){
                console.error("HackforPlay Error: Behaviour.forward can be set object has x and y.");
            }else if(arguments.x === 0 && arguments.y === 0){
                console.error("HackforPlay Error: Behaviour.forward cannot be set zero vector");
            }else{
                direction = Vec2Dir(arguments);
            }
        });
        this.__defineGetter__('right',    function(){ var f = Dir2Vec(direction); return { x: -f.y, y: f.x }; });

        this.__defineGetter__('frame',  function(){ return this.sprite.frame; });
        this.__defineSetter__('frame',  function(f){ this.sprite.frame = f; });

        // イベント
        this.addEventListener('enterframe', this.generalbehaviour);
    },
    generalbehaviour : function(){
        // シラベテ！の吹き出し
        if(!this.useMessage) this.balloon.opacity = 0; // なまえのわからないしもべ
        else if(env.player.sprite.within(this.sprite, this.radius)) this.balloon.opacity = 1;
        else this.balloon.opacity = 0;
    },
    locate : function(x, y){
        this.moveTo(32 * x, 32 * y);
    },
    intersect : function(collider){
        var other = null;
        if(collider instanceof enchant.Entity){
            other = collider;
        } else {
            other = new Entity();
            other._offsetX = collider.x;
            other._offsetY = collider.y;
            other.width = collider.width;
            other.height = collider.height;
        }
        return  this.collider.intersect(other);
    },
    spriteAsTiles : function(src, tiles){ // 複数のタイルを配列で指定する
        // 2次元配列になおす
        if(!Array.isArray(tiles)){
            tiles = [[tiles]];
        }else if(!Array.isArray(tiles[0])){
            tiles = [tiles];
        }
        // Surfaceにひとつずつdraw
        var s = new Surface(this.sprite.width, this.sprite.height);
        var col = src.width / 32, row = src.height / 32;
        tiles.forEach(function(array, y){
            array.forEach(function(frame, x){
                s.draw(src,
                    (frame%col)*32, parseInt(frame/col)*32, 32, 32,
                    x*32, y*32, 32, 32);
            });
        });
        this.sprite.image = s;
    },
    setImage : function(src){
        var prefixes = ['img/', __H4PENV__PATH];
        var me = this;
        prefixes.forEach(function(item){
            if(game.assets[item + src] !== undefined){
                me.sprite.image = game.assets[item + src];
            }
        });
    },
    destroy : function(){
        // var i = behaviours.indexOf(this);
        // if(i != -1) behaviours.splice(i, 1);
        if(this.scene !== null) this.scene.removeChild(this);
        if(this.parentNode !== null) this.parentNode.removeChild(this);
    },
    attack : function(_right, _front, _effect){
        // call Attack function based on this object
        var right   = _right === undefined ? 0 : parseInt(_right);
        var front   = _front === undefined ? 1 : parseInt(_front);
        var myX = parseInt(this.x / 32);
        var myY = parseInt(this.y / 32);
        Attack( myX + this.forward.x * front + this.right.x * right,
                myY + this.forward.y * front + this.right.y * right,
                this.atk, _effect);
    },
    setScene : function(_scene){
        // シーンへの追加
        if(this.scene === null){
            if(_scene instanceof enchant.Group) _scene.addChild(this);
            else if(_scene instanceof RelationalMap) _scene.scene.addChild(this);
            else if(_scene === undefined) env.map.scene.addChild(this);
        }else{
            var next = null;
            if(_scene instanceof enchant.Group && _scene !== this.scene) next = _scene;
            else if(_scene instanceof RelationalMap && _scene.scene !== this.scene) next = _scene.scene;
            else if(_scene === undefined && env.map.scene !== this.scene) next = env.map.scene;
            this.scene.removeChild(this);
            next.addChild(this);
        }
    },
    toString : function(){ // toStringをオーバーライド
        return this.kokoro;
    }
});
var Player = enchant.Class.create(Behaviour, {
    initialize : function(_namae){
        if(env.player === undefined || env.player === null){
            env.player = this;
        }
        Behaviour.call(this, {
            namae: _namae,
            image: 'img/chara0.png',
            width: 48, height: 48,
            dx: -8, dy: -12
        });
        this.collider = { x: 0, y: 0, width: 32, height: 32 };
        this.sprite.frame = 5;
        this.useMessage = false;    // 自分に反応するのをふせぐ
        this.collisionFlag = false; // 自分との衝突をふせぐ
        this.kokoro = "すごうでハッカー。\nプログラミングで みんなをたすけるヒーロー・・・に あこがれている、むじゃきなしょうねん";

        this.walkable = true;
        this.behavior = BehaviorTypes.Idle;
        // this.direction = 0; // アニメーションの設定。ある程度汎用化したい
        // this.__defineGetter__('directionVector', function(){
        //     var _x = this.direction === 1 ? -1 : this.direction === 2 ? 1 : 0;
        //     var _y = this.direction === 3 ? -1 : this.direction === 0 ? 1 : 0;
        //     return { x:_x, y:_y };
        // });
        this.animCount = 1;
        this.damageFlag = false;
        this.control = true;
        this.beginWalking = false; // 歩き始めた瞬間をとらえるトリガー
        this.talkWith = null; // 話している相手を保持する

        this.locate(7, 6);
    },
    onenterframe : function(){
    	var map = env.map;
        var input = { x:0, y:0, d:this.direction };
        if (game.input.up) {
            input.d = this.control ? 3 : 0;
            input.y = this.control ?-1 : 1;
        } else if (game.input.down) {
            input.d = this.control ? 0 : 3;
            input.y = this.control ? 1 :-1;
        } else if (game.input.left) {
            input.d = this.control ? 1 : 2;
            input.x = this.control ? -1: 1;
        } else if (game.input.right) {
            input.d = this.control ? 2 : 1;
            input.x = this.control ? 1 :-1;
        }
        this.animCount ++;
        this.beginWalking = false; // 歩き始めた瞬間をとらえるトリガー
        this.talkWith = null; // 誰に話しかけたのかを保持するフィールド
        switch(this.behavior){
            case BehaviorTypes.Idle:
                this.sprite.frame = this.direction * 9 + 1;     // 9列の歩行グラフィック
                // this.sprite.frame = this.direction * 3 + 1;  // 3列の歩行グラフィック
                this.animCount = 0;
                if(this.walkable){
                    // 移動
                    this.direction = input.d;
                    if (input.x || input.y) {
                        var _x = this.center.x + input.x * 32; // 移動後のキャラクターの中心X座標
                        var _y = this.center.y + input.y * 32; // 移動後のキャラクターの中心Y座標
                        // 他のしもべ達を調べる行動
                        var front = null; // 進行方向にいる、メッセージを出すBehaviour
                        // behaviours. ->
                        var c = this.collider;
                        env.map.scene.childNodes.forEach(function(item){
                            if(item.intersect({ x:c._offsetX+input.x*32, y:c._offsetY+input.y*32,
                                                width:c.width, height:c.height })){ // あたり判定
                                front = item;
                            }
                        });
                        if(front !== null && front.useMessage){
                            if(!textarea.enabled){
                                textarea.text = front.message;
                                this.talkWith = front;
                                textarea.show();
                            }
                        }
                        if ((front === null || !front.collisionFlag) &&
                            0 <= _x && _x <= map.width && 0 <= _y && _y <= map.height &&
                            !map.hitTest(_x, _y)) {
                            this.beginWalking = true;
                            this.behavior = BehaviorTypes.Walk;
                            this.tl.moveBy(input.x * 32, input.y * 32, 4).then(function(){
                                this.animCount = 0;
                                this.behavior = BehaviorTypes.Idle;
                                // 他のMAPに移動
	                            var rel = map.getRel(parseInt(_x/32), parseInt(_y/32));
	                            if(rel !== undefined){
	                            	changeMap(rel, this);
	                            }
                            });
                        }
                    }
                }
                break;

            case BehaviorTypes.Walk:
                this.sprite.frame = this.direction * 9 + (this.animCount % 3);      // 9列の歩行グラフィック
                // this.sprite.frame = this.direction * 3 + (this.animCount % 3);   // 3列の歩行グラフィック
                break;
        }
        // when become invisible, show ballown
        if((!this.damageFlag && this.sprite.opacity <= 0.01 )
         || this.sprite.scaleX <= 0.1 || this.sprite.scaleY <= 0.1){
            this.useMessage = true;
            this.balloon.text = "(ココ)";
            this.balloon.opacity = 1;
        }
    }
});

// RPG HackforPlayの主人公
var Knight = enchant.Class.create(Player, {
    initialize : function(_namae){
        Player.call(this, _namae);
        this.sprite.image = game.assets['img/chara5.png']; // the image of knight
        this.hp = 1;
        this.atk = 1;
        game.onabuttondown = function(){
            if (env.player.behavior === BehaviorTypes.Idle) {
                env.player.attack(0, 1);
                env.player.animCount = 0;
                env.player.behavior = BehaviorTypes.Attack;
            }
        };
    },
    onenterframe : function(){
        var map = env.map;
        var input = { x:0, y:0, d:this.direction };
        if (game.input.up) {
            input.d = this.control ? 3 : 0;
            input.y = this.control ?-1 : 1;
        } else if (game.input.down) {
            input.d = this.control ? 0 : 3;
            input.y = this.control ? 1 :-1;
        } else if (game.input.left) {
            input.d = this.control ? 1 : 2;
            input.x = this.control ? -1: 1;
        } else if (game.input.right) {
            input.d = this.control ? 2 : 1;
            input.x = this.control ? 1 :-1;
        }
        this.animCount ++;
        this.beginWalking = false; // 歩き始めた瞬間をとらえるトリガー
        this.talkWith = null; // 誰に話しかけたのかを保持するフィールド
        switch(this.behavior){
            case BehaviorTypes.Idle:
                this.sprite.frame = this.direction * 9 + 1;     // 9列の歩行グラフィック
                // this.sprite.frame = this.direction * 3 + 1;  // 3列の歩行グラフィック
                this.animCount = 0;
                // Attack
                if(this.walkable){
                    // 移動
                    this.direction = input.d;
                    if (input.x || input.y) {
                        var _x = this.center.x + input.x * 32; // 移動後のキャラクターの中心X座標
                        var _y = this.center.y + input.y * 32; // 移動後のキャラクターの中心Y座標
                        // 他のしもべ達を調べる行動
                        var front = null; // 進行方向にいる、メッセージを出すBehaviour
                        // behaviours. ->
                        var c = this.collider;
                        env.map.scene.childNodes.forEach(function(item){
                            if(item.intersect({ x:c._offsetX+input.x*32, y:c._offsetY+input.y*32,
                                                width:c.width, height:c.height })){ // あたり判定
                                front = item;
                            }
                        });
                        if(front !== null && front.useMessage){
                            if(!textarea.enabled){
                                textarea.text = front.message;
                                this.talkWith = front;
                                textarea.show();
                            }
                        }
                        if ((front === null || !front.collisionFlag) &&
                            0 <= _x && _x <= map.width && 0 <= _y && _y <= map.height &&
                            !map.hitTest(_x, _y)) {
                            this.beginWalking = true;
                            this.behavior = BehaviorTypes.Walk;
                            this.tl.moveBy(input.x * 32, input.y * 32, 4).then(function(){
                                this.animCount = 0;
                                this.behavior = BehaviorTypes.Idle;
                                // 他のMAPに移動
                                var rel = map.getRel(parseInt(_x/32), parseInt(_y/32));
                                if(rel !== undefined){
                                    changeMap(rel, this);
                                }
                            });
                        }
                    }
                }
                break;

            case BehaviorTypes.Walk:
                this.sprite.frame = this.direction * 9 + (this.animCount % 3);      // 9列の歩行グラフィック
                // this.sprite.frame = this.direction * 3 + (this.animCount % 3);   // 3列の歩行グラフィック
                break;

            case BehaviorTypes.Attack:
                this.sprite.frame = this.direction * 9 + (this.animCount / 2 % 3) + 6;
                if(this.animCount > 5){
                    this.animCount = 1;
                    this.behavior = BehaviorTypes.Idle;
                }
                break;

            case BehaviorTypes.Dead:
                this.sprite.frame = 1;
                break;
        }
        // when become invisible, show ballown
        if((!this.damageFlag && this.sprite.opacity <= 0.01 ) || this.sprite.scaleX <= 0.1 || this.sprite.scaleY <= 0.1){
            this.useMessage = true;
            this.balloon.text = "(ココ)";
            this.balloon.opacity = 1;
        }

        // flash when damaged
        if(this.damageFlag){
            this.sprite.opacity = this.sprite.opacity === 0 ? 1 : 0;
        }
    },
    damage : function(atk){
        if( !this.damageFlag &&
            this.behavior !== BehaviorTypes.Damaged &&
            this.behavior !== BehaviorTypes.Dead){
            this.hp -= atk;
            if(this.hp >= 0){
                this.sprite.opacity = 0;
                this.damageFlag = true;
                var me = this;
                this.sprite.tl.delay(4).then(function(){
                    me.sprite.opacity = 1;
                    me.damageFlag = false;
                });
            }else{
                this.behavior = BehaviorTypes.Dead;
                var me = this;
                this.sprite.tl.fadeOut(10).then(function(){
                    if(me === env.player){
                        gameover();
                    }
                });
            }
        }
    }
});

var PC = enchant.Class.create(Behaviour, {
    initialize : function(_namae){
        Behaviour.call(this, {
            namae: _namae,
            image: 'img/pc.gif',
            width: 20, height: 20,
            dx: 5, dy: 10,
            frame: 0
        });
        this.useMessage = false;
        this.created = false;
    },
    onenterframe : function(){
        var player = env.player;
        if(game.input.up &&
            this.x == player.x && this.y + 32 == player.y){
            var editor = getEditor();
            editor.opacity = 1;
            editor.moveTo(0, 0);
            editor.scale(0.5, 1);
            editor.tl.scaleTo(1, 1, 7, enchant.Easing.BACK_EASEOUT); // うごきあり
            textarea.hide();
            this.created = true;
        }
        if(this.created)  // エディタが作られていて
        {
            if(env.player.beginWalking && getEditor().opacity > 0
                && getEditor().scaleX > 0){ // 歩き始めたら閉じる
                sendToEditor('cls();'); // エディタ側でcls()を呼び出し
            }
        }
    }
});

var EnchantBook = enchant.Class.create(enchant.Sprite, {
    initialize: function(){
        Sprite.call(this, 64, 64);
        this.image = game.assets['img/enchantbook.png'];
        var editor = getEditor();
        editor.opacity = 0;
        editor.moveTo(0, 1000);
        this.on('touchend', function() {
            var editor = getEditor();
            editor.moveTo(0, 0);
            editor.opacity = 1;
            editor.scale(0.5, 1);
            editor.tl.scaleTo(1, 1, 7, enchant.Easing.BACK_EASEOUT); // うごきあり
            textarea.hide();
        });
    }
});

/* Generic Class Behaviour */
// Item
var Item = enchant.Class(Behaviour, {
    // _mapがシーンあるいはマップの場合、自動で追加される。
    // 省略した場合は現在のmap.sceneに追加される。falseを指定すると追加を無効化できる
    initialize: function(_map){
        Behaviour.call(this, {
            namae: "item",
            image: "img/icon0.png"
        });
        this.collisionFlag = false;
        this.useMessage = false;    // 自分に反応するのをふせぐ
        this.on('enterframe', function() {
            var p = env.player;
            if(p !== undefined && p.intersect(this)){
                this.pickup();
                this.pickup = function(){};
            }
        });
        this.locate(7, 5); // 中央に配置
        this.frame = 14; // コインの絵
        this.setScene(_map);
    },
    pickup: function(){
        // プレイヤーとかさなった時に呼ばれるイベント.
        var me = this;
        this.sprite.tl.moveBy(0, -20, 10).then(function(){
            me.destroy();
        });
    }
});

// Effect
var Effect = enchant.Class(Behaviour, {
    // 自動でシーンに追加される。
    // フレーム単位でライフタイムを指定.disappearを呼び出す
    initialize: function(lifetime, index){
        Behaviour.call(this, {
            namae: "effect",
            image: "img/icon0.png"
        });
        this.collisionFlag = false;
        this.useMessage = false;

        this.lifetime = lifetime === undefined ? 99999999 : lifetime;
        this.on('enterframe', function() {
            if(this.lifetime > 0){
                this.sprite.opacity = 1 - this.age / this.lifetime;
            }
            if(this.age > this.lifetime){
                this.disappear();
                this.disappear = function(){};
            }
        });

        this.moveTo(env.player.collider.x, env.player.collider.y); // プレイヤーの位置
        this.frame = index === undefined ? 50 : index; // デフォルトはビーム（下向き）
        this.setScene();
    },
    disappear: function(){
        this.destroy();
    }
});

/* 親ウィンドウ（ゲームウィンドウ）にフォーカスを戻す。主にエディタから呼び出す */
function refocus(){

    window.document.activeElement.blur();
    window.focus();

    // game.keybind(" ".charCodeAt(0), 'b'); // bボタンはスペースキー
    game.keybind(" ".charCodeAt(0), 'a'); // aボタンはスペースキー
}

/*
    ゲーム内でよく使うグローバル関数
*/
function miru(obj){
    textarea.text = obj.toString();
    textarea.show();
}


