<?php
/*
過去1ヶ月間に作られたAnonymousUserが遊んだStageID[101-106]の数とその後登録した数を取得する
Output:	no-data , parse-error , JSON{summary_of_tutorial}
{
	labels : [101-106,Reg],
	values : [チュートリアル挑戦率]
}
*/

try {

	require_once '../preload.php';

	// 過去１ヶ月のうち最もIDの若いものを取得
	$stmt	= $dbh->prepare('SELECT MIN("ID"),COUNT(DISTINCT "UserID") FROM "AnonymousUser" WHERE "Registered">:now');
	$stmt->bindValue(":now", (new DateTime(NULL, new DateTimeZone('UTC')))->modify('-1 month')->format('Y-m-d H:i:s'), PDO::PARAM_STR);
	$stmt->execute();
	$info	= $stmt->fetch(PDO::FETCH_ASSOC);
	var_dump($info);

	// MIN ID 以降のAUserIDを持つAnonymous User Dataをすべて取得
	$stmt	= $dbh->prepare('SELECT "AUserID","StageID" FROM "AnonymousUserData" WHERE "AUserID">:min_id');
	$stmt->bindValue(":min_id", $info['MIN("ID")'], PDO::PARAM_INT);
	$stmt->execute();
	$alldata = $stmt->fetchAll(PDO::FETCH_COLUMN | PDO::FETCH_GROUP);
	echo "<br/><br/><br/>";
	var_dump($alldata);
	echo "<br/><br/><br/>";

	// 分布を求める
	$dist	= array_fill(101, 6, 0); // ユーザー分布
	foreach ($alldata as $key => $value) {
		// $key == UserID, $value == array of cleared StageIDs
		foreach ($value as $inkey => $invalue) {
			$count = (int)$invalue;
			$dist[$count] ++;
		}
	}
	$dist['Reg'] = (int)$info['COUNT(DISTINCT "UserID")']; // 会員登録をしたユーザーの数

	$summary_of_tutorial		= new stdClass;
	$summary_of_tutorial->values = $dist;
	$summary_of_tutorial->labels = array_keys($dist);

	$json = json_encode($summary_of_tutorial);
	if ($json === FALSE) {
		exit('parse-error');
	}
	echo $json;

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>
