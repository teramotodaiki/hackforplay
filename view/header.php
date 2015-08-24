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
<header class="navbar navbar-static-top">
	<div class="container">
		<div class="navbar-header">
	     	<a class="navbar-brand" title="ハックフォープレイ" href="/?rewrite=true">
	        	<img alt="hackforplay" src="/logo.png">
	     	</a>
		    <div class="pull-right visible-xs">
				<div class="dropdown">
					<a class="btn navbar-btn" data-target="#" href="#" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false" onfocus="this.blur();" >
						<span class="caret"></span>
					</a>
					<ul class="dropdown-menu" role="menu" aria-labelledby="h4p_header-dropdown">
						<li role="presentation"><a href="/m" title="settings">マイページ</a></li>
						<li role="presentation"><a href="/p" title="settings">せってい</a></li>
						<li role="presentation"><a href="/comments" title="comments">メッセージ</a></li>
						<li role="presentation" class="divider"></li>
						<li role="presentation" class="h4p_signin"><a data-toggle="modal" data-target="#signinModal">ログイン</a></li>
						<li role="presentation" class="h4p_signin"><a data-toggle="modal" data-target="#authModal">とうろく</a></li>
						<li role="presentation" class="h4p_signout"><a href="javascript:void(0);" onclick="signout();">ログアウト</a></li>
					</ul>
				</div>
		    </div>
	    </div>
	    <nav class="collapse navbar-collapse">
	    	<ul class="nav navbar-nav">
	    	<?php if ($help_button_visibility): ?>
	    		<li><a class="btn btn-link navbar-btn h4p_need-help" href="javascript:void(0)" title=" "> </a></li>
		    <?php endif; ?>
	    	<?php if($header_pattern === 'inGame' && $mode === 'official'): ?>
	    		<li><a class="btn btn-link navbar-btn" href="../" title="トップに戻る">トップに戻る</a></li>
	    	<?php elseif ($header_pattern === 'inGame' && $mode !== 'official'): ?>
	    		<li><a class="btn btn-link navbar-btn" href="/r" title="改造ステージ一覧へ">改造ステージ一覧へ</a></li>
	    		<?php if ($author_id !== NULL) : ?>
		    		<li><a class="btn btn-link navbar-btn" href="/m?id=<?php echo $author_id; ?>" target="_blank" title="この人が作った他のステージ">この人が作った他のステージ</a></li>
	    		<?php endif; ?>
	    	<?php else: ?>
	    		<li><a class="btn btn-link navbar-btn" href="/r" title="新着ステージ">新着ステージ</a></li>
	    		<li><a class="btn btn-link navbar-btn" href="/resources" title="リソース">リソース</a></li>
	    		<li><a class="btn btn-link navbar-btn" href="/reference" title="リファレンス">リファレンス</a></li>
			<?php endif; ?>
	    	</ul>
	    	<ul class="nav navbar-nav navbar-right">
	    		<li class="h4p_signin"><button type="button" class="btn btn-link navbar-btn" data-toggle="modal" data-target="#signinModal">ログイン</button></li>
				<li class="h4p_signin"><button type="button" class="btn btn-default navbar-btn" data-toggle="modal" data-target="#authModal">とうろく</button></li>
				<li class="h4p_signout">
					<div class="dropdown">
						<a id="h4p_header-dropdown" class="btn navbar-btn" data-target="#" href="#" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false" onfocus="this.blur();" >
							<div data-toggle="tooltip" data-placement="bottom" title="マイページと設定">
								<span class="h4p_own-nickname btn btn-link"></span>
								<img class="img-circle h4p_own-thumbnail">
							</div>
						</a>
						<ul class="dropdown-menu" role="menu" aria-labelledby="h4p_header-dropdown">
							<li role="presentation"><a href="/m" title="settings">マイページ</a></li>
							<li role="presentation"><a href="/myproject" title="settings">プロジェクト</a></li>
							<li role="presentation"><a href="/p" title="settings">せってい</a></li>
							<li role="presentation"><a href="/comments" title="comments">メッセージ</a></li>
							<li role="presentation" class="divider"></li>
							<li role="presentation" class="h4p_signout"><a href="javascript:void(0);" onclick="signout();">ログアウト</a></li>
						</ul>
					</div>
				</li>
	    	</ul>
	    </nav>
	</div>
</header>