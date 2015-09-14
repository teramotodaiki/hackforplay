<?php
/* updatequest.php
 * Questの情報を更新する
 * Input:	id , type , published
 * Output:	invalid-id , invalid-type , success
*/

try {

	require_once '../preload.php';

	// 値の取得とバリデーション
	$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
	if (!$id) {
		exit('invalid-id');
	}
	$type	= filter_input(INPUT_POST, 'type');
	if (array_search($type, ['easy', 'normal', 'hard']) === FALSE) {
		exit('invalid-type');
	}
	$published	= filter_input(INPUT_POST, 'published', FILTER_VALIDATE_BOOLEAN);

	// 更新
	$stmt	= $dbh->prepare('UPDATE "_Quest" SET "Type"=:type,"Published"=:published WHERE "ID"=:id');
	$stmt->bindValue(":id", $id, PDO::PARAM_INT);
	$stmt->bindValue(":type", $type, PDO::PARAM_STR);
	$stmt->bindValue(":published", $published, PDO::PARAM_BOOL);
	$stmt->execute();

	exit('success');


} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
}
?>