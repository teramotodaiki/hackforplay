var SpriteObject = enchant.Class.create(enchant.Sprite,
{
    initialize: function()
    {

        this.pos = Vec2(0, 0);


        this.Initialize();
    }
});






var Barrage = function()
{


    //----------// ユーザーが使用するメンバ //----------//

    // 何秒毎に生成するか
    this.create_time = 1.0;

    // way 方向に生成する
    this.way = 1;

    // 速度
    this.speed = 0;

    // 色
    this.color = 0;

    // 軸
    this.axis_angle = 0;




    // 撃つ範囲
    this.range_angle = 360;

    // 消滅時間
    // 秒に修正予定
    this.life = 300;

    // 敵対タイプ
    this.target_type = 'player';

    // 自分に自分の弾が当たるか
    this.hit_self = false;

    // 材質
    this.material = 'normal';


    // creator から space 離れた場所に弾が生成される
    this.space = 0;

    // 並べる
    this.repeat = 1;
    this.repeat_angle = 0;

    // 横に並べる
    this.repeat_x = 1;
    this.repeat_space_x = 0;

    // 縦に並べる
    this.repeat_y = 1;
    this.repeat_space_y = 0;

    this.pos = [0, 0];
    this.pos_type = 'relative';


    // pos 互換
    this.pos_x = null;
    this.pos_y = null;


    //----------// 固定互換 //----------//

    // ランダムな軸を指定する時、こっちの書き換えると 1 回の生成で 1 回だけ計算される
    this.const_axis_angle = null;

    this.const_color = null;



    //----------// 未実装 //----------//




    //----------// 廃止 //----------//


    // this.material に変更
    // this.texture_name = 'shot-none';


    // material.width, height に変更
    // 変更する場合は Scale から
    // this.size = 10;


    // 生成者に依存
    // this.power = 1;


    //----------// 内部で使用するメンバ //----------//

    // 時間
    this.time = 0.0;
    this.count = 0;

    this.create_count = 0;

    this.shots = [];

    this.events = [];

    // 識別番号
    this.handle = null;


    this.frame = 0;


    // 弾幕の使用者
    this.creator = null;



    this.__control = null;
    this.__shotControl = null;


    // this.axis = Vec2(0, 0);

    this.shotEvents = [];




    // 詳細設定
    this.random = null;


}


// 乱数生成
Barrage.prototype.Random = function(values)
{
    this.random = values;
    return this;
}

var lv1 = ['create_time', 'way', 'repeat', 'repeat_x', 'repeat_y', 'const_axis_angle', 'const_color'];

Barrage.prototype.RandomizeFirst = function()
{

    if (!this.random) return;

    for (var key in this.random)
    {

        if (lv1.indexOf(key) < 0) continue;

        this[key] = this.RandomizeName(key);

    }

}

Barrage.prototype.RandomizeSecond = function()
{

    if (!this.random) return;



    for (var key in this.random)
    {

        if (lv1.indexOf(key) >= 0) continue;

        this[key] = this.RandomizeName(key);

    }

}


Barrage.prototype.RandomizeName = function(name)
{

    // ランダムにしたらダメなプロパティ

    var a = ['target_type', 'material' /*, hit_self*/ ];


    if (a.indexOf(name) >= 0)
    {
        console.warn('プロパティ "' + name + '" はランダムにできません');
        return null;
    }


    // 整数値
    var int_keys = ['repeat', 'repeat_x', 'repeat_y', 'color'];


    // 乱数生成器
    var _Random = int_keys.indexOf(name) >= 0 ? Random2 : Random;


    return _Random(this.random[name][0], this.random[name][1]);
}



Barrage.prototype.AddShotEvent = function(time, property)
{
    time *= game.fps;
    this.shotEvents.push(function()
    {
        if (this.count <= time)
        {
            this.attribute(property)
            {}
        }
    });
}






// 弾幕を自由に制御できる関数を設定
Barrage.prototype.control = function(control)
{
    this.__control = control;
    return this;
}

// 弾を自由に制御できる関数を設定
Barrage.prototype.shotControl = function(control)
{
    this.__shotControl = control;
    return this;
}



// 生成する時間なら
Barrage.prototype.CreateNow = function()
{
    return this.count % this.create_count === 0;
}

// イベント
Barrage.prototype.addEvent = function(callback)
{
    //events



}

Barrage.prototype.attribute = function(object)
{
    for (var key in object)
    {
        this[key] = object[key];
    }
    return this;
}


