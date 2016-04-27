<?php
/**
* getachievementsbypavilionid.php
* 指定されたPavilionにふくまれるQuestのアチーブメント取得状況を取得する
* Input: pavilion_id,
* Output: no-session, invalid-id , result:JSON
* {
* 		Cleared: [quest_id...],
*		Restaged: [quest_id...]
* }
*/

require_once '../preload.php';

session_start();
$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();
if (!$session_userid) {
	exit('no-session');
}

$pavilion_id = filter_input(INPUT_POST, 'pavilion_id', FILTER_VALIDATE_INT);
if (!$pavilion_id) {
	exit('invalid-id');
}

$result = new stdClass;

$stmt	= $dbh->prepare('SELECT "QuestID" FROM "QuestUserMap" WHERE "UserID"=:session_userid AND "Cleared"=:true AND "QuestID" IN (SELECT "ID" FROM "Quest" WHERE "PavilionID"=:pavilion_id)');
$stmt->bindValue(":session_userid", $session_userid, PDO::PARAM_INT);
$stmt->bindValue(":pavilion_id", $pavilion_id, PDO::PARAM_INT);
$stmt->bindValue(":true", true, PDO::PARAM_INT);
$stmt->execute();
$result->Cleared	= $stmt->fetchAll(PDO::FETCH_COLUMN);

$stmt	= $dbh->prepare('SELECT "QuestID" FROM "QuestUserMap" WHERE "UserID"=:session_userid AND "Restaged"=:true AND "QuestID" IN (SELECT "ID" FROM "Quest" WHERE "PavilionID"=:pavilion_id)');
$stmt->bindValue(":session_userid", $session_userid, PDO::PARAM_INT);
$stmt->bindValue(":pavilion_id", $pavilion_id, PDO::PARAM_INT);
$stmt->bindValue(":true", true, PDO::PARAM_INT);
$stmt->execute();
$result->Restaged	= $stmt->fetchAll(PDO::FETCH_COLUMN);

echo json_encode($result);

?>
