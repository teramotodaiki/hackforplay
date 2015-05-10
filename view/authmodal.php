<!-- Authorize Modal -->
<script type="text/javascript" charset="utf-8">
$(function() {
	// Initialize tooltip
	$('[data-toggle="tooltip"]').tooltip();

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
		var submit = $(this).find('button[type="submit"]').button('loading');

		var email = $("#signinEmail").val();
		var password = $("#signinPassword").val();
		$("#signin .alert").addClass('hide');

		$.post('/auth/signinwithemail.php',{
			'email': email,
			'password': password
		} , function(data, textStatus, xhr) {
			submit.button('reset');
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
		var submit = $(this).find('button[type="submit"]').button('loading');

		var email = $("#signupEmail").val();
		var nickname = $('#nickname').val();
		var gender = $('input[name="gender"]:checked').val();
		var birthday = $('#birth_year').val() + '-' + $('#birth_month').val() + '-' + $('#birth_day').val();
		var experience_days = $('#experience_days').val();
		var timezone_name = $('#timezone').val();
		var timezone_offset = $('#timezone option:selected').attr('data-offset');
		var timezone = new Date().getTimezoneString();

		$('#signup .alert').addClass('hide');

		$.post('/auth/signupwithemail.php', {
			'email': email,
			'gender' : gender,
			'nickname' : nickname,
			'birthday' : birthday,
			'timezone_name' : timezone_name,
			'timezone_offset' : timezone_offset,
			'experience_days' : experience_days,
			'timezone': timezone
		}, function(data, textStatus, xhr) {
			console.log(data);
			submit.button('reset');
			switch(data){
				case "success":
					// メールアドレスをローカルストレージに記憶
					localStorage.setItem('unconfirmed_email', value);
					$('.auth-page-2 #tmpPassword').val('');
					$('.auth-page-2 p.alert').hide();

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
		var submit = $(this).find('button[type="submit"]').button('loading');

		var password = $("#tmpPassword").val();
		var email = $("#signupEmail").val();
		$('#tmp .alert').addClass('hide');

		$.post('/auth/confirmpassword.php', {
			'password' : password,
			'email' : email
		}, function(data, textStatus, xhr) {
			submit.button('reset');
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
		var submit = $(this).find('button[type="submit"]').button('loading');

		var password = $('#password').val();
		var confirm = $('#confirm').val();

		$('#profile .alert').addClass('hide');
		$('.has-error').removeClass('has-error');

		// Password validation
		if(password.length < 8){
			$('#profile .alert').text('安全のため、パスワードは8文字以上にしてください').removeClass('hide');
			$('#password').parents('.has-feedback').addClass('has-error');
			return;
		}
		if(password !== confirm) {
			$('#profile .alert').text('パスワードが一致しません').removeClass('hide');
			$('#password').parents('.has-feedback').addClass('has-error');
			$('#confirm').parents('.has-feedback').addClass('has-error');
			return;
		}

		$.post('/auth/updateuserinfoimmediately.php', {
			'password' : password
		}, function(data, textStatus, xhr) {
			console.log(data);
			submit.button('reset');
			switch(data){
				case 'success':
					// ログイン完了画面へ
					$(".auth-page-3").hide('fast', function () {
						$(".auth-page-fin").fadeIn();
					});
					break;
				case 'no-session':
					$('#profile .alert').text('ログインされていません。もう一度ログインしてください').removeClass('hide');
					break;
				case 'not-immediately':
					$('#profile .alert').text('登録してから一度ログアウトされています。マイページから情報を入力してください').removeClass('hide');
					break;
				default:
					$('#profile .alert').text('登録できない内容です。修正してください').removeClass('hide');
					var invalid_inputs = jQuery.parseJSON(data);
					invalid_inputs.forEach(function(item){
						console.log($('#'+item).parents('.form-group'));
						$('#'+item).parents('.form-group').addClass('has-error');
					});
					break;
			}
		});

	});

	// ページ１に戻る
	$(".auth-modal-back").on('click', function() {
		$("#authModal .modal-body").hide();
		$(".auth-page-1").fadeIn('fast');
	});

	// タイムゾーンの初期値
	var timezone = new Date().getTimezoneOffset() * -60;
	$('#timezone option').each(function(index, el) {
		$(el).attr('selected', $(el).data('offset') === timezone);
	});
});
</script>
<div class="modal fade" id="authModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
	<div class="modal-dialog">
		<div class="modal-content">
    		<div class="modal-header">
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		        <h4>会員登録</h4>
	    	</div>
		    <div class="modal-body auth-page-1" style="display: none">
		    	<form id="signup" class="form-horizontal">
					<h4>プロフィールを入力してください</h4>
					<p class="alert alert-danger hide" role="alert"></p>
					<div class="form-group has-feedback">
				    	<label for="signupEmail" class="col-sm-3 control-label">メールアドレス</label>
				    	<div class="col-sm-8">
					    	<input type="email" class="form-control" id="signupEmail" placeholder="your@email.com">
				    	</div>
					</div>
				  	<div class="form-group has-feedback">
				    	<label for="nickname" class="col-sm-3 control-label">ニックネーム</label>
				    	<div class="col-sm-8">
				    		<input type="text" class="form-control" id="nickname">
				    	</div>
				    	<div class="col-sm-1" data-toggle="tooltip" data-placement="left" title="本名は使用できません">
				    		<span class="glyphicon glyphicon-question-sign form-control-feedback"></span>
				    	</div>
				  	</div>
				  	<div class="form-group has-feedback">
				  		<label class="col-sm-3 control-label" for="gender">性別</label>
				    	<div id="gender" class="col-sm-8">
					    	<label class="radio-inline"><input type="radio" name="gender" value="man" checked>男</label>
					  		<label class="radio-inline"><input type="radio" name="gender" value="woman">女</label>
				    	</div>
				  	</div>
				  	<div class="form-group has-feedback">
				  		<label for="birth_year" class="col-sm-3 control-label">生年月日</label>
				    	<div class="col-sm-4">
				    		<select id="birth_year" class="col-sm-4 form-control">
					    		<?php for($y = intval(date('Y')); $y > 1900; $y--): ?>
				    			<option value="<?php echo $y; ?>"><?php echo $y; ?>年</option>
						    	<?php endfor; ?>
				    		</select>
				    	</div>
				    	<div class="col-sm-2">
				    		<select id="birth_month" class="col-sm-2 form-control">
					    		<?php for($m = 1; $m <= 12; $m++): ?>
				    			<option value="<?php echo $m; ?>"><?php echo $m; ?>月</option>
						    	<?php endfor; ?>
				    		</select>
				    	</div>
				    	<div class="col-sm-2">
				    		<select id="birth_day" class="col-sm-2 form-control">
					    		<?php for($d = 1; $d <= 31; $d++): ?>
				    			<option value="<?php echo $d; ?>"><?php echo $d; ?>日</option>
						    	<?php endfor; ?>
				    		</select>
				    	</div>
				    	<div class="col-sm-1" data-toggle="tooltip" data-placement="left" title="あなたが生まれた年月日を選んでください">
				    		<span class="glyphicon glyphicon-question-sign form-control-feedback"></span>
				    	</div>
				  	</div>
				  	<div class="form-group has-feedback">
				  		<label for="timezone" class="col-sm-3 control-label">タイムゾーン</label>
				    	<div class="col-sm-8">
				    		<select id="timezone" class="form-control">
				    			<?php require 'timezone.php'; ?>
				    		</select>
				    	</div>
				    	<div class="col-sm-1" data-toggle="tooltip" data-placement="left" title="自分の住んでいる地域に近いところを選んでください">
				    		<span class="glyphicon glyphicon-question-sign form-control-feedback"></span>
				    	</div>
				  	</div>
				  	<div class="form-group has-feedback">
				  		<label for="experience_days" class="col-sm-3 control-label">プログラミングの経験</label>
				    	<div class="col-sm-8">
				    		<select id="experience_days" class="form-control">
				    			<option value="0" selected>はじめて</option>
				    			<option value="30">およそ１ヶ月</option>
				    			<option value="180">およそ半年</option>
				    			<option value="365">およそ１年</option>
				    			<option value="1095">およそ３年</option>
				    			<option value="1825">５年以上</option>
				    		</select>
				    	</div>
				    	<div class="col-sm-1" data-toggle="tooltip" data-placement="left" title="これまでにプログラミングをしてきた期間を選んでください">
				    		<span class="glyphicon glyphicon-question-sign form-control-feedback"></span>
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
		    	<h4>パスワードを設定してください</h4>
		    	<form id="profile" class="form-horizontal">
					<p class="alert alert-danger hide" role="alert"></p>
				  	<div class="form-group has-feedback">
				    	<label for="password" class="col-sm-3 control-label">パスワード</label>
				    	<div class="col-sm-8">
				    		<input type="password" class="form-control" id="password">
				    	</div>
				    	<div class="col-sm-1" data-toggle="tooltip" data-placement="left" title="8文字以上の長さが必要です">
				    		<span class="glyphicon glyphicon-question-sign form-control-feedback"></span>
				    	</div>
				  	</div>
				  	<div class="form-group has-feedback">
				    	<label for="confirm" class="col-sm-3 control-label">もう一度入力</label>
				    	<div class="col-sm-8">
				    		<input type="password" class="form-control" id="confirm">
				    	</div>
				    	<div class="col-sm-1" data-toggle="tooltip" data-placement="left" title="上と同じ文字を入力してください">
				    		<span class="glyphicon glyphicon-question-sign form-control-feedback"></span>
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
<div class="modal fade" id="signinModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
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
				<button type="button" class="btn btn-link" data-dismiss="modal" data-toggle="modal" data-target="#authModal" >アカウントを持っていません</button>
		        <button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
      		</div>
    	</div>
  	</div>
</div>