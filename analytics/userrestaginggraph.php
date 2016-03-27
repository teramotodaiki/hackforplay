<?php
/*
 **** 廃止予定 ****
 * ユーザーのRestagingLog情報をCSVフォーマットで書き出す
 *
 * 'UserID','StageID','Mode','BeginUnixTime','LastUnixTime','ExecuteCount','SaveCount','InputNumberCount','InputAlphabetCount','InputOtherCount','PasteCount','DeleteCount'\n
 * {Number},{String},{String},{Number},{Number},{Number},{Number},{Number},{Number},{Number},{Number},{Number}\n
 * {Number},{String},{String},{Number},{Number},{Number},{Number},{Number},{Number},{Number},{Number},{Number}\n
 * ...\n
*/

try {

	require_once '../preload.php';

	$offset		= filter_input(INPUT_GET, 'offset', FILTER_VALIDATE_INT);
	if (!$offset) {
		$offset	= 0;
	}
	$length		= filter_input(INPUT_GET, 'length', FILTER_VALIDATE_INT);
	if (!$length) {
		$length	= 1;
	}

	$fileName = "restaginglog_" . $offset . ".csv";
	header('Content-Type: application/octet-stream');
	header('Content-Disposition: attachment; filename=' . $fileName);

	require_once '../preload.php';

	// RestagingLog
	$stmt	= $dbh->prepare('SELECT "UserID","StageID","Mode","BeginUnixTime","LastUnixTime","ExecuteCount","SaveCount","InputNumberCount","InputAlphabetCount","InputOtherCount","PasteCount","DeleteCount" FROM "RestagingLog" ORDER BY "ID"');
	$stmt->execute();

	// Skip
	for ($i=0; $i < $offset; $i++) {
		$stmt->fetch();
	}

	echo "UserID,StageID,Mode,BeginUnixTime,LastUnixTime,ExecuteCount,SaveCount,InputNumberCount,InputAlphabetCount,InputOtherCount,PasteCount,DeleteCount'\n";

	while (($row = $stmt->fetch(PDO::FETCH_ASSOC)) && ($length-- > 0)) {

		echo implode(',', $row) . "\n";

	}

} catch (Exception $e) {
	die;
}


?>
