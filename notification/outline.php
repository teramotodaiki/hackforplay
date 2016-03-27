<?php
/**
 * outline.php
 * session user に対してストックされている通知をあたらしい順に取得する.
 * Input:	(offset|0) , (length|10)
 * Output:	result:JSON
 * {
 *		HasUnread: true|false:Boolean,
 * 		Notifications: [{
 *			State: "unread"|"read":String
 *			Type: "comment":String,
 *			Thumbnail: "/s/thumbs/----.png":String,
 *			LinkedURL: '/----/':String,
 *			Detail: []:Array,
 *		}, ]
 * }
 */

try {

	require_once '../preload.php';

	// Input
	$offset	= filter_input(INPUT_POST, 'offset', FILTER_VALIDATE_INT, array('options'=>array('default'=>0, 'min_range'=>0)));
	$length	= filter_input(INPUT_POST, 'length', FILTER_VALIDATE_INT, array('options'=>array('default'=>10, 'min_range'=>0)));

	// Session
	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	// Database
	$stmt_not	= $dbh->prepare('SELECT "ID","State","Type","Thumbnail","LinkedURL","MakeUnixTime" FROM "Notification" WHERE "UserID"=:userid ORDER BY "MakeUnixTime" DESC');
	$stmt_not->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt_not->execute();

	$stmt_det	= $dbh->prepare('SELECT "Data","KeyString" FROM "NotificationDetail" WHERE "NotificationID"=:id');
	$stmt_usr	= $dbh->prepare('SELECT "Nickname" FROM "User" WHERE "ID"=:userid');
	$stmt_stg	= $dbh->prepare('SELECT "Title" FROM "Stage" WHERE "ID"=:stageid');

	// Skip
	for ($i = $offset; $i > 0 && $stmt_not->fetch(); $i--)
		;

	// Fetch
	$result					= new stdClass;
	$result->Notifications	= array();
	for ($i = $length; $i > 0 && $row = $stmt_not->fetch(PDO::FETCH_ASSOC); $i--) {

		$row['Detail']	= array();
		$stmt_det->bindValue(":id", $row['ID'], PDO::FETCH_ASSOC);
		$stmt_det->execute();
		while ($detail = $stmt_det->fetch(PDO::FETCH_ASSOC)) {
			switch ($detail['KeyString']) {
				case 'user':
					$stmt_usr->bindValue(":userid", $detail['Data'], PDO::PARAM_INT);
					$stmt_usr->execute();
					$row['Detail']['user']	= $stmt_usr->fetch(PDO::FETCH_COLUMN);
					break;
				case 'stage':
					$stmt_stg->bindValue(":stageid", $detail['Data'], PDO::PARAM_INT);
					$stmt_stg->execute();
					$row['Detail']['stage']	= $stmt_stg->fetch(PDO::FETCH_COLUMN);
					break;
				default:
					$row['Detail'][$detail['KeyString']]	= $detail['Data'];
					break;
			}
		}

		array_push($result->Notifications, $row);
	}

	// HasUnread
	$stmt_has	= $dbh->prepare('SELECT COUNT(*) FROM "Notification" WHERE "UserID"=:userid AND "State"=:unread');
	$stmt_has->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt_has->bindValue(":unread", 'unread', PDO::PARAM_STR);
	$stmt_has->execute();
	$result->HasUnread	= (bool)$stmt_has->fetch(PDO::FETCH_COLUMN);

	// Encode and Output
	echo json_encode($result);

} catch (Exception $e) {
	Rollbar::report_exception($e);
	die();
}

 ?>
