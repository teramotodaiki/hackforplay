<?php
/**
 * 動的にKitの情報を取得
*/

try {

  require_once '../preload.php';

  // Script ID
  $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT) or die('invalid id');

  $stmt = $dbh->prepare('SELECT "RawCode","Updated" FROM "Script" WHERE "ID"=:id');
  $stmt->bindValue(':id', $id, PDO::PARAM_INT);
  $stmt->execute();
  $script = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$script) throw new Exception("Error no script has id=$id", 1);

  echo json_encode($script);

} catch (Exception $e) {

  print_r($e);

}

?>
