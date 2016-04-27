// 東方みたいな HP ゲージ
var HP = enchant.Class.create(enchant.Sprite,
{
    initialize: function(enemy)
    {
        Sprite.call(this, 100, 100);

        this.enemy = enemy;
        this.image = new Surface(this.width, this.height);


        // 位置を更新する
        this.updatePos = function()
        {
            this.x = this.enemy.x + (this.enemy.width - this.width) / 2;
            this.y = this.enemy.y + (this.enemy.height - this.height) / 2;
        }


this.compositeOperation = 'lighter';



        this.before_value = 0.0;


        this.smooth_value = 10;

        this.canvas = new Canvas(this.image);

        this.value = 0.0;

        this.opacity = 0.0;

        this.updatePos();
    },

    onenterframe: function()
    {

        // 位置を合わせる
        this.updatePos();


        if (this.enemy.death)
        {
            return scene.removeChild(this);
        }


        var op = 1.0;

        // 対象が準備中なら透過
        if (this.enemy.entry_motion === true || this.enemy.death)
        {
            op = 0.0;
        }


        this.opacity = (this.opacity * this.smooth_value + op) / (this.smooth_value + 1);


        // HP を正規化
        this.value = this.enemy.hp / this.enemy.hp_max;


        if (isNaN(this.value))
        {
            this.value = 0.0;
        }


        // 簡易スムージング
        this.value = (this.before_value * this.smooth_value + this.value) / (this.smooth_value + 1);

        this.before_value = this.value;


        var hpNorm = this.value * Math.PI2;


        (function() {

        }).call(this.image.context);





        var ctx = this.image.context;

        this.canvas.Clear();

        // 円
        this.canvas.ArcPath(this.width / 2, this.height / 2)(40)(Math.PI2);


        // 枠
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        // 背景
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#444';
        ctx.stroke();

        // 対象が既に倒れているなら HP ゲージは表示しなくても OK
        if (this.enemy.hp <= 0) return;

        ctx.lineWidth = 5;
        // HP ゲージ
        ctx.beginPath();
        ctx.arc(this.width / 2, this.height / 2, 40, -Math.PI / 2, -Math.PI / 2 - hpNorm, true);
        ctx.strokeStyle = '#fff';
        ctx.stroke();

    }
});



var CreateEnemy = function(property)
{

    console.log('敵を追加します');

    var enemy = new Enemy(20, 20);

    if (property.pos)
    {
        enemy.locate(property.pos[0], property.pos[1]);
    }

    if (property.motion)
    {
        enemy.setMotion(property.motion);
    }


    if (property.spell)
    {
        enemy.SetSpell(property.spell);
    }




    scene.addChild(enemy);
}





var _Stage = function()
{

    this.events = {};

    this.count = 0;


    this.index = null;

    this.__boss = false;


};


// 既存のボスを追加する
_Stage.prototype.AddBossFromInstance = function(time, boss)
{
    this.AddEvent(time, function()
    {

        this.__boss = true;

        scene.addChild(boss);
        scene.addChild(new HP(boss));
    });

    return this;
}


// ボスを追加する
_Stage.prototype.AddBoss = function(time, property)
{
    this.AddEvent(time, function()
    {
        console.log('ボスを追加します');

        var boss = new Boss(20, 20);


        boss.SetHP(100);

        scene.addChild(boss);

        scene.addChild(new HP(boss));


        this.__boss = true;


        if (property.pos)
        {
            boss.locate(property.pos.x, property.pos.y);
        }
        if (property.motion)
        {
            boss.setMotion(property.motion);
        }
        if (property.spell)
        {
            boss.SetSpell(property.spell);
        }

        if (property.entry_motion)
        {
            boss.SetEntryMotion(property.entry_motion);
        }




        var self = this;

        // ボスを倒したらカウントを再開
        boss.death_event = function()
        {
            self.__boss = false;




        }

    });
    return this;
}

_Stage.prototype.Update = function()
{


    // ボスが出現していない時はカウントを進める
    if (!this.__boss)
    {

        // イベントを処理する
        if (this.events[this.count] !== undefined)
        {
            this.events[this.count].call(this);
            console.log('stage: event');
        }

        ++this.count;
    }

}



// 整形用
_Stage.prototype.Chain = function()
{
    return this;
}


// 敵を追加する
_Stage.prototype.AddEnemy = function(time, enemy)
{

    this.AddEvent(time, function()
    {
        CreateEnemy(enemy);
    });

    return this;
}


// イベントを追加する
_Stage.prototype.AddEvent = function(time, event)
{

    var count = TimeToCount(time);

    if (stage.events[count] === undefined)
    {
        stage.events[count] = event;
    }
    // 多分ないだろうけど time が小さすぎて count が重複した場合
    else
    {
        console.log('Stage: イベントが重複しています');

        // イベントを合成する

        var _event = stage.events[count];

        delete stage.events[count];

        stage.events[count] = function()
        {

            _event.call(this);
            event.call(this);

        }


    }

    return this;
}


_Stage.prototype.Attribute = Spell.prototype.attribute;

var stage_asset = {};
var active_stage = null;


var stage_list = [];


var Stage = {

    Get: function(name)
    {

        if (stage_asset[name] === undefined)
        {
            console.warn('ステージ "' + name + '" は存在しません');
        }

        return stage_asset[name];
    },

    // 現在のステージを取得する
    GetActive: function()
    {
        return active_stage;
    },

    // 次のステージに
    Next: function()
    {
        return (active_stage = stage_list[active_stage.index + 1]);
    },

    Make: function(name, property)
    {

        stage = active_stage = stage_asset[name] = new _Stage();


        if (property)
        {

            // 時間をカウントに変換する
            for (var key in property)
            {

                stage.AddEvent(key, property[key]);

            }

        }

        stage.index = stage_list.length;
        stage_list.push(stage);

        return stage;
    }


};
