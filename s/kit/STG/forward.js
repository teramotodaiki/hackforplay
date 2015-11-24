// 前方宣言
var scene, input, game, player;



var ClassCreate = function(_super, property)
{
    return enchant.Class.create(_super, property);
}





var Clone = function(object)
{
    return $.extend({}, object);
}



var SpriteObject = ClassCreate(enchant.Sprite,
{
    initialize: function(width, height)
    {
        enchant.Sprite.call(this, width, height);


        // this.pos = Vec2(0, 0);


        this.Initialize();
    },
    onenterframe: function()
    {
        this.OnEnterFrame();
    }
});


var A = ClassCreate(SpriteObject);

A.prototype.Initialize = function()
{

    SpriteObject.call(this, 1, 1);

}

A.prototype.OnEnterFrame = function() {

}




/* デバッグ用 */
var Debug = {
    values: [],

    Update: function()
    {
        $('#debug').val('');

        var text = '';
        for (var key in this.values)
        {
            text += key + ': ' + this.values[key] + '\n';
        }

        $('#debug').val(text);
    },

    Set: function(name, text)
    {
        this.values[name] = text;
    }

};
