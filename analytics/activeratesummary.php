<?php
/*
過去1ヶ月間のアクティブ率(DAU/MAU比)を１日(00:00:00GMT - 23:59:59GMT)ごとに取得する
Output:	no-data , parse-error , JSON{summary_of_activerate}
{
	labels : [計測スパン],
	values : [アクティブ率]
}
*/

require_once '../preload.php';

try {

	$datetime	= (new DateTime())->modify('-29 days'); // 始点
	$stmt	= $dbh->prepare('SELECT COUNT(DISTINCT "UserID") FROM "Attendance" WHERE "End">:_from AND "Begin"<:_to');

	// MAU
	$month_from	= $datetime->setTime( 0,  0,  0)->format("Y-m-d H:i:s");
	$month_to	= (new DateTime())->setTime(23, 59, 59)->format("Y-m-d H:i:s");
	$stmt->bindValue(":_from", $month_from, PDO::PARAM_STR);
	$stmt->bindValue(":_to", $month_to, PDO::PARAM_STR);
	$stmt->execute();
	$MAU		= $stmt->fetchColumn(0);
	if ((int)$MAU === 0) {
		exit('no-data');
	}

	// DAU
	for ($i=0; $i < 30; $i++) {
		$_from	= $datetime->setTime( 0,  0,  0)->format("Y-m-d H:i:s");
		$_to	= $datetime->setTime(23, 59, 59)->format("Y-m-d H:i:s");
		$stmt->bindValue(":_from", $_from, PDO::PARAM_STR);
		$stmt->bindValue(":_to", $_to, PDO::PARAM_STR);
		$stmt->execute();
		$DAU	= $stmt->fetchColumn(0);

		$labels[$i]	= $datetime->format("D m/d");
		$values[$i]	= (int)$DAU / (int)$MAU;

		$datetime->modify('+1 day');
	}

	$summary_of_activerate		= new stdClass;
	$summary_of_activerate->values = $values;
	$summary_of_activerate->labels = $labels;

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