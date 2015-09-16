$(function () {
	// quest-item-entity, kit-item-entity をランダムに並べる

	// プロパティ
	var minHorizontalMargin = 100; // 少なくとも１行にこれだけのマージンをとる
	var entityWidth = $('.quest-item-entity').outerWidth(false); // CSSで指定されたEntityの固定幅

	// ロード時, リサイズ時, 難易度変更時に設定
	task();
	$(window).on('resize', task);
	$('.change-type-button').on('click', task);

	// カラム数を取得
	function getColumn () {
		var body_width = $('.container-pavilion>.row').width();
		return ((body_width - minHorizontalMargin) / entityWidth) >> 0;
	}

	function task () {

		var seed = Math.random();

		var current_row = 0, current_column = 0;
		var pavilion_id = sessionStorage.getItem('stage_param_pavilion') >> 0;
		var type_number = $('.change-type-button[disabled="disabled"]').data('number') >> 0;
		var body_width = $('.container-pavilion>.row').width();

		$('.quest-item-entity,.kit-item-entity').each(function(index, el) {
			var columnNum = Math.max(getColumn() - (current_row % 2), 1);
			var margin = body_width - entityWidth * columnNum;

			$(el).css({
				'margin-left': margin * constRandoms(columnNum, current_row, pavilion_id, type_number)[current_column],
				'margin-right': 0
			});

			// 次のアイテムに
			current_column ++;
			if (current_column >= columnNum) {
				// 右辺を埋める
				$(el).css('margin-right',  margin * constRandoms(columnNum, current_row, pavilion_id, type_number)[current_column]);
				current_column = 0;
				current_row ++;
			}
		});

	}

	// あとTypeも含める
	function constRandoms (columnNum, current_row, pavilion_id, type_number) {
		var buffer = [];
		var sum = 0;
		for (var i = 0; i < columnNum + 1; i++) {
			buffer[i] = Math.sin(current_row + current_row + pavilion_id + type_number + i) + 1;
			sum += buffer[i];
		}
		for (var i = 0; i < buffer.length; i++) {
			buffer[i] /= sum;
		}
		return buffer;
	}
});