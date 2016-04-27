<?php
/*
コメントをリジェクトする(rejectedにする).セッションが必要.自分にあてたコメントでなければリジェクトできない
Input:	comment_id , (attendance-token)
Output:	no-session , not-found , database-error , success
*/

require_once '../preload.php';

session_start();
$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();

// セッションを取得
if (!isset($session_userid)) {
	exit('no-session');
}

// コメント情報を取得
$comment_id	= filter_input(INPUT_POST, 'comment_id', FILTER_VALIDATE_INT);
if (!$comment_id) {
	exit('not-found');
}

// 状態を変更
$stmt	= $dbh->prepare('UPDATE "CommentData" AS c INNER JOIN "Stage" AS s ON c."StageID"=s."ID" SET c."State"=:rejected WHERE c."ID"=:comment_id AND s."UserID"=:userid');
$stmt->bindValue(":rejected", 'rejected', PDO::PARAM_STR);
$stmt->bindValue(":comment_id", $comment_id, PDO::PARAM_INT);
$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
$flag	= $stmt->execute();
if (!$flag) {
	exit('database-error');
}

exit('success');

?>
