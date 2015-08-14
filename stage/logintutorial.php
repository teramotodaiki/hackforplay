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
	$data		= array();

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


	// ユーザーデータの更新

	// ユーザーの取得or作成
	$collationg_key = filter_input(INPUT_POST, 'key');
	$stmt			= $dbh->prepare('SELECT "ID" FROM "AnonymousUser" WHERE "CollatingKey"=:collationg_key');
	$stmt->bindValue(":collationg_key", $collationg_key, PDO::PARAM_STR);
	$stmt->execute();

	$anonymous_user	= $stmt->fetch(PDO::FETCH_ASSOC);

	if ($anonymous_user) {

		$user_id	= $anonymous_user['ID'];
	} else {

		// ユーザーが存在しない ユーザーを作成
		$stmt		= $dbh->prepare('INSERT INTO "AnonymousUser" ("CollatingKey") VALUES(:collationg_key)');
		$stmt->bindValue(":collationg_key", $collationg_key, PDO::PARAM_STR);
		$stmt->execute();
		$user_id	= $dbh->lastInsertId('AnonymousUser');
	}

	// 更新
	$stmt			= $dbh->prepare('SELECT "StageID","ID","AUserID","ClearTime","UseHint" FROM "AnonymousUserData" WHERE "AUserID"=:user_id');
	$stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
	$stmt->execute();
	$current		= $stmt->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_ASSOC | PDO::FETCH_UNIQUE); // StageIDでグループ化

	foreach ($data as $stageid => $value) {

		// 差分を調査
		if (!array_key_exists($stageid, $current)) {

			// まだレコードがない 新しく挿入
			$stmt	= $dbh->prepare('INSERT INTO "AnonymousUserData" ("AUserID","StageID","ClearTime") VALUES(:user_id,:stageid,:cleartime)');
			$stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
			$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
			$stmt->bindValue(":cleartime", $value->clearTime, PDO::PARAM_INT);
			$stmt->execute();
		} elseif ($value->clearTime !== $current[$stageid]['ClearTime']) {

			// レコードが存在する データが異なれば上書き
			$stmt	= $dbh->prepare('UPDATE "AnonymousUserData" SET "ClearTime"=:cleartime WHERE "ID"=:current_id');
			$stmt->bindValue(":cleartime", $value->clearTime, PDO::PARAM_INT);
			$stmt->bindValue(':current_id', $current[$stageid]['ID'], PDO::PARAM_INT);
			$stmt->execute();
		}
	}

} catch (Exception $e) {

	require_once '../exception/tracedata.php';
	traceData($e);
	die('database-error');
}
?>