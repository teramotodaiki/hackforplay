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
	$origin_stage = $pdo->prepare('SELECT "id","title" FROM "stage" WHERE "restaging_id"=:rid AND "playable"=1');
	foreach ($value as $key => $item) {
		// add restaging information
		if($item['type'] == "1"){
			$rstg->bindValue(":id", $item['restaging_id'], PDO::PARAM_INT);
			$rstg->execute();
			$item['restaging'] = $rstg->fetch(PDO::FETCH_ASSOC);

			if($item['restaging']['origin_id'] != NULL){
				$origin_stage->bindValue(":rid", $item['restaging']['origin_id'], PDO::PARAM_INT);
				$origin_stage->execute();
				$result = $origin_stage->fetch(PDO::FETCH_ASSOC);
				$item['origin_stage'] = $result;
			}

		}
		$allstages[$item['id']] = $item;
	}
}catch ( PDOException $e ) {
    die('PDO Error in getstages');
    // die(print_r($e));
}

 ?>