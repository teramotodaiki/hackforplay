




var motion_asset = [];

var Motion = {



    // 新しいモーションを作成
    New: function(name)
    {
        return (motion_asset[name] = new NewEasyTimeline());
    },


    Mirror: function() {

    },


    // キャラクターに適用する
    Use: function(name, target)
    {

        if (motion_asset[name] === undefined)
        {
            console.log(name + ' は存在しないモーションです');
            return;
        }

        // 適用
        motion_asset[name].Clone().Use(target);
    }



}
