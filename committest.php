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

			var code = $(this).find('.code').val();
			console.log(code);
			$.post('project/commitregistration.php',{
				'code': code
			}, function(data, textStatus, xhr) {
				$('.alert').text(data);
			});
		});
	});
	</script>
	<div class="container">
		<div class="alert alert-default"></div>
		<form id="commit">
			<h4>Code</h4>
			<textarea name="code" style="width:100%;height:400px;font-family:monospace;"></textarea>
			<button type="submit">Commit</button>
		</form>
	</div>
</body>
</html>