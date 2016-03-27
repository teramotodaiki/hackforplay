<?php
// Sessionのユーザによって指定されたユーザをコミュニティから除籍する (コネクションを削除する)

try {

  require_once '../preload.php';

  session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

  if (!$session_userid) {
    die('no-session');
  }

  $targetid = filter_input(INPUT_POST, 'userid', FILTER_VALIDATE_INT);
  if (!$targetid) {
    die('invalid-input-userid');
  }

  $communityid = filter_input(INPUT_POST, 'communityid', FILTER_VALIDATE_INT);
  if (!$communityid) {
    die('invalid-input-communityid');
  }

  // SessionUserの権限を調査する
  $stmt = $dbh->prepare('SELECT "ID","Enabled","MembershipEmpowered","MembershipManagement" FROM "UserCommunityMap" WHERE "UserID"=:userid AND "CommunityID"=:communityid');
  $stmt->bindValue(':userid', $session_userid, PDO::PARAM_INT);
  $stmt->bindValue(':communityid', $communityid, PDO::PARAM_INT);
  $stmt->execute();
  $doer = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$doer || !$doer['Enabled']) {
    die('missing-membership-doer');
  }

  // 指定されたユーザの権限を調査する
  $stmt->bindValue(':userid', $targetid, PDO::PARAM_INT);
  $stmt->bindValue(':communityid', $communityid, PDO::PARAM_INT);
  $stmt->execute();
  $target = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$target || !$target['Enabled']) {
    die('missing-membership-target');
  }

  // 変更する権限を調べる
  ($doer['MembershipManagement'] && $target['MembershipEmpowered']) or die('unauthorized-request');

  // 指定されたユーザのメンバーシップを無効化
  $stmt = $dbh->prepare('UPDATE "UserCommunityMap" SET "Enabled"=:false WHERE "ID"=:target');
  $stmt->bindValue(':false', false, PDO::PARAM_BOOL);
  $stmt->bindValue(':target', $target['ID'], PDO::PARAM_INT);
  $stmt->execute() or die('database-error');

  echo 'success';

} catch (Exception $e) {
  Rollbar::report_exception($e);
  die();
}
?>
