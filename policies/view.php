<!DOCTYPE html>
<html>
<head prefix="og: http://ogp.me/ns#">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>ポリシー hackforplay</title>
	<?php require_once '../library.php' ?>
</head>
<body class="">
	<?php require_once '../analyticstracking.php' ?>
	<?php require_once '../fb-root.php' ?>
	<?php require_once '../sendattendance.php'; ?>
	<?php require_once '../view/authmodal.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<div class="container">
		<div class="row">
			<div id="anchor-licence" class="col-md-12">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h4>ライセンス表記</h4>
					</div>
					<div class="panel-body">
						<table class="table table-stripe">
							<thead>
								<tr>
									<th>Product</th>
									<th>Copyright</th>
									<th>Licence</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>enchant.js</td>
									<td>...</td>
									<td>MIT License</td>
								</tr>
								<tr>
									<td>CodeMirror</td>
									<td>...</td>
									<td>MIT License</td>
								</tr>
								<tr>
									<td>BootStrap</td>
									<td>...</td>
									<td>MIT License</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div id="anchor-agreement" class="col-md-12">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h4>利用規約</h4>
					</div>
					<div class="panel-body">
						<pre><?php include '../licence.txt'; ?></pre>
					</div>
				</div>
			</div>
			<div id="anchor-privacy" class="col-md-12">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h4>プライバシーポリシー</h4>
					</div>
					<div class="panel-body">
						<pre>プライバシーポリシー</pre>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php require_once '../view/footer.php' ?>
</body>
</html>