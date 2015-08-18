<?php
/**
 * チュートリアル上でトラッキングされたClearTimeについてCSV形式で出力する
 * フォーマットは以下のようになる
 * 			\t    '101'\t    '102'\t    '103'\t    '104'\t    '105'\t    '106'\t 'NeedHelp'\t   'Registered'\n
 * {AUserID}\t {Number}\t {Number}\t {Number}\t {Number}\t {Number}\t {Number}\t      {0|1}\t {Y/m/d H:i:sZ}\n
 * {AUserID}\t {Number}\t {Number}\t {Number}\t {Number}\t {Number}\t {Number}\t      {0|1}\t {Y/m/d H:i:sZ}\n
 * ...\n
*/

require_once '../preload.php';

try {

	$delimiter	= "\t";
	echo '<pre>';

	// Column name
	$column_name = ['', '101', '102', '103', '104', '105', '106', 'NeedHelp', 'Registered'];
	echo implode($delimiter, $column_name) . "\n";

	// User loops
	$stmt_user	= $dbh->prepare('SELECT "ID","HelpFlag","Registered" FROM "AnonymousUser" WHERE "HelpFlag" >= 0 ORDER BY "Registered"');
	$stmt_data	= $dbh->prepare('SELECT "StageID","ClearTime" FROM "AnonymousUserData" WHERE "AUserID"=:user_id ORDER BY "StageID"');

	$stmt_user->execute();
	for ($row 	= $stmt_user->fetch(PDO::FETCH_ASSOC); $row;
		 $row 	= $stmt_user->fetch(PDO::FETCH_ASSOC))
	{
		// Output
		echo $row['ID'] . $delimiter; // AUser ID

		$stmt_data->bindValue(":user_id", $row['ID'], PDO::PARAM_INT);
		$stmt_data->execute();

		// StageIDでグループ化されたClearTime
		$data	= $stmt_data->fetchAll(PDO::FETCH_COLUMN | PDO::FETCH_GROUP | PDO::FETCH_UNIQUE);
		for ($i=101; $i <= 106; $i++) {
			if (isset($data[$i])) {
				echo $data[$i] . $delimiter; // 101-106
			} else {
				echo 'NULL' . $delimiter;
			}
		}

		echo $row['HelpFlag'] . $delimiter; // Need Help flag
		echo $row['Registered'] . $delimiter; // Registered formated time

		echo "\n";
	}

	echo '</pre>';


} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}

?>