<?php
/*
ユーザーの情報の一部を取得する。ただしセッションが必要
Input:	userid
Output:	no-session , missing-user , parse-error , JSON:{user-info}
user-info:
{
	gender : 性別 (man or woman),
	nickname : ニックネーム,
}
*/

require_once '../preload.php';

if (!isset($session_userid)) {
	exit('no-session');
}

$id 	= filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
if ($id === NULL || $id === FALSE) {
	exit('missing-user');
}

try {
	$stmt 	= $dbh->prepare('SELECT "Gender","Nickname" FROM "User" WHERE "ID"=:input_id');
	$stmt->bindValue(":input_id", $id, PDO::PARAM_INT);
	$stmt->execute();
	$result = $stmt->fetch(PDO::FETCH_ASSOC);
	if ($result === NULL) {
		exit('missing-user');
	}

} catch (PDOException $e) {
	print_r($e);
	die();
}

$user_info 	= new stdClass();
$user_info->gender 		= $result['Gender'];
$user_info->nickname 	= $result['Nickname'];

$json 	= json_encode($user_info);
if (!$json) {
	exit('parse-error');
}

exit($json);

?>