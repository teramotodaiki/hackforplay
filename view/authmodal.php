<!-- Authorize Modal -->
<script type="text/javascript" charset="utf-8">
$(function() {

	$("#authModal").on('shown.bs.modal', function() {
		// 状況に応じてページを表示
		var unconfirmed_email = localStorage.getItem('unconfirmed_email');
		if(unconfirmed_email === null){
			// メールアドレスの入力・サインイン
			$(".auth-page-1").show();
		}else{
			// 仮パスワードの入力
			$(".auth-page-2").show();
			// メールアドレスの自動入力
			$("#signupEmail").val(unconfirmed_email);
		}
	});

	// サインイン
	$('#signin').submit(function(event) {
		event.preventDefault();

		var email = $("#signinEmail").val();
		var password = $("#signinPassword").val();

		$.post('/auth/signinwithemail.php',{
			'email': email,
			'password': password
		} , function(data, textStatus, xhr) {
			switch(data){
				case "success":
					// サインイン完了画面へ
					$(".auth-page-1").hide('fast', function () {
						$(".auth-page-fin").fadeIn();
					});
					break;
					// invalid-email , unregistered , incorrect-password , success
				case "invalid-email":

					break;
				default:
					// 個々の対応
					console.log(data);
					break;
			}
		});
	});

	// サインアップ メールアドレスの入力
	$("#signupEmail").on('change', function() {
		var value = $(this).val();
		// @が入っているかどうかのみ調べる
		if(value.indexOf("@") !== -1){
			$.post('/auth/checkemail.php', {
				'email': value
			}, function(data, textStatus, xhr) {
				if(data === "available"){
					// velify
				}else if(data === "invalid"){
					// メールアドレスが無効です　のアラート表示
				}else{
					var result = jQuery.parseJSON(data);
					console.log(result);
					// サインインのサジェスト
				}
			});
		}else{
			//
		}
	});

	// メール送信・仮登録
	$('#signup').submit(function(event) {
		event.preventDefault();

		var value = $("#signupEmail").val();
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

	// パスワード確認・本登録
	$("#tmp").submit(function(event) {
		event.preventDefault();

		var password = $("#tmpPassword").val();
		var email = $("#signupEmail").val();
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
	});
});
</script>
<div class="modal fade" id="authModal" tabindex="-1" role="dialog" aria-labelledby="authModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
    		<div class="modal-header">
    			サインアップまたはサインインしてください
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	    	</div>
		    <div class="modal-body auth-page-1" style="display: none">
		    	<form id="signup" class="form-horizontal">
					<h4>サインアップ</h4>
					<div class="form-group">
				    	<label for="signupEmail" class="col-sm-3 control-label">メールアドレス</label>
				    	<div class="col-sm-8">
					    	<input type="email" class="form-control" id="signupEmail">
					    </div>
					</div>
				  	<div class="text-right">
						<button type="submit" class="btn btn-default">メールを送信</button>
					</div>
				</form>
				<hr>
				<form id="signin" class="form-horizontal">
					<h4>サインイン</h4>
				  	<div class="form-group">
				    	<label for="signinEmail" class="col-sm-3 control-label">メールアドレス</label>
				    	<div class="col-sm-8">
				    		<input type="email" class="form-control" id="signinEmail">
				    	</div>
				  	</div>
				  	<div class="form-group">
				    	<label for="signinPassword" class="col-sm-3 control-label">パスワード</label>
				    	<div class="col-sm-8">
					    	<input type="password" class="form-control" id="signinPassword">
					    </div>
				  	</div>
				  	<div class="text-right">
					  	<button type="submit" class="btn btn-default">サインイン</button>
				  	</div>
				</form>
		    </div>
		    <div class="modal-body auth-page-2" style="display: none">
		    	<h4>メールが送信されました</h4>
		    	<h5>本文に書かれた「仮パスワード」を入力してください</h5>
		    	<form id="tmp" class="form-horizontal">
					<div class="form-group">
				    	<label for="tmpPassword" class="col-sm-3 control-label">仮パスワード</label>
				    	<div class="col-sm-8">
					    	<input type="password" class="form-control" id="tmpPassword">
					    </div>
					</div>
				  	<div class="text-right">
						<button type="submit" class="btn btn-primary">確認</button>
					</div>
				</form>
				<p>メールアドレスの入力に<button type="button" class="btn btn-link auth-modal-back">
					もどる</button></p>
				<p>または、<button type="button" class="btn btn-link" data-dismiss="modal">スキップ</button>する</p>
		    </div>
		    <div class="modal-body auth-page-3" style="display: none">
		    	<h4>登録が完了しました</h4>
		    	<h5>新しくパスワードを設定する場合は、こちらに入力してください</h5>
		    	<form id="reset" class="form-horizontal">
				  	<div class="form-group">
				    	<label for="resetPassword" class="col-sm-3 control-label">パスワード</label>
				    	<div class="col-sm-8">
				    		<input type="password" class="form-control" id="resetPassword">
				    	</div>
				  	</div>
				  	<div class="form-group">
				    	<label for="resetConfirmed" class="col-sm-3 control-label">もう一度入力</label>
				    	<div class="col-sm-8">
					    	<input type="password" class="form-control" id="resetConfirmed">
					    </div>
				  	</div>
				  	<div class="text-right">
					  	<button type="submit" class="btn btn-default">再設定</button>
				  	</div>
					<p>または、<button type="button" class="btn btn-link" data-dismiss="modal">スキップ</button>する</p>
				</form>
		    </div>
		    <div class="modal-body auth-page-fin text-center" style="display: none">
		    	<h4>サインインしました</h4>
		    </div>
    		<div class="modal-footer">
        		<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
    		</div>
		</div>
	</div>
</div>