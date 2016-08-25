function render() {

	// Asyncにデータからviewをつくる
	getStage(getParam('id'))
	.then(function (result) {
		var stage = result[0] || result;

		if (stage.is_mod) {
			(function ($input) {
				var value = stage.plug ? `require('${stage.plug.full_label}');` : 'プラグがありません';
				$input
				.val(value)
				.attr('readonly', stage.plug === null)
				.on('click', function (event) {
					event.target.select(0, event.target.value.length - 1);
				})
				.on('change', function (event) {
					event.target.value = value;
				});
			})($('.require-mod-container input[name="require-mod"]'));

      $('.visible-mod').removeClass('hidden');
		} else {
      $('.visible-mod').addClass('hidden');
    }
	});

}
