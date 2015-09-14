<?php
/* getquestlist.php
 * PavilionIDから、クエストとレベルの一覧を取得する (管理者用)
 * Input:	id
 * Output:	result:JSON
 {
	quests:
	[{
		ID:INT,
		Type:String,
		Published:Bool,
		levels:
		[{
			StageID:INT,
			PlayOrder:INT
		}(,,,)]
	}(,,,)]
 }
 *
*/

try {

	require_once '../preload.php';

	$id	= filter_input(INPUT_POST, 'id');
	if (!$id) exit;

	$result	= array();

	$stmt				= $dbh->prepare('SELECT "ID","Type","Published" FROM "Quest" WHERE "PavilionID"=:id');
	$stmt->bindValue(":id", $id, PDO::PARAM_INT);
	$stmt->execute();
	$result['quests']	= $stmt->fetchAll(PDO::FETCH_ASSOC);
	if (!$result['quests']) {
		echo json_encode($result);
		exit;
	}

	$stmt	= $dbh->prepare('SELECT "ID","StageID","PlayOrder" FROM "Level" WHERE "QuestID"=:quest_id ORDER BY "PlayOrder"');

	foreach ($result['quests'] as $key => $value) {

		$stmt->bindValue(":quest_id", $value['ID'], PDO::PARAM_INT);
		$stmt->execute();
		$result['quests'][$key]['levels'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	echo json_encode($result);
	exit;

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
}


?>