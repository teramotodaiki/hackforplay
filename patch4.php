<?php
// Add project written flag

try {

	require_once 'preload.php';

	$stmt_se	= $dbh->prepare('UPDATE "Project" SET "Written"=(SELECT COUNT(*) FROM "Script" WHERE "Project"."ID"="Script"."ProjectID")');
	$result		= $stmt_se->execute();

	var_dump($result);


} catch (Exception $e) {
	var_dump($e);
}

?>
