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
}
*/


require_once '../preload.php';

try {

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

	// JSONで返す
	$json	= json_encode($comment);
	if (!$json) {
		// なんらかのエラー
		exit('parse-error');
	}

	echo $json;

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die('database-error');
}

?>