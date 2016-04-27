var Boss = enchant.Class.create(Enemy,
{
    initialize: function(width, height)
    {

        Enemy.call(this, width, height);


        // this.type = 'boss';

        this.type = 'enemy';


        this.entry_motion = true;

        this.death_event = function() {}

        this.spells = [];

        this.active_spell_index = -1;

        this.active = false;

        this.death = false;


        this.initialized = false;

    },
    onenterframe: function()
    {


        // 初期化
        if (!this.initialized)
        {
            this.NextSpell();
            this.initialized = true;
        }


        if (this.death) return;

        this.time = CountToTime(this.count);

        // TL を使用するから x, y から pos に逆輸入

        /*
        this.pos.x = this.x + this.width / 2;
        this.pos.y = this.y + this.height / 2;
        */


        // 準備中
        if (this.entry_motion)
        {
            // 準備終了
            if (this.timeline.end)
            {


                this.entry_motion = false;

                // 戦闘モーションに移行
                Motion.Use(this.GetActiveSpell().motion, this);

                this.SetHP(this.GetActiveSpell().hp);

            }

        }



        if (this.timeline !== undefined)
        {
            this.timeline.Update(this);
            this.convertPos();
        }


        // 攻撃する
        if (!this.entry_motion)
        {

            if (this.spells[this.active_spell_index] === undefined)
            {
                console.error('スペルが存在しません');
                console.error(this.spells);
            }



            this.spells[this.active_spell_index].Update(this);
        }


        this.count++;
    }
});

Boss.prototype.Active = function()
{
    this.active = true;
    this.NextSpell();
}


Boss.prototype.SetDeathEvent = function(event)
{
    this.death_event = event;
}



Boss.prototype.UpdateSpell = function()
{
    var self = this;

    this.spells.forEach(function(spell)
    {
        console.log('スペル "' + spell.__name + '" を更新しました');



        spell = __Spell.Get(spell.__name).Clone();


        // option を上書き
        spell = $.extend(spell, spell.__option);


        // barrage_count を初期化する
        spell.barrages.forEach(function(barrage)
        {

            console.log('SP2: ' + barrage.speed);

            this.barrage_count[barrage.handle] = 0;
        }, self);

    });

}


// スペルを追加する
Boss.prototype.AddSpell = function(name, option)
{


    var spell = __Spell.Get(name).Clone();



    // option を上書き
    spell = $.extend(spell, option);


    // barrage_count を初期化する
    spell.barrages.forEach(function(barrage)
    {
        this.barrage_count[barrage.handle] = 0;
    }, this);


    spell.__name = name;
    spell.__option = option;


    this.spells.push(spell);

}




Boss.prototype.GetActiveSpell = function()
{
    return this.spells[this.active_spell_index];
}


// 次のスペルに
Boss.prototype.NextSpell = function()
{
    this.active_spell_index++;

    // 全てのスペルを使用したら
    if (this.spells.length <= this.active_spell_index)
    {
        console.log('死亡');
        this.death = true;
        this.death_event();
    }
    else
    {

        // 準備移動を登録
        this.entry_motion = true;
        Motion.Use(this.GetActiveSpell().entry_motion, this);


    }

}


Boss.prototype.SetEntryMotion = function(name)
{
    this.entry_motion = true;

    // motion を適用
    Motion.Use(name, this);
}

Boss.prototype.Damage = function(damage)
{

    // 死体撃ち
    if (this.death) return;


    if (!this.entry_motion)
    {
        this.hp -= damage;

        // 次のスペルに
        if (this.hp <= 0.0)
        {

            console.log('HP が 0.0 以下になりました');
            this.NextSpell();



        }
    }

}
