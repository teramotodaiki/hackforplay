<?php
// topPage or inGame
$header_pattern = "topPage";
if(preg_match("/^.*\/s/", $_SERVER["PHP_SELF"])){
	$header_pattern = "inGame";
	$mode 	= filter_input(INPUT_GET, "mode");
	if(!isset($mode)){
		$mode	= isset($stage['restaging_id']) ? "replay" : "official";
	}
}else if(preg_match("/^.*\/m/", $_SERVER["PHP_SELF"])){
	$header_pattern = "more";
}else if(preg_match("/^.*\/a/", $_SERVER["PHP_SELF"])){
	$header_pattern = "admin";
}else if(preg_match("/^.*\/r/", $_SERVER["PHP_SELF"])){
	$header_pattern = "replay";
}
?>
<script type="text/javascript" charset="utf-8">
$(function(){
	// サインイン/サインアウトしたとき、ヘッダのボタンを切り替える
	$(".h4p_signin,.h4p_signout").hide();

	function authtext(result){
		console.log(result);
		if(result === "success"){
			$(".h4p_signin").hide();
			$(".h4p_signout").show();
		}else{
			$(".h4p_signin").show();
			$(".h4p_signout").hide();
		}
	}
	checkSigninSession(function(result){ authtext(result); });
	$("#authModal").on('hidden.bs.modal', function(){
		// 別タブでGET送信認証していてもlocalStorage経由で結果を得る
		checkSigninSession(function(result){ authtext(result); }, true);
	});
});
</script>
<header class="navbar navbar-static-top" <?php if($header_pattern == "topPage"): ?>style="margin-bottom:0px;"<?php endif; ?>>
	<div class="container">
		<div class="navbar-header h4p_header">
			<a class="" title="ハックフォープレイ" href="/">
				<img class="h4p_header-logo" src="/logo.png" alt="hackforplay" />
			</a>
		</div>
		<nav class="collapse navbar-collapse h4p_header_nav_padding" role="navigation">
			<ul class="nav navbar-nav">
				<?php switch ($header_pattern) :
					case 'topPage':
					?>
					<li><a class="h4p_header" href="http://hackforplay.weebly.com/contact.html" title="Contact">
					お問い合わせ</a></li>
					<li><a class="h4p_header" href="http://hackforplay.weebly.com/blog/001" title="Blog">
						ブログ</a></li>
					<?php
						break;
					case 'inGame':
						if ($mode == "replay" || $mode == "restaging") : ?>
						<li><a class="h4p_header" href="/r" title="改造ステージ一覧へ">改造ステージ一覧へ</a></li>
						<?php endif; ?>
						<li><a class="h4p_header" href="../" title="トップに戻る">トップに戻る</a></li>
						<?php
						break;
					case 'replay':
						?>
							<li class="h4p_signin"><button type="button" class="btn btn-link h4p_header" data-toggle="modal" data-target="#authModal">サインインまたはサインアップ</button></li>
							<li class="h4p_signout"><button type="button" class="btn btn-link h4p_header" onclick="signout();">サインアウト</button></li>
						<?php
						break;
					default: ?>
						<li><a class="h4p_header" href="../" title="トップに戻る">トップに戻る</a></li>
					<?php
						break;
				endswitch; ?>
			</ul>
		</nav>
	</div>
</header>