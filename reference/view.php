<!DOCTYPE html>
<html>
<head prefix="og: http://ogp.me/ns#">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>リファレンス hackforplay</title>
	<?php require_once '../library.php' ?>
</head>
<body class="">
	<?php require_once '../analyticstracking.php' ?>
	<?php require_once '../fb-root.php' ?>
	<?php require_once '../sendattendance.php'; ?>
	<?php require_once '../view/authmodal.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<script src="view.js" type="text/javascript"></script>
	<div class="container">
		<div class="row">
			<div class="col-md-10">
				<div id="anchor-hack" class="panel panel-default">
					<div class="panel-heading">
						<h2>hack.js <small>すべてのステージで共通して使える機能</small></h2>
					</div>
					<div class="panel-body">
						<table class="table">
							<thead>
								<tr>
									<td>Name</td>
									<td>Parameters</td>
									<td>Discription</td>
									<td>Return</td>
									<td>Example</td>
								</tr>
							</thead>
							<tbody>
							</tbody>
						</table>
					</div>
				</div>
				<div id="anchor-typing" class="panel panel-default">
					<div class="panel-heading">
						<h2>typing.js <small><a href="../s?id=304" target="_blank" title="タイピングゲーム">タイピングゲーム</a>で使える機能</small></h2>
					</div>
					<div class="panel-body">
						<table class="table">
							<thead>
								<tr>
									<td>Name</td>
									<td>Parameters</td>
									<td>Discription</td>
									<td>Return</td>
									<td>Example</td>
								</tr>
							</thead>
							<tbody>
							</tbody>
						</table>
					</div>
				</div>
				<div id="anchor-run" class="panel panel-default">
					<div class="panel-heading">
						<h2>run.js <small><a href="../s?id=305" target="_blank" title="ランゲーム">ランゲーム</a>で使える機能</small></h2>
					</div>
					<div class="panel-body">
						<table class="table">
							<thead>
								<tr>
									<td>Name</td>
									<td>Parameters</td>
									<td>Discription</td>
									<td>Return</td>
									<td>Example</td>
								</tr>
							</thead>
							<tbody>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="col-md-2">
				<div class="panel panel-default affix">
					<div class="panel-body">
						<nav>
							<ul class="list-unstyled">
								<li><a href="#anchor-hack" class="btn btn-link" title="hack.js">hack.js</a></li>
								<li><a href="#anchor-typing" class="btn btn-link" title="typing.js">typing.js</a></li>
								<li><a href="#anchor-run" class="btn btn-link" title="run.js">run.js</a></li>
								<hr>
								<li><a href="#" class="btn btn-link" title="Back to top">Back to top</a></li>
							</ul>
						</nav>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php require_once '../view/footer.php' ?>
</body>
</html>