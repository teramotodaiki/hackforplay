<?php
/*
関連付けられたExceptionMap-ExceptionDataのサマリーを取得する
Input:	begin , end , (attendance-token)
Output:	parse-error , JSON:{summary_of_exceptions}
{
	values : [
		ID : ExceptionDataのID,
		Code : 例外コード,
		File : 例外をスローしたファイルの名前,
		Line : 例外をスローした行,
		Message : 例外のメッセージ
	]
}
*/

require_once '../preload.php';

try {

	$stmt	= $dbh->prepare('SELECT * FROM "ExceptionData"');
	$stmt->execute();

	$summary_of_exceptions		= new stdClass;
	$summary_of_exceptions->values = $stmt->fetchAll(PDO::FETCH_ASSOC);

	$json = json_encode($summary_of_exceptions);

	if ($json === FALSE) {
		exit('parse-error');
	}
	echo $json;

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
 ?>