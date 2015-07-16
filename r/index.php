<?php
try {

	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	$fetch_start_id		= filter_input(INPUT_GET, 'start', FILTER_VALIDATE_INT);
	if (!$fetch_start_id) {
		$fetch_start_id	= 0;
	}

	// フィルターを取得
	$filter			= filter_input(INPUT_GET, 'filter');
	$stmt			= $dbh->prepare('SELECT "ID" FROM "StageTagData" WHERE "IdentifierString"=:filter');
	$stmt->bindValue(":filter", $filter, PDO::PARAM_STR);
	$stmt->execute();
	$filter_tag_id	= $stmt->fetch(PDO::FETCH_COLUMN, 0);

	// ステージの数を取得
	$stage_num = 0;
	if (!$filter_tag_id) {

		// フィルタリングせずに、すべてのステージの数を取得
		$stmt			= $dbh->prepare('SELECT COUNT(*) FROM "Stage" WHERE "Mode"=:replay AND "State"=:published');
		$stmt->bindValue(":replay", 'replay', PDO::PARAM_STR);
		$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
		$stmt->execute();
		$stage_num		= $stmt->fetch(PDO::FETCH_COLUMN, 0);

	} else {

		// フィルタリングされたステージの数を取得
		$stmt			= $dbh->prepare('SELECT COUNT(*) FROM "Stage" WHERE "Mode"=:replay AND "State"=:published AND "ID" IN (SELECT "StageID" FROM "StageTagMap" WHERE "TagID"=:filter_tag_id)');
		$stmt->bindValue(":replay", 'replay', PDO::PARAM_STR);
		$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
		$stmt->bindValue(":filter_tag_id", $filter_tag_id, PDO::PARAM_INT);
		$stmt->execute();
		$stage_num		= $stmt->fetch(PDO::FETCH_COLUMN, 0);

	}



	include('view.php');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);

	header('Location: ../e');
}
?>