<?php
/*
Mypage ユーザーごとのページ。自分のページ（ownview）を見る場合はセッションが必要
ユーザーの情報の閲覧や更新は非同期なAPIを用いる
*/

require_once '../preload.php';

session_start();
$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();

// コメント通知をすべて既読に
$stmt	= $dbh->prepare('UPDATE "Notification" SET "State"=:read,"ReadUnixTime"=:time WHERE "UserID"=:userid AND "State"=:unread AND "Type"=:comment');
$stmt->bindValue(":read", 'read', PDO::PARAM_STR);
date_default_timezone_set('GMT');
$stmt->bindValue(":time", time(), PDO::PARAM_INT);
$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
$stmt->bindValue(":unread", 'unread', PDO::PARAM_STR);
$stmt->bindValue(":comment", 'comment', PDO::PARAM_STR);
$stmt->execute();

include 'view.php';

?>
