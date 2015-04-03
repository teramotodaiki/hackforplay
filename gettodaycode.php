<?php
// 1.Preparation
require_once 'preload.php';

require_once 'signin.php';

$display_limit = 6;
if($user){
	$stmt	= $pdo->prepare("SELECT DISTINCT c.id,c.raw,c.voted,s.path,s.title FROM `code` c INNER JOIN `stage` s ON c.stage_id=s.id WHERE  c.error=1 AND NOT c.id=ANY(SELECT `code_id` FROM `challenge_vote` WHERE `user_id`=:user_id) ORDER BY c.voted, c.displayed LIMIT :display_limit");
	$stmt->bindValue(":user_id", $user['id'], PDO::PARAM_INT);
	$stmt->bindValue(":display_limit", $display_limit, PDO::PARAM_INT);
	$stmt->execute();
	$codes	= $stmt->fetchAll(PDO::FETCH_ASSOC);

	// update `displayed`
	$stmt	= $pdo->prepare("UPDATE `code` SET `displayed`=`displayed`+1 WHERE `id`=:id");
	foreach ($codes as $key => $value) {
		$stmt->bindValue(":id", $value['id'], PDO::PARAM_INT);
		$stmt->execute();
	}
	echo json_encode($codes);
}

 ?>