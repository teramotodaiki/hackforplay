/*
 * getEditor.js
 * ゲーム画面からテキストエディタを呼び出す処理。エディタ本体のスクリプトはeditorディレクトリの中にある。
 * sendToEditorメソッドで送った文字列は、javascriptのソースコードとしてエディタ側で実行される（eval）
*/
var getEditor;		// getEditorメソッドはグローバルに呼び出せる　ex) var editor = getEditor();
var sendToEditor;	// sendToEditorメソッドもグローバルに呼び出せる ex) sendToEditor("alert('ok');");
(function(){
	var editorEntity; // 一度作ったエンティティを残しておくための変数（他からは呼び出せない）
	var editorWindow; // Editorのiframeのwindow
	window.kaizou = "editor"; // エディタ改造用プロパティ
	//EditorのEntityを取得する。まだ作られていない場合は新たに生成する。
	getEditor = function(){
		if(editorEntity === undefined){
			// 新たに生成
			editorEntity = new enchant.Entity(); // enchant.jsでDOM要素を表示させる場合はEntityを使う
			editorEntity.width = 480;
			editorEntity.height = 320;
			editorEntity._element =
			$("<iframe>").attr({
			        "id" : "editor",
		            "src" : window.kaizou,
				    "width" : "480",
				    "height" : "320"
				}).get(0);
				editorEntity._element.type = "iframe";
			}
			if(editorEntity.scene !== game.rootScene){
				editorEntity.scale(1, 0);
				editorEntity.tl.scaleTo(1, 1, 7, enchant.Easing.BACK_EASEOUT); // うごきあり
				// editorEntity.tl.scaleTo(1, 1); // うごきなし
				game.rootScene.addChild(editorEntity);
			}
			return editorEntity;
	}
	// Editorのiframeに対してWeb Messagingを行う。
	sendToEditor = function(message){
		if(editorEntity === undefined){
			console.log("sendToEditor関数が呼び出されましたが、Editorが作られていなかったため、1秒待ってメッセージを送信します。");
			getEditor();
			setTimeout(function(){
				if(editorEntity !== undefined){ editorEntity._element.contentWindow.postMessage(message, '/'); }
			}, 1000);
		}else{
			editorEntity._element.contentWindow.postMessage(message, '/');
		}
	}
})();
