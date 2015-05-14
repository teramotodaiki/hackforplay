<?php
/*
新規コミットを登録する、テストのためのAPI
Input:	code
Output:	failed , success
*/

require_once '../preload.php';

$test_project_id	= 0;

// 現時点でのコードを、差分から復元する。Append=0は1行目を表しているため、そのまま[0]に格納する
$old_code	= array();
try {
	$stmt	= $dbh->prepare('SELECT "LineNum" FROM "Difference" WHERE "ProjectID"=:test_project_id ORDER BY "ID" DESC');
	$stmt->bindValue("test_project_id", $test_project_id, PDO::PARAM_INT);
	$stmt->execute();
	$recent	= $stmt->fetch(PDO::FETCH_ASSOC);
	if (empty($recent)) {
		$recent	= array('LineNum' => 0);
	}

	$stmt	= $dbh->prepare('SELECT "CodeID" FROM "Line" WHERE "Append"=:each_line AND "DifferenceID" IN (SELECT "ID" FROM "Difference" WHERE "ProjectID"=:test_project_id) ORDER BY "DifferenceID" DESC');
	for ($each_line=0; $each_line < $recent['LineNum']; $each_line++) {
		$stmt->bindValue(":each_line", $each_line, PDO::PARAM_INT);
		$stmt->bindValue(":test_project_id", $test_project_id, PDO::PARAM_INT);
		$stmt->execute();
		$old_code[$each_line]	= $stmt->fetch(PDO::FETCH_ASSOC);
	}

} catch (PDOException $e) {
	print_r($e);
	die();
}

// 新しいコードのCodeIDを取得する
$code 			= filter_input(INPUT_POST, 'code');
if($code === NULL || $code === FALSE){
	exit('failed');
}
$new_code			= array();
try {
	$code_exp		= explode("\n", $code);

	$stmt_se_code	= $dbh->prepare('SELECT "ID" AS "CodeID" FROM "Code" WHERE "Value"=:value');
	$stmt_in_code	= $dbh->prepare('INSERT INTO "Code" ("Value") VALUES(:value)');
	foreach ($code_exp as $key => $value) {

		// 1.Code.IDの取得をこころみる
		$stmt_se_code->bindValue(":value", $value, PDO::PARAM_STR);
		$stmt_se_code->execute();
		$new_code[$key]	= $stmt_se_code->fetch(PDO::FETCH_ASSOC);

		if (empty($new_code[$key])) {
			// 2.Codeを追加し、IDを取得する
			$stmt_in_code->bindValue(":value", $value, PDO::PARAM_STR);
			$stmt_in_code->execute();
			$new_code[$key] = array('CodeID' => $dbh->lastInsertId('Code'));
		}
	}
} catch (PDOException $e) {
	print_r($e);
	die();
}

