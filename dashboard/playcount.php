<?php
/**
 * Sessionユーザーが作成したステージの合計プレイ回数を求める
*/

try {

	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	if (!$session_userid) {
		exit();
	}

	$stmt	= $dbh->prepare('SELECT SUM("Playcount") FROM "Stage" WHERE "UserID"=:userid');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->execute();

	$value	= $stmt->fetch(PDO::FETCH_COLUMN);
	echo $value;
	exit();

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}

?>
