<?php

require_once 'preload.php';

try {

  $stmt = $dbh->prepare('UPDATE "Stage" SET "NoRestage"=:true WHERE "State"=:private');
  $stmt->bindValue(":true", true, PDO::PARAM_BOOL);
  $stmt->bindValue(':private', 'private', PDO::PARAM_STR);
  $flag = $stmt->execute();

  echo $stmt->rowCount() . " row affected";

} catch (Exception $e) {
  var_dump($e);
}

?>
