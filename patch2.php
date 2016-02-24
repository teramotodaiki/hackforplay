<?php
// Set flag of Processed

try {

	require_once 'preload.php';

	$stmt	= $dbh->prepare('UPDATE "Script" SET "Processed"=:true WHERE "RawCode" IS NULL');
	$stmt->bindValue(":true", true, PDO::PARAM_BOOL);
	$result	= $stmt->execute();

	var_dump($result);
	exit();

} catch (Exception $e) {
	var_dump($e);
}

?>
