<?php
/**
 * enqueue.php
 * CodeStockに未登録のコードを追加する
 * ただし、Project.UserIDと一致するUserIDをもつセッションが必要
 * publish flag がTRUEの時は、stage_infoを指定する
 * Input:	token , code , timezone , thumb , publish , (stage_info) , (attendance-token)
 * Output:	no-session , invalid-token , already-published , code-is-null , invalid-stage-info , database-error , success
 */

try {

	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	// セッションを取得
	if (!isset($session_userid)) {
		exit('no-session');
	}

	$token = filter_input(INPUT_POST, 'token');
	if($token === NULL || $token === FALSE){
		exit('invalid-token');
	}

	$stmt	= $dbh->prepare('SELECT "ID","PublishedStageID" FROM "Project" WHERE "Token"=:token');
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->execute();
	$project = $stmt->fetch(PDO::FETCH_ASSOC);
	if(!$project){
		exit('invalid-token');
	}elseif ($project['PublishedStageID'] !== NULL) {
		exit('already-published');
	}

	// code
	$code	= filter_input(INPUT_POST, 'code');
	if($token === NULL || $token === FALSE){
		exit('code-is-null');
	}

	// timezone
	$timezone = filter_input(INPUT_POST, 'timezone', FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^(\+|\-)[0-1][0-9]:00$/")));
	if($timezone === FALSE || $timezone === NULL){
		$timezone = '+00:00';
	}
	$registered = gmdate("Y-m-d H:i:s") . $timezone;

	// サムネイルを作成
	$thumb	= filter_input(INPUT_POST, 'thumb');

	if ($thumb) {
		$thumb = preg_replace('/data:[^,]+,/i', '', $thumb); //ヘッダに「data:image/png;base64,」が付いているので、それは外す
		$thumb = base64_decode($thumb); //残りのデータはbase64エンコードされているので、デコードする
		$image = imagecreatefromstring($thumb); //まだ文字列の状態なので、画像リソース化
		imagesavealpha($image, TRUE); // 透明色の有効

		// random name
		$bytes 	= openssl_random_pseudo_bytes(16); // 16bytes (32chars)
		$thumb_url	= '/s/thumbs/'.bin2hex($bytes).'.png'; // binaly to hex
		imagepng($image, '..' . $thumb_url); // 相対パス
	}else{
		$thumb_url = NULL;
	}

	// Publish flag
	$publish = filter_input(INPUT_POST, 'publish', FILTER_VALIDATE_BOOLEAN);
	if ($publish === NULL) $publish = FALSE;

	$new_stage_id = NULL;
	if ($publish) {
		// 新しくステージを作成
		$stage_info_json = filter_input(INPUT_POST, 'stage_info');
		if ($stage_info_json === NULL || $stage_info_json === FALSE) {
			exit('invalid-stage-info');
		}
		$stage_info = json_decode($stage_info_json);
		if (!$stage_info) {
			exit('invalid-stage-info');
		}

		// Srcを取得
		$stmt	= $dbh->prepare('SELECT "Src" FROM "Stage" WHERE "ID"=:project_sourceid');
		$stmt->bindValue(":project_sourceid", $stage_info->source_id, PDO::PARAM_INT);
		$stmt->execute();
		$stage_src	= $stmt->fetch(PDO::FETCH_COLUMN, 0);

		// ステージを作成
		$stmt	= $dbh->prepare('INSERT INTO "Stage" ("UserID","Mode","ProjectID","Path","Title","Explain","State","Thumbnail","SourceID","Src","Registered") VALUES(:userid,:replay,:projectid,:input_path,:input_title,:input_explain,:judging,:thumb_url,:project_sourceid,:stage_src,:gmt)');
		$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
		$stmt->bindValue(":replay", 'replay', PDO::PARAM_STR);
		$stmt->bindValue(":projectid", $project['ID'], PDO::PARAM_INT);
		$stmt->bindValue(":input_path", $stage_info->path, PDO::PARAM_STR);
		$stmt->bindValue(":input_title", $stage_info->title, PDO::PARAM_STR);
		$stmt->bindValue(":input_explain", $stage_info->explain, PDO::PARAM_STR);
		$stmt->bindValue(":judging", 'judging', PDO::PARAM_STR);
		$stmt->bindValue(":thumb_url", $thumb_url, PDO::PARAM_STR);
		$stmt->bindValue(":project_sourceid", $stage_info->source_id, PDO::PARAM_INT);
		$stmt->bindValue(":stage_src", $stage_src, PDO::PARAM_STR);
		$stmt->bindValue(":gmt", $registered, PDO::PARAM_STR);
		$flag 	= $stmt->execute();
		if (!$flag) {
			exit('database-error');
		}

		// ステージIDをProjectに関連づける
		$new_stage_id = $dbh->lastInsertId('Stage');
		$stmt	= $dbh->prepare('UPDATE "Project" SET "PublishedStageID"=:lastinsertid,"SourceStageID"=:source_stage_id WHERE "ID"=:projectid');
		$stmt->bindValue(":lastinsertid", $new_stage_id, PDO::PARAM_INT);
		$stmt->bindValue(":source_stage_id", $stage_info->source_id, PDO::PARAM_INT);
		$stmt->bindValue(":projectid", $project['ID'], PDO::PARAM_INT);
		$stmt->execute();
		if (!$flag) {
			exit('database-error');
		}
	}


	// Insert
	$stmt	= $dbh->prepare('INSERT INTO "CodeStock" ("Project","Code","Publish","Registered","Thumbnail","NewStage") VALUES(:project_id,:code,:publish,:registered,:thumb_url,:new_stage_id)');
	$stmt->bindValue(":project_id", $project['ID'], PDO::PARAM_INT);
	$stmt->bindValue(":code", $code, PDO::PARAM_STR);
	$stmt->bindValue(":publish", $publish , PDO::PARAM_BOOL);
	$stmt->bindValue(":registered", $registered , PDO::PARAM_STR);
	$stmt->bindValue(":thumb_url", $thumb_url , PDO::PARAM_STR);
	$stmt->bindValue(":new_stage_id", $new_stage_id, PDO::PARAM_INT);
	if (!$stmt->execute()) {
		exit('database-error');
	}

	exit('success');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}

?>