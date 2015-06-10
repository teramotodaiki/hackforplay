<?php
/*
ランディングページ
サインインされたセッションが存在し、 ?rewrite がFALSEでない場合、 /r に再送する
*/

require_once 'preload.php';

$rewrite = filter_input(INPUT_GET, 'rewrite', FILTER_VALIDATE_BOOLEAN);
echo 'session_userid';
var_dump($session_userid);
echo "\nrewrite";
var_dump($rewrite);
if (isset($session_userid) && $rewrite !== FALSE) {
	header('Location:../r');
	exit();
}

include 'view/main.php';
?>