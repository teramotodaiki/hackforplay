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
					break;
			}
		});
	});

	// メール送信前のValidation（Validationしてボタンをアクティブにする）
	$('form#signup button[type="submit"]').attr('disabled', true);
	setInputRoutine('form#signup', function(){
		var policy = $(this).find('#policy').is(':checked');
		var count = 0;
		$(this).find('input').each(function(index, el) {
			if($(el).val() === '') count++;
		});
		$(this).find('button[type="submit"]').attr('disabled', count > 0 || !policy);
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
		var timezone = new Date().getTimezoneString();

		$('#signup .alert').addClass('hide');

		$.post('/auth/signupwithemail.php', {
			'email': email,
			'gender' : gender,
			'nickname' : nickname,
			'birthday' : birthday,
			'experience_days' : experience_days,
			'timezone': timezone
		}, function(data, textStatus, xhr) {
			submit.button('reset');
			switch(data){
				case "success":
					// メールアドレスをローカルストレージに記憶
					localStorage.setItem('unconfirmed_email', email);
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
					break;
			}
		});
	});

	// 仮パスワード確認・本登録
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

					// パスワード設定画面へ
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

	$('#setPassword').submit(function(event) {
		event.preventDefault();

		var password = $(this).find('#password').val();
		var confirm = $(this).find('#confirm').val();

		$(this).find('.alert').addClass('hide');
		$(this).find('.has-error').removeClass('has-error');

		// Password validation
		if(password.length < 8){
			$(this).find('.alert').text('安全のため、パスワードは8文字以上にしてください').removeClass('hide');
			$(this).find('#password').parents('.has-feedback').addClass('has-error');
			return;
		}
		if(password !== confirm) {
			$(this).find('.alert').text('パスワードが一致しません').removeClass('hide');
			$(this).find('#password').parents('.has-feedback').addClass('has-error');
			$(this).find('#confirm').parents('.has-feedback').addClass('has-error');
			return;
		}

		var submit = $(this).find('button[type="submit"]').button('loading');
		$.post('/auth/updateuserinfoimmediately.php', {
			'password' : password
		}, function(data, textStatus, xhr) {
			submit.button('reset');
			switch(data){
				case 'success':
					// ログイン完了画面へ
					$(".auth-page-3").hide('fast', function () {
						$(".auth-page-fin").fadeIn();
					});
					break;
				case 'no-session':
					$(this).find('alert').text('ログインされていません。もう一度ログインしてください').removeClass('hide');
					break;
				case 'not-immediately':
					$(this).find('.alert').text('登録してから一度ログアウトされています。マイページから情報を入力してください').removeClass('hide');
					break;
				default:
					break;
			}
		});

	});

	// ページ１に戻る
	$("#authModal .auth-modal-back").on('click', function() {
		$("#authModal .modal-body").hide();
		$("#authModal .auth-page-1").fadeIn('fast');
	});

	// パスワードのリセット
	$('#resetModal').on('shown.bs.modal', function() {
		$(this).find('.modal-body').hide();
		$(this).find('.modal-page-1').show();
	});

	$('form[name="resetRequest"] button[type="submit"]').attr('disabled', true);
	setInputRoutine('form[name="resetRequest"]', function(){
		var invalid = $(this).find('#email').val().indexOf('@') === -1;
		$(this).find('button[type="submit"]').attr('disabled', invalid);
	});

	$('form[name="resetRequest"]').submit(function(event) {
		event.preventDefault();
		var submit = $(this).find('button[type="submit"]').button('loading');

		var $form = $(this);
		var submit = $form.find('button[type="submit"]');
		var email = $form.find('#email').val();

		$(this).find('.alert').addClass('hide');
		$.post('../auth/requestresetpassword.php',{
			'email': email,
			'attendance-token': sessionStorage.getItem('attendance-token')
		}, function(data, textStatus, xhr) {
			submit.button('reset');
			switch(data){
				case 'invalid-email':
					$form.find('.alert').text('登録されていないメールアドレスです').removeClass('hide');
					break;
				case 'database-error':
					$form.find('.alert').text('エラーにより照会できませんでした').removeClass('hide');
					break;
				default:
				case 'success':
					$('#resetModal .modal-body').hide('fast', function() {
						$('#resetModal .modal-page-2').show('fast');
						$('form[name="confirmCode"] #code').val('');
					});
					break;
			}
		});
	});

	$('form[name="confirmCode"] button[type="submit"]').attr('disabled', true);
	setInputRoutine('form[name="confirmCode"]', function(){
		var invalid = $(this).find('#code').val().length !== 6;
		$(this).find('button[type="submit"]').attr('disabled', invalid);
	});

	$('form[name="confirmCode"]').submit(function(event) {
		event.preventDefault();
		var submit = $(this).find('button[type="submit"]').button('loading');

		var $form = $(this);
		var code = $form.find('#code').val();
		var email = $('form[name="resetRequest"] #email').val();

		$(this).find('.remove-after-submit').remove();
		$(this).find('.alert').addClass('hide');
		$.post('../auth/confirmresetcode.php',{
			'email' : email,
			'code' : code
		}, function(data, textStatus, xhr) {
			submit.button('reset');
			switch(data){
				case 'invalid-email':
					$form.find('.alert').text('メールアドレスが間違っています').removeClass('hide');
					break;
				case 'incorrect-code':
					$form.find('.alert').text('確認コードが間違っています').removeClass('hide');
					break;
				case 'already-expired':
					$('#resetModal .modal-body').hide('fast', function() {
						$('#resetModal .modal-page-1').show('fast');
						$('form[name="resetRequest"] .alert').text('確認コードの期限が切れています。もう一度コードを送信してください').removeClass('hide');
					});
					break;
				case 'success':
					$('#resetModal').modal('hide');
					$('#authModal').off('shown.bs.modal').on('shown.bs.modal', function() {
						$('#authModal .modal-body').hide();
						$('#authModal .auth-page-3').show('fast');
					}).modal('show');
					break;
			}
		});
	});

	// Twitter OAuth認証
	$('.login-with-twitter').on('click', function(event) {
		var authed = '/loginsuccess.php';
		var login_successed = $(this).data('login_successed') || window.location.pathname + window.location.search;
		location.href =
		'/loginwithtwitter.php?authed=' + encodeURIComponent(authed) +
		'&login_successed=' + encodeURIComponent(login_successed);
	});

	// ペーパーログインでサインイン
	$('#paper-signin').submit(function(event) {
		event.preventDefault();
		var submit = $(this).find('button[type="submit"]').button('loading');

		var id = $("#paper-signinID").val();
		var password = $("#paper-signinPassword").val();
		$("#paper-signin .alert").addClass('hide');

		$.post('../auth/signinwithpaper.php',{
			'id': id,
			'password': password
		} , function(data, textStatus, xhr) {
			submit.button('reset');
			switch(data){
				case "success":
					// サインイン完了画面へ
					$('#paperLoginModal').modal('hide');
					break;
				case "unregistered":
					$('#paper-signin .alert').text('とうろく されていません').removeClass('hide');
					break;
				case "incorrect-password":
					$('#paper-signin .alert').text('パスワードが まちがっています').removeClass('hide');
					break;
				default:
					break;
			}
		});
	});

	$('.login-with-paper').on('click', function() {

		var timezone = new Date().getTimezoneString();

		$.post('../auth/signupwithpaper.php', {
			'timezone': timezone
		} , function(data, textStatus, xhr) {

			$('#authModal').modal('hide');
			switch (data) {
				case 'parse-error':
					break;
				default:
					var result = JSON.parse(data);
					$('#paper-infoModal .paper-id').text(result.id);
					$('#paper-infoModal .paper-password').text(result.password);
					$('#paper-infoModal').modal('show');
					break;
			}
		});
	});

	$('#paper-infoModal').on('hide.bs.modal', function(event) {
		if (confirm('メモ できましたか？\nいちど とじたら もう いっしょう みることは できません')) {
			// 情報を削除
			$(this).find('.paper-id').text('');
			$(this).find('.paper-password').text('');
			// サインインしてもらう
			$('#paperLoginModal').modal('show');
		} else {
			event.preventDefault();
		}
	});

	// メール送信前のValidation（Validationしてボタンをアクティブにする）
	$('form#paper-emailsignup button[type="submit"]').attr('disabled', true);
	setInputRoutine('form#paper-emailsignup', function(){
		var policy = $(this).find('#paper-policy').is(':checked');
		var count = 0;
		$(this).find('input').each(function(index, el) {
			if($(el).val() === '') count++;
		});
		$(this).find('button[type="submit"]').attr('disabled', count > 0 || !policy);
	});

	// ペーパーログインからメールアドレス会員へ
	$('#paper-emailsignup').submit(function(event) {
		event.preventDefault();

		var submit = $(this).find('button[type="submit"]').button('loading');

		var email = $(this).find('#paper-signupEmail').val();
		var nickname = $(this).find('#paper-nickname').val();
		var gender = $(this).find('input[name="paper-gender"]:checked').val();
		var birthday =
			$(this).find('#paper-birth_year').val() + '-' +
			$(this).find('#paper-birth_month').val() + '-' +
			$(this).find('#paper-birth_day').val();
		var experience_days = $(this).find('#paper-experience_days').val();
		var timezone = new Date().getTimezoneString();

		$('#paper-emailsignup .alert').addClass('hide');

		$.post('../auth/signupwithemailfrompaper.php', {
			'email': email,
			'gender' : gender,
			'nickname' : nickname,
			'birthday' : birthday,
			'experience_days' : experience_days,
			'timezone': timezone
		}, function(data, textStatus, xhr) {
			submit.button('reset');
			switch(data){
				case "success":
					// メールアドレスをローカルストレージに記憶
					localStorage.setItem('unconfirmed_email', email);
					$('#paper-emailsignupModal .auth-page-2 #tmpPassword').val('');
					$('#paper-emailsignupModal .auth-page-2 p.alert').hide();

					// 仮パスワード入力画面へ
					$("#paper-emailsignupModal .auth-page-1").addClass('hidden');
					$("#paper-emailsignupModal .auth-page-2").removeClass('hidden');
					break;
				case "invalid":
					$('#paper-emailsignup .alert').text('無効なメールアドレスです').removeClass('hide');
					break;
				case "reserved":
					$('#paper-emailsignup .alert').text('すでに登録されているメールアドレスです').removeClass('hide');
					break;
				case "sendmail-error":
					$('#paper-emailsignup .alert').text('メールの送信に失敗しました').removeClass('hide');
					break;
				case "no-session":
					$('#paper-authModal').modal('show');
					break;
				case "unauthorized":
					$('#paper-emailsignup .alert').text('すでにメールアドレスが登録されています').removeClass('hide');
					break;
				default:
					break;
			}
		});
	});

	// ページ１に戻る
	$("#paper-emailsignupModal .papersignup-modal-back").on('click', function() {
		$("#paper-emailsignupModal .modal-body").addClass('hidden');
		$("#paper-emailsignupModal .auth-page-1").removeClass('hidden');
	});

	// ペーパーログイン　仮パスワード確認・本登録
	$("#paper-tmp").submit(function(event) {
		event.preventDefault();
		var submit = $(this).find('button[type="submit"]').button('loading');

		var password = $("#paper-tmpPassword").val();
		var email = $("#paper-signupEmail").val();
		$('#paper-tmp .alert').addClass('hide');

		$.post('/auth/confirmpassword.php', {
			'password' : password,
			'email' : email
		}, function(data, textStatus, xhr) {
			submit.button('reset');
			switch(data){
				case "success":
					// 仮登録状態を解除
					localStorage.removeItem('unconfirmed_email');

					// パスワード設定画面へ
					$('#paper-emailsignupModal').modal('hide');
					$('#authModal').off('shown.bs.modal');
					$('#authModal').modal('show');

					$('#authModal .modal-body').hide();
					$('#authModal .auth-page-3').fadeIn();
					break;
				case "invalid-email":
					$('#paper-tmp .alert').text('無効なメールアドレスです ' + email).removeClass('hide');
					break;
				case "already-confirmed":
					$('#paper-tmp .alert').text('すでに登録が完了しています').removeClass('hide');
					break;
				case "incorrect-password":
					$('#paper-tmp .alert').text('パスワードが間違っています').removeClass('hide');
					break;
				case "valid-but-failed":
					$('#paper-tmp .alert').text('エラーにより認証ができませんでした').removeClass('hide');
					break;
			}
		});
	});

	// 'selector' element内のinputにfocusされている間のみroutineを実行し続ける処理をセット
	function setInputRoutine (selector, routine) {
		var _intervalID = null;
		var $element = $(selector);
		$element.find('input').on('focus', function() {
			clearInterval(_intervalID);
			_intervalID = setInterval(routine.bind($element.get(0)), 100);
		}).on('blur', function() {
			clearInterval(_intervalID);
		});
		$element.find('select,input').on('change', function() {
			routine.call($element.get(0));
		});
	}
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
					    	<label class="radio-inline"><input type="radio" name="gender" value="male" checked>男</label>
					  		<label class="radio-inline"><input type="radio" name="gender" value="female">女</label>
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
				  	<div class="checkbox text-center">
				  		<label><input type="checkbox" id="policy">ハックフォープレイ株式会社が定める<a href="../policies/#anchor-agreement" title="利用規約" target='_blank'>利用規約</a>に同意します</label>
				  	</div>
				  	<div class="text-center">
						<button type="submit" class="btn btn-primary">メールを送信</button>
					</div>
				</form>
			  	<hr>
			  	<div>
			  		<p class="text-center">
			  			<span>ペーパーログイン</span>
			  			<span class="text-muted">メールアドレスのいらない、かんたんなログインです</span>
			  			<a href="javascript:void(0)" title="Signin with paper" class="login-with-paper btn btn-default btn-lg">
			  				ペーパーログインではじめる
			  				<!-- <img src="../img/signin-with-twitter.png" height="28" width="158" alt="signin with twitter"> -->
			  			</a>
			  		</p>
			  	</div>
			  	<hr>
			  	<div>
			  		<p class="text-center">
			  			<span class="text-muted">または、Twitterでアカウントを作成</span>
			  			<a href="javascript:void(0)" title="Signin with twitter" class="login-with-twitter">
			  				<img src="../img/signin-with-twitter.png" height="28" width="158" alt="signin with twitter">
			  			</a>
			  		</p>
			  	</div>
		    </div>
		    <div class="modal-body auth-page-2" style="display: none">
		    	<form id="tmp" class="form-horizontal">
			    	<h4>メールが送信されました。届くまでに数分かかることがありますので、お気をつけください</h4>
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
		    	<form id="setPassword" class="form-horizontal">
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
						<button type="button" class="btn btn-link" data-dismiss="modal" data-toggle="modal" data-target="#resetModal">パスワードを忘れました</button>
					  	<button type="submit" class="btn btn-primary">ログイン</button>
				  	</div>
				  	<hr>
				  	<div>
				  		<h4>ペーパーログイン</h4>
				  		<p class="text-center">
				  			<button data-dismiss="modal" data-toggle="modal" data-target="#paperLoginModal" class="btn btn-default btn-lg">
				  				ペーパーログイン
				  				<!-- <img src="../img/signin-with-twitter.png" height="28" width="158" alt="signin with twitter"> -->
				  			</button>
				  		</p>
				  		<p class="text-muted text-center">メモを もっているかたは こちらです。</p>
				  	</div>
				  	<hr>
				  	<div>
				  		<h4>または、Twitterでログイン</h4>
				  		<p class="text-center">
				  			<a href="javascript:void(0)" title="Signin with twitter" class="login-with-twitter">
				  				<img src="../img/signin-with-twitter.png" height="28" width="158" alt="signin with twitter">
				  			</a>
				  		</p>
				  		<p class="text-muted text-center">ログインしたあと、このページに戻ってきます</p>
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
<div class="modal fade" id="paperLoginModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
  	<div class="modal-dialog">
    	<div class="modal-content">
      		<div class="modal-header">
	        	<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        	<h4 class="modal-title">ペーパーログイン</h4>
    		</div>
		    <div class="modal-body">
		    	<div class="alert alert-success">
		    		<p>紙(かみ) に メモした <b>ID</b> と <b>パスワード</b> を にゅうりょく してください</p>
		    	</div>
		    	<form id="paper-signin" class="form-horizontal">
					<p class="alert alert-danger hide" role="alert"></p>
				  	<div class="form-group">
				    	<label for="paper-signinID" class="col-sm-3 control-label">ID</label>
				    	<div class="col-sm-8">
				    		<input type="text" class="form-control" id="paper-signinID">
				    	</div>
				  	</div>
				  	<div class="form-group">
				    	<label for="paper-signinPassword" class="col-sm-3 control-label">パスワード</label>
				    	<div class="col-sm-8">
					    	<input type="password" class="form-control" id="paper-signinPassword">
					    </div>
				  	</div>
				  	<div class="text-right">
					  	<button type="submit" class="btn btn-primary">ログイン</button>
				  	</div>
				</form>
		    </div>
      		<div class="modal-footer">
				<button type="button" class="btn btn-link" data-dismiss="modal" data-toggle="modal" data-target="#authModal" >アカウントを持っていません</button>
		        <button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
      		</div>
    	</div>
  	</div>
