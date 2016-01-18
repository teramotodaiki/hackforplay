<?php
/**
 * sessiontime.php
 * 30分以内の連続するAttendanceをSessionTimeと定義し、累計時間を求める
*/


try {

	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	$lastweek = (new DateTime())->modify('-8 days'); // Timezoneがあるので、多めにさかのぼる

	$stmt	= $dbh->prepare('SELECT DISTINCT "Begin" FROM "Attendance" WHERE "UserID"=:userid AND "Begin">:lastweek ORDER BY "Begin"');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":lastweek", $lastweek->format('Y-m-d H:i:s'), PDO::PARAM_STR);
	$stmt->execute();

	$dist	= array();
	for ($i=0; $i < 7; $i++) {
		$day		= $lastweek->modify('+1 day')->format('m/d');
		$dist[$day]	= 0;
	}

	$cursor	= (new DateTime())->modify('-8 days'); // 初期化
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		if (!isset($row['Begin'])) continue;
		$begin	= new DateTime($row['Begin']);
		$day	= $begin->format('m/d');
		// cursor + 30 min > begin なら、 begin - cursor をカウント
		$cur30	= (new DateTime($cursor->format('Y-m-d H:i:s')))->modify('+30 minutes');
		if (isset($dist[$day]) && $cur30 > $begin) {
			$dist[$day]	+= $begin->format('U') - $cursor->format('U');
		}
		$cursor = $begin;
	}

	$result	= new stdClass;
	$result->labels		= array_keys($dist);
	$result->thisweek	= array_values($dist);

	echo json_encode($result);
	exit();

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}

?>
