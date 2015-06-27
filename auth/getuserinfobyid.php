<?php
/*
ユーザーの情報の一部を取得する。セッションは不要
Input:	userid , (attendance-token)
Output:	missing-user , parse-error , JSON:{user-info}
user-info:
{
	gender : 性別 (male or female),
	nickname : ニックネーム,
	profile_image_url : アイコン画像のURL（あれば）
}
*/

require_once '../preload.php';

try {

	$id 	= filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
	if ($id === NULL || $id === FALSE) {
		exit('missing-user');
	}

	$stmt 	= $dbh->prepare('SELECT "Gender","Nickname","ProfileImageURL" FROM "User" WHERE "ID"=:input_id');
	$stmt->bindValue(":input_id", $id, PDO::PARAM_INT);
	$stmt->execute();
	$result = $stmt->fetch(PDO::FETCH_ASSOC);
	if ($result === NULL) {
		exit('missing-user');
	}

	$user_info 	= new stdClass();
	$user_info->gender 		= $result['Gender'];
	$user_info->nickname 	= $result['Nickname'];
	$user_info->profile_image_url = $result['ProfileImageURL'];

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