<?php
// Enumrate cleared stage from play table by user_id

// 2.Fetch stage id which cleared
$cleared = array();
if($user){
	try{
		$stmt	= $pdo->prepare('SELECT DISTINCT "stage_id" FROM "play" WHERE "user_id"=:user_id AND "clear"=:clear');
		$stmt->bindValue(":user_id", $user['id'], PDO::PARAM_INT);
		$stmt->bindValue(":clear", 1, PDO::PARAM_BOOL);
		$stmt->execute();
		$cleared = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
		if(!$cleared) $cleared = array();
	}catch ( PDOException $e ) {
		$cleared = array();
	    die(print_r($e));
	}
}

?>