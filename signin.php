<?php
// part of sign in and sign up
/*
// 2.Do you have a key in the cookie?
$key = filter_input(INPUT_COOKIE, 'key', FILTER_VALIDATE_REGEXP,
	array("options"=>array("regexp"=>"/[0-9a-f]+/")));	// $key made from ONLY HEX.

if(!isset($key)){ // have not set
	// 2a-1.Generate key
	$bytes 	= openssl_random_pseudo_bytes(16); // 16bytes (32chars)
	$key	= bin2hex($bytes); // binaly to hex
	// 2a-2.Set key as http cookie
	setcookie('key', $key, time() + (365*24*60*60)); // save for a year
	// 2a-3.Sign up
	$stmt = $pdo->prepare("INSERT INTO `user` (`id`,`key`,`beta`,`begin`,`last`) VALUES (NULL, :key, :beta, :begin, NULL);");
	$stmt->bindValue(":key", $key, PDO::PARAM_STR);
	$stmt->bindValue(":beta", true, PDO::PARAM_BOOL);
	$stmt->bindValue(":begin", date("Y-m-d H:i:s"), PDO::PARAM_STR);
	$flag = $stmt->execute();
	if(!$flag) {
		// ERROR:Failed to sign up.
		setcookie('key', $key, time() - 1); // delete cookie
		$key = null;
	}
} else if(!$key){ // failed to filter ...Does it attack!?
	setcookie('key', $key, time() - 1); // delete cookie
	$key = null;
}

// 3.Sign in (update 'last' time of sign in)
$user = null;
if(isset($key)){
	// 3-1.Check the presence of you
	$stmt 	= $pdo->prepare("SELECT * FROM `user` WHERE `key`=:key;");
	$stmt->bindValue(":key", $key, PDO::PARAM_STR);
	$flag	= $stmt->execute();
	$user	= $stmt->fetch(PDO::FETCH_ASSOC);
	if(isset($user['id'])){
		// 3-2.Update information
		$stmt	= $pdo->prepare("UPDATE `user` SET `last`=:last WHERE `id`=:id;");
		$stmt->bindValue(":last", date("Y-m-d H:i:s"), PDO::PARAM_STR);
		$stmt->bindValue(":id", $user['id'], PDO::PARAM_INT);
		$flag	= $stmt->execute();
	} else {
		$user 	= null;
	}
}
*/
?>