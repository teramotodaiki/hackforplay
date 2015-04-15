var setEval; // どこからでも呼び出せる
var __H4PENV__SENDCODE;
var __H4PENV__DEBUGMODE = false; // エラーをハンドルしない
(function(){
    var raw = "";
    var error = false;
    var _setEvalFlag = false; // setEvalが呼び出されたかどうかのフラグ
    window.__defineGetter__('__H4PENV__SETEVALFLAG', function(){
        return _setEvalFlag;
    });
    setEval = function(action){
        _setEvalFlag = true;
        window.addEventListener('message', function(e){
            if(e.origin === window.location.protocol + '//' + window.location.host){
                if(!__H4PENV__DEBUGMODE){
                    try{
                        action(e.data);
                        error = false;
                    }catch(ex){
                        error = true;
                        textarea.text =
                        "うまく　うごかなかった。\n";
                        // ex.line + "ギョウめの　" + ex.column + "モジめふきんに、まちがいがあるようだ。\n" +
                        ex.message;
                        textarea.show();
                    }finally{
                        raw = e.data;
                    }
                }else{
                    // Debug mode
                    error = false;
                    action(e.data);
                }
            }
        });
    };
    __H4PENV__SENDCODE = function(){
        $.post('sendCode.php', {
            'token':__H4PENV__TOKEN,
            'raw':raw,
            'error':error
        }, function(data, textStatus, xhr) {
            if(data !== "") console.log(data);
            if(textStatus !== "") console.log(textStatus);
        });
    };
})();