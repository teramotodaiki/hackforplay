<?php
/*
ランディングページ
サインインされたセッションが存在し、 ?rewrite がFALSEでない場合、 /r に再送する
*/

require_once 'preload.php';

$rewrite = filter_input(INPUT_GET, 'rewrite', FILTER_VALIDATE_BOOLEAN);
var_dump($rewrite);
var_dump($session_userid);
if (isset($session_userid) && $rewrite !== FALSE) {
	header('Location:../r');
	exit();
}

include 'view/main.php';
?>