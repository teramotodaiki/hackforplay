<?php
// Set scriptID to all stage

try {

	require_once 'preload.php';

	$stmt	= $dbh->prepare('UPDATE "Stage" AS s SET s."ScriptID"=(SELECT MAX("ID") FROM "Script" AS script WHERE script."ProjectID"=s."ProjectID") WHERE s."ScriptID" IS NULL');
	$result	= $stmt->execute();

	var_dump($result);
	exit();

} catch (Exception $e) {
	var_dump($e);
}

?>
