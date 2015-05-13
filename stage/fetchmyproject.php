<?php
/*
セッションIDをもとに、自分が作ったプロジェクトのうち、まだ投稿していないもので、enabledステートのものを取得
Input:	length
Output:	no-session , parse-error , JSON:{information_of_projects}
information_of_projects:
	values : [
		id : プロジェクトのID,
		source_id : 改造元ステージのID,
		source_title : 改造元ステージの名前,
		source_mode : 改造元ステージのMode (official, replay)
		token : プロジェクトのトークン
		data : コードなどのデータ
		registered : 作成された日時
	](,,,[])
}
*/

require_once '../preload.php';

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
try {
	$stmt	= $dbh->prepare('SELECT p."ID",p."Token",p."Registered",p."SourceStageID",p."Data",s."Title",s."Mode" FROM "Project" AS p LEFT OUTER JOIN "Stage" AS s ON p."SourceStageID"=s."ID" WHERE p."UserID"=:userid AND p."PublishedStageID" IS NULL AND p."State"=:enabled ORDER BY p."Registered" DESC');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":enabled", 'enabled', PDO::PARAM_STR);
	$stmt->execute();

	for ($i = 0; $i < $max_fetch_length; $i++){
		$item	= $stmt->fetch(PDO::FETCH_ASSOC);
		if($item !== FALSE){
			array_push($result, $item);
		}else{
			break;
		}
	}

} catch (PDOException $e) {
	print_r($e);
	die();
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
	// dataを最初の4行だけ抜き出し
	$data_exploded		= explode("\n", $value['Data'], 5);
	if (count($data_exploded) > 4) {
		unset($data_exploded[4]);
	}
	$item->data			= implode("\n", $data_exploded);

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

?>