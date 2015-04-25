<?php
call_user_func(function($useCDN, $path){
	// in the local scope!
	if($useCDN && $_SERVER['SERVER_NAME'] !== 'localhost'):
		// on the internet -> it uses CDN
	?>

<!-- Use CDN -->
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" rel="stylesheet" />
<script src="https://code.jquery.com/jquery-1.11.2.min.js" type="text/javascript" charset="utf-8"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js" type="text/javascript" charset="utf-8"></script>
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
<script src="/bs-stylist.js" type="text/javascript" charset="utf-8"></script>
<!-- Signin session -->
<script type="text/javascript" charset="utf-8">
function checkSigninSession (callback, useStorage) {
	if(useStorage === undefined) useStorage = false;
	else if(useStorage){
		var state = localStorage.getItem('confirm-account-state');
		console.log(state);
		if(state !== null){
			callback(state);
			localStorage.removeItem('confirm-account-state');
			return;
		}
	}
	$.get('/auth/signinwithsession.php', callback);
}
function signout (){
	$.get('/auth/signout.php', function(data){
		$(".h4p_signin").show();
		$(".h4p_signout").hide();
	});
}
</script>