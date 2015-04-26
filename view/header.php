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
	$("#authModal,#signinModal").on('hidden.bs.modal', function(){
		// 別タブでGET送信認証していてもlocalStorage経由で結果を得る
		checkSigninSession(function(result){ authtext(result); }, true);
	});
});
</script>
<header class="navbar navbar-static-top">
	<div class="container">
		<div class="navbar-header">
	     	<a class="navbar-brand" title="ハックフォープレイ" href="/">
	        	<img alt="hackforplay" src="/logo.png">
	     	</a>
	    </div>
	    <nav class="collapse navbar-collapse">
	    	<ul class="nav navbar-nav">
	    	<?php if($header_pattern == 'inGame' && $mode == 'official'): ?>
	    		<li><a class="btn btn-link navbar-btn" href="../" title="トップに戻る">トップに戻る</a></li>
	    	<?php elseif ($header_pattern == 'inGame' && $mode != 'official'): ?>
	    		<li><a class="btn btn-link navbar-btn" href="/r" title="改造ステージ一覧へ">改造ステージ一覧へ</a></li>
	    	<?php elseif ($header_pattern == 'admin'): ?>
	    		<li><a class="btn btn-link navbar-btn" href="/r" title="改造ステージ一覧へ">改造ステージ一覧へ</a></li>
		    <?php elseif ($header_pattern == 'replay'): ?>
	    		<li><a class="btn btn-link navbar-btn" href="../" title="トップに戻る">トップに戻る</a></li>
			<?php endif; ?>
	    	</ul>
	    	<ul class="nav navbar-nav navbar-right">
	    		<li class="h4p_signin"><button type="button" class="btn btn-link navbar-btn" data-toggle="modal" data-target="#signinModal">ログイン</button></li>
				<li class="h4p_signin"><button type="button" class="btn btn-default navbar-btn" data-toggle="modal" data-target="#authModal">会員登録</button></li>
				<li class="h4p_signout"><button type="button" class="btn btn-link navbar-btn" onclick="signout();">ログアウト</button></li>
	    	</ul>
	    </nav>
	</div>
</header>