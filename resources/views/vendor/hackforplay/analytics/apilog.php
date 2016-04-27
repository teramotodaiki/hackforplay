<?php
/** APIを利用したログをPOSTする
* Input:	service , id , stage
* Output:	success , failed
*/

require_once '../preload.php';

session_start();
$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();

$service = filter_input(INPUT_POST, 'service');
$id		= filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
$stage	= filter_input(INPUT_POST, 'stage', FILTER_VALIDATE_INT);

switch ($service) {
	case 'soundcloud':
		$stmt	= $dbh->prepare('INSERT INTO "API_SoundCloud" ("TrackID","UserID","StageID","Registered") VALUES (:id,:user,:stage,:gmt)');
		$stmt->bindValue(":id", $id, PDO::PARAM_INT);
		$stmt->bindValue(":user", $session_userid, PDO::PARAM_INT);
		$stmt->bindValue(":stage", $stage, PDO::PARAM_INT);
		$stmt->bindValue(":gmt", gmdate('Y-m-d H:i:s'), PDO::PARAM_STR);
		$flag	= $stmt->execute();
		break;
	default:
		exit('failed');
		break;
}

if (!$flag) {
	exit('failed');
}
exit('success');

?>
