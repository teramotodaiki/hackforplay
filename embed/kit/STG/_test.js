


var InitializeGlobalVariable = function()
{


    game = enchant.Core.instance;


    sceneSize.width = game.width;
    sceneSize.height = game.height;



    scene = game.rootScene;
    scene.backgroundColor = '#666';



    /* var */
    input = game.input;



    game.addEventListener('enterframe', function()
    {



        // FPS
        Debug.Set('fps', game._actualFps);

        // Nodes
        Debug.Set('nodes', scene.childNodes.length)



        Debug.Update();
    });

}



// 魔道書
var EnchantBook = {

    Create: function()
    {


        // 魔道書
        Hack.enchantBookIcon = Hack.createSprite(64, 64,
        {
            image: game.assets['hackforplay/enchantbook.png'],
            defaultParentNode: game.rootScene,
            ontouchend: function()
            {
                Hack.openEditor();
            }
        });



        // 魔道書の中身
        Hack.hint = '';

    },

    PushHint: function(text)
    {
        Hack.hint += text + '\n';
    }


};


var CreatePad = function()
{









    var padMargin = 10;

    //アナログパッドの生成
    var pad = new APad();
    pad.moveTo(0 + padMargin, 220 - padMargin);



    pad.onenterframe = function()
    {
        _pad.x = this.vx;
        _pad.y = this.vy;

        // 必ず 0.0 ～ 1.0 の範囲
        var aPadLength = _pad.length();

        // キー入力を APad に対応する
        var keys = [input.down, input.right, input.up, input.left];

        // 方向キー全ての入力
        var keyPad = Vec2(0, 0);

        for (var index in keys)
        {
            if (keys[index])
            {
                // key[index] の方向
                var angle = Math.PI2 / 4 * index;
                var keyVec = Vec2(Math.sin(angle) | 0, Math.cos(angle) | 0);

                keyPad.add(keyVec);
            }

        }


        // APad に KeyPad を加算して正規化
        _pad.add(keyPad).normalize();



        // 低速キー || APad の押し込みが少ない
        if (input.shift || (pad.isTouched && aPadLength < 0.5))
        {
            _pad.Scale(0.5);
        }



    }

    scene.addChild(pad);



}