// 差分を管理するテーブルを作成
try {
	$stmt		= $dbh->prepare('INSERT INTO "Difference" ("ProjectID","LineNum","Registered") VALUES(:test_project_id,:line,:empty)');
	$stmt->bindValue(":test_project_id", $test_project_id, PDO::PARAM_INT);
	$stmt->bindValue(":line", count($new_code), PDO::PARAM_INT);
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

// 差分を求める
$stmt_append	= $dbh->prepare('INSERT INTO "Line" ("DifferenceID","Append","CodeID") VALUES(:difference_id,:line,:code_id)');
$stmt_remove	= $dbh->prepare('INSERT INTO "Line" ("DifferenceID","Remove","CodeID") VALUES(:difference_id,:line,:code_id)');
$stmt_move		= $dbh->prepare('INSERT INTO "Line" ("DifferenceID","Remove","Append","CodeID") VALUES(:difference_id,:before,:after,:code_id)');
$stmt_append->bindValue(":difference_id", $difference['ID'], PDO::PARAM_INT);
$stmt_remove->bindValue(":difference_id", $difference['ID'], PDO::PARAM_INT);
$stmt_move->bindValue(":difference_id", $difference['ID'], PDO::PARAM_INT);
try {
	$old_code_cursor	= 0;
	$new_code_cursor	= 0;
	$loop	= max($old_code_length = count($old_code), $new_code_length = count($new_code));
	for ($line=0; $line < $loop; $line++) {
		if (isset($old_code[$line])) {
			// 1.$old_code[$line]と一致する、現在の行より前の$new_lineを探索
			for ($i=$new_code_cursor; $i < $line && $i < $new_code_length; $i++) {
				if ($old_code[$line] === $new_code[$i]) {
					// 一致：Old->New'へMove
					for (; $old_code_cursor < $line; $old_code_cursor++) {
						$stmt_remove->bindValue(":line", $old_code_cursor, PDO::PARAM_INT);
						$stmt_remove->bindValue(":code_id", $old_code[$old_code_cursor]['CodeID'], PDO::PARAM_INT);
						$stmt_remove->execute();
					}
					for (; $new_code_cursor < $i; $new_code_cursor++) {
						$stmt_append->bindValue(":line", $new_code_cursor, PDO::PARAM_INT);
						$stmt_append->bindValue(":code_id", $new_code[$new_code_cursor]['CodeID'], PDO::PARAM_INT);
						$stmt_append->execute();
					}
					$stmt_move->bindValue(":before", $old_code_cursor, PDO::PARAM_INT);
					$stmt_move->bindValue(":after", $new_code_cursor, PDO::PARAM_INT);
					$stmt_move->execute();
					$old_code_cursor++;
					$new_code_cursor++;
					continue;
				}
			}
		}
		if (isset($old_code[$line]) && isset($new_code[$line])) {
			// 2.$old_code[$line]と$new_code[$line]が一致するか調べる
			if ($old_code[$line] === $new_code[$line]) {
				// 一致：Old->NewへMove
				for (; $old_code_cursor < $line; $old_code_cursor++) {
					$stmt_remove->bindValue(":line", $old_code_cursor, PDO::PARAM_INT);
					$stmt_remove->bindValue(":code_id", $old_code[$old_code_cursor]['CodeID'], PDO::PARAM_INT);
					$stmt_remove->execute();
				}
				for (; $new_code_cursor < $line; $new_code_cursor++) {
					$stmt_append->bindValue(":line", $new_code_cursor, PDO::PARAM_INT);
					$stmt_append->bindValue(":code_id", $new_code[$new_code_cursor]['CodeID'], PDO::PARAM_INT);
					$stmt_append->execute();
				}
				$old_code_cursor++;
				$new_code_cursor++;
				continue;
			}
		}
		if (isset($new_code[$line])) {
			// 3.$new_code[$line]と一致する、現在の行より前の$old_lineを探索
			for ($i=$old_code_cursor; $i < $line && $i < $old_code_length; $i++) {
				if ($new_code[$line] === $old_code[$i]) {
					// 一致：Old'->NewへMove
					for (; $old_code_cursor < $i; $old_code_cursor++) {
						$stmt_remove->bindValue(":line", $old_code_cursor, PDO::PARAM_INT);
						$stmt_remove->bindValue(":code_id", $old_code[$old_code_cursor]['CodeID'], PDO::PARAM_INT);
						$stmt_remove->execute();
					}
					for (; $new_code_cursor < $line; $new_code_cursor++) {
						$stmt_append->bindValue(":line", $new_code_cursor, PDO::PARAM_INT);
						$stmt_append->bindValue(":code_id", $new_code[$new_code_cursor]['CodeID'], PDO::PARAM_INT);
						$stmt_append->execute();
					}
					$stmt_move->bindValue(":before", $old_code_cursor, PDO::PARAM_INT);
					$stmt_move->bindValue(":after", $new_code_cursor, PDO::PARAM_INT);
					$stmt_move->execute();
					$old_code_cursor++;
					$new_code_cursor++;
					continue;
				}
			}
		}
	}
	for (; $old_code_cursor < $old_code_length; $old_code_cursor++) {
		$stmt_remove->bindValue(":line", $old_code_cursor, PDO::PARAM_INT);
		$stmt_remove->bindValue(":code_id", $old_code[$old_code_cursor]['CodeID'], PDO::PARAM_INT);
		$stmt_remove->execute();
	}
	for (; $new_code_cursor < $new_code_length; $new_code_cursor++) {
		$stmt_append->bindValue(":line", $new_code_cursor, PDO::PARAM_INT);
		$stmt_append->bindValue(":code_id", $new_code[$new_code_cursor]['CodeID'], PDO::PARAM_INT);
		$stmt_append->execute();
	}
} catch (PDOException $e) {
	print_r($e);
	die();
}

exit('success');

?>