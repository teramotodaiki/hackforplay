
window.addEventListener('load', function() {
    game.start();
    game.addEventListener('load', function(){

        var map = maps['Living'];
        map.load();

        var pc = new PC('pc');
        map.scene.addChild(pc);

        var editor = getEditor();
        editor.opacity = 1; // 起動

        var hint =
        "// RUNボタンをおすと、プログラムじっこう\n";

        // ここはコピペ
        // Runtime Evaluation
        window.addEventListener('message', function(e){
            try{
                // console.log(e.data);
                eval(e.data);
            }catch(ex){
                textarea.text =
                "うまく　うごかなかった。\n" +
                ex.line + "ギョウめの　" + ex.column + "モジめふきんに、まちがいがあるようだ。\n" +
                ex.message;
                textarea.show();
            }
        });
    });
});