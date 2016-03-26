<?php
/**
 * /members/?name={Community.Name}
 * コミュニティーに属しているメンバーを全て表示する
 * MembershipManagement 権限を持っている場合、メンバーの管理メニューを表示する
*/
try {

  require_once '../preload.php';

  session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

  $name = filter_input(INPUT_GET, 'name');
  if (!$name) {
    header("HTTP/1.0 404 Not Found");
    echo 'Invalid input of name';
    exit();
  }

  // Fetch community
  $stmt = $dbh->prepare('SELECT "ID","DisplayName" FROM "Community" WHERE "Name"=:name');
  $stmt->bindValue(':name', $name, PDO::PARAM_STR);
  $stmt->execute();
  $community = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$community) {
    header("HTTP/1.0 404 Not Found");
    echo 'Community not found';
    exit();
  }

  // Check authorization
  $stmt = $dbh->prepare('SELECT "ID" FROM "UserCommunityMap" WHERE "UserID"=:userid AND "CommunityID"=:communityid');
  $stmt->bindValue(':userid', $session_userid, PDO::PARAM_INT);
  $stmt->bindValue(':communityid', $community['ID'], PDO::PARAM_INT);
  $stmt->execute();
  $map = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$map) {
    header("HTTP/1.0 401 Unauthorized");
    echo 'You do not have a membership of this community';
    exit();
  }

  // Fetch members
  $stmt = $dbh->prepare('SELECT "UserID" FROM "UserCommunityMap" WHERE "CommunityID"=:communityid');
  $stmt->bindValue(':communityid', $community['ID'], PDO::PARAM_INT);
  $stmt->execute();
  $UCMap = $stmt->fetchAll(PDO::FETCH_ASSOC);

  include './view.php';

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>
