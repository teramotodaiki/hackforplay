<?php
/* removelevel.php
 * クエスト内のレベルを削除する
 * Input:	id
 * Output:	failed, success,
*/

try {

	require_once '../preload.php';

	$level_id	= filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

	// 存在確認
	$stmt	= $dbh->prepare('SELECT "QuestID","PlayOrder" FROM "Level" WHERE "ID"=:level_id');
	$stmt->bindValue(":level_id", $level_id, PDO::PARAM_INT);
	$stmt->execute();
	$level	= $stmt->fetch(PDO::FETCH_ASSOC);
	if (!$level) {
		exit('failed');
	}

	// 削除
	$stmt	= $dbh->prepare('DELETE FROM "Level" WHERE "ID"=:level_id');
	$stmt->bindValue(":level_id", $level_id, PDO::PARAM_INT);
	if (!$stmt->execute()) {
		exit('failed');
	}

	// PlayOrderをそろえる
	$stmt	= $dbh->prepare('UPDATE "Level" SET "PlayOrder"="PlayOrder"-1 WHERE "QuestID"=:quest_id AND "PlayOrder">:playorder');
	$stmt->bindValue(":quest_id", $level['QuestID'], PDO::PARAM_INT);
	$stmt->bindValue(":playorder", $level['PlayOrder'], PDO::PARAM_INT);
	if (!$stmt->execute()) {
		exit('failed');
	}

	exit('success');

} catch (Exception $e) {
	Rollbar::report_exception($e);
	die;
}

?>
