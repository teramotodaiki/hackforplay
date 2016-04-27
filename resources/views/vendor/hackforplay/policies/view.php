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
			<div id="anchor-licence" class="col-xs-12">
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
									<td>(c) Ubiquitous Entertainment Inc.</td>
									<td>MIT License</td>
								</tr>
								<tr>
									<td>CodeMirror</td>
									<td>(c) 2015 by Marijn Haverbeke and others</td>
									<td>MIT License</td>
								</tr>
								<tr>
									<td>BootStrap</td>
									<td>(c) 2015 Twitter.</td>
									<td>MIT License</td>
								</tr>
								<tr>
									<td>Sound Effects and BGM</td>
									<td>(c) 2000-2013 煉獄庭園</td>
									<td>著作権表示 再配布禁止</td>
								</tr>
								<tr>
									<td>Graphics</td>
									<td>(c) 2012-2014 くらげ工匠</td>
									<td>再配布禁止</td>
								</tr>
								<tr>
									<td>Graphics</td>
									<td>(c) エトリエ <small>etolier.webcrow.jp</small></td>
									<td>再配布禁止</td>
								</tr>
								<tr>
									<td>Graphics</td>
									<td>(c) 2008 TopeconHeroes with Mr.H <small>DOTS DESIGN</small></td>
									<td>再配布禁止</td>
								</tr>
								<tr>
									<td>Graphics</td>
									<td>(c) yms <small>Dot Art World</small></td>
									<td>著作権表示 再配布禁止</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div id="anchor-agreement" class="col-xs-12">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h4>利用規約</h4>
					</div>
					<div class="panel-body">
						<pre><?php include '../licence.txt'; ?></pre>
					</div>
				</div>
			</div>
			<div id="anchor-privacy" class="col-xs-12">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h4>プライバシーポリシー</h4>
					</div>
					<div class="panel-body">
						<pre><?php include '../privacy.txt'; ?></pre>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php require_once '../view/footer.php' ?>
</body>
</html>