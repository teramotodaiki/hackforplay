<?php
// API for clear stage

// 1.Preparation
require_once '../preload.php';

// 2.Get token and user_id
// 2-1.Get token
$token	= filter_input(INPUT_POST, 'token', FILTER_VALIDATE_REGEXP,
			array("options"=>array("regexp"=>"/[0-9a-f]+/")));	// $token made from ONLY HEX.
if(!isset($token) || !$token) exit('invalid token'); // invaild token
$raw	= filter_input(INPUT_POST, 'raw');
$error	= filter_input(INPUT_POST, 'error', FILTER_VALIDATE_BOOLEAN);
// 2-2.Get user ID play ID and stage ID
try{
	$stmt 	= $pdo->prepare('SELECT "id","stage_id","user_id" FROM "play" WHERE "token"=:token');
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->execute();
	$play	= $stmt->fetch(PDO::FETCH_ASSOC);
	if(!isset($play['id'])) exit('missing play log');
}catch( PDOException $e ) {
	die(print_r($e));
}

// 3.Insert information
try{
	$stmt	= $pdo->prepare('INSERT INTO "code" ("play_id", "stage_id", "user_id", "raw", "time", "error") VALUES(:play_id, :stage_id, :user_id, :raw, :time, :error)');
	$stmt->bindValue(":play_id", $play['id'], PDO::PARAM_INT);
	$stmt->bindValue(":stage_id", $play['stage_id'], PDO::PARAM_INT);
	$stmt->bindValue(":user_id", $play['user_id'], PDO::PARAM_INT);
	$stmt->bindValue(":raw", $raw, PDO::PARAM_STR);
	$stmt->bindValue(":time", date("Y-m-d H:i:s"), PDO::PARAM_STR);
	$stmt->bindValue(":error", $error, PDO::PARAM_BOOL);
	$flag 	= $stmt->execute();
	if(!$flag) exit('failed to send');
}catch( PDOException $e ) {
	die(print_r($e));
}
?>