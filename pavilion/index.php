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
	$stmt		= $dbh->prepare('SELECT "ID" FROM "_Pavilion" WHERE "ID"=:pavilion_id');
	$stmt->bindValue(":pavilion_id", $pavilion_id, PDO::PARAM_INT);
	$stmt->execute();
	$pavilion	= $stmt->fetch(PDO::FETCH_ASSOC);
	if (!$pavilion) {
		header('Location: ../town/'); // タウンにもどる
		exit();
	}

	// パビリオンが解放されているか

		// タウンにもどる

	// クエストのリストを取得
	$stmt_qu		= $dbh->prepare('SELECT "ID" FROM "_Quest" WHERE "PavilionID"=:pavilion_id');
	$stmt_qu->bindValue(":pavilion_id", $pavilion_id, PDO::PARAM_INT);
	$stmt_qu->execute();

	// 各クエストの詳細情報を取得
	$stmt_lv	= $dbh->prepare('SELECT "ID","StageID" FROM "_Level" WHERE "QuestID"=:quest_id ORDER BY "PlayOrder"');
	$stmt_st	= $dbh->prepare('SELECT "Thumbnail" FROM "Stage" WHERE "ID"=:stage_id');
	$result 		= new stdClass;
	$result->Quests	= array();
	while ($quest = $stmt_qu->fetch(PDO::FETCH_ASSOC)) {

		// レベルのリストを取得
		$stmt_lv->bindValue(":quest_id", $quest['ID'], PDO::PARAM_INT);
		$stmt_lv->execute();

		$quest['Levels'] = array();
		while ($level = $stmt_lv->fetch(PDO::FETCH_ASSOC)) {
			// レベルのサムネイルを取得
			$stmt_st->bindValue(":stage_id", $level['StageID'], PDO::PARAM_INT);
			$stmt_st->execute();
			$stage	= $stmt_st->fetch(PDO::FETCH_ASSOC);
			$level['Thumbnail']	= $stage['Thumbnail'];

			// レベルの実績を取得 (クリア実績があるか,挑戦可能か)

			// 要素をプッシュ
			array_push($quest['Levels'], $level);
		}

		// クエストの実績を取得

		// 要素をプッシュ
		array_push($result->Quests, $quest);
	}

	// JSON形式にパース
	$result_json	= json_encode($result);

	include 'view.php';

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);

	header('Location: ../e');
}

?>