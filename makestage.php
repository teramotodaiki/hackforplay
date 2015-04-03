<?php

require_once 'preload.php';

$stage_name	= filter_input(INPUT_POST, 'stage_name');
$restaging_id	= filter_input(INPUT_POST, 'restaging_id');

$stmt 	= $pdo->prepare("SELECT `stage_id` FROM `restaging` WHERE `id`=:id;");
$stmt->bindValue(":id", $restaging_id, PDO::PARAM_INT);
$stmt->execute();
$restaging	= $stmt->fetch(PDO::FETCH_ASSOC);
if($restaging == FALSE){
	exit("missing restaging information");
}

$stmt 	= $pdo->prepare("SELECT `path` FROM `stage` WHERE `id`=:id;");
$stmt->bindValue(":id", $restaging['stage_id'], PDO::PARAM_INT);
$stmt->execute();
$stage	= $stmt->fetch(PDO::FETCH_ASSOC);
if($stage == FALSE){
	exit("missing stage information");
}

$stmt	= $pdo->prepare("INSERT INTO `stage` (`id`,`path`,`title`,`next`,`playcount`,`playable`,`type`,`restaging_id`) VALUES(NULL, :path, :title, NULL, 0, 1, 'replay', :rid)");
$stmt->bindValue(":path", $stage['path'], PDO::PARAM_INT);
$stmt->bindValue(":title", $stage_name, PDO::PARAM_STR);
$stmt->bindValue(":rid", $restaging_id, PDO::PARAM_INT);
$res = $stmt->execute();
if($res == FALSE){
	exit("faild to make stage");
}
 ?>