<div class="modal fade" id="modal-signup-paper" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
	<div class="modal-dialog">
		<div class="modal-content">
    		<div class="modal-header">
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		        <h4>ペーパーログイン</h4>
	    	</div>
		    <div class="modal-body modal-page-1 hidden">
			  	<h4>
			  		<ruby>ID<rt>あいでぃー</rt></ruby>とパスワードを あたらしく つくります
			  	</h4>
			  	<h3>メモのじゅんびを してください</h3>
			  	<button type="button" class="btn btn-primary btn-lg btn-block modal-page-next" data-loading="loading...">OK</button>
			</div>
		    <div class="modal-body modal-page-2 hidden">
		    	<h4><b>ID</b> と <b>パスワード</b> を <ruby>紙<rt>かみ</rt></ruby> などに かいてください</h4>
		    	<div class="alert alert-danger">
		    		<dl class="dl-horizontal">
		    			<dt><h2>ID</h2></dt>
		    			<dd><h2><b><span class="paper-id"></span></b></h2></dd>
		    			<dt><h2>パスワード</h2></dt>
		    			<dd><h2><b><span class="paper-password"></span></b></h2></dd>
		    		</dl>
		    	</div>
		    	メモできたら…<a href="../login/" class="btn btn-link" title="Next">ログインする</a>
			</div>
      		<div class="modal-footer">
		        <button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
      		</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal-signup-email" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
	<div class="modal-dialog">
		<div class="modal-content">
    		<div class="modal-header">
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		        <h4>メールアドレスでとうろく</h4>
	    	</div>
		    <div class="modal-body modal-page-1 hidden">
			  	<form id="signup" class="form-horizontal">
					<h4 class="text-center">プロフィールを入力してください<br><small>メールアドレスをとうろくすると、パスワードを忘れてしまったときでもリセットができます</small></h4>
					<p class="alert alert-danger hidden" role="alert"></p>
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
			</div>
		    <div class="modal-body modal-page-2 hidden">
		    	<form id="tmp" class="form-horizontal">
			    	<h4>メールが送信されました。届くまでに数分かかることがありますので、お気をつけください</h4>
			    	<h5>本文に書かれた「仮パスワード」を入力してください</h5>
					<p class="alert alert-danger hidden" role="alert"></p>
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
		    <div class="modal-body modal-page-3 hidden">
		    	<form id="setPassword" class="form-horizontal">
			    	<h4>パスワードを設定してください</h4>
					<p class="alert alert-danger hidden" role="alert"></p>
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
		    <div class="modal-body modal-page-4 hidden">
		    	<div class="text-center">
			    	<h4>ログインできました！</h4>
			    	<a href="/" class="btn btn-link btn-lg" title="Next">つぎのページへ</a>
		    	</div>
		    </div>
      		<div class="modal-footer">
		        <button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
      		</div>
		</div>
	</div>
</div>