// 弾を放つ
Barrage.prototype.Fire = function()
{

    this.RandomizeFirst();




    var shotProperty = {


        __control: this.__shotControl,
        target_type: this.target_type,
        // size: this.size,

        hit_self: this.hit_self,

        power: this.creator.power

    };


    // 材質
    var material = Material.Get(this.material);

    // 仮
    for (var way in Range(this.way))
    {





        // プロパティを追加
        // shot = $.extend(shot, this);


        /*
        this.shotEvents.forEach(function(event)
        {
            shot.events.push(event);
        })
        */




        // RangeN(r1, r2, r3...) -> [][][]

        // ずらし配置みたいな
        for (var repeat in Range(this.repeat))
        {

            // 横に並べる
            for (var x in Range(this.repeat_x))
            {
                // 縦に並べる
                for (var y in Range(this.repeat_y))
                {
                    this.RandomizeSecond();


                    // 軸を選択する
                    var axis_angle = this.const_axis_angle === null ? this.axis_angle : this.const_axis_angle;


                    // 角度を計算する
                    var begin_angle = axis_angle - this.range_angle / 2;
                    var step_angle = this.range_angle / this.way;
                    var angle = begin_angle + step_angle * way;
                    angle -= this.repeat_angle * this.repeat / 2;
                    angle += this.repeat_angle * repeat;



                    // 弾を生成する
                    var shot = new Shot(this.creator, material);



                    // x, y が有効値なら pos に上書き
                    if (this.pos_x !== null && this.pos_y !== null)
                    {
                        this.pos = [this.pos_x, this.pos_y];
                    }


                    shotProperty['speed'] = this.speed;
                    shotProperty['life'] = this.life;

                    shotProperty.angle = angle;


                    var color = this.const_color === null ? this.color : this.const_color;

                    shotProperty.frame = color;


                    // プロパティを登録
                    shot.attribute(shotProperty);



                    // pos を適用する
                    (
                    {
                        relative: function()
                        {
                            shot.pos.add(this.pos.ToVec2());
                        },
                        absolute: function()
                        {
                            shot.pos = this.pos.ToVec2();
                        }
                    })[this.pos_type].call(this);



                    // repeat_x, repeat_y を計算

                    var shot_width = (this.repeat_x - 1) * this.repeat_space_x;
                    shot.pos.sub(Vec2(shot_width / 2, 0));
                    shot.pos.add(Vec2(this.repeat_space_x * x, 0));

                    var shot_height = (this.repeat_y - 1) * this.repeat_space_y;
                    shot.pos.sub(Vec2(shot_height / 2, 0));
                    shot.pos.add(Vec2(this.repeat_space_y * y, 0));



                    // 使用者から距離を取る
                    // shot.pos.add(shot.angle.ToVec2().Scale(this.space));
                    shot.pos.add(Angle(angle).ToVec2().Scale(this.space));



                    // 弾を登録する
                    shot.InitializeUpdate();
                    scene.addChild(shot);
                    this.shots.push(shot);


                }




            }
        }
    }




}






Barrage.prototype.ShotControl = function(property)
{
    this.shots.forEach(function(shot)
    {
        shot.attribute(property);
    });
}


// [[deprecated]]
Barrage.prototype.Restart = function()
{
    this.creator.barrage_count[this.handle] = 0;
}


Barrage.prototype.NextColor = function()
{
    this.color++;
}

// 弾幕を更新する
Barrage.prototype.Update = function()
{

    // Spell ->
    // set creator
    // set count

    // 時間関連の変換
    this.time = CountToTime(this.count);
    this.create_count = TimeToCount(this.create_time);


    // 完全に自由な制御
    if (this.__control)
    {
        this.__control.call(this);
    }


    // 一定時間に達したら弾を生成する
    if (this.count % this.create_count === 0)
    {
        this.Fire();
    }


}


// 一番近い敵を狙う
Barrage.prototype.AxisFromNearTarget = function()
{
    this.AxisFromTarget(CharacterList.GetNear(this.creator, this.target_type));
}



// target の方向に axis_angle を向ける
Barrage.prototype.AxisFromTarget = function(target)
{
    // 標的がいるなら軸を向け、いないならとりあえず上に
    this.axis_angle = target ? this.creator.pos.angle(target.pos) : 0;
}




var barrage_asset = {};

var barrage_handle = 0;

var __Barrage = {

    Get: function(name)
    {

        if (barrage_asset[name] === undefined)
        {
            console.warn('弾幕 "' + name + '" は存在しません');
        }


        barrage_asset[name].asset_name = name;

        return barrage_asset[name];
    },


    New: function(name, property)
    {

        var barrage = barrage_asset[name] = new Barrage();




        barrage.handle = barrage_handle++;


        if (property)
        {
            barrage.attribute(property);
        }


        return barrage;
    },



}
