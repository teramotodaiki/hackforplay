<?php
/**
 * load.php
 * Input:
 * Output: no-session, database-error, town:JSON
 */

try {

	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	if (!$session_userid) {
		exit('no-session');
	}

	// すべてのパビリオン/パビリオンに関する自分の実績情報を取得
	$stmt	= $dbh->prepare('SELECT p."ID",p."DisplayName",p."RequiredAchievements",p."LocationNumber",m."ID" AS mID,m."Certified",m."Restaged",r."Icon" FROM "Pavilion" AS p ' . 'LEFT OUTER JOIN "PavilionUserMap" AS m ON p."ID"=m."PavilionID" AND m."UserID"=:userid LEFT OUTER JOIN "PavilionResourcePath" AS r ON p."ID"=r."PavilionID"');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->execute();
	$pavilions	= $stmt->fetchAll(PDO::FETCH_ASSOC);

	// パビリオンごとの実績を取得
	foreach ($pavilions as $key => $value) {
		$pavilions[$key]['Achievements'] = intval($value['Restaged']); // 0 or 1
	}

	// パビリオンごとにクエストの実績を取得
	$stmt	= $dbh->prepare('SELECT m."Cleared",m."Restaged",q."PavilionID" FROM "QuestUserMap" AS m INNER JOIN "Quest" AS q ON m."QuestID"=q."ID" WHERE m."UserID"=:userid AND (m."Cleared"=:true1 OR m."Restaged"=:true2)');
	$stmt->bindValue(":true1", TRUE, PDO::PARAM_BOOL);
	$stmt->bindValue(":true2", TRUE, PDO::PARAM_BOOL);
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->execute();
	while ($quest = $stmt->fetch(PDO::FETCH_ASSOC)) {
		// 該当するパビリオンを見つける
		foreach ($pavilions as $key => $value) {
			if ($value['ID'] === $quest['PavilionID']) {
				$pavilions[$key]['Achievements'] = $value['Achievements'] + $quest['Cleared'] + $quest['Restaged'];
				continue;
			}
		}
	}

	// 合計実績数
	$has_achievements	= 0;
	foreach ($pavilions as $key => $value) {
		$has_achievements += $value['Achievements'];
	}

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

	// もっとも保存時刻のあたらしいプロジェクトの情報を取得
	$stmt	= $dbh->prepare('SELECT "ProjectID","Thumbnail" FROM "Script" WHERE "ProjectID" IN (SELECT "ID" FROM "Project" WHERE "UserID"=:userid AND "State"=:enabled AND "Written"=:true) ORDER BY "Registered" DESC');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":enabled", 'enabled', PDO::PARAM_STR);
	$stmt->bindValue(":true", TRUE, PDO::PARAM_BOOL);
	$stmt->execute();
	$recent_project	= $stmt->fetch(PDO::FETCH_ASSOC);
	if ($recent_project) {
		$stmt		= $dbh->prepare('SELECT "SourceStageID","Token" FROM "Project" WHERE "ID"=:project_id');
		$stmt->bindValue(":project_id", $recent_project['ProjectID'], PDO::PARAM_INT);
		$stmt->execute();
		$project	= $stmt->fetch(PDO::FETCH_ASSOC);

		$recent_project['SourceStageID']	= $project['SourceStageID'];
		$recent_project['Token']			= $project['Token'];
	}

	$town					= new stdClass;
	$town->pavilions		= $pavilions;
	$town->has_achievements = $has_achievements;
	$town->recent_project	= $recent_project;

	echo json_encode($town);

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	exit('database-error');
}

?>
