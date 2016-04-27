<?php
/*
* LevelUserMap, QuestUserMapを更新する.ユーザー情報はセッションから取得する.
* Input:	level
* Output:	invalid-input , invalid-level , unregistered-level , unregistered-quest , no-session , database-error , success
*/

require_once '../preload.php';

// Levelの存在確認
$input	= filter_input(INPUT_POST, 'level', FILTER_VALIDATE_INT);
if (!$input) {
	exit('invalid-input');
}
$stmt	= $dbh->prepare('SELECT "ID","QuestID","PlayOrder" FROM "Level" WHERE "ID"=:input');
$stmt->bindValue(":input", $input, PDO::PARAM_INT);
$stmt->execute();
$level	= $stmt->fetch(PDO::FETCH_ASSOC);
if (!$level) {
	exit('invalid-level');
}

// ユーザー情報を取得
session_start();
$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();

// セッションを確認
if (!$session_userid) {
	exit('no-session');
}

// Levelの更新の必要があるかどうか
$stmt		= $dbh->prepare('SELECT "ID","Cleared" FROM "LevelUserMap" WHERE "LevelID"=:level_id AND "UserID"=:userid');
$stmt->bindValue(":level_id", $level['ID'], PDO::PARAM_INT);
$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
$stmt->execute();
$level_map	= $stmt->fetch(PDO::FETCH_ASSOC);

if (!$level_map) {
	// 行が存在しない
	exit('unregistered-level');
} elseif (!$level_map['Cleared']) {
	// フラグが立っていないので,更新
	$stmt	= $dbh->prepare('UPDATE "LevelUserMap" SET "Cleared"=:clear WHERE "ID"=:map_id ');
	$stmt->bindValue(":clear", TRUE, PDO::PARAM_INT);
	$stmt->bindValue(":map_id", $level_map['ID'], PDO::PARAM_INT);
	$stmt->execute();
}

// Questの更新の必要があるかどうか
$stmt		= $dbh->prepare('SELECT "ID","Cleared" FROM "QuestUserMap" WHERE "QuestID"=:quest_id AND "UserID"=:userid');
$stmt->bindValue(":quest_id", $level['QuestID'], PDO::PARAM_INT);
$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
$stmt->execute();
$quest_map	= $stmt->fetch(PDO::FETCH_ASSOC);

if (!$quest_map) {
	// 行が存在しない
	exit('unregistered-quest');
} elseif (!$quest_map['Cleared']) {
	// フラグが立っていない
	// このLevelが,Questに含まれるLevelの中で最後のLevelかどうか
	$stmt		= $dbh->prepare('SELECT "ID" FROM "Level" WHERE "QuestID"=:quest_id AND "PlayOrder">:level_playorder');
	$stmt->bindValue(":quest_id", $level['QuestID'], PDO::PARAM_INT);
	$stmt->bindValue(":level_playorder", $level['PlayOrder'], PDO::PARAM_INT);
	$stmt->execute();

	// 現在のPlayOrderよりも大きなPlayOrderをもつLevelが,同じQuestの中に存在しない => このLevelが最後
	if (!$stmt->fetch(PDO::FETCH_ASSOC)) {
		// 更新する
		$stmt	= $dbh->prepare('UPDATE "QuestUserMap" SET "Cleared"=:clear WHERE "ID"=:map_id ');
		$stmt->bindValue(":map_id", $quest_map['ID'], PDO::PARAM_INT);
		$stmt->bindValue(":clear", TRUE, PDO::PARAM_INT);
		$stmt->execute();
	}
}

exit('success');

?>
