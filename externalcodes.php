<!-- FB -->
<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v2.5&appId=481203238698048";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
<!-- twitter -->
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
<!-- GA -->
<?php if($_SERVER['SERVER_NAME'] !== 'localhost'): ?>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-57860455-1', 'auto');
  ga('send', 'pageview');

</script>
<?php endif; ?>
<!-- HFP -->
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
				'attendance-token': token
			}
		})
		.always(function(result){
			sessionStorage.removeItem('attendance-token');
			return;
		});
	});
})();
</script>