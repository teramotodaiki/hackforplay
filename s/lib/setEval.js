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
    // 残っているトークンを削除
    var tokenKey = 'sendcode-project-token';
    sessionStorage.removeItem(tokenKey);
    __H4PENV__SENDCODE = function(){
        // トークンをもとにプロジェクトを見つけ、前回との差分を記録する
        var updateTask = function(){
            var sendCodeToken = sessionStorage.getItem(tokenKey);
            if (sendCodeToken === null) return;
            $.post('../../project/updatefromtoken.php',{
                'token': sendCodeToken,
                'data': raw
            }, function(data, textStatus, xhr) {
                console.log(data);
            });
        };
        if (sessionStorage.getItem(tokenKey) === null) {
            // プロジェクトの作成
            var stageid = sessionStorage.getItem('stage_param_id');
            var attendanceToken = sessionStorage.getItem('attendance-token');
            $.post('../../project/makefromplaying.php',{
                'stageid': stageid,
                'attendance-token': attendanceToken
            }, function(data, textStatus, xhr) {
                if (data !== 'failed') {
                    sessionStorage.setItem(tokenKey, data);
                    updateTask();
                }
            });
        }else{
            updateTask();
        }

        // エラーが発生していた場合、Acitive Log - CodeGeneratesErrorに、コードの全文とエラー例外のメッセージを送信

    };
})();