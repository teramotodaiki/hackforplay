<?php
/**
* /cast/channels.php
* 自分が視聴できるチャンネルの一覧をJSONで取得する
* (filter): Boolean 自分がキャストできるチャンネルだけにフィルターする
* セッション必須
*/

require_once '../preload.php';

session_start();
$session_userid = $_SESSION['UserID'];
session_commit();
if (!$session_userid) {
  echo "no-session";
  die;
}

// 加盟しているTeamをFetch
$filter = filter_input(INPUT_GET, 'filter', FILTER_VALIDATE_BOOLEAN);
$stmt = $filter ?
  $dbh->prepare('SELECT DISTINCT "TeamID" FROM "UserTeamMap" WHERE "UserID"=:userid AND "Enabled"=1 AND "CastingEmpowered"=1') :
  $dbh->prepare('SELECT DISTINCT "TeamID" FROM "UserTeamMap" WHERE "UserID"=:userid AND "Enabled"=1');
$stmt->bindValue(':userid', $session_userid, PDO::PARAM_INT);
$stmt->execute();
$teams = $stmt->fetchAll(PDO::FETCH_COLUMN);

// ChannelをFetch
$result = array();
$stmt = $dbh->prepare('SELECT ch."Name",ch."DisplayName",ch."Thumbnail",t."DisplayName" AS Team,u."Nickname" FROM "Channel" AS ch INNER JOIN "Team" AS t ON ch."TeamID"=t."ID" LEFT OUTER JOIN "User" AS u ON ch."UserID"=u."ID" WHERE "TeamID"=:team_id');
foreach ($teams as $key => $team_id) {
  $stmt->bindValue(':team_id', $team_id, PDO::PARAM_INT);
  $stmt->execute();
  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    array_push($result, $row);
  }
}

echo json_encode($result);
exit;

?>
