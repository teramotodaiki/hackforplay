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

	// すべてのパビリオン/パビリオンに関する自分の実績情報を取得
	$stmt		= $dbh->prepare('SELECT p."ID",p."DisplayName",p."RequiredAchievements",p."LocationNumber",m."ID" AS mID,m."Certified",m."Restaged",r."Icon" FROM "Pavilion" AS p LEFT OUTER JOIN "PavilionUserMap" AS m ON p."ID"=m."PavilionID"  AND m."UserID"=:userid LEFT OUTER JOIN "PavilionResourcePath" AS r ON p."ID"=r."PavilionID"');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->execute();
	$pavilions	= $stmt->fetchAll(PDO::FETCH_ASSOC);

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
	$kit_restaged	= 0;
	foreach ($pavilions as $key => $value) {
		if ($value['Restaged']) $kit_restaged ++;
	}

	// 合計実績数
	$has_achievements	= $quest_cleared + $quest_restaged + $kit_restaged;

	// パビリオンの中に、新たにCertifyするべきものがあれば、更新または追加する
	$stmt_update	= $dbh->prepare('UPDATE "PavilionUserMap" SET "Certified"=:true WHERE "ID"=:map_id');
	$stmt_insert	= $dbh->prepare('INSERT INTO "PavilionUserMap" ("PavilionID","UserID","Certified") VALUES(:pavilion_id,:userid,:true)');
	foreach ($pavilions as $key => $value) {
		// Uncertified and Has enough achievements
		if (!$value['Certified'] && $value['RequiredAchievements'] <= $has_achievements) {
			if ($value['mID']) {
				// Mapが存在する 更新
				$stmt_update->bindValue(":true", TRUE, PDO::PARAM_BOOL);
				$stmt_update->bindValue(":map_id", $value['mID'], PDO::PARAM_INT);
				$stmt_update->execute();
				// $pavilionsに反映
				$pavilions[$key]['Certified'] = "1";
			} else {
				// Mapが存在しない 追加
				$stmt_insert->bindValue(":pavilion_id", $value['ID'], PDO::PARAM_INT);
				$stmt_insert->bindValue(":userid", $session_userid, PDO::PARAM_INT);
				$stmt_insert->bindValue(":true", TRUE, PDO::PARAM_BOOL);
				$stmt_insert->execute();
				// $pavilionsに反映
				$pavilions[$key]['mID'] = $dbh->lastInsertId('PavilionUserMap');
				$pavilions[$key]['Certified'] = "1";
			}
		}
	}

	$town					= new stdClass;
	$town->pavilions		= $pavilions;
	$town->has_achievements = $has_achievements;

	include 'view.php';

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);

	header('Location: ../e');
}

?>