<?php
/*
サインアウトしてランディングページにリダイレクトする
metaタグでキャッシュを無効化している
*/

try {

	// サーバー側のセッション情報を削除
	session_start();
	setcookie(session_name(), '', time() - 1, '/');

	session_destroy();
	session_commit();

} catch (Exception $e) {
	Rollbar::report_exception($e);
	header('Location: ../e');
}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<title></title>
	<script type="text/javascript" charset="utf-8">
	window.location.href = '/';
	</script>
</head>
<body>
</body>
</html>
