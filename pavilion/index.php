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

	// パビリオンが解放されているか
	$stmt		= $dbh->prepare('SELECT "Certified","Restaged" FROM "PavilionUserMap" WHERE "PavilionID"=:pavilion_id AND "UserID"=:userid');
	$stmt->bindValue(":pavilion_id", $pavilion_id, PDO::PARAM_INT);
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->execute();
	$certified	= $stmt->fetch(PDO::FETCH_ASSOC);
	if (!$certified || !$certified['Certified']) {
		header('Location: ../town/'); // タウンにもどる
		exit();
	}

	// クエストのリストを取得
	$stmt_qu		= $dbh->prepare('SELECT "ID","Type" FROM "Quest" WHERE "PavilionID"=:pavilion_id AND "Published"=:published');
	$stmt_qu->bindValue(":pavilion_id", $pavilion_id, PDO::PARAM_INT);
	$stmt_qu->bindValue(":published", TRUE, PDO::PARAM_BOOL);
	$stmt_qu->execute();

	// 各クエストの詳細情報を取得
	$stmt_lv	= $dbh->prepare('SELECT "ID","StageID","PlayOrder" FROM "Level" WHERE "QuestID"=:quest_id ORDER BY "PlayOrder"');
	$stmt_st	= $dbh->prepare('SELECT s."Thumbnail",s."Title",u."Nickname" FROM "Stage" AS s LEFT OUTER JOIN "User" AS u ON s."UserID"=u."ID" WHERE s."ID"=:stage_id');
	$stmt_map_l	= $dbh->prepare('SELECT "Cleared" FROM "LevelUserMap" WHERE "LevelID"=:level_id AND "UserID"=:userid');
	$stmt_map_q	= $dbh->prepare('SELECT "Cleared","Restaged" FROM "QuestUserMap" WHERE "QuestID"=:quest_id AND "UserID"=:userid');
	$stmt_num	= $dbh->prepare('SELECT COUNT(*) FROM "QuestUserMap" WHERE "QuestID"=:quest_id');
	$stmt_num_w	= $dbh->prepare('SELECT COUNT(*) FROM "QuestUserMap" WHERE "QuestID"=:quest_id AND "Cleared"=:clear');

	$pavilion['Quests']	= array();
	while ($quest = $stmt_qu->fetch(PDO::FETCH_ASSOC)) {

		// レベルのリストを取得
		$stmt_lv->bindValue(":quest_id", $quest['ID'], PDO::PARAM_INT);
		$stmt_lv->execute();

		$quest['Levels'] = array();
		$quest['Authors'] = array();
		while ($level = $stmt_lv->fetch(PDO::FETCH_ASSOC)) {
			// レベルのサムネイルを取得
			$stmt_st->bindValue(":stage_id", $level['StageID'], PDO::PARAM_INT);
			$stmt_st->execute();
			$stage				= $stmt_st->fetch(PDO::FETCH_ASSOC);
			$level['Thumbnail']	= $stage['Thumbnail'];
			$level['Title']		= $stage['Title'];
			$level['PlayOrder']	= intval($level['PlayOrder']);

			// ステージの作者情報
			if ($stage['Nickname'] !== NULL && array_search($stage['Nickname'], $quest['Authors']) === FALSE) {
				// ユニークな値をプッシュ
				array_push($quest['Authors'], $stage['Nickname']);
			}

			// レベルの実績を取得 (クリア実績があるか,挑戦可能か)
			$stmt_map_l->bindValue(":level_id", $level['ID'], PDO::PARAM_INT);
			$stmt_map_l->bindValue(":userid", $session_userid, PDO::PARAM_INT);
			$stmt_map_l->execute();
			$level['Cleared']	= (bool)$stmt_map_l->fetchColumn(0);
			$level['Allowed']	= !$quest['Levels'] || end($quest['Levels'])['Cleared'];

			// 要素をプッシュ
			array_push($quest['Levels'], $level);
		}

		// クエストの実績を取得
		$stmt_map_q->bindValue(":quest_id", $quest['ID'], PDO::PARAM_INT);
		$stmt_map_q->bindValue(":userid", $session_userid, PDO::PARAM_INT);
		$stmt_map_q->execute();
		$quest_map			= $stmt_map_q->fetch(PDO::FETCH_ASSOC);
		$quest['Cleared'] 	= $quest_map && $quest_map['Cleared'];
		$quest['Restaged'] 	= $quest_map && $quest_map['Restaged'];

		// クエストの挑戦者数/達成者数を取得
		$stmt_num->bindValue(":quest_id", $quest['ID'], PDO::PARAM_INT);
		$stmt_num->execute();
		$quest['Challengers'] 	= (int)$stmt_num->fetchColumn(0);
		$stmt_num_w->bindValue(":quest_id", $quest['ID'], PDO::PARAM_INT);
		$stmt_num_w->bindValue(":clear", TRUE, PDO::PARAM_BOOL);
		$stmt_num_w->execute();
		$quest['Winners'] 		= (int)$stmt_num_w->fetchColumn(0);

		// 要素をプッシュ
		array_push($pavilion['Quests'], $quest);
	}

	// このパビリオンのキットの情報を取得
	$stmt				= $dbh->prepare('SELECT "ID","Title","Thumbnail","Explain" FROM "Stage" WHERE "ID"=:kit_stage_id AND "State"=:published');
	$stmt->bindValue(":kit_stage_id", $pavilion['KitStageID'], PDO::PARAM_INT);
	$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
	$stmt->execute();
	$kit_stage			= $stmt->fetch(PDO::FETCH_ASSOC);
	if ($kit_stage) {
		// キットの実績を付与
		$kit_stage['Restaged']	= $certified && $certified['Restaged'];

		// キットを改造したことのある人数を取得
		$stmt					= $dbh->prepare('SELECT COUNT(*) FROM "PavilionUserMap" WHERE "PavilionID"=:pavilion_id AND "Restaged"=:true');
		$stmt->bindValue(":pavilion_id", $pavilion_id, PDO::PARAM_BOOL);
		$stmt->bindValue(":true", TRUE, PDO::PARAM_BOOL);
		$stmt->execute();
		$kit_stage['Makers']	= (int)$stmt->fetch(PDO::FETCH_COLUMN);

		$pavilion['Kit'] = $kit_stage;
	}

	// JSON形式にパース
	$pavilion_json	= json_encode($pavilion);

	// BodyのBackgroundだけ個別に取得
	$pavilionBg = $pavilion['BodyBg'];

	include 'view.php';

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);

	header('Location: ../e');
}

?>