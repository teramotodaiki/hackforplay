<?php
/**
* /cast/start.php
* あたらしくCastを開始する。POSTでアクセスすること
*/

require_once '../preload.php';

session_start();
$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();
if (!$session_userid) {
  echo 'no-session';
  die;
}

// Channel, TeamをFetch
$name = filter_input(INPUT_POST, 'name');
$stmt = $dbh->prepare('SELECT "ID","TeamID" FROM "Channel" WHERE "Name"=:name');
$stmt->bindValue(':name', $name, PDO::PARAM_STR);
$stmt->execute();
$channel  = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$channel) {
  echo "channel-not-found";
  die;
}

// 権限を確認
$stmt = $dbh->prepare('SELECT "ID" FROM "UserTeamMap" WHERE "UserID"=:userid AND "TeamID"=:team_id AND "CastingEmpowered"=1 AND "Enabled"=1');
$stmt->bindValue(':userid', $session_userid, PDO::PARAM_INT);
$stmt->bindValue(':team_id', $channel['TeamID'], PDO::PARAM_INT);
$stmt->execute();
$map = $stmt->fetch();
if (!$map) {
  echo "unauthorized";
  die;
}

// Fetch project
$token  = filter_input(INPUT_POST, 'token');
$stmt = $dbh->prepare('SELECT "ID","Written" FROM "Project" WHERE "Token"=:token AND "UserID"=:userid AND "State"=:enabled');
$stmt->bindValue(':token', $token, PDO::PARAM_STR);
$stmt->bindValue(':userid', $session_userid, PDO::PARAM_INT);
$stmt->bindValue(':enabled', 'enabled', PDO::PARAM_STR);
$stmt->execute();
$project  = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$project) {
  echo "project-not-found";
  die;
}
if (!$project['Written']) {
  echo "no-commit";
  die;
}

$stmt = $dbh->prepare('UPDATE "Channel" SET "ProjectID"=:project_id,"ProjectToken"=:project_token,"UserID"=:userid,"Updated"=:gmt WHERE "ID"=:channel_id');
$stmt->bindValue(':project_id', $project['ID'], PDO::PARAM_INT);
$stmt->bindValue(':project_token', $token, PDO::PARAM_STR);
$stmt->bindValue(':userid', $session_userid, PDO::PARAM_INT);
$stmt->bindValue(':gmt', gmdate('Y-m-d H:i:s'), PDO::PARAM_STR);
$stmt->bindValue(':channel_id', $channel['ID'], PDO::PARAM_INT);
$stmt->execute();

echo 'success';
exit();

?>
