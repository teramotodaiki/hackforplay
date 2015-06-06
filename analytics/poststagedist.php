<?php
/*
ユーザーごとの過去７日間の投稿回数によるユーザー数の分布と、その先週についての同分布
Output:	JSON{distribution_of_poststage}
*/

require_once '../preload.php';

try {

	$stmt	= $dbh->prepare('SELECT COUNT("UserID") FROM "Stage" WHERE "Registered">:_begin AND "Registered"<:_end AND "UserID" IS NOT NULL GROUP BY "UserID"');

	// 過去７日間
	$datetime	= (new DateTime())->modify('+1 day')->setTime(0,0,0);
	$stmt->bindValue(":_end", $datetime->format('Y-m-d H:i:s'), PDO::PARAM_STR);
	$stmt->bindValue(":_begin", $datetime->modify('-7 days')->format('Y-m-d H:i:s'), PDO::PARAM_STR);
	$stmt->execute();

	$this_week	= array_fill(0, 100, 0);
	for ($poststage = $stmt->fetchColumn(0); $poststage; $poststage = $stmt->fetchColumn(0)) {
		$key	= min((int)$poststage - 1, 99); // 1回なら0, n回ならn-1, 100回以上なら99
		$this_week[$key]++;
	}

	// １４日前からの７日間
	$datetime	= (new DateTime())->modify('-6 day')->setTime(0,0,0);
	$stmt->bindValue(":_end", $datetime->format('Y-m-d H:i:s'), PDO::PARAM_STR);
	$stmt->bindValue(":_begin", $datetime->modify('-7 days')->format('Y-m-d H:i:s'), PDO::PARAM_STR);
	$stmt->execute();

	$last_week	= array_fill(0, 100, 0);
	for ($poststage = $stmt->fetchColumn(0); $poststage; $poststage = $stmt->fetchColumn(0)) {
		$key	= min((int)$poststage - 1, 99); // 1回なら0, n回ならn-1, 100回以上なら99
		$last_week[$key]++;
	}

	// ラベル
	$labels	= array();
	for ($i=1; $i < 100; $i++) {
		array_push($labels, (string)$i);
	}
	array_push($labels, '100+');

	$distribution_of_poststage				= new stdClass;
	$distribution_of_poststage->labels		= $labels;
	$distribution_of_poststage->thisWeek	= $this_week;
	$distribution_of_poststage->lastWeek	= $last_week;

	$json = json_encode($distribution_of_poststage);
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