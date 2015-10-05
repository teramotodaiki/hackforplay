<?php

try {

	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	// パビリオンの存在確認
	$pavilion_id	= filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
	if (!$pavilion_id) {
		header('Location: ../town/'); // タウンにもどる
		exit();
	}
	$stmt		= $dbh->prepare('SELECT p."KitStageID",p."RequiredAchievements",r.* FROM "Pavilion" AS p INNER JOIN "PavilionResourcePath" AS r ON p."ID"=r."PavilionID" WHERE p."ID"=:pavilion_id');
	$stmt->bindValue(":pavilion_id", $pavilion_id, PDO::PARAM_INT);
	$stmt->execute();
	$pavilion	= $stmt->fetch(PDO::FETCH_ASSOC);
	if (!$pavilion) {
		header('Location: ../town/'); // タウンにもどる
		exit();
	}

	// BodyのBackgroundだけ個別に取得
	$pavilionBg = $pavilion['BodyBg'];

	include 'view.php';

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);

	header('Location: ../e');
}

?>