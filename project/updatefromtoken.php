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
	if(empty($project)){
		exit('invalid-token');
	}elseif ($project['PublishedStageID'] !== NULL) {
		exit('already-published');
	}

} catch (PDOException $e) {
	print_r($e);
	die();
}

// データを更新
$data 			= filter_input(INPUT_POST, 'data');
if($data === NULL || $data === FALSE){
	exit('data-is-null');
}
try {
	// 新しいコードのCodeIDを取得する
	$new_code			= array();
	$code_exp		= explode("\n", $data);

	$stmt_se_code	= $dbh->prepare('SELECT "ID" AS "CodeID" FROM "Code" WHERE "Value"=:value');
	$stmt_in_code	= $dbh->prepare('INSERT INTO "Code" ("Value") VALUES(:value)');
	foreach ($code_exp as $key => $value) {

		// 1.Code.IDの取得をこころみる
		$stmt_se_code->bindValue(":value", $value, PDO::PARAM_STR);
		$stmt_se_code->execute();
		$new_code[$key]	= $stmt_se_code->fetch(PDO::FETCH_COLUMN, 0);

		if (empty($new_code[$key])) {
			// 2.Codeを追加し、IDを取得する
			$stmt_in_code->bindValue(":value", $value, PDO::PARAM_STR);
			$stmt_in_code->execute();
			$new_code[$key] = $dbh->lastInsertId('Code');
		}
	}

	// データを格納
	$stmt	= $dbh->prepare('INSERT INTO "Script" ("ProjectID","LineNum","Registered") VALUES(:project_id,:line,:empty)');
	$stmt->bindValue(":project_id", $project['ID'], PDO::PARAM_INT);
	$stmt->bindValue(":line", count($new_code), PDO::PARAM_INT);
	$stmt->bindValue(":empty", '', PDO::PARAM_STR);
	$stmt->execute();
	$difference	= array('ID' => $dbh->lastInsertId('Script'));
	if (empty($difference['ID'])) {
		exit('failed');
	}
	$stmt	= $dbh->prepare('INSERT INTO "Line"("ScriptID","Append","CodeID") VALUES(:difference_id,:line,:code_id)');
	$stmt->bindValue(":difference_id", $difference['ID'], PDO::PARAM_INT);
	foreach ($new_code as $key => $value) {
		$stmt->bindValue(":line", $key, PDO::PARAM_INT);
		$stmt->bindValue(":code_id", $value, PDO::PARAM_INT);
		$stmt->execute();
	}

} catch (PDOException $e) {
	print_r($e);
	die();
}

exit('success');

?>