<?php
/*
過去1ヶ月間のアクティブユーザーを１日(00:00:00GMT - 23:59:59GMT)ごとに取得する
Output:	no-data , parse-error , JSON{summary_of_activerate}
{
	labels : [計測スパン],
	values : [アクティブ率]
}
*/

require_once '../preload.php';

try {

	$datetime	= (new DateTime())->modify('-1 month'); // 始点
	$stmt	= $dbh->prepare('SELECT "UserID","Begin" FROM "Attendance" WHERE "Begin">:lastmonth ORDER BY "UserID"');
	$stmt->bindValue(":lastmonth", $datetime->format('Y-m-d H:i:s'), PDO::PARAM_STR);
	$stmt->execute();

	// Label
	$dist	= array();
	for ($i=0; $i < 30; $i++) {
		$date = $datetime->modify('+1 day')->format('m/d');
		$dist[$date] = 0;
	}

	$maxUidEachDays = array_fill_keys(array_keys($dist), 0); // dynamic cache
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$date = (new DateTime($row['Begin']))->format('m/d');
		$user = (int)$row['UserID'];
		if (isset($maxUidEachDays[$date]) && $user > $maxUidEachDays[$date]) {
			$dist[$date] ++;
			$maxUidEachDays[$date] = $user;
		}
	}

	$summary_of_activerate		= new stdClass;
	$summary_of_activerate->values = array_values($dist);
	$summary_of_activerate->labels = array_keys($dist);

	$json = json_encode($summary_of_activerate);
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