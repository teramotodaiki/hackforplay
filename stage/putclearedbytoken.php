<?php
// method:POST
// PlayLog.Cleared を登録する

require_once '../preload.php';

try {

	$token 	= filter_input(INPUT_POST, 'token');
	if (!$token) {
		die('token-empty');
	}

  // Fetch playlog
	$stmt	= $dbh->prepare('SELECT "ID","Cleared" FROM "PlayLog" WHERE "Token"=:token');
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->execute();
	$playlog = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$playlog) {
    die('invalid-token');
  } elseif ($playlog['Cleared']) {
    die('already-cleared');
  }

  // Set time
  $stmt	= $dbh->prepare('UPDATE "PlayLog" SET "Cleared"=:gmt WHERE "ID"=:id');
  $stmt->bindValue(":gmt", gmdate('Y-m-d H:i:s'), PDO::PARAM_STR);
	$stmt->bindValue(":id", $playlog['ID'], PDO::PARAM_INT);
	$stmt->execute() or die('database-error');

  echo 'success';

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
 ?>
