<?php
/*
Mypage ユーザーごとのページ。自分のページ（ownview）を見る場合はセッションが必要
ユーザーの情報の閲覧や更新は非同期なAPIを用いる
*/

try {

	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	// ステージ一覧をフェッチする開始位置
	$fetch_start_id		= filter_input(INPUT_GET, 'start', FILTER_VALIDATE_INT);
	if (!$fetch_start_id) {
		$fetch_start_id	= 0;
	}

	// 自分自身のページ（ID）か？
	$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
	if($id === FALSE){
		exit();
	}

	if (isset($session_userid) && ($id === $session_userid || $id === NULL)) {
		// コメント通知をすべて既読に
		$stmt	= $dbh->prepare('UPDATE "Notification" SET "State"=:read,"ReadUnixTime"=:time WHERE "UserID"=:userid AND "State"=:unread AND "Type"=:judged');
		$stmt->bindValue(":read", 'read', PDO::PARAM_STR);
		date_default_timezone_set('GMT');
		$stmt->bindValue(":time", time(), PDO::PARAM_INT);
		$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
		$stmt->bindValue(":unread", 'unread', PDO::PARAM_STR);
		$stmt->bindValue(":judged", 'judged', PDO::PARAM_STR);
		$stmt->execute();
		include 'ownview.php';
	}elseif ($id !== NULL) {
		include 'othersview.php';
	}else{
		header('Location:../');
	}

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>