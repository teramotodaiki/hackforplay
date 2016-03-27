<?php
/**
 * ***廃止予定***
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
	$stmt	= $dbh->prepare('SELECT "ID" FROM "Project" WHERE "Token"=:token');
	$cache = array();
	foreach ($list as $index => $row) {
		$token = $row['token'];
		if ($token === NULL) {
			$list[$index]['ProjectID'] = NULL;
		} elseif (isset($cache[$token])) {
			$list[$index]['ProjectID'] = $cache[$token];
		} else {
			$stmt->bindValue(":token", $row['token'], PDO::PARAM_STR);
			$stmt->execute();
			$list[$index]['ProjectID'] = $cache[$token] = $stmt->fetch(PDO::FETCH_COLUMN);
		}
	}

	$placeholder = implode(',', array_fill(0, count($list), '(?,?,?,?)'));
	$stmt	= $dbh->prepare('INSERT INTO "AssetLog" ("AssetID","UserID","ProjectID","Registered") VALUES '.$placeholder);
	foreach ($list as $index => $row) {
		$num = $index * 4;
		$stmt->bindValue($num + 1, $row['AssetID'], PDO::PARAM_INT);
		$stmt->bindValue($num + 2, $session_userid, PDO::PARAM_INT);
		$stmt->bindValue($num + 3, $row['ProjectID'], PDO::PARAM_STR);
		$stmt->bindValue($num + 4, $row['Registered'], PDO::PARAM_STR);
	}
	$flag = $stmt->execute();
	if (!$flag) exit('NG');

	exit('OK');

} catch (Exception $e) {
	die();
}

?>
