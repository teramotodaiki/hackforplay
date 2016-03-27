<?php
/*
 **** 廃止予定 ****
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

	$begin	= filter_input(INPUT_POST, "begin");
	$end	= filter_input(INPUT_POST, "end");

	$stmt	= $dbh->prepare('SELECT * FROM "ExceptionData" WHERE "ID" IN (SELECT DISTINCT "DataID" FROM "ExceptionMap" WHERE "Registered">:_begin AND "Registered"<:end)');
	$stmt->bindValue(":_begin", $begin, PDO::PARAM_STR);
	$stmt->bindValue(":end", $end, PDO::PARAM_STR);
	$stmt->execute();

	$summary_of_exceptions		= new stdClass;
	$summary_of_exceptions->values = $stmt->fetchAll(PDO::FETCH_ASSOC);

	$json = json_encode($summary_of_exceptions);
	if ($json === FALSE) {
		exit('parse-error');
	}
	echo $json;

} catch (Exception $e) {
	die();
}
 ?>
