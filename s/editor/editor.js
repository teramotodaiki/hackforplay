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
		lineNumbers: false,
		indentUnit: 4,
		scrollbarStyle: 'simple',
		autoCloseBrackets: true
	});
	jsEditor.setSize(440, 320-60);
	// ヒントメッセージ送信のリクエスト
	setEditor();
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
		if (change.origin === "+input" || change.origin === "*compose" /*|| change.origin === "paste"*/) {
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
		if (change.origin == "+delete" && change.to.ch - change.from.ch == 1) {
			var del = cm.doc.getRange(change.from, change.to);
			if (del.match(/[,;=\(\)\[\]\']/g)) {
				change.cancel();
			}
		}
	});
	jsEditor.on('change', function(cm, change) {
		renderUI();
		// 魔道書が書き換えられたことをゲーム側に伝える
		var source = "if(window.editorTextChanged) editorTextChanged();";
		game.postMessage(source, policy);
	});
	jsEditor.on('focus', function() {
		$('.phantom').addClass('focus');
	});
	jsEditor.on('blur', function() {
		$('.phantom').removeClass('focus');
	});

};

window.addEventListener('message', function(e){
	try {
		eval(e.data);
	} catch (ex) {
		console.error(ex.message);
	}
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

	// 魔道書が閉じられたことをゲーム側に伝える
	game.postMessage("if(window.editorWindowClosed) editorWindowClosed();", policy);
	dispatchHackEvent('editend');
}

function cls(){
	var source =
	"var e = getEditor();"+
	"e.tl.scaleTo(0, 1, 7, enchant.Easing.BACK_EASEIN);"+
	"window.focus();";
	game.postMessage(source, policy);

	// 魔道書が閉じられたことをゲーム側に伝える
	game.postMessage("if(window.editorWindowClosed) editorWindowClosed();", policy);
	dispatchHackEvent('editcancel');
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

// RPG互換性維持のための仕様
function setHint(){
	// ゲーム側に、ヒントを送信してセットするようリクエストを送る。
	// postMessageされることでエスケープ\nが改行になってしまうことを防ぐため、\\nにしている。
	var source =
	"sendToEditor('jsEditor.setValue(\"'+(hint).replace(/\\n/g, \"\\\\n\")+'\");');";
	game.postMessage(source, policy);
}

function setEditor(){
	// sessionStorageを用いて渡した値をsetする
	var code = sessionStorage.getItem('enchantbook-set-hint');
	if (code) {
		if (jsEditor) jsEditor.setValue(code);
		else document.getElementById('editor_js').value = code;
	}
}

function dispatchHackEvent (type) {
	// Hack.oneditend , Hack.oneditcancel Event を dispatchする
	var source =
	"if (Hack && Hack.dispatchEvent) { Hack.dispatchEvent(new Event('" + type + "')); }";
	game.postMessage(source, policy);
}