<?php
/**
 * /thumbnail?stage_id={stage_id}
 * Show image
 */

try {

	require_once '../preload.php';

	$stage_id = filter_input(INPUT_GET, 'stage_id', FILTER_VALIDATE_INT);
	if (!$stage_id) exit();

	$stmt	= $dbh->prepare('SELECT "Thumbnail" FROM "Stage" WHERE "ID"=:stage_id');
	$stmt->bindValue(":stage_id", $stage_id, PDO::PARAM_INT);
	$flag	=  $stmt->execute();
	if (!$flag) exit();

	$filename = $stmt->fetch(PDO::FETCH_COLUMN);
	if (!$filename) exit();

	$im = imagecreatefrompng('..' . $filename);
	header('Content-Type: image/png');

	imagepng($im);
	imagedestroy($im);

	exit();

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
}

?>
