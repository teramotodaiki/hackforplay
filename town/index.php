<?php

try {

	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	if (!$session_userid) {
		header('Location: ../login/');
		exit;
	}

	// クエストごとの実績を取得
	$stmt			= $dbh->prepare('SELECT COUNT(*) FROM "QuestUserMap" WHERE "Cleared"=:true AND "UserID"=:userid');
	$stmt->bindValue(":true", TRUE, PDO::PARAM_BOOL);
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->execute();
	$quest_cleared	= $stmt->fetch(PDO::FETCH_COLUMN);

	$stmt			= $dbh->prepare('SELECT COUNT(*) FROM "QuestUserMap" WHERE "Restaged"=:true AND "UserID"=:userid');
	$stmt->bindValue(":true", TRUE, PDO::PARAM_BOOL);
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->execute();
	$quest_restaged	= $stmt->fetch(PDO::FETCH_COLUMN);

	// パビリオンごとの実績を取得
	$stmt			= $dbh->prepare('SELECT COUNT(*) FROM "PavilionUserMap" WHERE "Restaged"=:true AND "UserID"=:userid');
	$stmt->bindValue(":true", TRUE, PDO::PARAM_BOOL);
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->execute();
	$kit_restaged	= $stmt->fetch(PDO::FETCH_COLUMN);

	// まだ解放されていないPavilionで、RequiredAchievementsが十分なものがあれば、そのIDを取得
	$stmt		= $dbh->prepare('SELECT p."ID" AS pID,m."ID" AS mID, m."Certified" FROM "Pavilion" AS p LEFT OUTER JOIN "PavilionUserMap" AS m ON p."ID"=m."PavilionID" AND m."UserID"=:userid WHERE p."RequiredAchievements"<=:achievements');
	$stmt->bindValue(":achievements", $quest_cleared + $quest_restaged + $kit_restaged, PDO::PARAM_INT);
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->execute();
	$certifying	= $stmt->fetchAll(PDO::FETCH_ASSOC);

	if ($certifying) {
		// $certifyingがあれば、MapのCertificationを更新または追加する
		$stmt_update	= $dbh->prepare('UPDATE "PavilionUserMap" SET "Certified"=:true WHERE "ID"=:map_id');
		$stmt_insert	= $dbh->prepare('INSERT INTO "PavilionUserMap" ("PavilionID","UserID","Certified") VALUES(:pavilion_id,:userid,:true)');
		foreach ($certifying as $key => $value) {
			if (!$value['Certified']) {
				if ($value['mID']) {
					// Mapが存在する 更新
					$stmt_update->bindValue(":true", TRUE, PDO::PARAM_INT);
					$stmt_update->bindValue(":map_id", $value['mID'], PDO::PARAM_INT);
					$stmt_update->execute();
				} else {
					// Mapが存在しない 追加
					$stmt_insert->bindValue(":pavilion_id", $value['pID'], PDO::PARAM_INT);
					$stmt_insert->bindValue(":userid", $session_userid, PDO::PARAM_INT);
					$stmt_insert->bindValue(":true", TRUE, PDO::PARAM_INT);
					$stmt_insert->execute();
				}
			}
		}
	}

	// パビリオンの情報を取得 (とりあえず　すべて) (Certificationと合同にすれば最適化できる)
	$stmt	= $dbh->prepare('SELECT p."ID",p."DisplayName",p."RequiredAchievements",m."Certified" FROM "Pavilion" AS p LEFT OUTER JOIN "PavilionUserMap" AS m ON p."ID"=m."PavilionID" AND m."UserID"=:userid');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->execute();
	$pavilions	= $stmt->fetchAll(PDO::FETCH_ASSOC);

	include 'view.php';

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);

	header('Location: ../e');
}

?>