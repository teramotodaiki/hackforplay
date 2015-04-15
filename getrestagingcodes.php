<?php
try{
	$restagingcodes = array();
	$stmt	= $pdo->prepare('SELECT "id","stage_id","code","time","author","stage_name","thumbnail" FROM "restaging" ORDER BY "id" DESC');
	$stmt->execute();
	$check	= $pdo->prepare('SELECT COUNT(*) FROM "stage" WHERE "restaging_id"=:rid');
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$check->bindValue(":rid", $row['id'], PDO::PARAM_INT);
		$check->execute();
		$res = $check->fetch(PDO::FETCH_NUM);
		if($res[0] == 0){
			array_push($restagingcodes, $row);
		}
	}
}catch ( PDOException $e ) {
    die(print_r($e));
}

?>