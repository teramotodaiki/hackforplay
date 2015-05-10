<?php
/*
セッション情報から、自分の情報を取得する
Output:	no-session , parse-error , JSON:{user-info}
user-info:
{
	gender : 性別 (man or woman),
	nickname : ニックネーム,
	birthday : 生年月日,
	timezone : タイムゾーン
}
*/

require_once '../preload.php';

session_start();
if (!isset($_SESSION['UserID'])) {
	exit('no-session');
}
$userid = $_SESSION['UserID'];
session_commit();

try {
	$stmt 	= $dbh->prepare('SELECT "Gender","Nickname","Birthday","TimezoneOffset" FROM "User" WHERE "ID"=:userid');
	$stmt->bindValue(":userid", $userid, PDO::PARAM_INT);
	$stmt->execute();
	$result = $stmt->fetch(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
	print_r($e);
	die();
}

$user_info 	= new stdClass();
$user_info->gender 		= $result['Gender'];
$user_info->nickname 	= $result['Nickname'];
$user_info->birthday	= $result['Birthday'];
$user_info->timezone	= $result['TimezoneOffset'];

$json 	= json_encode($user_info);
if (!$json) {
	exit('parse-error');
}

exit($json);

?>