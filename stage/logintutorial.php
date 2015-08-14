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

	/**
	* AnonymousUserDataのパラメータリスト
	*/
	class AnonymousUserData
	{
		public $clearTime = NULL;
		public $useHint = NULL;
	}

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
		$data[$item->stageid] = new AnonymousUserData;
		$data[$item->stageid]->clearTime 	= $item->value - $start_timestamp; // 秒数
	}

	// Hintをみたかどうか 1/0(プロパティなし)
	foreach ($log->values as $key => $value) {
		if ($value->field === 'hint') {
			// ないばあいはdataを挿入
			if (!isset($data[$value->stageid])) {
				$data[$value->stageid] = new AnonymousUserData;
			}
			$data[$value->stageid]->useHint = 1;
		}
	}

	// HELP Flag
	$filt_help	= array_filter($log->values, function($item) {
		return $item->field === 'help';
	});
	$help_flag	= count($filt_help) > 0 ? $filt_help[max(array_keys($filt_help))]->value : NULL;


	// ユーザーデータの更新

	// ユーザーの取得or作成
	$collationg_key = filter_input(INPUT_POST, 'key');
	$stmt			= $dbh->prepare('SELECT "ID","HelpFlag" FROM "AnonymousUser" WHERE "CollatingKey"=:collationg_key');
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

	// HELPフラグの更新
	if ($help_flag !== NULL &&
		!($anonymous_user && $help_flag === $anonymous_user['HelpFlag'])) {

		$stmt		= $dbh->prepare('UPDATE "AnonymousUser" SET "HelpFlag"=:help_flag WHERE "ID"=:user_id');
		$stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
		$stmt->bindValue(":help_flag", $help_flag, PDO::PARAM_BOOL);
		$stmt->execute();
	}

	// トラッキングデータの更新
	$stmt			= $dbh->prepare('SELECT "StageID","ID","AUserID","ClearTime","UseHint" FROM "AnonymousUserData" WHERE "AUserID"=:user_id');
	$stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
	$stmt->execute();
	$current		= $stmt->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_ASSOC | PDO::FETCH_UNIQUE); // StageIDでグループ化

	foreach ($data as $stageid => $value) {

		// 差分を調査
		if (!array_key_exists($stageid, $current)) {

			// まだレコードがない 新しく挿入
			$stmt	= $dbh->prepare('INSERT INTO "AnonymousUserData" ("AUserID","StageID","ClearTime","UseHint") VALUES(:user_id,:stageid,:cleartime)');
			$stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
			$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
			$stmt->bindValue(":cleartime", $value->clearTime, PDO::PARAM_INT);
			$stmt->bindValue(":usehint", $value->useHint, PDO::PARAM_INT);
			$stmt->execute();
		} elseif (	$value->clearTime !== $current[$stageid]['ClearTime'] ||
					$value->useHint !== $current[$stageid]['UseHint']) {

			var_dump($current[$stageid]['ID']);

			// レコードが存在する データが異なれば上書き
			$stmt	= $dbh->prepare('UPDATE "AnonymousUserData" SET "ClearTime"=:cleartime,"UseHint"=:usehint WHERE "ID"=:current_id');
			$stmt->bindValue(":cleartime", $value->clearTime, PDO::PARAM_INT);
			$stmt->bindValue(":usehint", $value->useHint, PDO::PARAM_INT);
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