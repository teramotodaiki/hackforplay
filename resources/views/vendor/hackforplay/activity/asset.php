<?php
/**
* ユーザーのアセット利用データを時系列で受け取る
* Input: list{JSON}
* Output: OK , NG
*/

require_once '../preload.php';

session_start();
$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();

$json = filter_input(INPUT_POST, 'list');
if (!$json) exit('NG');

$list = json_decode($json, TRUE); // Parse ASSOC
if (!$list) exit('NG');

// Project token-ID convert
$stmt	= $dbh->prepare('SELECT "ID","ReservedID" FROM "Project" WHERE "Token"=:token');
$cache = array();
foreach ($list as $index => $row) {
	$token = $row['token'];
	if ($token === NULL) {
		$list[$index]['ProjectID'] = NULL;
		$list[$index]['ReservedID'] = NULL;
	} elseif (isset($cache[$token])) {
		$list[$index]['ProjectID'] = $cache[$token]['ID'];
		$list[$index]['StageID'] = $cache[$token]['ReservedID'];
	} else {
		$stmt->bindValue(":token", $row['token'], PDO::PARAM_STR);
		$stmt->execute();
		$cache[$token] = $stmt->fetch(PDO::FETCH_ASSOC);
		$list[$index]['ProjectID'] = $cache[$token]['ID'];
		$list[$index]['StageID'] = $cache[$token]['ReservedID'];
	}
}

$placeholder = implode(',', array_fill(0, count($list), '(?,?,?,?,?)'));
$stmt	= $dbh->prepare('INSERT INTO "AssetLog" ("AssetID","UserID","ProjectID","StageID","Registered") VALUES '.$placeholder);
foreach ($list as $index => $row) {
	$num = $index * 5;
	$stmt->bindValue($num + 1, $row['AssetID'], PDO::PARAM_INT);
	$stmt->bindValue($num + 2, $session_userid, PDO::PARAM_INT);
	$stmt->bindValue($num + 3, $row['ProjectID'], PDO::PARAM_INT);
	$stmt->bindValue($num + 4, $row['StageID'], PDO::PARAM_INT);
	$stmt->bindValue($num + 5, $row['Registered'], PDO::PARAM_STR);
}
$flag = $stmt->execute();
if (!$flag) exit('NG');

exit('OK');

?>
