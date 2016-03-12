<?php
/**
 * iframe内でthrowされたerrorデータを時系列で受け取る
 * Input: list{JSON}
 * Output: OK , NG
*/

try {

	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	$json = filter_input(INPUT_POST, 'list');
	if (!$json) exit('NG');

	$list = json_decode($json, TRUE); // Parse ASSOC
	if (!$list) exit('NG');

	// Project token-ID convert
	$stmt	= $dbh->prepare('SELECT "ReservedID" FROM "Project" WHERE "Token"=:token');
	$cache = array();
	foreach ($list as $index => $row) {
		$token = $row['token'];
		if (!$row['IsRestaging']) {
			continue; // play
		} elseif ($token === NULL) {
			$list[$index]['StageID'] = NULL;
		} elseif (isset($cache[$token])) {
			$list[$index]['StageID'] = $cache[$token];
		} else {
			$stmt->bindValue(":token", $row['token'], PDO::PARAM_STR);
			$stmt->execute();
			$list[$index]['StageID'] = $cache[$token] = $stmt->fetch(PDO::FETCH_COLUMN);
		}
	}

	$placeholder = implode(',', array_fill(0, count($list), '(?,?,?,?,?,?)'));
	$stmt	= $dbh->prepare('INSERT INTO "ClientErrorLog" ("UserID","StageID","IsRestaging","Name","Message","Registered") VALUES '.$placeholder);
	foreach ($list as $index => $row) {
		$num = $index * 6;
		$stmt->bindValue($num + 1, $session_userid, PDO::PARAM_INT);
		$stmt->bindValue($num + 2, $row['StageID'], PDO::PARAM_INT);
		$stmt->bindValue($num + 3, $row['IsRestaging'], PDO::PARAM_BOOL);
		$stmt->bindValue($num + 4, $row['Name'], PDO::PARAM_STR);
		$stmt->bindValue($num + 5, $row['Message'], PDO::PARAM_STR);
		$stmt->bindValue($num + 6, $row['Registered'], PDO::PARAM_STR);
	}
	$flag = $stmt->execute();
	if (!$flag) exit('NG');

	exit('OK');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}

?>
