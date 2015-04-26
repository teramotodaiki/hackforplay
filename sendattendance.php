<?php
/*
Attendance 情報を送信する
全ページの load, beforeUnload イベントを制御
*/
?>
<script type="text/javascript" charset="utf-8">
$(function(){
	$.ajax({
		url: '/attendance/begin.php',
		type: 'POST',
		data: {
			'href': location.href,
			'pathname': location.pathname
		}
	})
	.done(function(result) {
		if(result !== null && result !== "");
		sessionStorage.setItem('attendance-token', result);
	});
});
$(window).on('beforeunload', function(event) {
	var token = sessionStorage.getItem('attendance-token');
	if(token === null) return;
	$.ajax({
		url: '/attendance/end.php',
		type: 'POST',
		async: false,
		data: {'token': token},
	})
	.always(function(result){
		sessionStorage.removeItem('attendance-token');
	});

});
</script>