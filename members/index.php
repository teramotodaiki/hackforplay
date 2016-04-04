<?php
/**
* /members/?name={Team.Name}
* チームに属しているメンバーを全て表示する
* MembershipManagement 権限を持っている場合、メンバーの管理メニューを表示する
*/

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

// Fetch team
$stmt = $dbh->prepare('SELECT "ID","DisplayName" FROM "Team" WHERE "Name"=:name');
$stmt->bindValue(':name', $name, PDO::PARAM_STR);
$stmt->execute();
$team = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$team) {
  header("HTTP/1.0 404 Not Found");
  echo 'Team not found';
  exit();
}

// Check authorization
$stmt = $dbh->prepare('SELECT "ID","MembershipManagement" FROM "UserTeamMap" WHERE "UserID"=:userid AND "TeamID"=:teamid AND "Enabled"=:true');
$stmt->bindValue(':userid', $session_userid, PDO::PARAM_INT);
$stmt->bindValue(':teamid', $team['ID'], PDO::PARAM_INT);
$stmt->bindValue(':true', true, PDO::PARAM_BOOL);
$stmt->execute();
$map = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$map) {
  header("HTTP/1.0 401 Unauthorized");
  echo 'You do not have a membership of this team';
  exit();
}

// Fetch members
$stmt = $dbh->prepare('SELECT m."ID","UserID","MembershipEmpowered",m."Registered",u."Nickname" FROM "UserTeamMap" AS m INNER JOIN "User" AS u ON m."UserID"=u."ID" WHERE "TeamID"=:teamid AND "Enabled"=:true');
$stmt->bindValue(':teamid', $team['ID'], PDO::PARAM_INT);
$stmt->bindValue(':true', true, PDO::PARAM_BOOL);
$stmt->execute();
$UCMap = $stmt->fetchAll(PDO::FETCH_ASSOC);

include './view.php';

?>
