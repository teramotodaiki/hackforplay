<?php
/*
過去1ヶ月間のDAUと新規ユーザー数を１日(00:00:00GMT - 23:59:59GMT)ごとに取得する
Output:	no-data , parse-error , JSON{summary_of_activeuser}
{
labels : [計測スパン],
dau : [DAU],
dru : [新規ユーザー数]
}
*/

require_once '../preload.php';

$datetime	= (new DateTime())->modify('-1 month'); // 始点
$lastmonth	= $datetime->format('Y-m-d H:i:s');
$stmt	= $dbh->prepare('SELECT "UserID","Begin" FROM "Attendance" WHERE "Begin">:lastmonth ORDER BY "UserID"');
$stmt->bindValue(":lastmonth", $lastmonth, PDO::PARAM_STR);
$stmt->execute();

// Label
$label	= array();
for ($i=0; $i < 30; $i++) {
	array_push($label, $datetime->modify('+1 day')->format('m/d'));
}

// DAU
$dau	= array_fill_keys($label, 0);
$maxUidEachDays = array_fill_keys($label, 0); // dynamic cache
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
	$date = (new DateTime($row['Begin']))->format('m/d');
	$user = (int)$row['UserID'];
	if (isset($maxUidEachDays[$date]) && $user > $maxUidEachDays[$date]) {
		$dau[$date] ++;
		$maxUidEachDays[$date] = $user;
	}
}

// Register user
$stmt	= $dbh->prepare('SELECT "ID","Registered" FROM "User" WHERE "Registered">:lastmonth');
$stmt->bindValue(":lastmonth", $lastmonth, PDO::PARAM_STR);
$stmt->execute();

// DRU
$dru	= array_fill_keys($label, 0);
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
	$date = (new DateTime($row['Registered']))->format('m/d');
	$dru[$date] ++;
}

$summary_of_activeuser		= new stdClass;
$summary_of_activeuser->dau = array_values($dau);
$summary_of_activeuser->dru = array_values($dru);
$summary_of_activeuser->labels = $label;

$json = json_encode($summary_of_activeuser);
if ($json === FALSE) {
	exit('parse-error');
}
echo $json;

?>
