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
	// like PHP Datetime format (utc flag default: false)
	Date.prototype.format = function (format, utc) {
		utc = !!utc;
		format = format.replace('Y', utc ? this.getUTCFullYear() : this.getFullYear());
		format = format.replace('d', ('0' + (utc ? this.getUTCDate() : this.getDate())).slice(-2));
		format = format.replace('m', ('0' + ((utc ? this.getUTCMonth() : this.getMonth()) + 1)).slice(-2));
		format = format.replace('H', ('0' + (utc ? this.getUTCHours() : this.getHours())).slice(-2));
		format = format.replace('i', ('0' + (utc ? this.getUTCMinutes() : this.getMinutes())).slice(-2));
		format = format.replace('s', ('0' + (utc ? this.getUTCSeconds() : this.getSeconds())).slice(-2));
		var microseconds = (utc ? this.getUTCMilliseconds() : this.getMilliseconds()) * 1000;
		format = format.replace('u', ('000' + microseconds).slice(-6));
		return format;
	}
})();
// Parsed Web Messaging (Required query property)
window.addEventListener('message', function (event) {
	if (event.origin === location.origin) {
		var parsed;
		try {
			parsed = $.parseJSON(event.data);
		} catch (e) { return; }
		if (!parsed && !parsed.query) return;
		$(window).trigger(parsed.query + '.' + 'parsedMessage', [parsed]);
	}
});
</script>
