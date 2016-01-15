<?php
/**
 * Project作成数
*/

try {

	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	$lastweek = (new DateTime())->modify('-8 days'); // Timezoneがあるので、多めにさかのぼる

	$stmt	= $dbh->prepare('SELECT "Registered" FROM "Project" WHERE "UserID"=:userid AND "State"!=:sendcode');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":sendcode", 'sendcode', PDO::PARAM_STR);
	$stmt->execute();

	$dist	= array();
	for ($i=0; $i < 7; $i++) {
		$day		= $lastweek->modify('+1 day')->format('m/d');
		$dist[$day]	= 0;
	}

	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		if (!isset($row['Registered'])) {
			continue;
		}
		$date	= new DateTime($row['Registered']);
		$day	= $date->format('m/d');
		if (isset($dist[$day])) {
			$dist[$day] ++;
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
