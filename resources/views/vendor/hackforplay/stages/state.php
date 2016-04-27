<?php
/**
 * /stages/
 * POST (id:Number, state:String)
 * 更新するには、Stage.TeamIDが指すチームのPublishingManagement権限を持つUserのsessionが必要
*/

require_once '../preload.php';

session_start();
$session_userid  = isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();
if (!$session_userid) {
  die('no-session');
}

$stage_id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT) or die('invalid-id');

$stmt = $dbh->prepare('SELECT * FROM "Stage" WHERE "ID"=:stage_id');
$stmt->bindValue(':stage_id', $stage_id, PDO::PARAM_INT);
$stmt->execute();
$current  = $stmt->fetch(PDO::FETCH_ASSOC) or die('stage-not-found');

// 権限を確認する
$stmt = $dbh->prepare('SELECT "PublishingManagement" FROM "UserTeamMap" WHERE "UserID"=:session_userid AND "TeamID"=:current_teamid AND "Enabled"=1');
$stmt->bindValue(':session_userid', $session_userid, PDO::PARAM_INT);
$stmt->bindValue(':current_teamid', $current['TeamID'], PDO::PARAM_INT);
$stmt->execute();
if (!$stmt->fetch(PDO::FETCH_COLUMN)) {
  die('unauthorized');
}

// 変更可能か調べる
$state  = filter_input(INPUT_POST, 'state') or die('invalid-state');
if ($state === $current['State']) {
  die("state-already-set $state");
}

// 通知を作成
if (in_array($state, ['published', 'rejected'])) {
  // 通知を生成
  $stmt	= $dbh->prepare('INSERT INTO "Notification" ("UserID","State","Type","Thumbnail","LinkedURL","MakeUnixTime") VALUES(:author_id,:unread,:judged,:thumb_url,:mypage,:time)');
  $stmt->bindValue(":author_id", $current['UserID'], PDO::PARAM_INT);
  $stmt->bindValue(":unread", 'unread', PDO::PARAM_STR);
  $stmt->bindValue(":judged", 'judged', PDO::PARAM_STR);
  $stmt->bindValue(":thumb_url", $current['Thumbnail'], PDO::PARAM_STR);
  $stmt->bindValue(":mypage", '/m/', PDO::PARAM_STR);
  date_default_timezone_set('GMT');
  $stmt->bindValue(":time", time(), PDO::PARAM_STR);
  $stmt->execute();
  $NotificationID	= $dbh->lastInsertId('Notification');
}

// 変更
switch ($state) {
  case 'published':
    $stmt = $dbh->prepare('UPDATE "Stage" SET "State"=:state,"Published"=:gmt WHERE "ID"=:stage_id');
    $stmt->bindValue(':state', $state, PDO::PARAM_STR);
    $stmt->bindValue(':gmt', gmdate("Y-m-d H:i:s"), PDO::PARAM_STR);
    $stmt->bindValue(':stage_id', $stage_id, PDO::PARAM_INT);
    $stmt->execute();
  	// ステージ名と結果を追加
  	$stmt	= $dbh->prepare('INSERT INTO "NotificationDetail" ("NotificationID","Data","KeyString") VALUES(:id_1,:stageid,:stage),(:id_2,:published,:judged)');
  	$stmt->bindValue(":id_1", $NotificationID, PDO::PARAM_INT);
  	$stmt->bindValue(":id_2", $NotificationID, PDO::PARAM_INT);
  	$stmt->bindValue(":stageid", $stage_id, PDO::PARAM_STR);
  	$stmt->bindValue(":stage", 'stage', PDO::PARAM_STR);
  	$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
  	$stmt->bindValue(":judged", 'judged', PDO::PARAM_STR);
  	$stmt->execute();
    exit('success');
    break;
  case 'rejected':
    $notice	= filter_input(INPUT_POST, 'notice');
    // 更新
    $stmt	= $dbh->prepare('UPDATE "Stage" SET "State"=:rejected,"RejectNotice"=:notice WHERE "ID"=:stage_id');
    $stmt->bindValue(":rejected", 'rejected', PDO::PARAM_STR);
    $stmt->bindValue(':notice', $notice, PDO::PARAM_STR);
    $stmt->bindValue(":stage_id", $stage_id, PDO::PARAM_INT);
    $stmt->execute();
    // リジェクトの理由
    $reasons_json	= filter_input(INPUT_POST, 'reasons');
    $reasons		= json_decode($reasons_json);
    if ($reasons && !empty($reasons)) {
      $registered		= gmdate("Y-m-d H:i:s");
      $placeHolder	= array_fill(0, count($reasons), "($stage_id,?,'$registered')");
      $stmt			= $dbh->prepare('INSERT INTO "RejectReasonMap" ("StageID","DataID","Registered") VALUES '
        . implode(',', $placeHolder));
      foreach ($reasons as $key => $value) {
        $stmt->bindValue($key + 1, $value, PDO::PARAM_INT);
      }
      $stmt->execute();
    }
    // ステージ名と結果を追加
    $stmt	= $dbh->prepare('INSERT INTO "NotificationDetail" ("NotificationID","Data","KeyString") VALUES(:id_1,:stageid,:stage),(:id_2,:rejected,:judged)');
    $stmt->bindValue(":id_1", $NotificationID, PDO::PARAM_INT);
    $stmt->bindValue(":id_2", $NotificationID, PDO::PARAM_INT);
    $stmt->bindValue(":stageid", $stage_id, PDO::PARAM_STR);
    $stmt->bindValue(":stage", 'stage', PDO::PARAM_STR);
    $stmt->bindValue(":rejected", 'rejected', PDO::PARAM_STR);
    $stmt->bindValue(":judged", 'judged', PDO::PARAM_STR);
    $stmt->execute();
    exit('success');
  default:
    die("unexpected-state $state");
    break;
}


?>
