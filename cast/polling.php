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

$stmt = $dbh->prepare('SELECT ch."DisplayName",ch."ProjectToken",ch."ProjectID",ch."UserID",ch."Registered",ch."Updated",u."Nickname" FROM "Channel" AS ch LEFT OUTER JOIN "User" AS u ON ch."UserID"=u."ID" WHERE ch."ID"=:id');
$stmt_script  = $dbh->prepare('SELECT MAX("ID") FROM "Script" WHERE "ProjectID"=:project_id');

set_time_limit(0);
while (1) {

  $stmt->bindValue(':id', $id, PDO::PARAM_INT);
  $stmt->execute();
  $channel  = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$channel) {
    // Not found
    header("HTTP/1.0 404 Not Found");
    echo 'channel not found';
    die;

  } elseif ($last_update != $channel['Updated']) {

    $stmt_script->execute($channel['ProjectID']);
    $channel['ScriptID'] = (int)$stmt_script->fetch(PDO::FETCH_COLUMN);

    // Fetch new update
    echo json_encode($channel);
    exit;

  } else {
    // Update time limit
    sleep(1);

  }

}

?>
