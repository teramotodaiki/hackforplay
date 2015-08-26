<?php
// topPage or inGame
$header_pattern = "topPage";
if(preg_match("/^.*\/s/", $_SERVER["PHP_SELF"])){
	$header_pattern = "inGame";
	$mode 	= filter_input(INPUT_GET, "mode");
	if(!isset($mode)){
		$mode	= $stage['Mode'];
	}
}else if(preg_match("/^.*\/policies/", $_SERVER["PHP_SELF"])){
	$header_pattern = "policies";
}else if(preg_match("/^.*\/resources/", $_SERVER["PHP_SELF"])){
	$header_pattern = "resources";
}else if(preg_match("/^.*\/reference/", $_SERVER["PHP_SELF"])){
	$header_pattern = "reference";
}else if(preg_match("/^.*\/myproject/", $_SERVER["PHP_SELF"])){
	$header_pattern = "myproject";
}else if(preg_match("/^.*\/m/", $_SERVER["PHP_SELF"])){
	$header_pattern = "mypage";
}else if(preg_match("/^.*\/a/", $_SERVER["PHP_SELF"])){
	$header_pattern = "admin";
}else if(preg_match("/^.*\/r/", $_SERVER["PHP_SELF"])){
	$header_pattern = "replay";
}else if(preg_match("/^.*\/p/", $_SERVER["PHP_SELF"])){
	$header_pattern = "pref";
}

// HELP Flag on/off
$help_button_visibility = false;
?>
<script type="text/javascript" charset="utf-8">
$(function(){
	// サインイン/サインアウトしたとき、ヘッダのボタンを切り替える
	$(".h4p_signin,.h4p_signout").hide();

	function authtext(result){
		if(result === "success"){
			$(".h4p_signin").hide();
			$(".h4p_signout").show();
			$.post('../auth/getmyinfo.php', {
				'attendance-token': sessionStorage.getItem('attendance-token')
			}, function(data, textStatus, xhr) {
				switch(data){
					case 'no-session':
					case 'missing-user':
					case 'parse-error':
						break;
					default:
						var info = $.parseJSON(data);
						$('.h4p_own-nickname').text(info.nickname);
						if (info.profile_image_url) {
							$('.h4p_own-thumbnail').attr('src', info.profile_image_url);
						} else {
							$('.h4p_own-thumbnail').attr('src', info.gender === 'male' ? '/m/icon_m.png' : '/m/icon_w.png');
						}
						break;
				}
			});
		}else{
			$(".h4p_signin").show();
			$(".h4p_signout").hide();
		}
	}
	checkSigninSession(function(result){ authtext(result); });
	$("#authModal,#signinModal,#paperLoginModal").on('hidden.bs.modal', function(){
		// 別タブでGET送信認証していてもlocalStorage経由で結果を得る
		checkSigninSession(function(result){ authtext(result); }, true);
	});

	$('[data-toggle="tooltip"]').tooltip();

	$('.h4p_need-help').on('click', function() {
		var storageKeyIdentifier = 'tutorial_tracking_key';
		var storageLogIdentifier = 'tutorial_tracking_log';
		var log_json = localStorage.getItem(storageLogIdentifier); // ログのJSON値
		var log = log_json ? $.parseJSON(log_json) : { values: [] }; // ログオブジェクト(localStorageに値がないとき、新しく作る)

		// 現在の値
		var helps = log.values.filter(function(element) {
			return element.field === 'help';
		});
		var current_help = log.helpFlag;

		log.helpFlag = window.confirm('need help ? \nnow: ' + current_help);
		localStorage.setItem(storageLogIdentifier, JSON.stringify(log));

		$.post('../stage/logintutorial.php', {
			key: localStorage.getItem(storageKeyIdentifier),
			log: localStorage.getItem(storageLogIdentifier),
			timezone: new Date().getTimezoneString()
		});
		return false;
	});
});
</script>
<nav class="navbar navbar-default">
	<div class="container">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#header-nav-collapse" aria-expanded="false">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" title="ハックフォープレイ" href="/?rewrite=true">
	        	<img alt="hackforplay" src="/logo.png">
	     	</a>
		</div>
		<div class="collapse navbar-collapse" id="header-nav-collapse">
		<?php
			if (!$session_userid) :
			// Before Login
		?>
	<form class="navbar-form navbar-left">
		<div class="form-group">
			<label class="written-in-ja" for="navbarLoginEmail"><small>メールまたはID</small></label>
			<input class="form-control" id="navbarLoginEmail" type="text">
		</div>
		<div class="form-group">
			<label class="written-in-ja" for="navbarLoginPassword"><small>パスワード</small></label>
			<input class="form-control" id="navbarLoginPassword" type="password">
		</div>
		<button class="written-in-ja btn btn-default" type="submit"><small>ログイン</small></button>
	</form>
	<ul class="nav navbar-nav navbar-left">
		<li>
			<a id="button-loginwithtwitter" href="#" title="Login with Twitter">
  				<img src="../img/signin-with-twitter.png" alt="Signin with twitter">
			</a>
		</li>
		<li>
			<a class="btn btn-link" href="#" title="Register">
				<span class="written-in-ja"><small>新規登録</small></span>
			</a>
		</li>
	</ul>
		<?php
			else :
			// Have Logged
		?>
		<?php
			endif;
		?>
		</div>
	</div>
</nav>