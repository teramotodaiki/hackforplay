<?php
/*
セッション情報から、自分の情報を取得する
Input:	(attendance-token)
Output:	no-session , parse-error , JSON:{user-info}
user-info:
{
	gender : 性別 (male or female),
	nickname : ニックネーム,
	birthday : 生年月日
}
*/

require_once '../preload.php';

try {

	if (!isset($session_userid)) {
		exit('no-session');
	}

	$stmt 	= $dbh->prepare('SELECT "Gender","Nickname","Birthday" FROM "User" WHERE "ID"=:userid');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->execute();
	$result = $stmt->fetch(PDO::FETCH_ASSOC);

	$user_info 	= new stdClass();
	$user_info->gender 		= $result['Gender'];
	$user_info->nickname 	= $result['Nickname'];
	$user_info->birthday	= $result['Birthday'];

	$json 	= json_encode($user_info);
	if (!$json) {
		exit('parse-error');
	}
	exit($json);

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}

?>