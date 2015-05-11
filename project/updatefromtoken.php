<?php
/*
トークンからプロジェクト情報を参照し、データを更新する
ただし、Project.UserIDと一致するUserIDをもつセッションが必要
Input:	token , data
Output:	no-session , invalid-token , already-published , data-is-null , database-error , success
*/

require_once '../preload.php';

if (!isset($session_userid)) {
	exit('no-session');
}

// プロジェクト情報を取得
$token = filter_input(INPUT_POST, 'token');
if($token === NULL || $token === FALSE){
	exit('invalid-token');
}
try {
	$stmt	= $dbh->prepare('SELECT "ID","PublishedStageID" FROM "Project" WHERE "Token"=:token AND "UserID"=:userid');
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->execute();
	$project = $stmt->fetch(PDO::FETCH_ASSOC);
	if($project === NULL){
		exit('invalid-token');
	}elseif ($project['PublishedStageID'] !== NULL) {
		exit('already-published');
	}

} catch (PDOException $e) {
	print_r($e);
	die();
}

// データを更新
$data 	= filter_input(INPUT_POST, "data");
if($data === NULL){
	exit('data-is-null');
}
try {
	$stmt	= $dbh->prepare('UPDATE "Project" SET "Data"=:data WHERE "ID"=:projectid');
	$stmt->bindValue(":data", $data);
	$stmt->bindValue(":projectid", $project['ID'], PDO::PARAM_INT);
	$flag 	= $stmt->execute();
	if(!$flag){
		exit('database-error');
	}
} catch (PDOException $e) {
	print_r($e);
	die();
}

exit('success');

?>