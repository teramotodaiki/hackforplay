
// _level のアラート _text を生成し、jQueryオブジェクトを返す
function bsAlert (_level, _text) {
	var _bsalert =
	$('<div>').addClass('alert alert-dismissible fade in').addClass(_level).attr('role', 'alert').append(
		$('<button>').addClass('close').attr({
			'type' : 'button',
			'data-dismiss': 'alert',
			'aria-label': 'Close'
		}).append(
			$('<span>').attr('aria-hidden', 'true').html('&times;')
		)
	).append(
		$('<span>').text(_text)
	);
	return _bsalert;
}