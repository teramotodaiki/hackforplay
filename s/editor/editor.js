// Editor
var game = window.parent;
var jsEditor;
var policy = "/";

window.addEventListener('click', function(e){
	// クリック時、ゲームウィンドウにフォーカスを戻す
	if(!jsEditor.state.focused){	// テキストエリアにフォーカスが当たっていないときのみ
		var source = "refocus();";	// フォーカスを戻すメソッドをゲーム側で呼び出す
		game.postMessage(source, policy);
	}
});

window.onload = function(){
	jsEditor = CodeMirror.fromTextArea(document.getElementById('editor_js'), {
		mode: "javascript",
		lineNumbers: true,
		indentUnit: 4,
		autoClossBrackets: true
	});
	jsEditor.setSize(460, 320-44);
	// ヒントメッセージ送信のリクエスト
	setHint();
	$("input[name=run]").on('click', run);
	$("input[name=cls]").on('click', cls);
	$("input[name=undo]").on('click', undo);
	$("input[name=redo]").on('click', redo);
	jsEditor.on('beforeChange', function(cm, change) {
		if (change.origin === "undo" && cm.doc.historySize().undo === 0) {
			// Ctrl+Zの押し過ぎで、全部消えてしまうのをふせぐ
			change.cancel();
		}
		if (change.origin === "+input" /*|| change.origin === "paste"*/) {
			var matchFlag = false;
			var replaced = [];
			change.text.forEach(function(input){
				if(input.match(/[！-～|。|、|”|’]/g)){
					var han = input.replace(/[！-～]/g, function(s){
						return String.fromCharCode(s.charCodeAt(0)-0xFEE0);
					});
					han = han.replace(/。/g, function(s){ return "."; });
					han = han.replace(/、/g, function(s){ return ","; });
					han = han.replace(/”/g, function(s){ return "\""; });
					han = han.replace(/’/g, function(s){ return "\'"; });
					replaced.push(han);
					matchFlag = true;
				}else{
					replaced.push(input);
				}
			});
			if(matchFlag){
				change.update(change.from, change.to, replaced, "");
			}
		}
	});
	jsEditor.on('change', function(cm, change) {
		renderUI();
	});
};

window.addEventListener('message', function(e){
	// console.log(e.data);
	eval(e.data);
});

function run(){
	jsEditor.save();
	game.postMessage($("#editor_js").val(), policy); // ここでコードを実行させる
	game.postMessage("__H4PENV__SENDCODE();", policy); // 直前に実行したコードをログとして送信させる
	var source =
	"var e = getEditor();"+
	"e.tl.scaleTo(0, 1, 3, enchant.Easing.LINEAR);"+
	"window.focus();";
	game.postMessage(source, policy);
}

function cls(){
	var source =
	"var e = getEditor();"+
	"e.tl.scaleTo(0, 1, 7, enchant.Easing.BACK_EASEIN);"+
	"window.focus();";
	game.postMessage(source, policy);
}

function undo () {
	jsEditor.doc.undo();
	renderUI();
}

function redo () {
	jsEditor.doc.redo();
	renderUI();
}

function renderUI () {
	$("input[name=undo]").attr('src', 'img/ui_undo_' + (jsEditor.doc.historySize().undo > 1 ? 'enabled.png':'disabled.png'));
	$("input[name=redo]").attr('src', 'img/ui_redo_' + (jsEditor.doc.historySize().redo > 0 ? 'enabled.png':'disabled.png'));
}

function setHint(){
	// ゲーム側に、ヒントを送信してセットするようリクエストを送る。
	// postMessageされることでエスケープ\nが改行になってしまうことを防ぐため、\\nにしている。
	var source =
	"sendToEditor('jsEditor.setValue(\"'+hint.replace(/\\n/g, \"\\\\n\")+'\");');";
	game.postMessage(source, policy);
}