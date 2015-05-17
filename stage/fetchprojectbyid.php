<?php
/*
Project IDからプロジェクトの情報を取得する
Input:	project_id
Output:	(JSON{information_of_project})
information_of_project:
	data : ソースコードなどのデータ
}
*/

require_once '../preload.php';

try {

	$project_id = filter_input(INPUT_POST, 'project_id', FILTER_VALIDATE_INT);
	if ($project_id === FALSE || $project_id === NULL) {
		exit();
	}

	// プロジェクトの情報を取得
	require_once '../project/getcurrentcode.php';
	$code	= getCurrentCode($project_id);

	// データを格納
	$item 		= new stdClass();
	$item->data = $code;

	// 出力
	$json = json_encode($item);

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