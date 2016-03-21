// Editor
var game = window.parent;
var jsEditor;
var policy = "/";

window.addEventListener('click', function(e){
	// クリック時、ゲームウィンドウにフォーカスを戻す
	if(!jsEditor.state.focused){	// テキストエリアにフォーカスが当たっていないときのみ
		game.postMessage({
			query: 'eval',
			value: 'refocus();'
		}, policy);
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
	});
	jsEditor.on('focus', function() {
		document.body.classList.add('focused');
	});
	jsEditor.on('blur', function() {
		document.body.classList.remove('focused');
	});

	// onReadyイベントの発行
	game.postMessage({
		query: 'dispatch',
		value: 'editorready'
	}, '/');

};

window.addEventListener('message', function(e){
	switch (e.data.query) {
		case 'set':
			var code = e.data.value;
			if (typeof code === 'string') {
				if (jsEditor) jsEditor.setValue(code);
				else document.getElementById('editor_js').value = code;
			}
			break;
		default:
			break;
	}
});

function run(){
	game.postMessage({
		query: 'eval',
		value: jsEditor.getValue()
	}, policy);
	game.postMessage({
		query: 'dispatch',
		value: 'editend'
	}, policy);
}

function cls(){
	game.postMessage({
		query: 'dispatch',
		value: 'editcancel'
	}, policy);
}

function undo () {
	jsEditor.doc.undo();
	renderUI();
	jsEditor.focus();
}

function redo () {
	jsEditor.doc.redo();
	renderUI();
	jsEditor.focus();
}

function renderUI () {
	document.getElementById('undo').setAttribute('src', 'img/ui_undo_' + (jsEditor.doc.historySize().undo > 1 ? 'enabled.png':'disabled.png'));
	document.getElementById('redo').setAttribute('src', 'img/ui_redo_' + (jsEditor.doc.historySize().redo > 0 ? 'enabled.png':'disabled.png'));
}
