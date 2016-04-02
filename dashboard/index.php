<?php
/**
* /dashboard/?id={User.ID}
* そのアカウントの情報が見られる. 公開は限定的.
* 当人がSessionUser, あるいはCommunityに許可している場合飲み閲覧可能
*/

require_once '../preload.php';

session_start();
$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();

$userid = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
// See me
if (!$userid && $session_userid) {
	$userid = $session_userid;
}

// Invalid input
if (!$userid) {
	header("HTTP/1.0 403 Forbidden");
	echo 'User not found. Please input [id] of user by GET paramater or sign in';
	exit();
}

// Fetch User
$stmt	= $dbh->prepare('SELECT "ID","Nickname" FROM "User" WHERE "ID"=:userid');
$stmt->bindValue(':userid', $userid, PDO::PARAM_INT);
$stmt->execute();
$user	= $stmt->fetch(PDO::FETCH_ASSOC);
if (!$user) {
	header("HTTP/1.0 404 Not Found");
	echo 'User not found';
	exit();
}

// Authentication
if ($userid == $session_userid) {
	// Same user (Authentication is not required)
} else {
	// Empowered to community
	// [SessionUser] <===(Management)==== [Community] <====(Empowered)==== [TargetUser]
	$stmt	= $dbh->prepare(
	'SELECT "ID" FROM "UserCommunityMap" WHERE "Enabled"=1 AND "DashboardEmpowered"=1 AND "UserID"=:userid AND "CommunityID" IN (SELECT "CommunityID" FROM "UserCommunityMap" WHERE "Enabled"=1 AND "DashboardManagement"=1 AND "UserID"=:session_userid)');
	// $stmt->bindValue(':true1', true, PDO::PARAM_BOOL);
	// $stmt->bindValue(':true2', true, PDO::PARAM_BOOL);
	// $stmt->bindValue(':true3', true, PDO::PARAM_BOOL);
	// $stmt->bindValue(':true4', true, PDO::PARAM_BOOL);
	$stmt->bindValue(':userid', $userid, PDO::PARAM_INT);
	$stmt->bindValue(':session_userid', $session_userid, PDO::PARAM_INT);
	$stmt->execute();
	$map	= $stmt->fetch(PDO::FETCH_ASSOC);
	if (!$map) {
		header("HTTP/1.0 401 Unauthorized");
    echo 'Management membership is required';
    exit();
	}
}

// Get playcount
$stmt	= $dbh->prepare('SELECT SUM("Playcount") FROM "Stage" WHERE "UserID"=:userid');
$stmt->bindValue(":userid", $userid, PDO::PARAM_INT);
$stmt->execute();
$playcount	= $stmt->fetch(PDO::FETCH_COLUMN);

// Get restagecount
$stmt	= $dbh->prepare('SELECT COUNT(*) FROM "RestagingLog" WHERE "Mode"=:replay AND "StageID" IN (SELECT "ID" FROM "Stage" WHERE "UserID"=:userid)');
$stmt->bindValue(":replay", 'replay', PDO::PARAM_STR);
$stmt->bindValue(":userid", $userid, PDO::PARAM_INT);
$stmt->execute();
$restagecount	= $stmt->fetch(PDO::FETCH_COLUMN);

include 'view.php';

?>
