<?php
/*
セッションを取得し、 Attendance レコードを新たに作成し、Tokenを発行する。EndはNULLにしておく
レコードを作成しなかった場合、何も出力せずに終了する
Input:	self_path , refferer , query_string , timezone
Output:	(token)
*/

require_once '../preload.php';

session_start();
$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();

if (!isset($session_userid)) {
	exit();
}

$self_path		= filter_input(INPUT_POST, 'self_path');
$refferer		= filter_input(INPUT_POST, 'refferer');
$query_string	= filter_input(INPUT_POST, 'query_string');
$timezone		= filter_input(INPUT_POST, 'timezone', FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^(\+|\-)[0-1][0-9]:00$/")));
if($timezone === FALSE || $timezone === NULL){
	$timezone	= '+00:00';
}

// Tokenを生成
$bytes 	= openssl_random_pseudo_bytes(16); // 16bytes (32chars)
$token	= bin2hex($bytes); // binaly to hex

// レコードを作成
$stmt	= $dbh->prepare('INSERT INTO "Attendance" ("UserID","Token","Begin") VALUES(:userid,:token,:gmt)');
$stmt->bindValue(':userid', $session_userid, PDO::PARAM_INT);
$stmt->bindValue(':token', $token, PDO::PARAM_STR);
$stmt->bindValue(':gmt', gmdate("Y-m-d H:i:s") . $timezone, PDO::PARAM_STR);

$flag 	= $stmt->execute();
if(!$flag){
	// 失敗
	exit();
}
// UserAgentなどを格納
require_once 'keyvaluedata.php';
setData($dbh->lastInsertId('Attendance'), array(
	'AcceptLanguage' => $_SERVER['HTTP_ACCEPT_LANGUAGE'],
	'RomoteAddress' => $_SERVER['REMOTE_ADDR'],
	'SelfPath' => $self_path,
	'Refferer' => $refferer,
	'QueryString' => $query_string
));

// 正常終了
exit($token);

?>
