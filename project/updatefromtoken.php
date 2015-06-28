<?php
/*
トークンからプロジェクト情報を参照し、データを更新する
ただし、Project.UserIDと一致するUserIDをもつセッションが必要
Input:	token , data , timezone , (source_stage_id) , (attendance-token)
Output:	no-session , invalid-token , already-published , data-is-null , no-update , database-error , success
*/

require_once '../preload.php';

try {

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	if (!isset($session_userid)) {
		exit('no-session');
	}

	// プロジェクト情報を取得
	$token = filter_input(INPUT_POST, 'token');
	if($token === NULL || $token === FALSE){
		exit('invalid-token');
	}

	$stmt	= $dbh->prepare('SELECT "ID","SourceStageID","PublishedStageID" FROM "Project" WHERE "Token"=:token AND "UserID"=:userid');
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->execute();
	$project = $stmt->fetch(PDO::FETCH_ASSOC);
	if(empty($project)){
		exit('invalid-token');
	}elseif ($project['PublishedStageID'] !== NULL) {
		exit('already-published');
	}

	// データを更新
	$data 			= filter_input(INPUT_POST, 'data');
	if($data === NULL || $data === FALSE){
		exit('data-is-null');
	}

	// 現在のコードを復元
	require_once 'getcurrentcode.php';
	$old_code		= getCurrentCode($project['ID']);
	if ($data === $old_code) {
		exit('no-update');
	}

	// 新しいコードのCodeIDを取得する
	$new_code		= array();
	$code_exp		= explode("\n", $data);

	// 古いコードのValue-IDテーブルをキャッシュのためにロード
	require_once 'getcurrentcodeascache.php';
	$old_code_cache	= getCurrentCodeAsCache($project['ID']);

	$stmt_se_code	= $dbh->prepare('SELECT "ID" AS "CodeID" FROM "Code" WHERE "Value"=:value');
	$stmt_in_code	= $dbh->prepare('INSERT INTO "Code" ("Value") VALUES(:value)');
	foreach ($code_exp as $key => $value) {

		// 0.old codeの配列に「同じ行」がないか調べる（キャッシュ）
		if (isset($old_code_cache[$value])) {
			$new_code[$key]	= $old_code_cache[$value];
			continue;
		}

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
	$timezone		= filter_input(INPUT_POST, 'timezone', FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^(\+|\-)[0-1][0-9]:00$/")));
	if($timezone === FALSE || $timezone === NULL){
		$timezone	= '+00:00';
	}
	$stmt	= $dbh->prepare('INSERT INTO "Script" ("ProjectID","LineNum","Registered") VALUES(:project_id,:line,:gmt)');
	$stmt->bindValue(":project_id", $project['ID'], PDO::PARAM_INT);
	$stmt->bindValue(":line", count($new_code), PDO::PARAM_INT);
	$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s") . $timezone, PDO::PARAM_STR);
	$stmt->execute();
	$difference	= array('ID' => $dbh->lastInsertId('Script'));
	if (empty($difference['ID'])) {
		exit('failed');
	}

	$insertion_max	= 500; // 一度に挿入できる最大数
	for ($offset_index=0; $offset_index < count($new_code); $offset_index += $insertion_max) {

		$once			= array_slice($new_code, $offset_index, $insertion_max); // max以下の個数を取得(添え字は0から)
		$placeHolder	= array_fill(0, count($once), '(?,?,?)');
		$stmt	= $dbh->prepare('INSERT INTO "Line"("ScriptID","Line","CodeID") VALUES' . implode(',', $placeHolder));
		foreach ($once as $key => $value) {
			$stmt->bindValue($key * 3 + 1, $difference['ID'], PDO::PARAM_INT);
			$stmt->bindValue($key * 3 + 2, $key + $offset_index, PDO::PARAM_INT);
			$stmt->bindValue($key * 3 + 3, $value, PDO::PARAM_INT);
		}
		$stmt->execute();
	}

	// SourceStageIDの更新
	$source_stage_id	= filter_input(INPUT_POST, 'source_stage_id', FILTER_VALIDATE_INT);
	if ($source_stage_id && $source_stage_id != $project['SourceStageID']) {
		$stmt	= $dbh->prepare('UPDATE "Project" SET "SourceStageID"=:source_stage_id WHERE "ID"=:project_id');
		$stmt->bindValue(":project_id", $project['ID'], PDO::PARAM_INT);
		$stmt->bindValue(":source_stage_id", $source_stage_id, PDO::PARAM_INT);
		$flag	= $stmt->execute();
		if (!$flag) {
			$project_id	= $project['ID'];
			throw new Exception("Selfish exception: didn't update SourceStageID of Project, which id=$project_id", 9999);
		}
	}

	exit('success');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>