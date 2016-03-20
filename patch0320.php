<?php
// Stage.Src=(game.php|rpg.php)のステージを、すべてrejectedにする

try {

  require_once 'preload.php';

  // Get ID of reject reason data
  $message = 'ゲームシステム変更の都合によりリジェクト';
  $stmt = $dbh->prepare('SELECT "ID" FROM "RejectReasonData" WHERE "Message"=:message');
  $stmt->bindValue(':message', $message, PDO::PARAM_STR);
  $stmt->execute();
  $reason_id = $stmt->fetch(PDO::FETCH_COLUMN);

  if (!$reason_id) {
    $stmt = $dbh->prepare('INSERT INTO "RejectReasonData" ("Message") VALUES (:message)');
    $stmt->bindValue(':message', $message, PDO::PARAM_STR);
    $stmt->execute();
    $reason_id = $dbh->lastInsertId('RejectReasonData');
  }

  //
  // Fetch stages
  $stmt = $dbh->prepare('SELECT "ID","UserID","Thumbnail","Title" FROM "Stage" WHERE "Src" IN (:game,:rpg) AND "State"!=:rejected');
  $stmt->bindValue(':game', 'game.php', PDO::PARAM_STR);
  $stmt->bindValue(':rpg', 'rpg.php', PDO::PARAM_STR);
  $stmt->bindValue(':rejected', 'rejected', PDO::PARAM_STR);
  $stmt->execute();

  $stmt_upd = $dbh->prepare('UPDATE "Stage" SET "State"=:rejected WHERE "ID"=:id');
  $stmt_ins = $dbh->prepare('INSERT INTO "RejectReasonMap" ("StageID","DataID","Registered") VALUES (:stage_id,:data_id,:gmt)');

  date_default_timezone_set('GMT');
  $stmt_not	= $dbh->prepare('INSERT INTO "Notification" ("UserID","State","Type","Thumbnail","LinkedURL","MakeUnixTime") VALUES(:author_id,:unread,:judged,:thumb_url,:mypage,:time)');
  $stmt_det	= $dbh->prepare('INSERT INTO "NotificationDetail" ("NotificationID","Data","KeyString") VALUES(:id_1,:stageid,:stage),(:id_2,:rejected,:judged)');

  $count = 0;

  while ($stage = $stmt->fetch(PDO::FETCH_ASSOC)) {

    // Reject stage
    $stmt_upd->bindValue(':rejected', 'rejected', PDO::PARAM_STR);
    $stmt_upd->bindValue(':id', $stage['ID'], PDO::PARAM_INT);
    $stmt_upd->execute();

    // Set reason
    $stmt_ins->bindValue(':stage_id', $stage['ID'], PDO::PARAM_INT);
    $stmt_ins->bindValue(':data_id', $reason_id, PDO::PARAM_INT);
    $stmt_ins->bindValue(':gmt', gmdate('Y-m-d H:i:s'), PDO::PARAM_STR);
    $stmt_ins->execute();

    // Notification
    if (isset($stage['UserID'])) {
  		// 通知を生成
  		$stmt_not->bindValue(":author_id", $stage['UserID'], PDO::PARAM_INT);
  		$stmt_not->bindValue(":unread", 'unread', PDO::PARAM_STR);
  		$stmt_not->bindValue(":judged", 'judged', PDO::PARAM_STR);
  		$stmt_not->bindValue(":thumb_url", $stage['Thumbnail'], PDO::PARAM_STR);
  		$stmt_not->bindValue(":mypage", '/m/', PDO::PARAM_STR);
  		$stmt_not->bindValue(":time", time(), PDO::PARAM_STR);
  		$stmt_not->execute();
  		$NotificationID	= $dbh->lastInsertId('Notification');

  		// ステージ名と結果を追加
  		$stmt_det->bindValue(":id_1", $NotificationID, PDO::PARAM_INT);
  		$stmt_det->bindValue(":id_2", $NotificationID, PDO::PARAM_INT);
  		$stmt_det->bindValue(":stageid", $stage['ID'], PDO::PARAM_INT);
  		$stmt_det->bindValue(":stage", 'stage', PDO::PARAM_STR);
  		$stmt_det->bindValue(":rejected", 'rejected', PDO::PARAM_STR);
  		$stmt_det->bindValue(":judged", 'judged', PDO::PARAM_STR);
  		$stmt_det->execute();
  	}

    $count++;
  }

  exit ("$count row rejected");

} catch (Exception $e) {

  var_dump($e);

}

?>
