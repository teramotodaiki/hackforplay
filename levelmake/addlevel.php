<?php
/* addlevel.php
* クエストにレベルを追加する
* Input:	quest_id
* Output:	failed , level:JSON
{
ID:INT,
StageID:INT,
QuestID:INT,
PlayOrder:INT
}
*/

require_once '../preload.php';

$quest_id	= filter_input(INPUT_POST, 'quest_id', FILTER_VALIDATE_INT);

// 最大のPlayOrderを取得して、1足す
$stmt		= $dbh->prepare('SELECT MAX("PlayOrder") FROM "Level" WHERE "QuestID"=:quest_id');
$stmt->bindValue(":quest_id", $quest_id, PDO::PARAM_INT);
$stmt->execute();
$playorder	= $stmt->fetch(PDO::FETCH_COLUMN) + 1;

$stmt	= $dbh->prepare('INSERT INTO "Level" ("QuestID","PlayOrder") VALUES(:quest_id,:playorder)');
$stmt->bindValue(":quest_id", $quest_id, PDO::PARAM_INT);
$stmt->bindValue(":playorder", $playorder, PDO::PARAM_INT);
$flag	= $stmt->execute();
if (!$flag) {
	exit('failed');
}

$stmt		= $dbh->prepare('SELECT "ID","StageID","QuestID","PlayOrder" FROM "Level" WHERE "ID"=:level_id');
$stmt->bindValue(":level_id", $dbh->lastInsertId('Level'), PDO::PARAM_INT);
$stmt->execute();

$level				= $stmt->fetch(PDO::FETCH_ASSOC);
echo json_encode($level);
exit;

?>
