<?php
/**
 * /cast/?name={Channel.Name}
 * キャストを視聴するページ
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

  // Channelを取得
  $stmt = $dbh->prepare('SELECT ch."ID",ch."DisplayName" AS ChName,ch."UserID",ch."Token",ch."Registered",ch."Updated",co."DisplayName" AS CoName FROM "Channel" AS ch INNER JOIN "Community" AS co ON ch."CommunityID"=co."ID" WHERE ch."Name"=:name');
  $stmt->bindValue(':name', $name, PDO::PARAM_STR);
  $stmt->execute();
  $channel = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$channel) {
    header("HTTP/1.0 404 Not Found");
    echo 'Channel not found';
    exit();
  }

  // CastしているUserの情報を取得
  $stmt = $dbh->prepare('SELECT "ID","Nickname" FROM "User" WHERE "ID"=:userid');
  $stmt->bindValue('userid', $channel['UserID'], PDO::PARAM_INT);
  $stmt->execute();
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  include 'view.php';

} catch (Exception $e) {
  Rollbar::report_exception($e);
  die;
}
?>
