<?php
/*
ステージの情報をDBから取得し、変数にもたせる
Input:	id
Stage.State:
  published:公開されている/プレイ可能
  private:  非公開/プレイ可能
  judging:	審査中/自分のみプレイ可能
  queue:	処理中/プレイ不可能
  rejected:	審査等でリジェクトされた/自分のみプレイ可能
*/

try {

	$missing_page = '../r'; // ステージ情報が取得できなかった時に飛ぶページ

	// モードによってステージ情報の取得方法がことなる
	// quest: 	levelからidを取得したのち、ステージ情報を取得
	// 他:		idからステージ情報を取得
	$mode	= filter_input(INPUT_GET, 'mode');
	if ($mode === 'quest') {
		if (!$session_userid) {
			// ログインされていない
			header('Location: ../login/');
			exit();
		}

		// levelをパラメータの取得
		$input		= filter_input(INPUT_GET, 'level', FILTER_VALIDATE_INT);
		if (!$input) {
			header('Location: ' . $missing_page);
			exit();
		}
		// IDをlevelから取得
		$stmt		= $dbh->prepare('SELECT "ID","StageID","QuestID","PlayOrder" FROM "Level" WHERE "ID"=:input');
		$stmt->bindValue(":input", $input, PDO::PARAM_INT);
		$stmt->execute();
		$level		= $stmt->fetch(PDO::FETCH_ASSOC);
		$stageid	= $level['StageID'];

		// QuestIDからPavilionの情報を取得
		$stmt		= $dbh->prepare('SELECT "ID" FROM "Pavilion" WHERE "ID"=(SELECT "PavilionID" FROM "Quest" WHERE "ID"=:quest_id)');
		$stmt->bindValue(":quest_id", $level['QuestID'], PDO::PARAM_INT);
		$stmt->execute();
		$pavilion	= $stmt->fetch(PDO::FETCH_ASSOC);

		// このQuestをクリアした実績があるか
		$stmt	= $dbh->prepare('SELECT "ID","Cleared","Restaged" FROM "QuestUserMap" WHERE "UserID"=:userid AND "QuestID"=:quest_id');
		$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
		$stmt->bindValue(":quest_id", $level['QuestID'], PDO::PARAM_INT);
		$stmt->execute();
		$quest_map	= $stmt->fetch(PDO::FETCH_ASSOC);
		if (!$quest_map) {
			// フラグがない (初挑戦)

			// フラグを用意 (初期値はFALSE)
			$stmt	= $dbh->prepare('INSERT INTO "QuestUserMap" ("UserID","QuestID") VALUES (:userid,:quest_id)');
			$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
			$stmt->bindValue(":quest_id", $level['QuestID'], PDO::PARAM_INT);
			$stmt->execute();
		}
		if (!$quest_map || !$quest_map['Cleared']) {
			// まだクリアしていない

			// Pavilionが解放されているか
			$stmt		= $dbh->prepare('SELECT "Certified" FROM "PavilionUserMap" WHERE "PavilionID"=:pavilion_id AND "UserID"=:userid');
			$stmt->bindValue(":pavilion_id", $pavilion['ID'], PDO::PARAM_INT);
			$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
			$stmt->execute();
			$certified	= $stmt->fetch(PDO::FETCH_COLUMN);
			if (!$certified) {
				// 解放されていない場合、mode=replayでリロード
				header('Location: ../s/?mode=replay&id=' . $level['StageID']);
			}

			// このLevelをクリアした実績があるか
			$stmt	= $dbh->prepare('SELECT "ID","Cleared" FROM "LevelUserMap" WHERE "UserID"=:userid AND "LevelID"=:level_id');
			$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
			$stmt->bindValue(":level_id", $level['ID'], PDO::PARAM_INT);
			$stmt->execute();
			$level_map	= $stmt->fetch(PDO::FETCH_ASSOC);
			if (!$level_map) {
				// フラグがない (初挑戦)
				// フラグを用意 (初期値はFALSE)
				$stmt	= $dbh->prepare('INSERT INTO "LevelUserMap" ("UserID","LevelID") VALUES (:userid,:level_id)');
				$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
				$stmt->bindValue(":level_id", $level['ID'], PDO::PARAM_INT);
				$stmt->execute();
			}
			if (!$level_map || !$level_map['Cleared']) {
				// まだクリアしていない

				// このQuest内の他の実績を調査

				// そのLevelが解放されているか
				// (そのQuestに存在するLevelのうち、このPlayOrder以下のLevelをクリアした実績があるか)

					// 解放されていない場合、mode=replayでリロード

					// 解放されていた場合、クリア後に実績を報告するようフラグをセット

			}
		}

		// クリア時の報告義務
		// (クエスト|レベル)に, 初めて挑戦した or クリアしていない => 報告義務を与える
		$reporting_requirements = 	(isset($quest_map) && (!$quest_map || !$quest_map || !$quest_map['Cleared'])) ||
									(isset($level_map) && (!$level_map || !$level_map || !$level_map['Cleared']));

		// 改造時の報告義務
		// クエストに初めて挑戦した or まだ改造していない => 報告義務を与える
		$reporting_restaged	= !$quest_map || !$quest_map['Restaged'];

		// 次のPlayOrderのLevelを取得 (falseと評価できる場合は最後のステージ)
		$stmt		= $dbh->prepare('SELECT "ID" FROM "Level" WHERE "QuestID"=:quest_id AND "PlayOrder"=:next');
		$stmt->bindValue(":quest_id", $level['QuestID'], PDO::PARAM_INT);
		$stmt->bindValue(":next", $level['PlayOrder'] + 1, PDO::PARAM_INT);
		$stmt->execute();
		$level_next = $stmt->fetch(PDO::FETCH_ASSOC);

	} else {
		// IDをパラメータで取得
		$stageid = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
		if($stageid === FALSE || $stageid === NULL){
			header('Location:' . $missing_page);
			exit();
		}
		// 改造することを報告するかどうかのフラグ
		$reporting_restaged = filter_input(INPUT_GET, 'report', FILTER_VALIDATE_BOOLEAN);
	}

	// ステージの情報/制作者の情報/改造元ステージの情報を取得
	$stmt	= $dbh->prepare('SELECT s."ID",s."UserID",s."Mode",s."Path",s."Title",s."Explain",s."State",s."Playcount",s."Src",s."Thumbnail",s."SourceID",s."NoRestage",u."Nickname",source."Title" AS SourceTitle,script."RawCode" FROM "Stage" AS s LEFT OUTER JOIN "User" AS u ON s."UserID"=u."ID" LEFT OUTER JOIN "Stage" AS source ON s."SourceID"=source."ID" LEFT OUTER JOIN "Script" AS script ON s."ScriptID"=script."ID" WHERE s."ID"=:stageid');
	$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
	$stmt->execute();
	$stage	= $stmt->fetch(PDO::FETCH_ASSOC);
	if($stage === NULL){
		header('Location:' . $missing_page);
		exit();
	}

	if (($stage['State'] === 'rejected' || $stage['State'] === 'private') && $stage['UserID'] !== $session_userid) {
		// リジェクトor非公開設定されている場合は、本人しか遊ぶことができない
		$stage['Explain'] = 'You cannot play this stage.';
		$project['Data'] = '';
	} elseif ($stage['State'] === 'judging' && $stage['UserID'] !== $session_userid &&
		($session_userid === NULL || $session_userid > 10)) {
		// 審査中の場合は、本人しか遊ぶことができない
		$stage['Explain'] = 'This stage is been judging. (審査中)';
		$project['Data'] = '';
	} else {
		// 改造コードを取得
		$project['Data']	= $stage['RawCode'];
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
