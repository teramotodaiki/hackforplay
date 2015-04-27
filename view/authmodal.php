<!-- Authorize Modal -->
<script type="text/javascript" charset="utf-8">
$(function() {

	$("#authModal").on('shown.bs.modal', function() {
		$('#authModal .modal-body').hide();
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

	$('#signinModal').on('shown.bs.modal', function() {
		$('#signinModal .modal-body').hide();
		$('.signin-page-1').show();
	});

	// サインイン
	$('#signin').submit(function(event) {
		event.preventDefault();

		var email = $("#signinEmail").val();
		var password = $("#signinPassword").val();
		$("#signin .alert").addClass('hide');

		$.post('/auth/signinwithemail.php',{
			'email': email,
			'password': password
		} , function(data, textStatus, xhr) {
			switch(data){
				case "success":
					// サインイン完了画面へ
					$(".signin-page-1").hide('fast', function () {
						$(".signin-page-2").fadeIn();
					});
					break;
				case "invalid-email":
					$('#signin .alert').text('無効なメールアドレスです').removeClass('hide');
					break;
				case "unregistered":
					$('#signin .alert').text('登録されていないメールアドレスです').removeClass('hide');
					break;
				case "incorrect-password":
					$('#signin .alert').text('パスワードが間違っています').removeClass('hide');
					break;
				default:
					console.log(data);
					break;
			}
		});
	});

	// メール送信・仮登録
	$('#signup').submit(function(event) {
		event.preventDefault();

		var value = $("#signupEmail").val();
		$('#signup .alert').addClass('hide');

		$.post('/auth/signupwithemail.php', {
			'email': value
		}, function(data, textStatus, xhr) {
			console.log(data);
			switch(data){
				case "success":
					// メールアドレスをローカルストレージに記憶
					localStorage.setItem('unconfirmed_email', value);

					// 仮パスワード入力画面へ
					$(".auth-page-1").hide('fast', function () {
						$(".auth-page-2").fadeIn();
					});
					break;
				case "invalid":
					$('#signup .alert').text('無効なメールアドレスです').removeClass('hide');
					break;
				case "reserved":
					$('#signup .alert').text('すでに登録されているメールアドレスです').removeClass('hide');
					break;
				case "sendmail-error":
					$('#signup .alert').text('メールの送信に失敗しました').removeClass('hide');
					break;
				default:
					console.log(data);
					break;
			}
		});
	});

	// パスワード確認・本登録
	$("#tmp").submit(function(event) {
		event.preventDefault();

		var password = $("#tmpPassword").val();
		var email = $("#signupEmail").val();
		$('#tmp .alert').addClass('hide');

		$.post('/auth/confirmpassword.php', {
			'password' : password,
			'email' : email
		}, function(data, textStatus, xhr) {
			switch(data){
				case "success":
					// 仮登録状態を解除
					localStorage.removeItem('unconfirmed_email');

					// プロフィール設定画面へ
					$(".auth-page-2").hide('fast', function () {
						$(".auth-page-3").fadeIn();
					});
					break;
				case "invalid-email":
					$('#tmp .alert').text('無効なメールアドレスです ' + email).removeClass('hide');
					break;
				case "already-confirmed":
					$('#tmp .alert').text('すでに登録が完了しています').removeClass('hide');
					break;
				case "incorrect-password":
					$('#tmp .alert').text('パスワードが間違っています').removeClass('hide');
					break;
				case "valid-but-failed":
					$('#tmp .alert').text('エラーにより認証ができませんでした').removeClass('hide');
					break;
			}
		});
	});

	$('#profile').submit(function(event) {
		event.preventDefault();

		var age = $('#age').val();
		var gender = $('input[name="gender"]:checked').val();
		var nickname = $('#nickname').val();
		$('#profile .alert').addClass('hide');

		$.post('/auth/updateuser.php', {
			'age' : age,
			'gender' : gender,
			'nickname' : nickname
		}, function(data, textStatus, xhr) {
			console.log(data);
			switch(data){
				case 'success':
					// ログイン完了画面へ
					$(".auth-page-3").hide('fast', function () {
						$(".auth-page-fin").fadeIn();
					});
					break;
				case 'no-session':
					$('#profile .alert').text('ログインされていません。もう一度ログインしてください');
					break;
			}
		});

	});

	// ページ１に戻る
	$(".auth-modal-back").on('click', function() {
		$("#authModal .modal-body").hide();
		$(".auth-page-1").fadeIn('fast');
	});
});
</script>
<div class="modal fade" id="authModal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
    		<div class="modal-header">
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		        <h4>会員登録</h4>
	    	</div>
		    <div class="modal-body auth-page-1" style="display: none">
		    	<form id="signup" class="form-horizontal">
					<h4>メールアドレスを入力してください</h4>
					<p class="alert alert-danger hide" role="alert"></p>
					<div class="form-group">
				    	<div class="col-sm-offset-1 col-sm-10 col-sm-offset-1">
					    	<input type="email" class="form-control" id="signupEmail" placeholder="your@email.com">
					    </div>
					</div>
				  	<div class="text-right">
						<button type="submit" class="btn btn-primary">メールを送信</button>
					</div>
				</form>
		    </div>
		    <div class="modal-body auth-page-2" style="display: none">
		    	<form id="tmp" class="form-horizontal">
			    	<h4>メールが送信されました</h4>
			    	<h5>本文に書かれた「仮パスワード」を入力してください</h5>
					<p class="alert alert-danger hide" role="alert"></p>
					<div class="form-group">
				    	<div class="col-sm-offset-1 col-sm-10 col-sm-offset-1">
					    	<input type="password" class="form-control" id="tmpPassword">
					    </div>
					</div>
				  	<div class="text-right">
						<button type="submit" class="btn btn-primary">確認</button>
					</div>
				</form>
				<p>メールアドレスの入力に<button type="button" class="btn btn-link auth-modal-back">もどる</button></p>
		    </div>
		    <div class="modal-body auth-page-3" style="display: none">
		    	<h4>プロフィールを入力してください</h4>
		    	<form id="profile" class="form-horizontal">
					<p class="alert alert-danger hide" role="alert"></p>
				  	<div class="form-group">
				    	<label for="nickname" class="col-sm-3 control-label">ニックネーム</label>
				    	<div class="col-sm-8">
				    		<input type="text" class="form-control" id="nickname">
				    	</div>
				  	</div>
				  	<div class="form-group">
				  		<label class="col-sm-3 control-label" for="gender">性別</label>
				    	<div id="gender" class="col-sm-8">
					    	<label class="radio-inline"><input type="radio" name="gender" value="man" checked>男</label>
					  		<label class="radio-inline"><input type="radio" name="gender" value="woman">女</label>
				    	</div>
				  	</div>
				  	<div class="form-group">
				  		<label for="age" class="col-sm-3 control-label">年齢</label>
				    	<div class="col-sm-8">
				    		<input type="number" class="form-control" id="age" value="16">
				    	</div>
				  	</div>
				  	<div class="text-right">
					  	<button type="submit" class="btn btn-primary">登録</button>
				  	</div>
				</form>
		    </div>
		    <div class="modal-body auth-page-fin text-center" style="display: none">
		    	<h4>ログインしました</h4>
		    </div>
    		<div class="modal-footer">
        		<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
    		</div>
		</div>
	</div>
</div>
<div class="modal fade" id="signinModal" tabindex="-1" role="dialog" aria-hidden="true">
  	<div class="modal-dialog">
    	<div class="modal-content">
      		<div class="modal-header">
	        	<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        	<h4 class="modal-title">ログイン</h4>
    		</div>
		    <div class="modal-body signin-page-1">
		    	<form id="signin" class="form-horizontal">
					<p class="alert alert-danger hide" role="alert"></p>
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
					  	<button type="submit" class="btn btn-default">ログイン</button>
				  	</div>
				</form>
		    </div>
		    <div class="modal-body signin-page-2 text-center" style="display: none">
		    	<h4>ログインできました</h4>
		    </div>
      		<div class="modal-footer">
		        <button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
      		</div>
    	</div>
  	</div>
</div>