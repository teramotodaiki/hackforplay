


var preload_textures = {};

var preload_sources = [];

preload_sources.push('hackforplay/enchantbook.png', 'enchantjs/x2/map2.png', 'hackforplay/dot_syuj.png', 'enchantjs/x2/icon0.png', 'enchantjs/font2.png', 'enchantjs/monster1.gif',
    'dots_design/bg10_3.gif', 'dot_art_world/SC-Door-Entce03.png', 'rengoku-teien/asa_no_komorebi.mp3', 'etolier/01sougen.jpg');

var Assets = {
    Add: function(name, source)
    {

        preload_sources.push(source);

        preload_textures[name] = source;

    },

    Preload: function()
    {
        game.preload(preload_sources);
    },

    Get: function(name)
    {
        return game.assets[preload_textures[name]];
    }

};



// 秒をフレームカウントに変換する
var TimeToCount = function(time)
{
    return Math.round(time * game.fps);
}

// フレームカウントを病に変換する
var CountToTime = function(count)
{
    return count / game.fps;
}



/*
    円同士の衝突判定
    pos.x, pos.y, collision_size
*/

var Collision = function(o1, o2)
{
    return Math.pow(o1.pos.x - o2.pos.x, 2) + Math.pow(o1.pos.y - o2.pos.y, 2) <= Math.pow((o1.collision_size + o2.collision_size) / 2, 2);
}



var shot_material_asset = {};

var Material = {

    New: function(name, property)
    {
        var material = shot_material_asset[name] = {};


        (function()
        {

            this.name = 'material-' + name;

            this.width = property.width;
            this.height = property.height;

            // 比率を計算する
            this.scale_width = property.default_width === undefined ? 0 : property.default_width / this.width;
            this.scale_height = property.default_height === undefined ? 0 : property.default_height / this.height;


            this.collision_size = property.collision_size;


        }).call(material);


        // テクスチャを登録する
        Assets.Add(material.name, property.source);

    },

    Get: function(name)
    {
        return shot_material_asset[name];
    }

};





// 敵キャラ
var enemies = [];

// プレイヤー
var player;


// キャラクター管理
var character_list = [];

var CharacterList = {


    Each: function(type, callback)
    {

        scene.childNodes.forEach(function(character)
        {
            if (character.type === type)
            {
                callback.call(character);
            }
        });
    },

    // base に一番近い type のキャラクターを取得する
    GetNear: function(base, type)
    {

        var target = null;
        this.Each(type, function()
        {

            //

            if (base !== this)
            {

                if (!target)
                {
                    target = this;
                }
                else
                {
                    target = base.pos.near(target, this);
                }
            }

        });

        return target;
    }


}





// 弾
var Shot = enchant.Class.create(enchant.Sprite,
{
    initialize: function(creator, material)
    {

        if (!material)
        {
            console.log('マテリアルが存在しません');
        }

        Sprite.call(this, material.width, material.height);


        this.image = Assets.Get(material.name);

        this.material = material;


        this.type = 'shot';

        this.collision_size = material.collision_size;




        // 自分に自分の弾が当たるか
        this.hit_self = false;


        // this.compositeOperation = 'lighter';


        // 画面外に出た場合削除するか
        this.outScreenRemove = true;

        this.time = 0.0;

        this.power = null;

        // 能力の使用者
        this.creator = creator;

        this.pos = Vec2(0, 0);

        this.pos.x = creator.pos.x;
        this.pos.y = creator.pos.y;


        // 移動方向
        this.angle = 0;


        // 仮
        this.target_type = 'enemy';

        this.count = 0;



        this.__control = null;

        this.events = [];


        this.Scale_x = 1.0;
        this.Scale_y = 1.0;

    },

    // 色を変更する
    Color: function(color)
    {
        this.frame = color;
    },

    resize: function()
    {


        this.scaleX = this.material.scale_width;
        this.scaleY = this.material.scale_height;


    },

    // (pos) を (x, y) に反映する
    updatePos: function()
    {
        this.x = this.pos.x - this.width / 2;
        this.y = this.pos.y - this.height / 2;



        // 画面外に出た場合
        if (this.outScreenRemove)
        {
            if (this.pos.x < 0 || this.pos.x > scene.width || this.pos.y < 0 || this.pos.y > scene.height)
            {
                this.remove();
                return;
            }
        }





    },


    // 自身を削除する
    remove: function()
    {
        scene.removeChild(this);
    },

    // 衝突
    hit: function(target)
    {


        // 自滅を回避する
        if (target === this.creator && !this.hit_self)
        {
            return;
        }


        if (Collision(this, target))
        {


            target.Damage(this.power);
            this.remove();
        }

    },

    // シンプルな弾制御
    move: function()
    {

        this.pos.add(Angle(this.angle).ToVec2().Scale(this.speed));


    },

    onenterframe: function()
    {


        this.resize();
        this.updatePos();

        var self = this;

        // 完全に自由な制御
        if (this.__control)
        {
            this.__control.call(this);
        }

        // イベントを実行する
        this.events.forEach(function(event)
        {
            event.call(self);
        });




        // 移動
        this.move();




        // 攻撃対象に被弾判定
        CharacterList.Each(this.target_type, function()
        {

            self.hit(this);

        });

        // 寿命
        if (this.count++ >= this.life)
        {
            this.remove();
        }



        this.time = CountToTime(this.count);

    }

});


Shot.prototype.attribute = function(object)
{
    for (var key in object)
    {
        this[key] = object[key];
    }
    return this;
}


// 初期化後に呼ぶ
Shot.prototype.InitializeUpdate = function()
{

    this.updatePos();
    this.resize();
}
