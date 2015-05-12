<?php
/*
セッションを取得し、 Attendance レコードを新たに作成し、Tokenを発行する。EndはNULLにしておく
レコードを作成しなかった場合、何も出力せずに終了する
Input:	href, pathname
Output:	(token)
*/

require_once '../preload.php';

$timezone = filter_input(INPUT_POST, 'timezone', FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^(\+|\-)[0-1][0-9]:00$/")));
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
	$stmt	= $dbh->prepare('INSERT INTO "Attendance" ("UserID","Token","Begin") VALUES(:userid,:token,:gmt)');
	$stmt->bindValue(':userid', $session_userid, PDO::PARAM_INT);
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

// UserAgentなどを格納
require_once 'keyvaluedata.php';
setData($dbh->lastInsertId('Attendance'), array(
	'AcceptLanguage' => $_SERVER['HTTP_ACCEPT_LANGUAGE'],
	'RomoteAddress' => $_SERVER['REMOTE_ADDR'],
	'SelfPath' => $href,
	'Refferer' => '',
	'QueryString' => ''
));

// 正常終了
exit($token);
?>
