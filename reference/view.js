$(function() {

	var $tr =
	$('<tr>').append(
		$('<td>').append(
			'Hack.'
		).append(
			$('<span>').addClass('member-name')
		).append(
			$('<span>').addClass('member-is-method hide').text('( ')
		).append(
			$('<var>').append(
				$('<b>').addClass('member-args')
			)
		).append(
			$('<span>').addClass('member-is-method hide').text(' )')
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
		if (type === 'method') {
			tr.find('.member-is-method').removeClass('hide');
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
				$('<p>').text(item)
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
		['method', 'log', [['text', 'String', '表示する文字']], ['テキストエリアに文字を表示する','すでに文字がある場合は下に１行追加して表示する'], [], 304]
	].forEach(addRow, $('#anchor-hack tbody'));
});