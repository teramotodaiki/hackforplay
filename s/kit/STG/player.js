

var Player = enchant.Class.create(Character,
{
    initialize: function(width, height)
    {
        Character.call(this, width, height);

        this.type = 'player';

        this.attackSpell;

        this.count = 0;
        this.attackSpellCount = 0;
        this.bombSpellCount = 0;

        this.power = 10;

        this.escape_count = 0;
        this.escape_time = 0.0;

    },

    // 通常攻撃スペルを設定する
    SetAttackSpell: function(name)
    {



        // this.spell = __Spell.Get(name);


        this.attackSpell = __Spell.Get(name);


        // barrage_count を初期化する
        this.attackSpell.barrages.forEach(function(barrage)
        {
            this.barrage_count[barrage.handle] = 0;
        }, this);

    },




    // 弾幕から通常攻撃を登録
    __set_attackSpellFromBarrage: function(name)
    {

        var barrage = __Barrage.Get(name).attribute(
        {
            creator: this,
        });


        var spell = CreateSpell();
        spell.addBarrage(barrage);

        spell.name = 'w';

        this.attackSpell = spell;
    },

    __set_attackSpell: function(name)
    {
        //        this.attackSpell = __Barrage.Get(name);
    },

    // ◆初級◆ 通常攻撃を設定する
    updateAttackBarrage: function()
    {


        barrage.creator = this;

        var spell = new Spell();

        spell.name = '通常攻撃';

        spell.addBarrage(barrage);


        this.attackSpell = spell;




    },


    onenterframe: function()
    {





        // 通常攻撃
        if (this.attackSpell)
        {

            // 攻撃する
            if (input.z)
            {
                // console.log('z');
                this.attackSpell.Update(this);
            }
            else
            {
                this.attackSpell.ResetCount(this);
            }
        }





        this.vec = _pad;


        //		console.log('pos: ' + this.pos.x + ' / ' + this.pos.y)


        this.move();



        this._test();


        this.escape_time = CountToTime(this.escape_count++);
        Debug.Set('escape-time', this.escape_time.toFixed(2));


    }

});


// 被弾
Player.prototype.Damage = function(damage)
{
    this.escape_count = 0;
    this.hp -= damage;
}
