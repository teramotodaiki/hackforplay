<?php
/*
新規コミットを登録する、テストのためのAPI
Input:	code
Output:	failed , success
*/

require_once '../preload.php';

$test_project_id	= 0;

// コードを取得
$code 		= filter_input(INPUT_POST, 'code');
if($code === NULL || $code === FALSE){
	exit('failed');
}
$code_exp	= explode("\n", $code);

// 差分を作成
try {
	$stmt		= $dbh->prepare('INSERT INTO "Difference" ("ProjectID", "Registered") VALUES(:test_project_id,:empty)');
	$stmt->bindValue(":test_project_id", $test_project_id, PDO::PARAM_INT);
	$stmt->bindValue(":empty", '', PDO::PARAM_STR);
	$stmt->execute();
	$difference	= array('ID' => $dbh->lastInsertId('Code'));
	if (empty($difference['ID'])) {
		exit('failed');
	}
} catch (PDOException $e) {
	print_r($e);
	die();
}

// 全てAppendでLineに記録
$stmt_se_code	= $dbh->prepare('SELECT "ID" FROM "Code" WHERE "Value"=:value');
$stmt_in_code	= $dbh->prepare('INSERT INTO "Code" ("Value") VALUES(:value)');
$stmt_in_line	= $dbh->prepare('INSERT INTO "Line" ("DifferenceID","Append","CodeID") VALUES(:difference_id,:append,:code_id)');
try {
	foreach ($code_exp as $key => $value) {

		// 1.Code.IDを取得する
		$stmt_se_code->bindValue(":value", $value, PDO::PARAM_STR);
		$stmt_se_code->execute();
		$unique_code	= $stmt_se_code->fetch(PDO::FETCH_ASSOC);

		if (empty($unique_code)) {
			// 2.Codeを追加し、IDを取得する
			$stmt_in_code->bindValue(":value", $value, PDO::PARAM_STR);
			$stmt_in_code->execute();
			$unique_code = array('ID' => $dbh->lastInsertId('Code'));
		}

		// 3.Lineに新しい行を追加する
		$stmt_in_line->bindValue(":difference_id", $difference['ID'], PDO::PARAM_INT);
		$stmt_in_line->bindValue(":append", $key + 1, PDO::PARAM_INT);
		$stmt_in_line->bindValue(":code_id", $unique_code['ID'], PDO::PARAM_INT);
		$stmt_in_line->execute();
	}
} catch (PDOException $e) {
	print_r($e);
	die();
}

exit('success');

?>