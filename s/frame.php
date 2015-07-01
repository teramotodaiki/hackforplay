<?php
/*
/s のビューにある iframe がロードするスクリプト。ゲームの起点
Input:	file
file: ゲームのスクリプトファイル。 /s/{file} となるような相対パスで記述する
*/

require_once '../preload.php';

try {

	$file	= filter_input(INPUT_GET, 'file');

	include dirname(__FILE__) . '/' . $file;

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	exit('Error loading frame');
}

?>