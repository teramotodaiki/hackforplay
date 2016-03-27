<?php
/*
Restaging中のログを更新する
UserIDが更新可能なら更新する
Input:	token , log:JSON
{
	ExecuteCount	int(11)			0
	SaveCount		int(11)			0
	PublishCount	int(11)			0
	InputNumberCount	int(11)		0
	InputAlphabetCount	int(11)		0
	InputOtherCount	int(11)			0
	PasteCount		int(11)			0
	DeleteCount		int(11)			0
}
Output:	parse-error , invalid-token , error , success
*/

try {

	require_once '../preload.php';

	// トークンの取得
	$token	= filter_input(INPUT_POST, 'token');
	if (!$token) {
		exit('invalid-token');
	}

	// 現在のログの取得
	$stmt		= $dbh->prepare('SELECT "ID","UserID" FROM "RestagingLog" WHERE "Token"=:token');
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->execute();
	$current	= $stmt->fetch(PDO::FETCH_ASSOC);
	if (!$current) {
		exit('invalid-token');
	}

	// 新しいログの取得とパース
	$log	= filter_input(INPUT_POST, 'log');
	if (!$log) {
		exit('parse-error');
	}
	$data	= json_decode($log);
	if (!$data) {
		exit('parse-error');
	}

	// 現在時刻の取得
	date_default_timezone_set('GMT');
	$gmtime	= time();

	// データの更新
	$stmt	= $dbh->prepare('UPDATE "RestagingLog" SET "LastUnixTime"=:LastUnixTime,"ExecuteCount"=:ExecuteCount,"SaveCount"=:SaveCount,"PublishCount"=:PublishCount,"InputNumberCount"=:InputNumberCount,"InputAlphabetCount"=:InputAlphabetCount,"InputOtherCount"=:InputOtherCount,"PasteCount"=:PasteCount,"DeleteCount"=:DeleteCount WHERE "ID"=:current_id');
	$stmt->bindValue(":LastUnixTime", $gmtime, PDO::PARAM_INT);
	$stmt->bindValue(":ExecuteCount", isset($data->ExecuteCount) ? $data->ExecuteCount : 0, PDO::PARAM_INT);
	$stmt->bindValue(":SaveCount", isset($data->SaveCount) ? $data->SaveCount : 0, PDO::PARAM_INT);
	$stmt->bindValue(":PublishCount", isset($data->PublishCount) ? $data->PublishCount : 0, PDO::PARAM_INT);
	$stmt->bindValue(":InputNumberCount", isset($data->InputNumberCount) ? $data->InputNumberCount : 0, PDO::PARAM_INT);
	$stmt->bindValue(":InputAlphabetCount", isset($data->InputAlphabetCount) ? $data->InputAlphabetCount:0, PDO::PARAM_INT);
	$stmt->bindValue(":InputOtherCount", isset($data->InputOtherCount) ? $data->InputOtherCount : 0, PDO::PARAM_INT);
	$stmt->bindValue(":PasteCount", isset($data->PasteCount) ? $data->PasteCount : 0, PDO::PARAM_INT);
	$stmt->bindValue(":DeleteCount", isset($data->DeleteCount) ? $data->DeleteCount : 0, PDO::PARAM_INT);
	$stmt->bindValue(":current_id", $current['ID'], PDO::PARAM_INT);
	$flag	= $stmt->execute();
	if (!$flag) {
		exit('error');
	}

	// ユーザー情報の更新
	if (!$current['UserID']) {
		session_start();
		$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
		session_commit();

		if ($session_userid) {
			$stmt	= $dbh->prepare('UPDATE "RestagingLog" SET "UserID"=:session_userid WHERE "ID"=:current_id');
			$stmt->bindValue(":session_userid", $session_userid, PDO::PARAM_INT);
			$stmt->bindValue(":current_id", $current['ID'], PDO::PARAM_INT);
			$stmt->execute();
		}
	}

	exit('success');

} catch (Exception $e) {
	Rollbar::report_exception($e);
	die();
}

 ?>
