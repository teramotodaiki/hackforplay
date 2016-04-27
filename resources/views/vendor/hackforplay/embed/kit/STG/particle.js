var ArcSprite = enchant.Class.create(enchant.Sprite,
{

    initialize: function(name)
    {

        var texture = Assets.Get(name);


        enchant.Sprite.call(texture.width, texture.height);


        this.image = texture;


        
    }
});



var Particle = function() {


}
