<?php
/*
Preferences ユーザーの環境設定などのページ。セッションが必要
ユーザーの情報の閲覧や更新は非同期なAPIを用いる
*/


try {

	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	$conneted_twitter	= FALSE;
	if ($session_userid) {

		// Twitterとの連携情報を確認
		$stmt	= $dbh->prepare('SELECT "ID" FROM "Account" WHERE "UserID"=:user_id AND "Type"=:twitter AND "State"=:connected');
		$stmt->bindValue(":user_id", $session_userid, PDO::PARAM_INT);
		$stmt->bindValue(":twitter", 'twitter', PDO::PARAM_STR);
		$stmt->bindValue(":connected", 'connected', PDO::PARAM_STR);
		$stmt->execute();
		$conneted_twitter	= $stmt->fetch() ? TRUE : FALSE; // 有効なTwitterアカウントがあればTRUE
	}

	include 'view.php';

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}

?>
