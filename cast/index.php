<?php
/**
* /cast/?name={Channel.Name}
* キャストを視聴するページ
*/

require_once '../preload.php';

session_start();
$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();
if (!$session_userid) {
  echo "no-session";
  exit();
}

$name = filter_input(INPUT_GET, 'name');
if (!$name) {
  echo "missing-name";
  exit();
}

// Channelを取得
$stmt = $dbh->prepare('SELECT ch."ID",ch."DisplayName" AS ChName,ch."UserID",ch."TeamID",ch."ProjectToken",ch."ProjectID",ch."Registered",ch."Updated",t."DisplayName" AS TeamName FROM "Channel" AS ch INNER JOIN "Team" AS t ON ch."TeamID"=t."ID" WHERE ch."Name"=:name');
$stmt->bindValue(':name', $name, PDO::PARAM_STR);
$stmt->execute();
$channel = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$channel) {
  echo "channel-not-found";
  exit();
}

// Channelの視聴権限を確認
$stmt = $dbh->prepare('SELECT "ID" FROM "UserTeamMap" WHERE "UserID"=:userid AND "TeamID"=:team_id AND "Enabled"=1');
$stmt->bindValue(':userid', $session_userid, PDO::PARAM_INT);
$stmt->bindValue(':team_id', $channel['TeamID'], PDO::PARAM_INT);
$stmt->execute();
if (!$stmt->fetch()) {
  echo "unauthorized";
  exit();
}

// CastしているUserの情報を取得
$stmt = $dbh->prepare('SELECT "ID","Nickname" FROM "User" WHERE "ID"=:userid');
$stmt->bindValue('userid', $channel['UserID'], PDO::PARAM_INT);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

$stmt_script  = $dbh->prepare('SELECT MAX("ID") FROM "Script" WHERE "ProjectID"=?');
$stmt_script->execute([$channel['ProjectID']]);
$channel['ScriptID'] = (int)$stmt_script->fetch(PDO::FETCH_COLUMN);

include 'view.php';

?>
