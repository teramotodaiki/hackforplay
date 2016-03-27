<?php
/* addquest.php
 * パビリオンに空のクエストを追加する
 * Input:	pavilion_id
 * Output:	failed , quest:JSON
 {
	ID:INT,
	Type:String,
	levels:[] (empty)
 }
*/

try {

	require_once '../preload.php';

	$pavilion_id	= filter_input(INPUT_POST, 'pavilion_id', FILTER_VALIDATE_INT);

	$stmt	= $dbh->prepare('INSERT INTO "Quest" ("PavilionID") VALUES(:pavilion_id)');
	$stmt->bindValue(":pavilion_id", $pavilion_id, PDO::PARAM_INT);
	$flag	= $stmt->execute();
	if (!$flag) {
		exit('failed');
	}

	$stmt		= $dbh->prepare('SELECT "ID","Type" FROM "Quest" WHERE "ID"=:quest_id');
	$stmt->bindValue(":quest_id", $dbh->lastInsertId('Quest'), PDO::PARAM_INT);
	$stmt->execute();

	$quest				= $stmt->fetch(PDO::FETCH_ASSOC);
	$quest['levels']	= array();
	echo json_encode($quest);
	exit;

} catch (Exception $e) {
	Rollbar::report_exception($e);
	die;
}

?>
