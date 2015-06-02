var setEval; // どこからでも呼び出せる
var __H4PENV__SENDCODE;
var __H4PENV__DEBUGMODE = false; // エラーをハンドルしない
(function(){
    var raw = "";
    var error = false;
    var exmes = null;
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
                        exmes = ex.message;
                        textarea.text =
                        "うまく　うごかなかった。\n";
                        // ex.line + "ギョウめの　" + ex.column + "モジめふきんに、まちがいがあるようだ。\n" +
                        // ex.message;
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
        var _sendcode = raw;
        var _message = error ? exmes : false;
        var updateTask = function(){
            var sendCodeToken = sessionStorage.getItem(tokenKey);
            if (sendCodeToken === null) return;
            $.post('../../project/updatefromtoken.php',{
                'token': sendCodeToken,
                'data': _sendcode,
                'attendance-token': sessionStorage.getItem('attendance-token')
            }, function(data, textStatus, xhr) {

            });
            // エラーが発生していた場合、SendcodeExceptionに登録
            if (_message) {
                $.post('../../exception/tracebysendcode.php', {
                    'project-token': sendCodeToken,
                    'message': _message,
                    'attendance-token': sessionStorage.getItem('attendance-token')
                }, function(data, textStatus, xhr) {

                });
            }
        };
        if (sessionStorage.getItem(tokenKey) === null) {
            // プロジェクトの作成
            var stageid = sessionStorage.getItem('stage_param_id');
            var attendanceToken = sessionStorage.getItem('attendance-token');
            var timezone = new Date().getTimezoneString();
            $.post('../../project/makefromplaying.php',{
                'stageid': stageid,
                'attendance-token': attendanceToken,
                'timezone': timezone
            }, function(data, textStatus, xhr) {
                if (data !== 'failed') {
                    sessionStorage.setItem(tokenKey, data);
                    updateTask();
                }
            });
        }else{
            updateTask();
        }
    };
})();