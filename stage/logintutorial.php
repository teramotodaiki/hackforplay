<?php
/*
チュートリアルのログをつける. anonymousユーザを作成し、セッションをつくる
Input:	key, log:JSON
Output:
log :
{
	values: [
		{
			stageid: ステージID,
			field: フィールドの識別子,
			value: フィールドの値
		},,,
	]
}
*/

require_once '../preload.php';

try {

	$log_json	= filter_input(INPUT_POST, 'log');

	$log		= json_decode($log_json);

	var_dump($log);

} catch (Exception $e) {

	require_once '../exception/tracedata.php';
	traceData($e);
	die('database-error');
}
?>