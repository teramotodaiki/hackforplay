<?php
// Make new scripts and set it kit stage's

require 'preload.php';

try {

  $stmt = $dbh->prepare('SELECT "ID","Thumbnail","Registered" FROM "Stage" WHERE "Mode"=:official AND "ScriptID" IS NULL');
  $stmt->bindValue(':official', 'official', PDO::PARAM_STR);
  $stmt->execute();

  $stmt_in = $dbh->prepare('INSERT INTO "Script" ("Thumbnail","Registered") VALUES (:thumbnail,:registered)');
  $stmt_up = $dbh->prepare('UPDATE "Stage" SET "ScriptID"=:script_id WHERE "ID"=:stage_id');

  $count = 0;

  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

    $stmt_in->bindValue(':thumbnail', $row['Thumbnail'], PDO::PARAM_STR);
    $stmt_in->bindValue(':registered', $row['Registered'], PDO::PARAM_STR);
    $flag = $stmt_in->execute();
    if (!$flag) exit('Failed to insert');

    $script_id = $dbh->lastInsertId('Script');

    $stmt_up->bindValue(':script_id', $script_id, PDO::PARAM_INT);
    $stmt_up->bindValue(':stage_id', $row['ID'], PDO::PARAM_INT);
    $flag = $stmt_up->execute();
    if (!$flag) exit('Failed to update');

    $count++;
  }

  echo "count $count";

} catch (Exception $e) {
  print_r($e);
}

?>
