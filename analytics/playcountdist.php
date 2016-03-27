<?php
/*
 **** 廃止予定 ****
ユーザーごとの過去７日間のステージプレイ回数によるユーザー数の分布と、その先週についての同分布
Output:	JSON{distribution_of_playcount}
*/

require_once '../preload.php';

try {

	// KeyValueData.IDを取得
	$pattern= $_SERVER['SERVER_NAME'] === 'localhost' ? '/hackforplay/s/index.php' : '/s/index.php';
	$stmt	= $dbh->prepare('SELECT "ID" FROM "KeyValueData" WHERE "KeyString"=:selfpath AND "ValueString"=:pattern');
	$stmt->bindValue(":selfpath", 'SelfPath', PDO::PARAM_STR);
	$stmt->bindValue(":pattern", $pattern, PDO::PARAM_STR);
	$stmt->execute();
	$kvd_id	= $stmt->fetchColumn(0);

	$stmt	= $dbh->prepare('SELECT COUNT("UserID") FROM "Attendance" AS a WHERE a."Begin">:_begin AND a."Begin"<:_end AND :kvd_id IN (SELECT "KeyValueDataID" FROM "AttendanceMap" AS m WHERE m."AttendanceID"=a."ID") GROUP BY a."UserID"');

	// 過去７日間
	$datetime	= (new DateTime())->modify('+1 day')->setTime(0,0,0);
	$stmt->bindValue(":_end", $datetime->format('Y-m-d H:i:s'), PDO::PARAM_STR);
	$stmt->bindValue(":_begin", $datetime->modify('-7 days')->format('Y-m-d H:i:s'), PDO::PARAM_STR);
	$stmt->bindValue(":kvd_id", $kvd_id, PDO::PARAM_INT);
	$stmt->execute();

	$this_week	= array_fill(0, 100, 0);
	for ($playcount = $stmt->fetchColumn(0); $playcount; $playcount = $stmt->fetchColumn(0)) {
		$key	= min((int)$playcount - 1, 99); // 1回なら0, n回ならn-1, 100回以上なら99
		$this_week[$key]++;
	}

	// １４日前からの７日間
	$datetime	= (new DateTime())->modify('-6 day')->setTime(0,0,0);
	$stmt->bindValue(":_end", $datetime->format('Y-m-d H:i:s'), PDO::PARAM_STR);
	$stmt->bindValue(":_begin", $datetime->modify('-7 days')->format('Y-m-d H:i:s'), PDO::PARAM_STR);
	$stmt->bindValue(":kvd_id", $kvd_id, PDO::PARAM_INT);
	$stmt->execute();

	$last_week	= array_fill(0, 100, 0);
	for ($playcount = $stmt->fetchColumn(0); $playcount; $playcount = $stmt->fetchColumn(0)) {
		$key	= min((int)$playcount - 1, 99); // 1回なら0, n回ならn-1, 100回以上なら99
		$last_week[$key]++;
	}

	// ラベル
	$labels	= array();
	for ($i=1; $i < 100; $i++) {
		array_push($labels, (string)$i);
	}
	array_push($labels, '100+');

	$distribution_of_playcount				= new stdClass;
	$distribution_of_playcount->labels		= $labels;
	$distribution_of_playcount->thisWeek	= $this_week;
	$distribution_of_playcount->lastWeek	= $last_week;

	$json = json_encode($distribution_of_playcount);
	if ($json === FALSE) {
		exit('parse-error');
	}
	echo $json;

} catch (Exception $e) {
	die();
}

?>
