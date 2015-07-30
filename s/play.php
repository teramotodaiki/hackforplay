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

	// ステージの情報を取得
	$missing_page = '../r'; // ステージ情報が取得できなかった時に飛ぶページ

	$stageid = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
	if($stageid === FALSE || $stageid === NULL){
		header('Location:' . $missing_page);
		exit();
	}

	$stmt	= $dbh->prepare('SELECT s."ID",s."UserID",s."Mode",s."ProjectID",s."Path",s."Title",s."Explain",s."Playcount",s."NextID",s."Src",s."EmbedContent",s."Thumbnail",s."SourceID",u."Nickname",source."Title" AS SourceTitle FROM "Stage" AS s LEFT OUTER JOIN "User" AS u ON s."UserID"=u."ID" LEFT OUTER JOIN "Stage" AS source ON s."SourceID"=source."ID" WHERE s."ID"=:stageid AND s."State"!=:rejected');
	$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
	$stmt->bindValue(":rejected", 'rejected', PDO::PARAM_STR);
	$stmt->execute();
	$stage	= $stmt->fetch(PDO::FETCH_ASSOC);
	if($stage === NULL){
		header('Location:' . $missing_page);
		exit();
	}

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