<?php
/**
 * /cast/channels.php
 * 自分が視聴できるチャンネルの一覧をJSONで取得する
 * (filter): Boolean 自分がキャストできるチャンネルだけにフィルターする
 * セッション必須
*/

try {

  require_once '../preload.php';

  session_start();
  $session_userid = $_SESSION['UserID'];
  session_commit();
  if (!$session_userid) {
    echo "no-session";
    die;
  }

  // 加盟しているCommunityをFetch
  $filter = filter_input(INPUT_GET, 'filter', FILTER_VALIDATE_BOOLEAN);
  $stmt = $filter ?
    $dbh->prepare('SELECT DISTINCT "CommunityID" FROM "UserCommunityMap" WHERE "UserID"=:userid AND "Enabled"=1 AND "CastingEmpowered"=1') :
    $dbh->prepare('SELECT DISTINCT "CommunityID" FROM "UserCommunityMap" WHERE "UserID"=:userid AND "Enabled"=1');
  $stmt->bindValue(':userid', $session_userid, PDO::PARAM_INT);
  $stmt->execute();
  $communities = $stmt->fetchAll(PDO::FETCH_COLUMN);

  // ChannelをFetch
  $result = array();
  $stmt = $dbh->prepare('SELECT ch."Name",ch."DisplayName",ch."Thumbnail",co."DisplayName" AS Community,u."Nickname" FROM "Channel" AS ch INNER JOIN "Community" AS co ON ch."CommunityID"=co."ID" LEFT OUTER JOIN "User" AS u ON ch."UserID"=u."ID" WHERE "CommunityID"=:community_id');
  foreach ($communities as $key => $community_id) {
    $stmt->bindValue(':community_id', $community_id, PDO::PARAM_INT);
    $stmt->execute();
    array_push($result, $stmt->fetch(PDO::FETCH_ASSOC));
  }

  echo json_encode($result);
  exit;

} catch (Exception $e) {
  Rollbar::report_exception($e);
  die;
}
?>
