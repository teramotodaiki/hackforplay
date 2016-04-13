<?php
/**
* /cast/polling.php?id={Channel.ID}&update={Channel.Update}
* Cast視聴者が long polling するためのスクリプト
*/

require_once '../preload.php';

// channel id
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id) {
  header("HTTP/1.0 404 Not Found");
  echo 'invalid id';
  die;
}

// Datetime string of latest update
$last_update  = filter_input(INPUT_GET, 'update');

$stmt_ch = $dbh->prepare('SELECT * FROM "Channel" WHERE "ID"=:id');
$stmt_pr = $dbh->prepare('SELECT "Written" FROM "Project" WHERE "ID"=:project_id');
$stmt_us = $dbh->prepare('SELECT "ID","Nickname" FROM "User" WHERE "ID"=:user_id');
$stmt_sc  = $dbh->prepare('SELECT MAX("ID") FROM "Script" WHERE "ProjectID"=:project_id');

set_time_limit(0);
while (1) {

  $stmt_ch->bindValue(':id', $id, PDO::PARAM_INT);
  $stmt_ch->execute();
  $channel  = $stmt_ch->fetch(PDO::FETCH_ASSOC);
  if (!$channel) {
    // Not found
    if (!headers_sent()) {
      header("HTTP/1.0 404 Not Found");
      echo 'channel not found';
    }
    die;
  }

  $stmt_pr->bindValue(':project_id', $channel['ProjectID'], PDO::PARAM_INT);
  $stmt_pr->execute();
  $written  = $stmt_pr->fetch(PDO::FETCH_COLUMN);

  if ($last_update != $channel['Updated'] && $written) {

    $stmt_us->bindValue(':user_id', $channel['UserID'], PDO::PARAM_INT);
    $stmt_us->execute();
    $channel['User']  = $stmt_us->fetch(PDO::FETCH_ASSOC);

    $stmt_sc->bindValue(':project_id', $channel['ProjectID'], PDO::PARAM_INT);
    $stmt_sc->execute();
    $channel['Script'] = $stmt_sc->fetch(PDO::FETCH_ASSOC);

    // Fetch new update
    echo json_encode($channel);
    exit;

  } else {
    // Update time limit
    sleep(1);

  }

}

?>
