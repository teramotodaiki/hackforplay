<?php
/*
そのステージに自分がしたコメントを取得する. なおStateが published, rejected のときのみ取得する.セッションが必要
Input:	stageid, (attendance-token)
Output:	no-session , not-found , parse-error , JSON:{information_of_comment}
information_of_comment:
{
ID : このコメントのID,
StageID : コメントしたステージのID,
Message : コメントの内容,
Thumbnail : コメントのサムネイル画像のURL,
Registered : コメントをした日時(GMT+Timezone)
Tags : [
	IdentifierString : タグの識別子
	DisplayString : タグをラベルとして表示する場合の文字
	LabelColor : タグをラベルとして表示する場合の背景色
],,,
}
*/


require_once '../preload.php';

session_start();
$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();

// セッションを取得
if (!isset($session_userid)) {
	exit('no-session');
}

// ステージ情報を取得
$stageid	= filter_input(INPUT_POST, 'stageid', FILTER_VALIDATE_INT);
if ($stageid === FALSE || $stageid === NULL) {
	exit();
}

// コメントを取得
$stmt		= $dbh->prepare('SELECT "ID","StageID","Message","Thumbnail","Registered" FROM "CommentData" WHERE "StageID"=:stageid AND "UserID"=:userid AND "State" IN (:published, :rejected)');
$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
$stmt->bindValue(":rejected", 'rejected', PDO::PARAM_STR);
$stmt->execute();

$comment 	= $stmt->fetch(PDO::FETCH_ASSOC);
if (!$comment) {
	// コメントしていない
	exit('not-found');
}

// タグを取得
$stmt				= $dbh->prepare('SELECT d."IdentifierString",d."DisplayString",d."LabelColor" FROM "StageTagData" AS d INNER JOIN "StageTagMap" AS m ON d."ID"=m."TagID" WHERE m."CommentID"=:comment_id ');
$stmt->bindValue(":comment_id", $comment['ID'], PDO::PARAM_INT);
$stmt->execute();
$comment['Tags']	= $stmt->fetchAll(PDO::FETCH_ASSOC);

// JSONで返す
$json	= json_encode($comment);
if (!$json) {
	// なんらかのエラー
	exit('parse-error');
}

echo $json;

?>
