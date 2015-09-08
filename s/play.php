<?php
/*
ステージの情報をDBから取得し、変数にもたせる
Input:	id
Stage.State:
  published:公開されている/プレイ可能
  judging:	審査中/プレイ可能
  rejected:	審査等でリジェクトされた/プレイ不可能
*/

try {

	$missing_page = '../r'; // ステージ情報が取得できなかった時に飛ぶページ

	// モードによってステージ情報の取得方法がことなる
	// quest: 	levelからidを取得したのち、ステージ情報を取得
	// 他:		idからステージ情報を取得
	$mode	= filter_input(INPUT_GET, 'mode');
	if ($mode === 'quest') {
		// levelをパラメータの取得
		$level		= filter_input(INPUT_GET, 'level', FILTER_VALIDATE_INT);
		if (!$level) {
			header('Location: ' . $missing_page);
			exit();
		}
		// IDをlevelから取得
		$stmt		= $dbh->prepare('SELECT "StageID","QuestID","PlayOrder" FROM "_Level" WHERE "ID"=:level');
		$stmt->bindValue(":level", $level, PDO::PARAM_INT);
		$stmt->execute();
		$level		= $stmt->fetch(PDO::FETCH_ASSOC);
		$stageid	= $level['StageID'];

		// このQuestをクリアした実績があるか

			// QuestからPavilionを取得

			// Pavilionが解放されているか
			if (!$session_userid) {
				// ログインされていない
				header('Location: ../login/');
				exit();
			} else {
				// 解放されていない場合、mode=replayでリロード

			}

			// このLevelをクリアした実績があるか

				// このQuest内の他の実績を調査

				// そのLevelが解放されているか
				// (そのQuestに存在するLevelのうち、このPlayOrder以下のLevelをクリアした実績があるか)

					// 解放されていない場合、mode=replayでリロード

					// 解放されていた場合、クリア後に実績を報告するようフラグをセット

		// 次のPlayOrderのLevelを取得

	} else {
		// IDをパラメータで取得
		$stageid = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
		if($stageid === FALSE || $stageid === NULL){
			header('Location:' . $missing_page);
			exit();
		}
	}

	// ステージの情報/制作者の情報/改造元ステージの情報を取得
	$stmt	= $dbh->prepare('SELECT s."ID",s."UserID",s."Mode",s."ProjectID",s."Path",s."Title",s."Explain",s."Playcount",s."NextID",s."Src",s."YouTubeID",s."Thumbnail",s."SourceID",u."Nickname",source."Title" AS SourceTitle FROM "Stage" AS s LEFT OUTER JOIN "User" AS u ON s."UserID"=u."ID" LEFT OUTER JOIN "Stage" AS source ON s."SourceID"=source."ID" WHERE s."ID"=:stageid AND s."State"!=:rejected');
	$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
	$stmt->bindValue(":rejected", 'rejected', PDO::PARAM_STR);
	$stmt->execute();
	$stage	= $stmt->fetch(PDO::FETCH_ASSOC);
	if($stage === NULL){
		header('Location:' . $missing_page);
		exit();
	}

	// リプレイの場合は改造コードを取得
	if ($stage['Mode'] === 'replay') {
		require_once '../project/getcurrentcode.php';
		$project['Data']	= getCurrentCode($stage['ProjectID']);
	}

	// Playcountを更新
	$stmt	= $dbh->prepare('UPDATE "Stage" SET "Playcount"="Playcount"+1 WHERE "ID"=:stageid');
	$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
	$stmt->execute();

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);

	header('Location: ../e');
}
?>