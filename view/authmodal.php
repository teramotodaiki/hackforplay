<!-- Authorize Modal -->
<script type="text/javascript" charset="utf-8">
$(function() {

	$("#authModal").on('shown.bs.modal', function() {
		// 状況に応じてページを表示
		var unconfirmed_email = localStorage.getItem('unconfirmed_email');
		if(unconfirmed_email === null){
			// メールアドレスの入力
			$(".auth-page-1").show();
		}else{
			// 仮パスワードの入力
			$(".auth-page-2").show();
			// メールアドレスの自動入力
			$("input[name=email]").val(unconfirmed_email);
		}
	});

	$("#authModal").modal("show");

	// メールアドレスの入力
	$(".auth-submit").hide();
	$(".auth-page-1 input").on('change', function() {
		var value = $(this).val();
		// @が入っているかどうかのみ調べる
		if(value.indexOf("@") !== -1){
			$.post('/auth/checkemail.php', {
				'email': value
			}, function(data, textStatus, xhr) {
				if(data === "available"){
					$(".auth-page-1 .auth-submit").fadeIn('fast');
				}else if(data === "invalid"){
					$(".auth-page-1 .auth-submit").fadeOut('fast');
					// メールアドレスが無効です　のアラート表示
				}else{
					var result = jQuery.parseJSON(data);
					console.log(result);
				}
			});
		}else{
			$(".auth-page-1 .auth-submit").fadeOut('fast');
		}
	});

	// メール送信・仮登録
	$(".auth-page-1 .auth-submit").on('click', function() {
		$(this).attr('disabled', 'disabled');

		var value = $("input[name=email]").val();
		$.post('/auth/signupwithemail.php', {
			'email': value
		}, function(data, textStatus, xhr) {
			if(data === "success"){
				// メールアドレスをローカルストレージに記憶
				localStorage.setItem('unconfirmed_email', value);

				// 仮パスワード入力画面へ
				$(".auth-page-1").hide('fast', function () {
					$(".auth-page-2").fadeIn();
				});
			}else{
				// セッションが作られているか、確認する必要
				console.log(data);
			}
		});
	});

	// 仮パスワード入力
	$(".auth-page-2 input").on('change', function() {
		var value = $(this).val();
		if(value !== ""){
			$(".auth-page-2 .auth-submit").fadeIn('fast');
		}else{
			$(".auth-page-2 .auth-submit").fadeOut('fast');
		}
	});

	// パスワード確認・本登録
	$(".auth-page-2 .auth-submit").on('click', function() {
		$(this).attr('disabled', 'disabled');

		var password = $("input[name=tmp-password]").val();
		var email = $("input[name=email]").val();
		$.post('/auth/confirmpassword.php', {
			'password' : password,
			'email' : email
		}, function(data, textStatus, xhr) {
			if (data === "success") {
				// 仮登録状態を解除
				localStorage.removeItem('unconfirmed_email');

				// パスワード設定画面へ
				$(".auth-page-2").hide('fast', function () {
					$(".auth-page-3").fadeIn();
				});
			}else{
				console.log(data);
			}
		});
	});

	// パスワード変更
	$(".auth-page-3 input").on('change', function() {
		var new_password = $(".new-password").val();
		var confirm_password = $(".confirm-password").val();

		if (new_password.length < 8) {
			// パスワードは８文字以上にしてください
		}else if(new_password !== confirm_password) {
			// パスワードがことなります
		}else{
			$(".auth-page-2 .auth-submit").fadeIn('fast');
		}
	});

	// ページ１に戻る
	$(".auth-modal-back").on('click', function() {
		$("#authModal .modal-body").hide();
		$(".auth-page-1").fadeIn('fast');
		$(".auth-page-1 .auth-submit").fadeIn('fast');
	});
});
</script>
<div class="modal fade" id="authModal" tabindex="-1" role="dialog" aria-labelledby="authModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
    		<div class="modal-header">
    			サインインまたはサインアップしてください
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	    	</div>
		    <div class="modal-body auth-page-1" style="display: none">
				<label for="email" class="control-label">メールアドレス:</label>
				<input type="email" class="form-control" name="email" placeholder="yours@example.com">
				<button type="button" class="btn btn-block btn-primary auth-submit">メールを送信</button>
		    </div>
		    <div class="modal-body auth-page-2" style="display: none">
		    	<p>メールが送信されました</p>
		    	<p>本文に書かれた「仮パスワード」を入力してください</p>
				<input type="password" class="form-control" name="tmp-password">
				<button type="button" class="btn btn-block btn-primary auth-submit">確認</button>
				<p class="gray">メールアドレスの入力に<button type="button" class="btn btn-link auth-modal-back">
					もどる</button></p>
				<p class="gray">または、<button type="button" class="btn btn-link" data-dismiss="modal">スキップ</button>する</p>
		    </div>
		    <div class="modal-body auth-page-3" style="display: none">
		    	<p>登録が完了しました</p>
		    	<p>新しくパスワードを設定する場合は、こちらに入力してください</p>
				<input type="password" class="form-control" name="new-password">
				<input type="password" class="form-control" name="confirm-password">
				<button type="button" class="btn btn-block btn-primary auth-submit">設定</button>
				<p class="gray">または、<button type="button" class="btn btn-link" data-dismiss="modal">スキップ</button>する</p>
		    </div>
    		<div class="modal-footer">
        		<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
    		</div>
		</div>
	</div>
</div>