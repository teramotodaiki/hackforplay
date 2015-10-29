<?php
// Temporaly generator

try {

	require_once 'preload.php';

	// Fetch Statements
	$stmt_map	= $dbh->prepare('SELECT "StageID","CommentID","Registered" FROM "StageTagMap"');
	$stmt_stage	= $dbh->prepare('SELECT "UserID" FROM "Stage" WHERE "ID"=:stage_id');
	$stmt_comm	= $dbh->prepare('SELECT "UserID","Thumbnail" FROM "CommentData" WHERE "ID"=:comment_id');

	$stmt_map->execute();

	// Insert Statements
	$stmt_noti	= $dbh->prepare('INSERT INTO "Notification" ("UserID","State","Type","Thumbnail","LinkedURL","MakeUnixTime") VALUES(:author_id,:unread,:comment,:thumb_url,:comments,:time)');


	while ($map = $stmt_map->fetch(PDO::FETCH_ASSOC)) {

		$stmt_stage->bindValue(":stage_id", $map['StageID'], PDO::PARAM_INT);
		$stmt_stage->execute();
		$stage	= $stmt_stage->fetch(PDO::FETCH_ASSOC);

		$stmt_comm->bindValue(":comment_id", $map['CommentID'], PDO::PARAM_INT);
		$stmt_comm->execute();
		$comment	= $stmt_comm->fetch(PDO::FETCH_ASSOC);

		$time_datetime	= new DateTime($map['Registered'], new DateTimeZone('Asia/Tokyo'));
		$time_unixtime	= $time_datetime->format('U') + $time_datetime->format('Z');

		// GENERATE
		$stmt_noti->bindValue(":author_id", $stage['UserID'], PDO::PARAM_INT);
		$stmt_noti->bindValue(":unread", 'unread', PDO::PARAM_STR);
		$stmt_noti->bindValue(":comment", 'comment', PDO::PARAM_STR);
		$stmt_noti->bindValue(":thumb_url", $comment['Thumbnail'], PDO::PARAM_STR);
		$stmt_noti->bindValue(":comments", '/comments/', PDO::PARAM_STR);
		$stmt_noti->bindValue(":time", $time_unixtime, PDO::PARAM_STR);
		$stmt_noti->execute();
		$NotificationID	= $dbh->lastInsertId('Notification');

	}

} catch (Exception $e) {

	print_r($e);

}

?>