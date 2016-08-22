function render() {

	// Asyncにデータからviewをつくる
	getStage(getParam('id'))
	.then(function (result) {
		var stage = result[0] || result;

		if (stage.is_mod) {
			$('.visible-mod.hidden').removeClass('hidden');

			(function ($input) {
				$input
				.val(stage.plug ? `require('${stage.plug.full_label}');` : 'プラグがありません')
				.attr('readonly', stage.plug === null)
				.on('click', function (event) {
					event.target.select(0, event.target.value.length - 1);
				});
			})($('.require-mod-container input[name="require-mod"]'));

		}
	});

}
