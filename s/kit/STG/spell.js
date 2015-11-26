// 弾幕を組み合わせてスペルを創造する
var Spell = function()
{
    this.name = '';

    this.barrages = [];

}

// [[deprecated]]
Spell.prototype.CreateCount = function()
{
    return Array.apply(null,
    {
        length: this.barrages.length
    }).map(Boolean).map(Number);
}



// [[deprecated]]
Spell.prototype.resetCount = function()
{
    this.count = 0;
    this.barrages.forEach(function(barrage)
    {
        barrage.count = 0;
    });
}


// オブジェクトのプロパティをコピー
Spell.prototype.attribute = function(object)
{
    for (var key in object)
    {
        this[key] = object[key];
    }
    return this;
}

// オブジェクトのプロパティを全ての弾幕にコピー
Spell.prototype.attributeAll = function(object)
{
    this.barrages.forEach(function(barrage)
    {
        barrage.attribute(object);
    });
}



// 弾幕を追加する
// [[deprecated]]
Spell.prototype.addBarrage = function(barrage)
{

    var barrage2 = $.extend(
    {}, barrage);

    this.barrages.push(barrage2);
}

// 弾幕を追加する
Spell.prototype.pushBarrage = function(barrage)
{
    this.barrages.push(barrage);
}



// カウントを初期化する
Spell.prototype.ResetCount = function(creator)
{
    this.barrages.forEach(function(barrage)
    {
        creator.barrage_count[barrage.handle] = 0;
    });
}



// 更新する
Spell.prototype.Update = function(creator)
{

    this.barrages.forEach(function(barrage, index)
    {

        barrage.creator = creator;
        barrage.count = creator.barrage_count[barrage.handle]++;

        barrage.Update();

    });

}


// 複製する
Spell.prototype.Clone = function()
{

    var spell = new Spell();

    spell.name = this.name;

    // 闇の処理
    this.barrages.forEach(function(barrage)
    {
        spell.barrages.push($.extend(
        {}, barrage));

//        spell.barrages.push( /*Clone*/ (__Barrage.Get(barrage.asset_name)));

    });

    return spell;
}

// 技の名前とか表示するやつ
Spell.prototype.statusRender = function()
{
    /* default */
};





var spell_asset = {};




var Asset = {

    asset: [],
    name: '',

    Get: function(name)
    {

        if (this.asset[name] === undefined)
        {
            console.warn(this.name + ' "' + name + '" は存在しません');
        }

        return spell_asset[name];

    }


}


var Class = function(base, extend) {


}


var __Spell = {


    // スペルを取得する
    Get: function(name)
    {

        if (spell_asset[name] === undefined)
        {
            console.warn('スペル "' + name + '" は存在しません')
        }

        return spell_asset[name];
    },


    Reload: function()
    {

        scene.childNodes.forEach(function(character)
        {

            if(character.ReloadSpell !== undefined)
            {
                character.ReloadSpell();
            }
        });
    },

    UpdateAll: function()
    {


        CharacterList.Each('enemy', function()
        {
            this.UpdateSpell();
        })
    },




    // 技を作成する
    Make: function(name, property)
    {


        // Spell.Make('name')('b1', 'b2', 'b3');
        // Spell.Make('name', { property: value })('b1', 'b2', 'b3');

        var spell = spell_asset[name] = new Spell();

        spell.__name = name;

        if (property)
        {
            spell.attribute(property);
        }

        return function(Args___)
        {


            Array.prototype.forEach.call(arguments, function(name)
            {
                spell.pushBarrage(__Barrage.Get(name));
            });

            /*
            for (var index in Range(arguments.length))
            {
                spell.pushBarrage(__Barrage.Get(arguments[index]));
            }
            */

            return spell;

        }

    }



}