</div>
<div class="modal fade" id="paper-infoModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
  	<div class="modal-dialog">
    	<div class="modal-content">
      		<div class="modal-header">
	        	<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        	<h4 class="modal-title"><b>ID</b> と <b>パスワード</b> を 紙(かみ) などに メモしてください</h4>
    		</div>
		    <div class="modal-body">
		    	<div class="alert alert-danger">
		    		<dl class="dl-horizontal">
		    			<dt><h2>ID</h2></dt>
		    			<dd><h2><b><span class="paper-id"></span></b></h2></dd>
		    			<dt><h2>パスワード</h2></dt>
		    			<dd><h2><b><span class="paper-password"></span></b></h2></dd>
		    		</dl>
		    	</div>
		    </div>
      		<div class="modal-footer">
		        <button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
      		</div>
    	</div>
  	</div>
</div>
<div class="modal fade" id="paper-emailsignupModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
  	<div class="modal-dialog">
    	<div class="modal-content">
      		<div class="modal-header">
	        	<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        	<h4 class="modal-title">メールアドレスを設定する</h4>
    		</div>
		    <div class="modal-body auth-page-1">
				<form id="paper-emailsignup" class="form-horizontal">
					<h4>プロフィールを入力してください</h4>
					<p class="alert alert-danger hide" role="alert"></p>
					<div class="form-group has-feedback">
				    	<label for="paper-signupEmail" class="col-sm-3 control-label">メールアドレス</label>
				    	<div class="col-sm-8">
					    	<input type="email" class="form-control" id="paper-signupEmail" placeholder="your@email.com">
				    	</div>
					</div>
				  	<div class="form-group has-feedback">
				    	<label for="paper-nickname" class="col-sm-3 control-label">ニックネーム</label>
				    	<div class="col-sm-8">
				    		<input type="text" class="form-control" id="paper-nickname">
				    	</div>
				    	<div class="col-sm-1" data-toggle="tooltip" data-placement="left" title="本名は使用できません">
				    		<span class="glyphicon glyphicon-question-sign form-control-feedback"></span>
				    	</div>
				  	</div>
				  	<div class="form-group has-feedback">
				  		<label class="col-sm-3 control-label" for="paper-gender">性別</label>
				    	<div id="paper-gender" class="col-sm-8">
					    	<label class="radio-inline"><input type="radio" name="paper-gender" value="male" checked>男</label>
					  		<label class="radio-inline"><input type="radio" name="paper-gender" value="female">女</label>
				    	</div>
				  	</div>
				  	<div class="form-group has-feedback">
				  		<label for="paper-birth_year" class="col-sm-3 control-label">生年月日</label>
				    	<div class="col-sm-4">
				    		<select id="paper-birth_year" class="col-sm-4 form-control">
					    		<?php for($y = intval(date('Y')); $y > 1900; $y--): ?>
				    			<option value="<?php echo $y; ?>"><?php echo $y; ?>年</option>
						    	<?php endfor; ?>
				    		</select>
				    	</div>
				    	<div class="col-sm-2">
				    		<select id="paper-birth_month" class="col-sm-2 form-control">
					    		<?php for($m = 1; $m <= 12; $m++): ?>
				    			<option value="<?php echo $m; ?>"><?php echo $m; ?>月</option>
						    	<?php endfor; ?>
				    		</select>
				    	</div>
				    	<div class="col-sm-2">
				    		<select id="paper-birth_day" class="col-sm-2 form-control">
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
				  		<label for="paper-experience_days" class="col-sm-3 control-label">プログラミングの経験</label>
				    	<div class="col-sm-8">
				    		<select id="paper-experience_days" class="form-control">
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
				  	<div class="checkbox text-center">
				  		<label><input type="checkbox" id="paper-policy">ハックフォープレイ株式会社が定める<a href="../policies/#anchor-agreement" title="利用規約" target='_blank'>利用規約</a>に同意します</label>
				  	</div>
				  	<div class="text-center">
						<button type="submit" class="btn btn-primary">メールを送信</button>
					</div>
				</form>
		    </div>
		    <div class="modal-body auth-page-2 hidden">
		    	<form id="paper-tmp" class="form-horizontal">
			    	<h4>メールが送信されました。届くまでに数分かかることがありますので、お気をつけください</h4>
			    	<h5>本文に書かれた「仮パスワード」を入力してください</h5>
					<p class="alert alert-danger hide" role="alert"></p>
					<div class="form-group">
				    	<div class="col-sm-offset-1 col-sm-10 col-sm-offset-1">
					    	<input type="password" class="form-control" id="paper-tmpPassword">
					    </div>
					</div>
				  	<div class="text-right">
						<button type="submit" class="btn btn-primary">確認</button>
					</div>
				</form>
				<p>メールアドレスの入力に<button type="button" class="btn btn-link papersignup-modal-back">もどる</button></p>
		    </div>
      		<div class="modal-footer">
		        <button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
      		</div>
    	</div>
  	</div>
