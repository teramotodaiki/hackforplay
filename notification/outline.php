<?php
/**
 * outline.php
 * session user に対してストックされている unread な通知のすべてを取得する.
 * Input:	(offset|0) , (length|10)
 * Output:	result:JSON
 * {
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
	$offset	= filter_input(INPUT_GET, 'offset', FILTER_VALIDATE_INT, array('options'=>array('default'=>0, 'min_range'=>0)));
	$length	= filter_input(INPUT_GET, 'length', FILTER_VALIDATE_INT, array('options'=>array('default'=>10, 'min_range'=>0)));

	// Session
	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	// Database
	$stmt_not	= $dbh->prepare('SELECT "ID","State","Type","Thumbnail","LinkedURL","MakeUnixTime" FROM "Notification" WHERE "UserID"=:userid ORDER BY "MakeUnixTime" DESC');
	$stmt_not->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt_not->execute();

	$stmt_det	= $dbh->prepare('SELECT "Data","KeyString" FROM "NotificationDetail" WHERE "NotificationID"=:id');

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
			$row['Detail'][$detail['KeyString']]	= $detail['Data'];
		}

		array_push($result->Notifications, $row);
	}

	// Encode and Output
	echo json_encode($result);

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}

 ?>