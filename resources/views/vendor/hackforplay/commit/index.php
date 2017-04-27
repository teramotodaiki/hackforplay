<?php
/**
* /commit
* Projectに対して新しいScriptを追加する. また、そのScriptをStageとして投稿する
* ただし、Project.UserIDと一致するUserIDをもつセッションが必要
* publish flag がTRUEの時は、stage_infoを指定する
* team_id を指定することで、チーム名義として投稿できる
* Input:	token , code , timezone , publish , (stage_info) , (team_id) , (minor_update) (attendance-token)
* Output:	no-session , invalid-token , already-published , code-is-null , invalid-stage-info , database-error , success
*/


$ENABLED_JUDGING = false;
define('ENABLED_FEELES_WEBHOOK', true);

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

$stmt	= $dbh->prepare('SELECT "ID","ReservedID" FROM "Project" WHERE "Token"=:token AND "UserID"=:userid');
$stmt->bindValue(":token", $token, PDO::PARAM_STR);
$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
$stmt->execute();
$project = $stmt->fetch(PDO::FETCH_ASSOC);
if(!$project){
	exit('invalid-token');
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

// New Script
$stmt	= $dbh->prepare('INSERT INTO "Script" ("ProjectID","LineNum","RawCode","Registered") VALUES(:project_id,:line,:code,:registered)');
$stmt->bindValue(":project_id", $project['ID'], PDO::PARAM_INT);
$stmt->bindValue(":line", substr_count($code, "\n") + 1, PDO::PARAM_INT);
$stmt->bindValue(":code", $code, PDO::PARAM_STR);
$stmt->bindValue(":registered", $registered, PDO::PARAM_STR);
$result = $stmt->execute();
if (!$result) {
	exit('database-error');
}
$script_id = $dbh->lastInsertId('Script');

// Rise written flag of project
$stmt	= $dbh->prepare('UPDATE "Project" SET "Written"=1 WHERE "ID"=:project_id');
$stmt->bindValue(":project_id", $project['ID'], PDO::PARAM_INT);
$result = $stmt->execute();
if (!$result) {
	exit('database-error');
}

// Update channel if casting
$stmt	= $dbh->prepare('UPDATE "Channel" SET "Updated"=:gmt WHERE "ProjectID"=:project_id');
$stmt->bindValue(":project_id", $project['ID'], PDO::PARAM_INT);
$stmt->bindValue(":gmt", $registered, PDO::PARAM_STR);
$stmt->execute();

// Publish flag
$publish = filter_input(INPUT_POST, 'publish', FILTER_VALIDATE_BOOLEAN);

if ($publish) {
	// 新しくステージを作成
	$stage_info_json = filter_input(INPUT_POST, 'stage_info') or die('invalid-stage-info');
	$stage_info = json_decode($stage_info_json) or die('invalid-stage-info');

	// ステージ情報を更新
	if (!$project['ReservedID']) {
		exit('database-error');
	}

	// チームの権限を確認
	$team_id = filter_input(INPUT_POST, 'team_id', FILTER_VALIDATE_INT);
	if ($team_id) {
		$stmt	= $dbh->prepare('SELECT "ID" FROM "UserTeamMap" WHERE "UserID"=:userid AND "TeamID"=:team_id AND "Enabled"=1 AND "PublishingEmpowered"=1');
		$stmt->bindValue(':userid', $session_userid, PDO::PARAM_INT);
		$stmt->bindValue(':team_id', $team_id, PDO::PARAM_INT);
		$stmt->execute();
		if ($stmt->fetch() === FALSE) {
			die('unauthorized-team-publishing');
		}
	} else {
		$team_id = NULL;
	}

	// 最新のバージョンを取得
	$stmt = $dbh->prepare('SELECT "MajorVersion","MinorVersion" FROM "Stage" WHERE "ProjectID"=:id AND "MajorVersion" IS NOT NULL ORDER BY "ID" DESC');
	$stmt->bindValue(':id', $project['ID'], PDO::PARAM_INT);
	$stmt->execute();
	$versions = $stmt->fetchAll(PDO::FETCH_ASSOC);
	$version = array_shift($versions);
	if ($version === NULL) {
		$version = [
			'MajorVersion' => 0,
			'MinorVersion' => 0
		];
	}

	// 現在のバージョンを設定
	$minor_update = filter_input(INPUT_POST, 'minor_update', FILTER_VALIDATE_BOOLEAN);
	if ($minor_update) {
		// マイナーアップデート
		$version['MinorVersion'] ++;
	} else {
		// メジャーアップデート
		$version['MajorVersion'] ++;
		$version['MinorVersion'] = 0;
	}

	// Reserved -> Judging
	$stmt	= $dbh->prepare('UPDATE "Stage" SET "TeamID"=:team_id,"ScriptID"=:scriptid,"Title"=:input_title,"Explain"=:input_explain,"State"=:judging,"Registered"=:gmt,"MajorVersion"=:major,"MinorVersion"=:minor,"Published"=:gmt2 WHERE "ID"=:reserved_id');
	$stmt->bindValue(":team_id", $team_id, PDO::PARAM_INT);
	$stmt->bindValue(":scriptid", $script_id, PDO::PARAM_INT);
	$stmt->bindValue(":input_title", $stage_info->title, PDO::PARAM_STR);
	$stmt->bindValue(":input_explain", $stage_info->explain, PDO::PARAM_STR);
	$stmt->bindValue(":gmt", $registered, PDO::PARAM_STR);
	$stmt->bindValue(':major', $version['MajorVersion'], PDO::PARAM_INT);
	$stmt->bindValue(':minor', $version['MinorVersion'], PDO::PARAM_INT);
	$stmt->bindValue(":reserved_id", $project['ReservedID'], PDO::PARAM_INT);
	if ($ENABLED_JUDGING) {
		$stmt->bindValue(":judging", 'judging', PDO::PARAM_STR);
		$stmt->bindValue(':gmt2', null, PDO::PARAM_NULL);
	} else {
		$stmt->bindValue(":judging", 'published', PDO::PARAM_STR);
		$stmt->bindValue(':gmt2', $registered, PDO::PARAM_STR);
	}
	$result = $stmt->execute();
	if (!$result) {
		exit('database-error');
	}

	$stmt	= $dbh->prepare('SELECT "SourceID","Src","ImplicitMod","Thumbnail" FROM "Stage" WHERE "ID"=:reserved_id');
	$stmt->bindValue(":reserved_id", $project['ReservedID'], PDO::PARAM_INT);
	$stmt->execute();
	$stage = $stmt->fetch(PDO::FETCH_ASSOC);

	// 次のステージを事前に作成
	$stmt	= $dbh->prepare('INSERT INTO "Stage" ("UserID","Mode","ProjectID","State","SourceID","Src","ImplicitMod") VALUES(:userid,:replay,:projectid,:reserved,:source_id,:stage_src,:implicitMod)');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":replay", 'replay', PDO::PARAM_STR);
	$stmt->bindValue(":projectid", $project['ID'], PDO::PARAM_INT);
	$stmt->bindValue(":reserved", 'reserved', PDO::PARAM_STR);
	$stmt->bindValue(":source_id", $stage['SourceID'], PDO::PARAM_INT);
	$stmt->bindValue(":stage_src", $stage['Src'], PDO::PARAM_STR);
	$stmt->bindValue(":implicitMod", $stage['ImplicitMod'], PDO::PARAM_STR);
	$flag 	= $stmt->execute();
	if (!$flag) {
		exit('database-error');
	}
	$new_stage_id = $dbh->lastInsertId('Stage');

	$stmt	= $dbh->prepare('UPDATE "Project" SET "ReservedID"=:new_stage_id WHERE "ID"=:projectid');
	$stmt->bindValue(":new_stage_id", $new_stage_id, PDO::PARAM_INT);
	$stmt->bindValue(":projectid", $project['ID'], PDO::PARAM_INT);
	$flag 	= $stmt->execute();
	if (!$flag) {
		exit('database-error');
	}

	if (ENABLED_FEELES_WEBHOOK) {
		// ユーザーのニックネームを取得
		$stmt	= $dbh->prepare('SELECT "Nickname" FROM "User" WHERE "ID"=:user_id');
		$stmt->bindValue(":user_id", $session_userid, PDO::PARAM_INT);
		$stmt->execute();
		$user = $stmt->fetch(PDO::FETCH_ASSOC);

		// feeles.com に URL を通知
		$webhookParams = [
		    'title'         => $stage_info->title,
		    'type'          => 'website',
		    'image'         => $stage['Thumbnail'],
		    'description'   => $stage_info->explain,
		    'author'        => $user['Nickname'],
		    'url'           => "https://hackforplay.xyz/s/?id={$project['ReservedID']}",
		    'homepage'      => "https://hackforplay.xyz/m/?id={$session_userid}",
		    'original'      => "https://hackforplay.xyz/s/?id={$stage['SourceID']}",
		];
		file_get_contents('https://www.feeles.com/api/v1/add?' . http_build_query($webhookParams));
	}

}

exit('success');

?>
