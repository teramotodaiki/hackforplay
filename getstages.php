<?php
// Get stages (no tag)

// Use it
try{
	$allstages = array();
	$stmt	= $pdo->prepare('SELECT * FROM "stage" WHERE "playable"=:playable ORDER BY "id"');
	$stmt->bindValue(":playable", 1, PDO::PARAM_BOOL); // playable
	$stmt->execute();
	$value	= $stmt->fetchAll(PDO::FETCH_ASSOC);

	$rstg	= $pdo->prepare('SELECT * FROM "restaging" WHERE "id"=:id');
	foreach ($value as $key => $item) {
		// add restaging information
		if($item['type'] == "replay"){
			$rstg->bindValue(":id", $item['restaging_id'], PDO::PARAM_INT);
			$rstg->execute();
			$item['restaging'] = $rstg->fetch(PDO::FETCH_ASSOC);
		}
		$allstages[$item['id']] = $item;
	}
}catch ( PDOException $e ) {
    die(print_r($e));
}

 ?>