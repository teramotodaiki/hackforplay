<?php
/*
 * ユーザーのAttendance情報をCSVフォーマットで書き出す
 *
 * 			,  'Begin',    'End',  'SelfPath', 'QueryString'\n
 * {UserID}	, {Number}, {Number}, {String}	, {String}		\n
 * {UserID}	, {Number}, {Number}, {String}	, {String}		\n
 * ...\n
*/

try {

	$offset		= filter_input(INPUT_GET, 'offset', FILTER_VALIDATE_INT);
	if (!$offset) {
		$offset	= 0;
	}
	$length		= filter_input(INPUT_GET, 'length', FILTER_VALIDATE_INT);
	if (!$length) {
		$length	= 1;
	}

	$fileName = "attendance_" . $offset . ".csv";
	header('Content-Type: application/octet-stream');
	header('Content-Disposition: attachment; filename=' . $fileName);

	require_once '../preload.php';

	// KeyValueData
	$stmt	= $dbh->prepare('SELECT "ID","ValueString" FROM "KeyValueData" WHERE "KeyString"=:key');

	$stmt->bindValue(":key", 'SelfPath', PDO::PARAM_STR);
	$stmt->execute();
	$relationOfSelfPath		= $stmt->fetchAll(PDO::FETCH_COLUMN | PDO::FETCH_GROUP | PDO::FETCH_UNIQUE);

	$stmt->bindValue(":key", 'QueryString', PDO::PARAM_STR);
	$stmt->execute();
	$relationOfQueryString	= $stmt->fetchAll(PDO::FETCH_COLUMN | PDO::FETCH_GROUP | PDO::FETCH_UNIQUE);

	// Map
	$stmt_map	= $dbh->prepare('SELECT "KeyValueDataID" FROM "AttendanceMap" WHERE "AttendanceID"=:att_id');

	// Attendance
	$stmt_att	= $dbh->prepare('SELECT "ID","UserID","Begin","End" FROM "Attendance"');
	$stmt_att->execute();

	// Skip
	for ($i=0; $i < $offset; $i++) {
		$stmt_att->fetch();
	}

	echo ",Begin,End,SelfPath,QueryString\n";

	while (($row = $stmt_att->fetch(PDO::FETCH_ASSOC)) && ($length-- > 0)) {

		echo $row['UserID'] . ","; // UserID
		echo date_create_from_format('Y-m-d H:i:sP', $row['Begin'])->getTimeStamp() . ","; // Begin
		echo ($row['End'] ? date_create_from_format('Y-m-d H:i:sP', $row['End'])->getTimeStamp() : '') . ","; // End

		$stmt_map->bindValue(":att_id", $row['ID'], PDO::PARAM_INT);
		$stmt_map->execute();
		$map	= $stmt_map->fetchAll(PDO::FETCH_COLUMN);

		$selfPath			= NULL;
		foreach ($map as $key => $value) {
			if (isset($relationOfSelfPath[$value])) {
				$selfPath	= $relationOfSelfPath[$value];
				break;
			}
		}

		$queryString			= NULL;
		foreach ($map as $key => $value) {
			if (isset($relationOfQueryString[$value])) {
				$queryString	= $relationOfQueryString[$value];
				break;
			}
		}

		echo ($selfPath ? $selfPath : '') . ",";
		echo ($queryString ? $queryString : '') . ",";

		echo "\n";
	}

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
}


?>