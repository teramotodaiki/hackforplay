<?php

// SESSION User Info
if (isset($session_userid)) {
	$stmt 		= $dbh->prepare('SELECT "Gender","Nickname","ProfileImageURL" FROM "User" WHERE "ID"=:userid');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->execute();
	$user_info	= $stmt->fetch(PDO::FETCH_ASSOC);
}

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

	// ヘッダナビ用のTwitter OAuth認証
	(function() {
		var authed = '/loginsuccess.php';
		var login_successed = window.location.pathname + window.location.search; // 今いるページに帰還
		$('nav a#button-loginwithtwitter').attr('href',
			'/loginwithtwitter.php?authed=' + encodeURIComponent(authed) +
			'&login_successed=' + encodeURIComponent(login_successed));
	})();

	// 通知
	(function (data) {

		if (!data.Notifications.length) return;

		$('.notification-icon>a').css('color', '#ff3b6f'); // 通知ありの状態
		var $parent = $('.notification-icon ul.dropdown-menu');
		data.Notifications.forEach(function (item) {

			var entity = $(this).clone(true, true);
			entity.removeClass('notification-comment-sample hidden').addClass('notification-comment-entity');
			entity.find('.notification-item-thumbnail').attr('src', item.Thumbnail);
			entity.find('.notification-item-wrapper').attr('href', item.URL);
			item.Detail.forEach(function (text, index) {
				entity.find('.notification-detail-' + index).text(text);
			});

			$parent.prepend(entity);

		}, $('.notification-comment-sample'));

	})({
		Notifications: [{
			Type: "Comment",
			Thumbnail: "/s/thumbs/016f2d2dccc042097085b7b6b8b10659.png",
			Detail: ["てら", "ドラクエ", "おもしろい〜！"],
			URL: '../comments/'
		}, {
			Type: "Comment",
			Thumbnail: "/s/thumbs/04102c9d878ebb295e3aaa434b11a36c.png",
			Detail: ["たに", "パズドラ", "これすごいね"],
			URL: '../comments/'
		}]
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
			<form class="navbar-form navbar-left" action="../auth/signin.php" method="post" accept-charset="utf-8">
				<div class="form-group">
					<label for="navbarLoginEmail"><small>メールまたはID</small></label>
					<input class="form-control" name="email" id="navbarLoginEmail" type="text">
				</div>
				<div class="form-group">
					<label for="navbarLoginPassword"><small>パスワード</small></label>
					<input class="form-control" name="password" id="navbarLoginPassword" type="password">
				</div>
				<button class="btn btn-default" type="submit"><small>ログイン</small></button>
			</form>
			<ul class="nav navbar-nav navbar-left">
				<li>
					<a href="#" id="button-loginwithtwitter" title="Login with Twitter">
		  				<img src="../img/signin-with-twitter.png" alt="Signin with twitter">
					</a>
				</li>
				<li>
					<a href="../getaccount/" class="btn btn-link" title="Register">
						<small>新規登録</small>
					</a>
				</li>
			</ul>
		<?php
			else :
			// Have Logged
			$icon_url = $user_info['ProfileImageURL'] ? $user_info['ProfileImageURL'] :
				($user_info['Gender'] === 'male' ? '../m/icon_m.png' : '../m/icon_w.png');
		?>
			<ul class="nav navbar-nav navbar-left">
				<li>
					<a href="/town/" title="Town">ひろば</a>
				</li>
				<li>
					<a href="/myproject" title="My project">
						<ruby>保存<rt>ほぞん</rt></ruby>した
						<ruby>改造<rt>かいぞう</rt></ruby>ステージ
						<ruby>一覧<rt>いちらん</rt></ruby>
					</a>
				</li>
				<li>
					<a href="/r" title="New games">
						<ruby>最新<rt>さいしん</rt></ruby>のステージ
						<ruby>一覧<rt>いちらん</rt></ruby>
					</a>
				</li>
				<?php if (isset($author_id)) : ?>
				<li>
					<a href="/m?id=<?php echo $author_id; ?>" title="Other stages made by this user">
						この人が作った他のステージ
					</a>
				</li>
				<?php endif; ?>
			</ul>
			<ul class="nav navbar-nav navbar-right">
				<li class="dropdown notification-icon">
					<a href="#" title="Notification" class="dropdown-toggle"  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
						<span class="glyphicon glyphicon-envelope"></span>
					</a>
					<ul class="dropdown-menu">
						<!-- template ~ -->
						<li class="notification-comment-sample hidden">
							<a class="notification-item-wrapper" href="#" title="">
								<div class="row">
									<div class="col-xs-4">
										<img class="notification-item-thumbnail img-responsive" src="" alt="">
									</div>
									<div class="col-xs-8">
										<div class="notification-item-article break-word">
											<b class="notification-detail-0"></b> が あなたのステージ
											「<b class="notification-detail-1"></b>」にコメントしました
										</div>
									</div>
								</div>
							</a>
						</li>
						<!-- ~template -->
						<li>
							<a href="../comments/" title="See all">これまでのコメント</a>
						</li>
					</ul>
				</li>
				<li class="dropdown">
					<a href="#" class="dropdown-toggle"  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
						<img src="<?php echo $icon_url; ?>" class="img-circle" id="img-usericon">
						<?php echo $user_info['Nickname']; ?>
						<span class="caret"></span>
					</a>
					<ul class="dropdown-menu">
						<li>
							<a href="/m" title="My page">マイページ</a>
						</li>
						<li>
							<a href="/myproject" title="My project">
								<ruby>保存<rt>ほぞん</rt></ruby>した
								<ruby>改造<rt>かいぞう</rt></ruby>ステージ
								<ruby>一覧<rt>いちらん</rt></ruby>
							</a>
						</li>
						<li>
							<a href="/p" title="Preference">せってい</a>
						</li>
						<li>
							<a href="/comments" title="Comments">もらったコメント</a>
						</li>
						<li role="separator" class="divider"></li>
						<li>
							<a href="../auth/signout_and_gotolandingpage.php" title="Logout">ログアウト</a>
						</li>
					</ul>
				</li>
			</ul>
		<?php
			endif;
		?>
		</div>
	</div>
</nav>