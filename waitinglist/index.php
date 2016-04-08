<?php
/**
 * /waitinglist/?name={Team.Name}
 * チームとして投稿したステージの順番待ちリストのビュー
 * UserTeamMap.PublishingManagement 権限を持つユーザーのSessionが必要
*/

require_once '../preload.php';

session_start();
$session_userid  = isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();
if (!$session_userid) {
  die('no-session');
}

$team_name = filter_input(INPUT_GET, 'team') or die('invalid team name');

// チームを取得
$stmt = $dbh->prepare('SELECT "ID" FROM "Team" WHERE "Name"=:team_name');
$stmt->bindValue(':team_name', $team_name, PDO::PARAM_STR);
$stmt->execute();
$team = $stmt->fetch(PDO::FETCH_ASSOC) or die('team not found');

// 権限を確認
$stmt = $dbh->prepare('SELECT "PublishingManagement" FROM "UserTeamMap" WHERE "UserID"=:session_userid AND "TeamID"=:team_id AND "Enabled"=1');
$stmt->bindValue(':session_userid', $session_userid, PDO::PARAM_INT);
$stmt->bindValue(':team_id', $team['ID'], PDO::PARAM_STR);
$stmt->execute();
$rights = $stmt->fetch(PDO::FETCH_COLUMN) or die('unauthorized-management');

// waitinglistを取得
$stmt = $dbh->prepare('SELECT * FROM "Stage" WHERE "TeamID"=:team_id AND "State"=:judging');
$stmt->bindValue(':team_id', $team['ID'], PDO::PARAM_INT);
$stmt->bindValue(':judging', 'judging', PDO::PARAM_STR);
$stmt->execute();
$list = $stmt->fetchAll(PDO::FETCH_ASSOC);

// SourceStageをfetch
$stmt = $dbh->prepare('SELECT "ID","Title" FROM "Stage" WHERE "ID"=:source_id');
foreach ($list as $key => $stage) {
  $stmt->bindValue(':source_id', $stage['SourceID'], PDO::PARAM_INT);
  $stmt->execute();
  $list[$key]['SourceStage'] = $stmt->fetch(PDO::FETCH_ASSOC);
}

// User.Nicknameをfetch
$stmt = $dbh->prepare('SELECT "ID","Nickname" FROM "User" WHERE "ID"=:stage_userid');
foreach ($list as $key => $stage) {
  $stmt->bindValue(':stage_userid', $stage['UserID'], PDO::PARAM_INT);
  $stmt->execute();
  $list[$key]['User'] = $stmt->fetch(PDO::FETCH_ASSOC);
}

// RawCodeをfetch
$stmt = $dbh->prepare('SELECT "RawCode" FROM "Script" WHERE "ID"=:stage_scriptid');
foreach ($list as $key => $stage) {
  $stmt->bindValue(':stage_scriptid', $stage['ScriptID'], PDO::PARAM_INT);
  $stmt->execute();
  $list[$key]['Script'] = $stmt->fetch(PDO::FETCH_ASSOC);
}

// ビューを生成
include './view.php';

?>
