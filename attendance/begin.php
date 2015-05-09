<?php
/*
セッションを取得し、 Attendance レコードを新たに作成し、Tokenを発行する。EndはNULLにしておく
レコードを作成しなかった場合、何も出力せずに終了する
Input:	href, pathname
Output:	(token)
*/

require_once '../preload.php';

session_start();
if (isset($_SESSION['UserID'])){
	$userid = $_SESSION['UserID'];
} else {
	exit();
}
session_commit();

$timezone = filter_input(INPUT_POST, 'timezone');
if($timezone === FALSE || $timezone === NULL){
	exit();
}
$href = filter_input(INPUT_POST, 'href', FILTER_VALIDATE_URL);
if($href === FALSE || $href === NULL){
	exit();
}
$pathname = filter_input(INPUT_POST, 'pathname');
if($pathname === FALSE || $pathname === NULL){
	exit();
}

// Tokenを生成
$bytes 	= openssl_random_pseudo_bytes(16); // 16bytes (32chars)
$token	= bin2hex($bytes); // binaly to hex

// レコードを作成
try {
	$stmt	= $dbh->prepare('INSERT INTO "Attendance" ("UserID","Href","Pathname","Token","Begin") VALUES(:userid, :href, :pathname, :token, :gmt)');
	$stmt->bindValue(':userid', $userid, PDO::PARAM_INT);
	$stmt->bindValue(':href', $href, PDO::PARAM_STR);
	$stmt->bindValue(':pathname', $pathname, PDO::PARAM_STR);
	$stmt->bindValue(':token', $token, PDO::PARAM_STR);
	$stmt->bindValue(':gmt', gmdate("Y-m-d H:i:s") . $timezone, PDO::PARAM_STR);

	$flag 	= $stmt->execute();
	if(!$flag){
		// 失敗
		exit();
	}
} catch (PDOException $e) {
	print_r($e);
	die();
}

// 正常終了
exit($token);
?>
