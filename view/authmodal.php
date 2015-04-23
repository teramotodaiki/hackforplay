<!-- Authorize Modal -->
<script type="text/javascript" charset="utf-8">
$(function() {
	$("#authModal").modal("show");
	$("input[name=email]").on('change', function() {
		var value = $(this).val();
		// @が入っているかどうかのみ調べる
		if(value.indexOf("@") !== -1){
			$.post('/auth/checkemail.php', {
				'email': value
			}, function(data, textStatus, xhr) {
				if(data === "available"){
					$(".sendmail").fadeIn('fast');
				}else if(data === "invalid"){
					//
				}else{
					var result = jQuery.parseJSON(data);
					console.log(result);
				}
			});
		}
	});
	$(".sendmail button").on('click', function() {
		var value = $("input[name=email]").val();
		$.post('/auth/signup.php', {
			'email': value
		}, function(data, textStatus, xhr) {
			console.log(data);
		});
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
		    <div class="modal-body">
				<label for="email" class="control-label">メールアドレス:</label>
				<input type="email" class="form-control" name="email" placeholder="yours@example.com">
				<div class="sendmail" style="display: none;">
					<button type="button" class="btn btn-block btn-primary">メールを送信</button>
				</div>
		    </div>
    		<div class="modal-footer">
        		<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
    		</div>
		</div>
	</div>
</div>