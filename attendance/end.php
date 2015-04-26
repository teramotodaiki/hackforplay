<?php
/*
トークンを取得し、 Attendance レコードを更新する
Input:	token
*/

require_once '../preload.php';

// トークンを取得
$token = filter_input(INPUT_POST, 'token');
if($token == NULL || $token == FALSE){
	exit();
}

// レコードを更新
try {
	$stmt	= $dbh->prepare('UPDATE "Attendance" SET "End"=:gmt WHERE "token"=:token');
	$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s").date("P"), PDO::PARAM_STR);
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->execute();

} catch (PDOException $e) {
	print_r($e);
	die();
}

// 正常終了
exit();
?>