<?php
/**
 * sessiontime.php
 *
*/


try {

	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	$lastweek = (new DateTime())->modify('-8 days'); // Timezoneがあるので、多めにさかのぼる

	$stmt	= $dbh->prepare('SELECT "Begin","End" FROM "Attendance" WHERE "UserID"=:userid AND "End">:lastweek ORDER BY "Begin"');
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
		if (!isset($row['Begin']) || !isset($row['End'])) {
			continue;
		}
		$begin	= new DateTime($row['Begin']);
		$end	= new DateTime($row['End']);
		$day	= $begin->format('m/d');
		if (isset($dist[$day]) && $cursor < $end) {
			$nextDay = new DateTime($begin->format('Y-m-') . ($begin->format('d') + 1), new DateTimeZone($begin->format('e')));
			$diff = min($nextDay, $end)->format('U') - max($cursor, $begin)->format('U');
			$dist[$day]	+= $diff;
			$cursor	= min($nextDay, $end);
		}
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