</div>
<div class="modal fade" id="resetModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
  	<div class="modal-dialog">
    	<div class="modal-content">
      		<div class="modal-header">
	        	<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        	<h4 class="modal-title">パスワードをリセットします</h4>
    		</div>
		    <div class="modal-body modal-page-1" style="display: none">
		    	<form name="resetRequest" class="form-horizontal">
					<p class="alert alert-danger hide" role="alert"></p>
				  	<div class="form-group">
				    	<label for="email" class="col-sm-3 control-label">メールアドレス</label>
				    	<div class="col-sm-8">
				    		<input type="email" class="form-control" id="email">
				    	</div>
				  	</div>
				  	<div class="text-right">
					  	<button type="submit" class="btn btn-primary">確認コードを送信</button>
				  	</div>
				</form>
		    </div>
		    <div class="modal-body modal-page-2" style="display: none">
		    	<form name="confirmCode" class="form-horizontal">
					<p class="alert alert-danger hide" role="alert"></p>
				  	<div class="form-group">
				  		<p class="alert alert-success remove-after-submit" role="alert">
				  			確認コードがあなたのメールに送信されました。この画面は<b>閉じないで</b>ください
				  		</p>
				    	<label for="code" class="col-sm-3 control-label">確認コードを入力</label>
				    	<div class="col-sm-8">
				    		<input type="text" class="form-control" id="code" placeholder="######">
				    	</div>
				  	</div>
				  	<div class="text-right">
					  	<button type="submit" class="btn btn-danger">パスワードをリセット</button>
				  	</div>
				</form>
		    </div>
      		<div class="modal-footer">
		        <button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
      		</div>
    	</div>
  	</div>
</div>