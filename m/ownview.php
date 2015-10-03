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
	<script type="text/javascript" charset="utf-8">
	sessionStorage.setItem('view_user_id', <?php echo $session_userid; ?>);
	function bsAlert (_text) {
		var _bsalert =
		$('<div>').addClass('alert alert-dismissible fade in').attr('role', 'alert').append(
			$('<button>').addClass('close').attr({
				'type' : 'button',
				'data-dismiss': 'alert',
				'aria-label': 'Close'
			}).append($('<span>').attr('aria-hidden', 'true').html('&times;'))
		).append(
			$('<span>').text(_text)
		);
		return _bsalert;
	}
	var start = '<?php echo $fetch_start_id; ?>';
	start = isNaN(parseInt(start)) ? '0' : start;
	sessionStorage.setItem('view_param_start', start);
	</script>
	<script src="ownview.js" type="text/javascript" charset="utf-8"></script>
	<!-- Content -->
	<div class="container">
		<div class="row">
			<div class="col-xs-12 h4p_alert"></div>
			<div class="col-xs-12 panel panel-default">
				<div class="panel-body">
					<div class="text-center">
						<img src="tmpthumb.png" class="img-circle h4p_own-thumbnail">
					</div>
					<div class="text-center">
						<h3 class="h4p_own-nickname"></h3>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="container-fluid h4p_stagecontainer">
		<div class="row">
			<div class="col-xs-12 h4p_bar-top"></div>
			<div class="col-xs-12 h4p_bar-bar">
				<div class="container">
					<div class="h4p_bar-left"></div>
					<div class="row h4p_stagelist list-stage"></div>
					<div class="h4p_bar-right"></div>
				</div>
			</div>
			<div class="col-xs-12 h4p_bar-bottom"></div>
		</div>
	</div>
	<div class="container-fluid">
		<div class="row">
			<div class="col-xs-6 text-center">
				<a href="javascript:void(0);" title="previous" class="btn btn-lg btn-link go_page_previous">
					<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
				</a>
			</div>
			<div class="col-xs-6 text-center">
				<a href="javascript:void(0);" title="next" class="btn btn-lg btn-link go_page_next">
					<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
				</a>
			</div>
		</div>
	</div>
</body>
</html>