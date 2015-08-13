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

	// ログをパース
	$log		= json_decode($log_json);

	// Clear Time
	$keys_clear	= array();
	$filt_clear	= array_filter($log->values, function($item) use (&$keys_clear) {
		$flag	= $item->field === 'clear' && !in_array($item->stageid, $keys_clear);
		if ($flag) {
			array_push($keys_clear, $item->stageid);
		}
		return $flag;
	});
	foreach ($filt_clear as $key => $item) {
		// STARTのタイムスタンプを求める（CLEAR以下で最大）
		$start_timestamp = 0;
		foreach ($log->values as $log_key => $log_item) {
			if (	$log_item->stageid === $item->stageid &&
					$log_item->field === 'start' &&
					$log_item->value < $item->value) {

				$start_timestamp = max($start_timestamp, $log_item->value);
			}
		}
		$data[$item->stageid] = new stdClass;
		$data[$item->stageid]->clearTime 	= $item->value - $start_timestamp; // 秒数
	}

	// HELP Flag
	$filt_help	= array_filter($log->values, function($item) {
		return $item->field === 'help';
	});
	$help_flag	= count($filt_help) > 0 ? $filt_help[max(array_keys($filt_help))]->value : NULL;

	var_dump($data);
	var_dump($help_flag);

} catch (Exception $e) {

	require_once '../exception/tracedata.php';
	traceData($e);
	die('database-error');
}
?>