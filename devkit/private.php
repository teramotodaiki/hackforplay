<?php
/**
 * /devkit/private.php
 * ## プライベートAPI
 * Scriptの内容を直接書き換える
*/

try {

  require_once '../preload.php';

  $code = filter_input(INPUT_POST, 'code') or die('code is empty.');
  $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT) or die('invalid id');

  $stmt = $dbh->prepare('SELECT "RawCode" FROM "Script" WHERE "ID"=:id');
  $stmt->bindValue(':id', $id, PDO::PARAM_INT);
  $stmt->execute();
  $current = $stmt->fetch(PDO::FETCH_COLUMN) or die("No script has id=$id");

  if ($current === $code) {
    throw new Exception("Same code posted", 1);
  }

  $stmt = $dbh->prepare('UPDATE "Script" SET "RawCode"=:code,"Updated"=:gmt WHERE "ID"=:id');
  $stmt->bindValue(':code', $code, PDO::PARAM_STR);
  $stmt->bindValue(':gmt', gmdate('Y-m-d H:i:s'), PDO::PARAM_STR);
  $stmt->bindValue(':id', $id, PDO::PARAM_INT);
  $stmt->execute() or die('Database error');

} catch (Exception $e) {

  print_r($e);

}


?>
