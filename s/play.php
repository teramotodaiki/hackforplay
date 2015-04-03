<?php
// set token for a playing

// 2.Get ID
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if(!isset($id) || !$id){
	// no ID, go to top page
	header('Location:../');
	exit();
}

// 3.Get stage information
$stmt	= $pdo->prepare("SELECT * FROM `stage` WHERE `id`=:id;");
$stmt->bindValue(":id", $id, PDO::PARAM_INT);
$stmt->execute();
$stage	= $stmt->fetch(PDO::FETCH_ASSOC);
if(!$stage || !$stage['playable']){
	// no stage, go to top page
	header('Location:../');
	exit();
}

// 3-1.Get next stage id
// $stmt	= $pdo->prepare("SELECT `id` FROM `stage` WHERE `id`>:id AND `playable`=:playable ORDER BY `id` LIMIT 1");
// $stmt->bindValue(":id", $id, PDO::PARAM_INT);
// $stmt->bindValue(":playable", 1, PDO::PARAM_BOOL);
// $stmt->execute();
// $next = $stmt->fetch(PDO::FETCH_COLUMN);

if(isset($stage['restaging_id'])){
	// 3-2.Get restaging information
	$stmt	= $pdo->prepare("SELECT * FROM `restaging` WHERE `id`=:id");
	$stmt->bindValue(":id", $stage['restaging_id'], PDO::PARAM_INT);
	$stmt->execute();
	$restaging = $stmt->fetch(PDO::FETCH_ASSOC);
}

// 4.Generate token
$bytes 	= openssl_random_pseudo_bytes(16); // 16bytes (32chars)
$token	= bin2hex($bytes); // binaly to hex

// 5.Record this playing
if(isset($key)){
	// 5-1.Get user id
	$stmt = $pdo->prepare("SELECT `id` FROM `user` WHERE `key`=:key");
	$stmt->bindValue(":key", $key, PDO::PARAM_STR);
	$stmt->execute();
	$user = $stmt->fetch(PDO::FETCH_ASSOC);
	if(!isset($user['id'])){
		// Missing user
	} else {
		// 5-2.Record token-user_id pair
		$stmt = $pdo->prepare("INSERT INTO `play` (`id`,`token`,`user_id`,`stage_id`,`begin`) VALUES(NULL, :token, :user_id, :stage_id, :begin)");
		$stmt->bindValue(":token", $token, PDO::PARAM_STR);
		$stmt->bindValue(":user_id", $user['id'], PDO::PARAM_INT);
		$stmt->bindValue(":stage_id", $stage['id'], PDO::PARAM_INT);
		$stmt->bindValue(":begin", date("Y-m-d H:i:s"), PDO::PARAM_STR);
		$flag = $stmt->execute();
		if(!$flag){
			// Failed to record
			$token = "";
		}else{
			// increase playcount
			$stmt = $pdo->prepare("UPDATE `stage` SET `playcount`=`playcount`+1 WHERE `id`=:id");
			$stmt->bindValue(":id", $id, PDO::PARAM_INT);
			$stmt->execute();
		}
	}
}
?>