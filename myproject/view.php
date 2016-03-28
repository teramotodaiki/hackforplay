<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width,initial-scale=1.0" />
	<title>HackforPlay</title>
	<?php require_once '../library.php' ?>
</head>
<body>
	<?php require_once '../analyticstracking.php'; ?>
	<?php require_once '../fb-root.php'; ?>
	<?php require_once '../sendattendance.php'; ?>
	<?php require_once '../view/authmodal.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<script src="view.js" type="text/javascript" charset="utf-8"></script>
	<!-- Modal -->
	<div class="modal fade" id="reasonModal" tabindex="-1" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	    			<h4>リジェクトの理由</h4>
				</div>
			    <div class="modal-body">
			    </div>
	    		<div class="modal-footer">
	    			<p class="text-muted">
	    				ご不明な点がありましたら、<a href="http://hackforplay.weebly.com/contact.html" title="お問い合わせ" target="_blank">こちら</a>にお問い合わせください
	    			</p>
	        		<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
	    		</div>
			</div>
		</div>
	</div>
	<!-- Content -->
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
				<div class="row">
					<div class="col-xs-12">
						<div class="panel panel-default">
							<div class="panel-body text-center">
								<h3>あなたのプロジェクト</h3>
							</div>
						</div>
					</div>
					<div class="col-xs-12">
						<div class="row h4p_projectlist"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php include_once '../intercom.php'; ?>
</body>
</html>
