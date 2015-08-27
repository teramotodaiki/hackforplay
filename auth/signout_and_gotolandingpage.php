<?php
/*
サインアウトしてランディングページにリダイレクトする
*/

try {

	require_once '../preload.php';

	session_start();
	setcookie(session_name(), '', time() - 1);

	session_destroy();
	session_commit();

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);

	header('Location: ../e');
}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title></title>
	<script type="text/javascript" charset="utf-8">
	window.location.href = '/';
	</script>
</head>
<body>
</body>
</html>