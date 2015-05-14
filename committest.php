<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>Commit test</title>
	<?php require_once 'library.php' ?>
</head>
<body>
	<script type="text/javascript" charset="utf-8">
	$(function(){
		$('form#commit').submit(function(event) {
			event.preventDefault();
			var loading = $(this).find('button[type="submit"]').button('loading');

			var code = $(this).find('.code').val();
			$.post('project/commitregistration.php',{
				'code': code
			}, function(data, textStatus, xhr) {
				loading.button('reset');
				$('.result').text(data);
			});
		});
	});
	</script>
	<div class="container">
		<div class="row">
			<div class="col-md-6">
				<pre class="result"></pre>
			</div>
			<div class="col-md-6">
				<form id="commit">
					<h4>Code</h4>
					<textarea name="code" class="code" style="width:100%;height:400px;font-family:monospace;"></textarea>
					<button type="submit" class="btn btn-lg">Commit</button>
				</form>
			</div>
		</div>
	</div>
</body>
</html>