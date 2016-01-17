<?php
/*
Attendance 情報を送信する
全ページの load, beforeUnload イベントを制御
*/
?>
<script type="text/javascript" charset="utf-8">
(function(){

	var _ignore_attendance = false;
	$(function(){
		$('.ignore-attendance').on('click', function() {
			_ignore_attendance = true;
			sessionStorage.setItem('ignore-attendance-begin', 'ignore');
		});

		var flag = sessionStorage.getItem('ignore-attendance-begin');
		sessionStorage.removeItem('ignore-attendance-begin');
		if (flag === 'ignore') return;

		var timezone = new Date().getTimezoneString();
		$.ajax({
			url: '/attendance/begin.php',
			type: 'POST',
			data: {
				'self_path': <?php echo '"'.$_SERVER['PHP_SELF'].'"'; ?>,
				'refferer': <?php echo isset($_SERVER['HTTP_REFERER']) ? '"'
				. parse_url($_SERVER['HTTP_REFERER'])['host']
				. '"' : '""'; ?>,
				'query_string': <?php echo '"'.$_SERVER['QUERY_STRING'].'"'; ?>,
				'timezone': timezone
			}
		})
		.done(function(result) {
			sessionStorage.setItem('attendance-token', result);
		});
	});
	// /attendance/end.phpは廃止
})();
</script>