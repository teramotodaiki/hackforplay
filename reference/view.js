$(function() {

	var $tr =
	$('<tr>').append(
		$('<td>').append(
			$('<span>').addClass('member-is-class hide').text('new ')
		).append(
			'Hack.'
		).append(
			$('<span>').addClass('member-name text-info')
		).append(
			$('<span>').addClass('member-is-method member-is-class hide').text('( ')
		).append(
			$('<var>').append(
				$('<b>').addClass('member-args text-warning')
			)
		).append(
			$('<span>').addClass('member-is-method member-is-class hide').text(' )')
		)
	).append(
		$('<td>').append(
			$('<dl>').addClass('member-params')
		)
	).append(
		$('<td>').addClass('member-desc')
	).append(
		$('<td>').append(
			$('<dl>').addClass('member-return')
		)
	).append(
		$('<td>').append(
			$('<a>').addClass('member-link').attr('target', '_blank')
		)
	);

	var $dt =
	$('<dt>').append(
		$('<var>').addClass('member-param-name')
	).append(
		' '
	).append(
		$('<span>').addClass('text-muted').append(
			'{'
		).append(
			$('<span>').addClass('member-param-class')
		).append(
			'}'
		)
	);
	var $dd = $('<dd>');

	function addRow (memberInfo, index, array) {
		// @ $('#anchor-x tbody')

		var type = memberInfo[0];
		var name = memberInfo[1];
		var params = memberInfo[2];
		var desc = memberInfo[3];
		var retu = memberInfo[4];
		var exID = memberInfo[5];

		var tr = $tr.clone(true, true).appendTo(this);

		// column: Name
		switch (type) {
			case 'method':
				tr.find('.member-is-method').removeClass('hide');
				break;
			case 'class':
				tr.find('.member-is-class').removeClass('hide');
				break;
		}
		tr.find('.member-name').text(name);
		params.forEach(function(item, index) {
			$(this).append(
				index !== 0 ? ', ' + item[0] : '' + item[0]
			);
		}, tr.find('.member-args'));

		// column: Parameters
		params.forEach(function(item) {
			// @ $('.member-params')

			var dt = $dt.clone(true, true).appendTo(this);
			dt.find('.member-param-name').text(item[0]);
			dt.find('.member-param-class').text(item[1]);

			var dd = $dd.clone(true, true).appendTo(this);
			dd.text(item[2]);

		}, tr.find('.member-params'));

		// column: Description
		desc.forEach(function(item) {
			$(this).append(
				$('<p>').addClass('small').text(item)
			);
		}, tr.find('.member-desc'));

		// column: Return
		retu.forEach(function(item) {
			// @ $('.member-return')

			var dt = $dt.clone(true, true).appendTo(this);
			dt.find('.member-param-name').text(item[0]);
			dt.find('.member-param-class').text(item[1]);

			var dd = $dd.clone(true, true).appendTo(this);
			dd.text(item[2]);

		}, tr.find('.member-return'));

		// column: Example
		tr.find('.member-link').attr('href', '../s?id=' + exID).text(
			exID === 304 ? 'タイピングゲーム' :
			exID === 305 ? 'ランゲーム' : ''
		);
	}

	// Hack.js
	[
['method', 'clearLog', [], ['テキストエリアの文字を全てクリアする'], [], 0],
['method', 'closeEditor', [], ['エディタ(魔道書)を閉じる'], [], 0],
['method', 'createLabel', [['text', 'String', '表示したい文字'], ['[prop]', 'Object', 'Labelオブジェクトに追加したいメンバ']], ['ラベルを作成して表示する', 'enchant.Labelクラスのコンストラクタをラップしている', 'オブジェクトはHack.defaultParentNodeに追加される'], [['', 'enchant.Label', '作成されたラベル']], 0],
['method', 'createSprite', [['width', 'Number', 'スプライトの横幅'], ['height', 'Number', 'スプライトの縦幅'], ['[prop]', 'Object', 'Spriteオブジェクトに追加したいメンバ']], ['スプライトを作成して表示する', 'enchant.Spriteクラスのコンストラクタをラップしている', 'オブジェクトはHack.defaultParentNodeに追加される'], [['', 'enchant.Sprite', '作成されたスプライト']], 0],
['method', 'gameclear', [], ['ゲームクリア画面を表示する', 'Hack.gameclear, Hack.gameoverが呼び出されていないとき使える'], [], 0],
['method', 'gameover', [], ['ゲームオーバー画面を表示する', 'Hack.gameclear, Hack.gameoverが呼び出されていないとき使える'], [], 0],
['method', 'log', [['text', 'String', '表示する文字']], ['テキストエリアに文字を表示する','すでに文字がある場合は下に１行追加する'], [], 304],
['method', 'openEditor', [], ['エディタ(魔道書)を開く'], [], 0],
['method', 'overlay', [['fill/imagePath/fillStyle', 'Surface/String/String', '表示したい画像/画像のパス/CSSカラースタイル'], ['[...]', 'Surface/String/String', '複数指定できる']], ['画面全体に画像を表示する', 'fill: Hack.overlay(sprite.image);', 'imagePath: Hack.overlay(\'hackforplay/clear.png\');', 'fillStyle: Hack.overlay(\'black\'); Hack.overlay(\'rgba(0,0,0,0.7)\'); など'], [['', 'enchant.Sprite', '描画されたスプライト']], 0],
['member', 'defaultParentNode', [['', 'enchant.Group', 'デフォルトの親ノード']], ['デフォルトの親ノードを取得・設定する', 'なにも設定されなかった場合はgame.rootSceneになる'], [['', 'enchant.Group', '現在のデフォルトの親ノード']], 0],
['member', 'textarea', [['', 'enchant.Entity', 'テキストエリア']], ['テキストエリアを取得・設定する', 'text, show, hide といったメンバをもつ'], [['', 'enchant.Entity', 'テキストエリア']], 0],
['event', 'onload', [['', 'Function', '任意の処理']], ['Hackオブジェクトが設定された直後に呼び出されるイベント'], [['', 'Function', '現在のonload']], 0],
['property', 'hint', [['', 'String', 'エディタ(魔道書)の内容']], ['エディタ(魔道書)の内容を取得・設定する'], [['', 'String', '現在のエディタ(魔道書)の内容']], 0],
	].forEach(addRow, $('#anchor-hack tbody'));

	// typing.js
	[

['method', 'pressStartKey', [['keyString', 'String', 'スタートキーに設定したいキーの文字']], ['Hack.onpressstartイベントを発行するキーを設定する', 'Sキーを設定: Hack.pressStartKey(\'S\');'], [], 304],
['method', 'shuffleAndLog', [['list', 'String', 'テキストエリアに表示したい文字列をスペース区切りでまとめた文字列'], ['[count]', 'Number', 'シャッフル回数']], ['リストにふくまれる文字列をシャッフルしてスペース区切りでテキストエリアに出力する', 'countを省略した場合、シャッフル回数はlist.lengthになる'], [], 304],
['event', 'onendgame', [['', 'Function', '任意の処理']], ['全てのキーを打ち終えたとき呼び出されるイベント'], [['', 'Function', '現在のonendgame']], 304],
['event', 'onkeydown', [['', 'Function', '任意の処理']], ['キー入力があったときに呼び出されるイベント'], [['', 'Function', '現在のonkeydown']], 304],
['event', 'onpressstart', [['', 'Function', '任意の処理']], ['Hack.pressStartKeyで設定されたキーが入力され、まだHack.startedがfalseのとき呼び出されるイベント'], [['', 'Function', '現在のonpressstart']], 304],
['member', 'started', [['', 'Boolean', '現在のゲームがスタートしているか']], ['現在のゲームのスタート状況を取得または設定する', 'game.startとは無関係'], [['', 'Boolean', '現在のゲームがスタートしているか']], 304],
['member','getPreviousKey', [], ['直前に入力されたキーを文字で取得する', 'A-ZのキーコードはすべてLowerCase(a-z)に変換される'], [['', 'String', '直前に入力されたキーの文字']], 304]
	].forEach(addRow, $('#anchor-typing tbody'));

	// run.js
	[

['class', 'MovingSprite', [['width', 'Number', 'オブジェクトの横幅'], ['height', 'Number', 'オブジェクトの縦幅']], ['enchant.Spriteを継承したクラス', 'velocity, useGravity, useGround などのメンバをもつ', 'Hack.createMovingSpriteメソッドで作成する'], [['', 'Hack.MovingSprite', '作成されたMovingSpriteオブジェクト']], 305],
['method', 'createMovingSprite', [['width', 'Number', 'スプライトの横幅'], ['height', 'Number', 'スプライトの縦幅'], ['[prop]', 'Object', '追加したいメンバ']], ['MovingSpriteを作成して表示する', 'Hack.MovingSpriteクラスのコンストラクタをラップしている', 'オブジェクトはHack.defaultParentNodeに追加される'], [['', 'enchant.MovingSprite', '作成されたオブジェクト']], 305],
['method', 'createScrollMap', [['map', 'Array', 'マップ']], ['スクロール可能な横視点マップを作成する', 'Hack.backgroundImageとして参照可能', 'オブジェクトはHack.defaultParentNodeに追加される'], [['', 'Array', 'Hack.backgroundImage']], 305],
['method', 'pressStartKey', [['keyString', 'String', 'スタートキーに設定したいキーの文字']], ['Hack.onpressstartイベントを発行するキーを設定する', 'Sキーを設定: Hack.pressStartKey(\'S\');'], [], 305],
['method', 'scrollRight', [['x', 'Number', 'スクロールする量(x>0)']], ['Hack.defaultParentNodeをxだけ左にスクロールする', '逆方向へはスクロールできない'], [], 305],
['event', 'onpressstart', [['', 'Function', '任意の処理']], ['Hack.pressStartKeyで設定されたキーが入力され、まだHack.startedがfalseのとき呼び出されるイベント'], [['', 'Function', '現在のonpressstart']], 305],
['member', 'player', [], ['ゲームのプレイヤーを取得する'], [['', 'Hack.MovingSprite', 'プレイヤー']], 305],
['member', 'monster', [], ['ゲームのモンスターを取得する'], [['', 'Array', 'モンスターの配列']], 305],
['member', 'backgroundImage', [], ['スクロールマップを取得する', '実体は短冊状のスプライトの配列'], [['', 'Array', 'スクロールマップ']], 305],
['member', 'enchantBookIcon', [], ['魔道書のアイコンを取得する', 'クリックするとHack.openEditorを呼び出すイベントが定義されている'], [['', 'enchant.Entity', '魔道書のアイコン']], 305],
['member', 'gravity', [['', 'Object', 'ゲーム内の重力']], ['ゲーム内の重力を取得または設定する', 'x, y というプロパティをもつ'], [['', 'Object', '現在のゲーム内の重力']], 305],
['member', 'groundHeight', [['', 'Number', 'ゲーム内の地面の高さ']], ['ゲーム内の地面の高さを取得または設定する', '画面上部を基準としたYの値'], [['', 'Number', '現在のゲーム内の地面の高さ']], 305]

	].forEach(addRow, $('#anchor-run tbody'));
});











