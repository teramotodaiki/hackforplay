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

	$fileName = "pref_" . date("YmdHis") . ".csv";
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



	$buffer = ",Begin,End,SelfPath,QueryString\n";

	while ($row = $stmt_att->fetch(PDO::FETCH_ASSOC)) {

		$buffer .= $row['UserID'] . ","; // UserID
		$buffer .= date_create_from_format('Y-m-d H:i:sP', $row['Begin'])->getTimeStamp() . ","; // Begin
		$buffer .= ($row['End'] ? date_create_from_format('Y-m-d H:i:sP', $row['End'])->getTimeStamp() : '') . ","; // End

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

		$buffer .= ($selfPath ? $selfPath : '') . ",";
		$buffer .= ($queryString ? $queryString : '') . ",";

		$buffer .= "\n";
	}

	echo $buffer;

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
}


?>