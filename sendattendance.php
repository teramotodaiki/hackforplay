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
				'refferer': <?php echo isset($_SERVER['HTTP_REFERER']) ? '"'.$_SERVER['HTTP_REFERER'].'"' : FALSE; ?>,
				'query_string': <?php echo '"'.$_SERVER['QUERY_STRING'].'"'; ?>,
				'timezone': timezone
			}
		})
		.done(function(result) {
			console.log(result);
			sessionStorage.setItem('attendance-token', result);
		});
	});
	$(window).on('beforeunload', function(event) {
		if(_ignore_attendance) return;

		var token = sessionStorage.getItem('attendance-token');
		if(token === null) return;

		var timezone = new Date().getTimezoneString();
		$.ajax({
			url: '/attendance/end.php',
			type: 'POST',
			async: false,
			data: {
				'timezone': timezone,
				'token': token
			}
		})
		.always(function(result){
			sessionStorage.removeItem('attendance-token');
			return;
		});
	});
})();
</script>