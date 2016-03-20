window.addEventListener('load', function()
{



    // 前方宣言した変数の初期化とか
    InitializeGlobalVariable();


    var KeyBind = function(keyCode, name)
    {
        game.keybind(keyCode, name);
    }

    KeyBind(16, 'shift');
    KeyBind(90, 'z');


    Assets.Add('shot-none', 'tenonno-graphic/shot-none.png');
    Assets.Add('shot-normal', 'tenonno-graphic/shot-normal-min.png');
    Assets.Add('effect', 'tenonno-graphic/effect/effect.jpg');
    Assets.Add('background', 'tenonno-graphic/background/dot-background.png');


    Material.New('normal',
    {
        source: 'tenonno-graphic/shot-normal-min.png',
        width: 32,
        height: 32,
        default_width: 15,
        default_height: 15,
        collision_size: 10,
    });


    Assets.Preload();

    game.onload = function()
    {

        // 背景（仮）
        var background = new Sprite(scene.width, scene.height);
        var surface = background.image = new Surface(scene.width, scene.height);
        background.scroll = 0.0;
        background.onenterframe = function()
        {

            var texture = Assets.Get('background');

            var ratio = texture.width / scene.width;

            surface.draw(texture, 0, this.scroll * scene.height * ratio, scene.width, scene.height * ratio);
            surface.draw(texture, 0, (this.scroll - 1.0) * scene.height * ratio, scene.width, scene.height * ratio);


            if ((this.scroll += 0.01) >= 1.0)
            {
                this.scroll -= 1.0;
            }

        }
        scene.addChild(background);



        // Pad を生成する
        CreatePad();

        // 魔道書
        EnchantBook.Create();



        //----------// ここからステージ制作 //----------//


        // プレイヤーを召喚
        player = new Player(20, 20);
        scene.addChild(player);

        player.backgroundColor = '#f00';
        player.locate(sceneSize.width / 2, sceneSize.height / 2);
        player.speed = 5;

        /*
            50px の間隔で 2 つの弾を 0.0 度に放つ
        */
        __Barrage.New('player-normal',
        {
            material: 'normal',
            create_time: 0.1,
            way: 1,
            speed: 15,
            size: 10,
            target_type: 'enemy',
            repeat_x: 2,
            repeat_space_x: 50,
            power: 100
        });



        __Barrage.New('10way弾',
        {
            material: 'normal',
            way: 10,
            speed: 5,
            size: 20,
            space: 50
        }).shotControl(function()
        {

            this.angle.add(2);
        });


        __Barrage.New('ホーミング弾',
        {
            material: 'normal',
            range_angle: 10,
            createTime: 10.2,
            way: 8,
            speed: 10,

            size: 5,
        }).control(function()
        {

            // 一番近い標的を見つける
            var target = CharacterList.GetNear(this.creator, this.targetType);

            // 軸を標的の方向に
            this.AxisFromTarget(target);

        });




        /*
            Barrage.New('name', {}).Control(() => {}).ShotControl(() => {});
        */


        /*
            target_type: 'enemy'
            にすると同士討ちをするアレができる
        */
        __Barrage.New('自機狙い',
        {
            material: 'normal',
            create_time: 0.1,
            speed: 8,
            way: 1,
        }).control(function()
        {

            // 一番近い敵を狙う
            this.AxisFromNearTarger();



            if (this.count % 30 === 0)
            {
                this.frame++;
            }

        });




        /*
            10 方向に 6 度の間隔を開けた 3 つの弾を放つ
        */
        __Barrage.New('10way-r3',
        {
            material: 'normal',
            way: 15,
            create_time: 0.5,
            speed: 5,
            repeat: 3,
            repeat_angle: 3,
            pos_type: 'absolute'
        }).Random(
        {
            axis_angle: [0, 360],
            way: [6, 18],
            speed: [5, 10],
            color: [0, 7],

            pos_x: [0, 480],
            pos_y: [100, 100],
            target_type: [1, 1],

        });


        __Barrage.New('aaaaaaaa',
        {
            material: 'normal',
            way: 1,


            // range_angle: 20,

            create_time: 1.05,
            speed: 5,
        }).Random(
        {


        }).control(function()
        {

            this.AxisFromNearTarget();

        }).shotControl(function()
        {

            this.angle += 2;

            // this.angle += 2;


        });


        __Barrage.Get('aaaaaaaa').control(function() {

        });


        __Barrage.New('上から下',
        {
            material: 'normal',
            way: 1,
            axis_angle: 180,
            create_time: 0.5,
            speed: 5,
            repeat_x: 10,
            repeat_space_x: 480 / 10,

            pos_type: 'absolute',
            pos: [240, 0],

        });




        __Spell.Make('10way-r3')('aaaaaaaa' /*, '上から下'*/ );


        __Spell.Make('プレイヤースペル')('10way弾', 'ホーミング弾');
        __Spell.Make('player-spell')('player-normal');


        __Spell.Make('U to B')('上から下');

        __Spell.Make('自機狙い')('自機狙い');

        player.SetAttackSpell('player-spell');





        /*

        // 移動モーションを作成
        Motion.New('m-1').MoveBy(30, 30)(1.0).MoveBy(-30, 30)(1.0).easing(quad).Move(50, 20)(1.0).Move(-50, 20)(1.0).easing(linear).Move(20, 50)(2.0).Move(-20, 50)(2.0).remove();


        Motion.New('ボス登場').Move(0, 100)(1.0).Call('Active');


        // 右から左に
        Motion.New('RtoL').Move(-scene.width, 0)(2).remove();


        // loop に対応
        Motion.New('ボス反復').MoveBy(-200, 0)(1).MoveBy(400, 0)(2).Move(-200, 0)(1).Loop();

        */
        /*
        Stage.Make('ステージ',
        {
            1.0: function() {},
            2.0: function() {},
            3.0: function() {},
        });
        */



        Motion.New('不動');

        __Barrage.New('弾幕２２',
        {
            way: 8,
            speed: 5,

        }).control(function()
        {


            if (this.time >= 3)
            {
                this.color = 102;
            }

        });


        __Spell.Make('弾幕１')('弾幕２２');


        Stage.Make('ステージ').AddEnemy(0,
        {
            pos: [240, 100],
            spell: '弾幕１',
            motion: '不動',
        });

        Stage.Get('ステージ').AddEnemy(5,
        {
            pos: [340, 100],
            spell: '弾幕１',
            motion: '不動',
        });

        //
        Motion.New('ボス登場').MoveTo(scene.width / 2, 100)(1.0);
        Motion.New('ボス反復').MoveBy(-100, 0)(3.0).MoveBy(100, 0)(3.0).MoveBy(100, 0)(3.0).MoveBy(-100, 0)(3.0).Loop();

        ////////////////////////////////////////////////////



        /*
        var NET = new NewEasyTimeline();
        NET.MoveBy(-100, 30)(13).MoveBy(100, -30)(13).Loop();
        */




        // 現在のステージを更新する
        game.addEventListener('enterframe', function()
        {
            Stage.GetActive().Update();

            Debug.Set('stage-count', Stage.GetActive().count);

        });


        EnchantBook.PushHint("var b = __Barrage.Get('弾幕２２');");
        EnchantBook.PushHint("b.speed = 20;");
        EnchantBook.PushHint("__Spell.Reload();");


    }

    Hack.start();
    // console.log(Hack);
});
