<?php
// Publish restaging code

// 1.Preparation
require_once '../preload.php';

// 2.Get token and user_id
// 2-1.Get token
$token	= filter_input(INPUT_POST, 'token', FILTER_VALIDATE_REGEXP,
			array("options"=>array("regexp"=>"/[0-9a-f]+/")));	// $token made from ONLY HEX.
if(!isset($token) || !$token) exit('invalid token'); // invaild token
$code	= filter_input(INPUT_POST, 'code');
$author	= filter_input(INPUT_POST, 'author');
$stage_name	= filter_input(INPUT_POST, 'stage_name');
$origin_id	= filter_input(INPUT_POST, 'origin_id');
if($origin_id == "" || $origin_id == FALSE){ $origin_id = NULL; }
$thumb	= filter_input(INPUT_POST, 'thumb');

// 2-2.Get user ID play ID and stage ID
try{
	$stmt 	= $pdo->prepare('SELECT "id","stage_id","user_id" FROM "play" WHERE "token"=:token');
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->execute();
	$play	= $stmt->fetch(PDO::FETCH_ASSOC);
	// if(!isset($play['id'])) exit('missing play log');

	if($origin_id != NULL){
		$stmt 	= $pdo->prepare('SELECT "stage_id" FROM "restaging" WHERE "id"=:id');
		$stmt->bindValue(":id", $origin_id, PDO::PARAM_INT);
		$stmt->execute();
		$restaging	= $stmt->fetch(PDO::FETCH_ASSOC);
	}

}catch( PDOException $e ) {
	die(print_r($e));
}


// Save image
$thumb = preg_replace("/data:[^,]+,/i","",$thumb); //ヘッダに「data:image/png;base64,」が付いているので、それは外す
$thumb = base64_decode($thumb); //残りのデータはbase64エンコードされているので、デコードする
$image = imagecreatefromstring($thumb); //まだ文字列の状態なので、画像リソース化
imagesavealpha($image, TRUE); // 透明色の有効
// random name
$bytes 	= openssl_random_pseudo_bytes(16); // 16bytes (32chars)
$thumb_url	= 'thumbs/'.bin2hex($bytes).'.png'; // binaly to hex
imagepng($image ,$thumb_url);
$thumb_url = "/s/".$thumb_url;

// 3.Insert information
try{
	$stmt	= $pdo->prepare('INSERT INTO "restaging" ("id", "play_id", "stage_id", "user_id", "code", "time", "origin_id", "author", "stage_name", "thumbnail") VALUES(NULL, :play_id, :stage_id, :user_id, :code, :time, :origin_id, :author, :stage_name, :thumbnail)');
	if($origin_id == NULL){	$stmt->bindValue(":stage_id", $play['stage_id'], PDO::PARAM_INT); } // Restage on Official
	else { 					$stmt->bindValue(":stage_id", $restaging['stage_id'], PDO::PARAM_INT); } // Restage on Replay
	if(isset($play) && $play){
		$stmt->bindValue(":play_id", $play['id'], PDO::PARAM_INT);
		$stmt->bindValue(":user_id", $play['user_id'], PDO::PARAM_INT);
	}else{
		$stmt->bindValue(":play_id", 1, PDO::PARAM_INT);
		$stmt->bindValue(":user_id", 1, PDO::PARAM_INT);
	}
	$stmt->bindValue(":code", $code, PDO::PARAM_STR);
	$stmt->bindValue(":origin_id", $origin_id, PDO::PARAM_INT);
	$stmt->bindValue(":author", $author, PDO::PARAM_STR);
	$stmt->bindValue(":stage_name", $stage_name, PDO::PARAM_STR);
	$stmt->bindValue(":thumbnail", $thumb_url, PDO::PARAM_STR);
	$stmt->bindValue(":time", date("Y-m-d H:i:s"), PDO::PARAM_STR);
	$flag 	= $stmt->execute();
	if(!$flag) die('failed to send');
}catch( PDOException $e ) {
	die(print_r($e));
}
?>