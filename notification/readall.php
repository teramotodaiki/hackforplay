<?php
/**
 * readall.php
 * session user に対してストックされている unread な通知をすべて read にする
 * Input:
 * Output:
 */

try {

	require_once '../preload.php';

	// Session
	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	// Update
	$stmt	= $dbh->prepare('UPDATE "Notification" SET "State"=:read,"ReadUnixTime"=:time WHERE "UserID"=:userid AND "State"=:unread');
	$stmt->bindValue(":read", 'read', PDO::PARAM_STR);
	date_default_timezone_set('GMT');
	$stmt->bindValue(":time", time(), PDO::PARAM_INT);
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":unread", 'unread', PDO::PARAM_STR);
	$stmt->execute();

} catch (Exception $e) {
	Rollbar::report_exception($e);
	die();
}

?>
