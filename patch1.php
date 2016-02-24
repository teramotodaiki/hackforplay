<?php
// Set scriptID to all stage

try {

	require_once 'preload.php';

	$stmt	= $dbh->prepare('UPDATE "Stage" SET "ScriptID"=(SELECT MAX("ID") FROM "Script" WHERE "Script"."ProjectID"="Stage"."ProjectID") WHERE "ScriptID" IS NULL');
	$result	= $stmt->execute();

	var_dump($result);
	exit();

} catch (Exception $e) {
	var_dump($e);
}

?>
