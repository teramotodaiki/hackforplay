<?php
/**
 * cache.php
 * Original URL から png画像を取得し サムネイルにして (したものを) 取得する
 * Input: Origin , width , height
 * Output: NG , {id:Int}
*/

try {

	require_once '../preload.php';

	$origin	= filter_input(INPUT_POST, 'origin', FILTER_VALIDATE_URL);
	$width	= filter_input(INPUT_POST, 'width', FILTER_VALIDATE_INT);
	$height	= filter_input(INPUT_POST, 'height', FILTER_VALIDATE_INT);

	$extension	= pathinfo($origin, PATHINFO_EXTENSION);
	if (!$origin || !$extension) {
		exit('NG');
	}

	// Use cache
	$stmt	= $dbh->prepare('SELECT "ID","Width","Height" FROM "ImageCache" WHERE "Origin"=:origin');
	$stmt->bindValue(":origin", $origin, PDO::PARAM_STR);
	$stmt->execute();
	while ($cache = $stmt->fetch(PDO::FETCH_ASSOC)) {
		// Width, Heightが一致していればキャッシュ成功。NULLの場合は無視
		if ((isset($width)  && $width  != $cache['Width']) ||
			(isset($height) && $height != $cache['Height'])) {
			continue; // 指定サイズに沿わない
		} else {
			echo $cache['ID'];
			exit();
		}
	}

	switch ($extension) {
		case 'jpg':
		case 'jpeg': $image	= imagecreatefromjpeg($origin); break;
		case 'png': $image	= imagecreatefrompng($origin); break;
		case 'gif': $image	= imagecreatefromgif($origin); break;
		default: exit('NG'); break;
	}

	$size	= getimagesize($origin);
	if (!$size) {
		exit('NG');
	}

	if (!$width) {
		if (!$height) {
			$width = $size[0];
			$height = $size[1];
		} else {
			$width = (int)($size[0] * $height / $size[1]);
		}
	} else {
		if (!$height) {
			$height = (int)($size[1] * $width / $size[0]);
		}
	}

	// Resize
	$dist	= imagecreatetruecolor($width, $height);
	imagesavealpha($dist, TRUE);
	$result	= imagecopyresized($dist, $image, 0, 0, 0, 0, $width, $height, $size[0], $size[1]);
	if (!$result) {
		exit('NG');
	}
	imagedestroy($image);

	// Make file (temporary)
	$bytes		= openssl_random_pseudo_bytes(16); // 16bytes (32chars)
	$filename	= './'.bin2hex($bytes).'.png'; // binaly to hex
	imagepng($dist, $filename);
	imagedestroy($dist);

	$contents	= file_get_contents($filename);
	unlink($filename);

	$stmt	= $dbh->prepare('INSERT INTO "ImageCache"("Origin","Width","Height","PngData") VALUES(:origin,:width,:height,:contents)');
	$stmt->bindValue(":origin", $origin, PDO::PARAM_STR);
	$stmt->bindValue(":width", $width, PDO::PARAM_INT);
	$stmt->bindValue(":height", $height, PDO::PARAM_INT);
	$stmt->bindValue(":contents", $contents, PDO::PARAM_LOB);
	$flag	= $stmt->execute();
	if (!$flag) {
		exit('NG');
	}

	echo $dbh->lastInsertId('ImageCache');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}

?>
