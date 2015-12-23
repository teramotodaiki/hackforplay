<?php
call_user_func(function($useCDN, $path){
	// in the local scope!
	if($useCDN || $_SERVER['SERVER_NAME'] !== 'localhost'):
		// on the internet -> it uses CDN
	?>

<!-- Use CDN -->
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet" />
<script src="https://code.jquery.com/jquery-1.11.2.min.js" type="text/javascript" charset="utf-8"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js" type="text/javascript" charset="utf-8"></script>
	<?php
	else:
		// local environmnt -> it uses local file.
	?>

<!-- Use Local File -->
<link href="<?php echo $path; ?>/bootstrap.min.css" rel="stylesheet" />
<script src="<?php echo $path; ?>/jquery-1.11.2.min.js" type="text/javascript" charset="utf-8"></script>
<script src="<?php echo $path; ?>/bootstrap.min.js" type="text/javascript" charset="utf-8"></script>
	<?php
	endif;
}, true, "/lib");
 ?>
 <!-- Environment File -->
<link rel="stylesheet" href="/css/font.css" />
<link rel="stylesheet" href="/css/size.css" />
<link rel="stylesheet" href="/css/color.css" />
<link rel="stylesheet" href="/css/system.css" />
<!-- <script src="/bs-stylist.js" type="text/javascript" charset="utf-8"></script> -->
<!-- Signin session -->
<script type="text/javascript" charset="utf-8">
function checkSigninSession (callback) {
	$.ajax({
		url: '/auth/signinwithsession.php',
		type: 'GET',
		cache: false
	})
	.done(callback);
}
function signout (){
	$.ajax({
		url: '/auth/signout.php',
		type: 'GET',
		cache: false
	})
	.done(function(data){
		$(".h4p_signin").show();
		$(".h4p_signout").hide();
	});
}
(function(){
	// Example: +09:00, +00:00, -01:00
	Date.prototype.getTimezoneString = function(){
		var rawValue = parseInt((new Date()).getTimezoneOffset() / 60);
		var prefix1 = rawValue > 0 ? '-' : '+';
		var prefix2 = Math.abs(rawValue) < 10 ? '0' : '';
		return prefix1 + prefix2 + Math.abs(rawValue) + ':00';
	}
})();
</script>