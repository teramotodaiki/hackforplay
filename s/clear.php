<?php
// API for clear stage

// 1.Preparation
require_once '../preload.php';

// 2.Get token and user_id
// 2-1.Get token
$token	= filter_input(INPUT_POST, 'token', FILTER_VALIDATE_REGEXP,
			array("options"=>array("regexp"=>"/[0-9a-f]+/")));	// $token made from ONLY HEX.
if(!isset($token) || !$token) exit('invalid token'); // invaild token
// 2-2.Get user ID
$key 	= filter_input(INPUT_COOKIE, 'key', FILTER_VALIDATE_REGEXP,
			array("options"=>array("regexp"=>"/[0-9a-f]+/")));	// $key made from ONLY HEX.
if(!isset($key) || !$key) exit('invalid key'); // invaild key

try{
	$stmt 	= $pdo->prepare('SELECT "id" FROM "user" WHERE "key"=:key;');
	$stmt->bindValue(":key", $key, PDO::PARAM_STR);
	$stmt->execute();
	$user	= $stmt->fetch(PDO::FETCH_ASSOC);
	if(!isset($user['id'])) exit('missing user');
}catch(PDOException $e){
	die(print_r($e));
}

// 2-3.Check to play
try{
	$stmt	= $pdo->prepare('SELECT "id","clear" FROM "play" WHERE "token"=:token AND "user_id"=:user_id;');
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->bindValue(":user_id", $user['id'], PDO::PARAM_INT);
	$stmt->execute();
	$play	= $stmt->fetch(PDO::FETCH_ASSOC);
	if(!isset($play['id'])) exit('missing play');
}catch(PDOException $e){
	die(print_r($e));
}

// 3.Update information
try{
	$stmt	= $pdo->prepare('UPDATE "play" SET "clear"=:clear,"finish"=:finish WHERE "id"=:id;');
	$stmt->bindValue(":clear", 1, PDO::PARAM_BOOL);
	$stmt->bindValue(":finish", date("Y-m-d H:i:s"), PDO::PARAM_STR);
	$stmt->bindValue(":id", $play['id'], PDO::PARAM_INT);
	$flag 	= $stmt->execute();
}catch(PDOException $e){
	die(print_r($e));
}
?>