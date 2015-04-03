<?php
// // 2.Get 4 error codes without challenged

// $max_challenge_tocode = 1; // If (n) challenge have been done, it close the vote.
// $codes = array();
// if($user && $last_times_challenge_today > 0){
// 	$stmt	= $pdo->prepare("SELECT DISTINCT c.id,c.raw,s.path,s.title FROM `code` c INNER JOIN `play` p ON c.stage_id=p.stage_id INNER JOIN `stage` s ON c.stage_id=s.id WHERE c.voted < :max AND c.error=1 AND p.clear=1 AND p.user_id=:user_id AND NOT c.id=ANY(SELECT `code_id` FROM `challenge_vote` WHERE `user_id`=:user_id) LIMIT :count");
// 	$stmt->bindValue(":max", $max_challenge_tocode, PDO::PARAM_INT);
// 	$stmt->bindValue(":user_id", $user['id'], PDO::PARAM_INT);
// 	$stmt->bindValue(":count", $last_times_challenge_today, PDO::PARAM_INT);
// 	$stmt->execute();
// 	$codes	= $stmt->fetchAll(PDO::FETCH_ASSOC);
// }

?>