<?php
/*
過去１週間に作られたAnonymousUserが遊んだStageID[101-106]の数とその後登録した数を取得する
Output:	no-data , parse-error , JSON{summary_of_tutorial}
{
	labels : [101-106,Reg],
	thisweek : [チュートリアル挑戦率(過去１週間)],
	lastweek : [チュートリアル挑戦率(先週１週間)]
}
*/
try {

	require_once '../preload.php';

	$getWeeklySummary = function ($start, $end) use ($dbh)
	{
		// 過去１ヶ月のうち最もIDの若いものを取得
		$stmt	= $dbh->prepare('SELECT MIN("ID"),MAX("ID") FROM "AnonymousUser" WHERE :start<"Registered" AND "Registered"<:end');
		$stmt->bindValue(":start", $start, PDO::PARAM_STR);
		$stmt->bindValue(":end", $end, PDO::PARAM_STR);
		$stmt->execute();
		$range	= $stmt->fetch();

		// 登録したユーザーの数を取得
		$stmt	= $dbh->prepare('SELECT COUNT(DISTINCT "UserID") FROM "AnonymousUser" WHERE :start<"Registered" AND "Registered"<:end');
		$stmt->bindValue(":start", $start, PDO::PARAM_STR);
		$stmt->bindValue(":end", $end, PDO::PARAM_STR);
		$stmt->execute();
		$reg	= $stmt->fetch(PDO::FETCH_COLUMN);

		// MIN ID 以降のAUserIDを持つAnonymous User Dataをすべて取得
		$stmt	= $dbh->prepare('SELECT "AUserID","StageID" FROM "AnonymousUserData" WHERE :min_id<"AUserID" AND "AUserID"<:max_id ');
		$stmt->bindValue(":min_id", $range[0], PDO::PARAM_INT);
		$stmt->bindValue(":max_id", $range[1], PDO::PARAM_INT);
		$stmt->execute();
		$alldata = $stmt->fetchAll(PDO::FETCH_COLUMN | PDO::FETCH_GROUP);

		// 分布を求める
		$dist	= array_fill(101, 6, 0); // ユーザー分布
		foreach ($alldata as $userID => $stageIDArray) {
			foreach ($stageIDArray as $key => $stageID) {
				$dist[(int)$stageID] ++;
			}
		}
		$dist['Reg'] = (int)$reg; // 会員登録をしたユーザーの数

		return array_values($dist);
	};

	$label	= array('st.1', 'st.2', 'st.3', 'st.4', 'st.5', 'st.6', 'Register');
	$datetime	= new DateTime(NULL, new DateTimeZone('UTC'));
	$thisweek	= $datetime->format('Y-m-d H:i:s');
	$last1week	= $datetime->modify('-1 week')->format('Y-m-d H:i:s');
	$last2week	= $datetime->modify('-1 week')->format('Y-m-d H:i:s');

	$summary_of_tutorial			= new stdClass;
	$summary_of_tutorial->thisweek	= $getWeeklySummary($last1week, $thisweek);
	$summary_of_tutorial->lastweek	= $getWeeklySummary($last2week, $last1week);
	$summary_of_tutorial->labels	= $label;

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
