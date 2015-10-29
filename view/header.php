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
	(function () {
		var itemCount = 0;

		// 最初に取得
		$.post('../notification/outline.php', {
			offset: itemCount,
			length: 10
		}, function(data, textStatus, xhr) {
			var result = $.parseJSON(data);
			if (result && result.Notifications.length) {
				layoutNotification(result);
				itemCount += 10;
				if (result.Notifications.length >= 10) {
					$('<div>').addClass('notification-order').appendTo($('.notification-scroll'));
				} else {
					$('<div>').addClass('notification-end').appendTo($('.notification-scroll'));
				}
			}
		});

		// スクロール
		$('.notification-scroll').on('scroll', function() {
			// .notification-order が存在し、 .active でなく、 .notification-order が見えるところまでスクロールされたら
			var order = $(this).find('.notification-order');
			if (order && !order.hasClass('active') &&
				this.scrollTop + $(this).height() >= this.scrollHeight - order.height()) {

				// 追加
				order.addClass('active');
				$.post('../notification/outline.php', {
					offset: itemCount,
					length: 10
				}, function(data, textStatus, xhr) {
					order.remove();

					var result = $.parseJSON(data);
					if (result && result.Notifications.length) {
						layoutNotification(result);
						itemCount += 10;
						if (result.Notifications.length >= 10) {
							$('<div>').addClass('notification-order').appendTo($('.notification-scroll'));
						} else {
							$('<div>').addClass('notification-end').appendTo($('.notification-scroll'));
						}
					}
				});
			}
		});
	})();

	// 開いたときの未読アニメーション
	$('.dropdown.notification-icon').on('shown.bs.dropdown', function() {
		setTimeout(function () {
			$('.notification-state-unread').addClass('opened');
		}, 10);
	});

	// 既読トリガー
	$('.notification-check').on('click', function() {
		$.post('../notification/readall.php');
		$('.notification-state-unread').removeClass('notification-state-unread').addClass('notification-state-read');
		$('.notification-icon>a').css('color', 'rgb(112,112,112)');
	});

	// レイアウト関数
	function layoutNotification (result) {

		if (result.HasUnread) {
			$('.notification-icon>a').css('color', 'rgb(255, 59,111)'); // 未読通知ありの状態
		}
		if (result.Notifications.length > 3) {
			$('.notification-scroll').addClass('scroll-y'); // 4つをこえたらスクロールする
		}

		result.Notifications.forEach(function (item) {

			var prefix = 'notification-' + item.Type + '-';
			var entity = $('.' + prefix + 'sample').clone(true, true);
			entity.removeClass(prefix + 'sample hidden').addClass(prefix + 'entity');
			entity.addClass('notification-state-' + item.State);
			entity.find('.notification-item-thumbnail').attr('src', item.Thumbnail);
			entity.find('.notification-item-wrapper').attr('href', item.LinkedURL);
			Object.keys(item.Detail).forEach(function (key, index) {
				entity.find('.notification-detail-' + key).text(item.Detail[key]);
			});

			$(this).append(entity);

		}, $('.notification-scroll'));
	}
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
							<a class="notification-item-wrapper display-block" href="#" title="">
								<div class="row">
									<div class="col-xs-4">
										<img class="notification-item-thumbnail img-responsive" src="" alt="">
									</div>
									<div class="col-xs-8">
										<div class="notification-item-article break-word">
											<b class="notification-detail-user"></b> が あなたのステージ
											「<b class="notification-detail-stage"></b>」にコメントしました
										</div>
									</div>
								</div>
							</a>
						</li>
						<!-- ~template -->
						<li>
							<span class="btn btn-link notification-check">
								すべてチェック<span class="glyphicon glyphicon-check"></span>
							</span>
						</li>
						<div class="notification-scroll"></div>
						<li>
							<a class="btn btn-link" href="../comments/" title="See all">
								<h5>これまでのコメント</h5>
							</a>
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