<?php
$id = filter_input(INPUT_GET, 'share_id', FILTER_VALIDATE_INT);
$title = filter_input(INPUT_GET, 'share_title');
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title></title>
	<?php require_once '../library.php'; ?>
</head>
<body style="background-color: transparent;">
	<?php include '../externalcodes.php'; ?>
	<script>
	$(function () {
		var encodedTitle = encodeURIComponent('<?php echo $title; ?>');
		var URL = 'https://hackforplay.xyz/s/?id=' + <?php echo $id; ?>;
		var encodedURL = encodeURIComponent(URL);
		$('.twitter-share-button').attr('href', 'https://twitter.com/intent/tweet?hashtags=hackforplay&text=' + encodedTitle + '&url=' + encodedURL);
		$('.fb-share-button').attr('data-href', URL);
		$('.h4p-link-button').height(22).css({
			'margin-top': '-10px',
			'padding': '1px 10px'
		}).addClass('btn btn-sm btn-default').click(function(event) {
			var input = $('<input>').attr({
				'type': 'text',
				'size': URL.length,
				'value': URL
			}).click(function(event) {
				$(this).get(0).selectionStart = 0;
				$(this).get(0).selectionEnd = URL.length;
				$(this).focus();
			}).insertAfter(this);
			$(this).remove();
			input.focus();
		});
	});
	</script>
	<ul class="list-inline text-center">
		<li><a class="twitter-share-button" data-count="none">Tweet</a></li>
		<li><div class="fb-share-button" data-layout="button"></div></li>
		<li><div class="h4p-link-button"><span class="glyphicon glyphicon-paperclip"></span>URL</div></li>
	</ul>
</body>
</html>