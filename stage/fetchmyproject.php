<?php
/*
セッションIDをもとに、自分が作ったプロジェクトのうち、スクリプトが存在し、利用可能なものををすべて表示
Input:	length , (attendance-token)
Output:	no-session , parse-error , JSON:{information_of_projects}
information_of_projects:
	values : [
		id : プロジェクトのID,
		source_id : 改造元ステージのID,
		source_title : 改造元ステージの名前,
		source_mode : 改造元ステージのMode (official, replay),
		token : プロジェクトのトークン,
		thumbnail : サムネイルのURL,
		registered : 作成された日時
	](,,,[])
}
*/

require_once '../preload.php';

try {

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	// 最大値を設定
	$max_fetch_length 	= 15;
	$input_max_fetch_length = filter_input(INPUT_POST, 'length', FILTER_VALIDATE_INT);
	if ($input_max_fetch_length !== FALSE && $input_max_fetch_length !== NULL) {
		$max_fetch_length 	= min($max_fetch_length, $input_max_fetch_length);
	}

	// セッションを取得
	if (!isset($session_userid)) {
		exit('no-session');
	}

	// プロジェクト一覧を取得
	// SQL Serverでは LIMIT 句が使えないので、一旦全データを取得している いずれ直すべき
	$result = array();
	$stmt	= $dbh->prepare('SELECT p."ID",p."Token",p."Registered",p."SourceStageID",s."Title",s."Mode" FROM "Project" AS p LEFT OUTER JOIN "Stage" AS s ON p."SourceStageID"=s."ID" WHERE p."UserID"=:userid AND p."State"=:enabled AND p."Written"=:true ORDER BY p."Registered" DESC');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":enabled", 'enabled', PDO::PARAM_STR);
	$stmt->bindValue(":true", true, PDO::PARAM_BOOL);
	$stmt->execute();

	for ($i = 0; $i < $max_fetch_length; $i++){
		$item	= $stmt->fetch(PDO::FETCH_ASSOC);
		if($item !== FALSE){
			array_push($result, $item);
		}else{
			break;
		}
	}

	// ThumbnailのURLを取得
	foreach ($result as $key => $value) {
		// 最も新しい(値の大きい)ScriptIDを取得
		$stmt	= $dbh->prepare('SELECT "Thumbnail" FROM "Script" WHERE "ProjectID"=:project_id ORDER BY "ID" DESC');
		$stmt->bindValue(":project_id", $value['ID'], PDO::PARAM_INT);
		$stmt->execute();
		$thumb	= $stmt->fetch(PDO::FETCH_COLUMN, 0);
		$result[$key]['Thumbnail']	= $thumb ? $thumb : '';
	}

	// 配列のvalueを生成し、データを格納
	$values = array();
	foreach ($result as $key => $value) {
		$item 	= new stdClass();
		$item->id 			= $value['ID'];
		$item->source_id 	= $value['SourceStageID'];
		$item->source_title	= $value['Title'];
		$item->source_mode	= $value['Mode'];
		$item->token 		= $value['Token'];
		$item->registered 	= $value['Registered'];
		$item->thumbnail	= $value['Thumbnail'];

		array_push($values, $item);
	}

	// 出力
	$information_of_projects = new stdClass();
	$information_of_projects->values = $values;
	$json = json_encode($information_of_projects);

	if ($json === FALSE) {
		exit('parse-error');
	}
	echo $json;

} catch (Exception $e) {
	Rollbar::report_exception($e);
	die();
}
?>
