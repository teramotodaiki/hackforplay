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

	$lastweek = (new DateTime())->modify('-7 days'); // Timezoneがあるので、多めにさかのぼる

	$stmt	= $dbh->prepare('SELECT "Begin","End" FROM "Attendance" WHERE "UserID"=:userid AND "End">:lastweek');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":lastweek", $lastweek->format('Y-m-d H:i:s'), PDO::PARAM_STR);
	$stmt->execute();

	$dist	= array();
	for ($i=0; $i < 7; $i++) {
		$day		= $lastweek->modify('+1 day')->format('m/d');
		$dist[$day]	= 0;
	}
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		if (!isset($row['Begin']) || !isset($row['End'])) {
			continue;
		}
		$begin	= new DateTime($row['Begin']);
		$end	= new DateTime($row['End']);
		$day	= $begin->format('m/d');
		if (isset($dist[$day])) {
			$dist[$day]	= $dist[$day] + $end->format('U') - $begin->format('U');
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
