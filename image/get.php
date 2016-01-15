<?php
/**
 * ImageCacheから該当IDのPng画像を出力
 * Input: id
 */
try {

	require_once '../preload.php';

	$id	= filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

	$stmt	= $dbh->prepare('SELECT "PngData" FROM "ImageCache" WHERE "ID"=:id');
	$stmt->bindValue(":id", $id, PDO::PARAM_INT);
	$stmt->execute();

	$image	= $stmt->fetch(PDO::FETCH_COLUMN);
	header('Content-type: image/png');
	echo $image;

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>
