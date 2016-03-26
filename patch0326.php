<?php
// Make table if not exist and connect session user
try {

  require_once 'preload.php';

  session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

  if (!$session_userid) {
    die('no-session');
  }

  // Check table exist
  $stmt = $dbh->prepare('SELECT "ID" FROM "Community" WHERE "Name"=:hackforplay');
  $stmt->bindValue(':hackforplay', 'hackforplay', PDO::PARAM_STR);
  $stmt->execute();
  $CommunityID = $stmt->fetch(PDO::FETCH_COLUMN);

  if (!$CommunityID) {
    // Make table
    $stmt = $dbh->prepare('INSERT INTO "Community" ("Name","DisplayName","Registered") VALUES(:hackforplay,:inc,:gmt)');
    $stmt->bindValue(':hackforplay', 'hackforplay', PDO::PARAM_STR);
    $stmt->bindValue(':inc', 'HackforPlay, Inc.', PDO::PARAM_STR);
    $stmt->bindValue(':gmt', gmdate('Y-m-d H:i:s'), PDO::PARAM_STR);
    $stmt->execute();
    $CommunityID = $dbh->lastInsertId('Community');
  }

  // Check connection
  $stmt = $dbh->prepare('SELECT "ID","UserID","CommunityID" FROM "UserCommunityMap" WHERE "UserID"=:userid AND "CommunityID"=:communityid');
  $stmt->bindValue(':userid', $session_userid, PDO::PARAM_INT);
  $stmt->bindValue(':communityid', $CommunityID, PDO::PARAM_INT);
  $stmt->execute();
  $MapID = $stmt->fetch(PDO::FETCH_COLUMN);

  if (!$MapID) {
    // Connect this user
    $stmt = $dbh->prepare('INSERT INTO "UserCommunityMap" ("UserID","CommunityID","MembershipEmpowered","MembershipManagement","Registered") VALUES(:userid,:communityid,:true1,:true2,:gmt)');
    $stmt->bindValue(':userid', $session_userid, PDO::PARAM_INT);
    $stmt->bindValue(':communityid', $CommunityID, PDO::PARAM_INT);
    $stmt->bindValue(':true1', true, PDO::PARAM_BOOL);
    $stmt->bindValue(':true2', true, PDO::PARAM_BOOL);
    $stmt->bindValue(':gmt', gmdate('Y-m-d H:i:s'), PDO::PARAM_STR);
    $stmt->execute() or die('database-error');
    exit ('success');
  } else {
    exit ('already-exist');
  }

} catch (Exception $e) {
  var_dump($e);
}
?>
