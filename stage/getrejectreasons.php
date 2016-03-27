<?php
/*
リジェクトの理由をすべて取得する
Input:	(attendance-token)
Ouput:	JSON{reject_reasons}
reject_reasons :
{
	values : [
		ID : ID,
		Message : 内容
	](,[])
}
*/

require_once '../preload.php';

try {

	$stmt		= $dbh->prepare('SELECT "ID","Message" FROM "RejectReasonData" ORDER BY "ID"');
	$stmt->execute();
	$values		= $stmt->fetchAll(PDO::FETCH_ASSOC);

	$reject_reasons			= new stdClass;
	$reject_reasons->values	= $values;
	echo json_encode($reject_reasons);

} catch (Exception $e) {
	Rollbar::report_exception($e);
	die();
}

?>
