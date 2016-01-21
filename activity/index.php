<?php
/**
 * ユーザーの時系列データを受け取る
 * Input: list{JSON}
 * Output: OK , NG
*/

try {

	require_once '../preload.php';

	$json = filter_input(INPUT_POST, 'list');
	if (!$json) exit('NG');

	$list = json_decode($json);
	if (!$list) exit('NG');

	foreach ($list as $index => $row) {

	}

	exit();



} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}

?>
