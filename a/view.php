<!-- HTML -->
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>あそべるプログラミング hackforplay</title>
	<?php require_once '../library.php' ?>
	<script type="text/javascript" charset="utf-8">
	$(function(){
		$("button.accept-button").on('click', function() {
			$(this).attr('disabled', 'disabled');
			var $div = $(this).parent();
			$.post('../makestage.php', {
	            'stage_name':$div.children('.stage_name').text(),
	            'restaging_id':$div.children('.rid').text()
	        }, function(data, textStatus, xhr) {
	        	if(data !== "") console.log(data);
	        	if(textStatus !== "success") console.log(textStatus);
	        	else location.href = "/a";
	        });
		});
		$("button.code-button").on('click', function() {
			var code = $(this).parent().children('.code').text();
			$('.modal-body>pre').text(code);
		});

	});
	</script>
</head>
<body class="">
	<?php require_once '../sendattendance.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<script src="view.js" type="text/javascript" charset="utf-8"></script>
	<!-- Modal -->
	<div class="modal fade" id="codeModal" tabindex="-1" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
	    		<div class="modal-header">
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		    	</div>
			    <div class="modal-body">
			    	<pre><code></code></pre>
			    </div>
	    		<div class="modal-footer">
	        		<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
	    		</div>
			</div>
		</div>
	</div>
	<!-- contents -->
	<div class="container">
		<div class="row list-judging">
		</div>
	</div>
</body>
</html>