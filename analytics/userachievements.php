<?php
/*
 * ユーザーの実績数をCSVフォーマットで書き出す このデータはすべてUserごとにまとめられている
 *
 * 	    'ID',   'P_CR',  'P_CnR',  'P_nCR', 'P_nCnR',   'Q_CR',  'Q_CnR',  'Q_nCR', 'Q_nCnR',    'L_C',   'L_nC'\n
 * {UserID}	, {Number}, {Number}, {Number}, {Number}, {Number}, {Number}, {Number}, {Number}, {Number}, {Number}\n
 * {UserID}	, {Number}, {Number}, {Number}, {Number}, {Number}, {Number}, {Number}, {Number}, {Number}, {Number}\n
 * ...\n
*/

try {

	$offset		= filter_input(INPUT_GET, 'offset', FILTER_VALIDATE_INT);
	if (!$offset) {
		$offset	= 0;
	}
	$length		= filter_input(INPUT_GET, 'length', FILTER_VALIDATE_INT);
	if (!$length) {
		$length	= 1;
	}

	$fileName = "achievements_" . $offset . ".csv";
	header('Content-Type: application/octet-stream');
	header('Content-Disposition: attachment; filename=' . $fileName);

	require_once '../preload.php';

	// User
	$stmt_usr	= $dbh->prepare('SELECT DISTINCT "UserID" FROM "LevelUserMap" ORDER BY "UserID"');
	$stmt_usr->execute();

	// Achievements
	$stmt_pav	= $dbh->prepare('SELECT "Certified","Restaged" FROM "PavilionUserMap" WHERE "UserID"=:user_id');
	$stmt_que	= $dbh->prepare('SELECT "Cleared","Restaged" FROM "QuestUserMap" WHERE "UserID"=:user_id');
	$stmt_lev	= $dbh->prepare('SELECT "Cleared" FROM "LevelUserMap" WHERE "UserID"=:user_id');

	// Skip
	for ($i=0; $i < $offset; $i++) {
		$stmt_usr->fetch();
	}

	$column = array('ID', 'P_CR', 'P_CnR', 'P_nCR', 'P_nCnR', 'Q_CR', 'Q_CnR', 'Q_nCR', 'Q_nCnR', 'L_C', 'L_nC');

	echo implode(',', $column) . "\n";

	while (($user_id = $stmt_usr->fetch(PDO::FETCH_COLUMN)) && ($length-- > 0)) {

		$user = array_fill_keys($column, 0);
		$user['ID'] = $user_id;

		// Pavilion
		$stmt_pav->bindValue(":user_id", $user_id, PDO::PARAM_INT);
		$stmt_pav->execute();
		while ($row = $stmt_pav->fetch(PDO::FETCH_ASSOC)) {
			if ($row['Certified'] && $row['Restaged']) {
				$user['P_CR'] ++;
			} elseif ($row['Certified'] && !$row['Restaged']) {
				$user['P_CnR'] ++;
			} elseif (!$row['Certified'] && $row['Restaged']) {
				$user['P_nCR'] ++;
			} elseif (!$row['Certified'] && !$row['Restaged']) {
				$user['P_nCnR'] ++;
			}
		}

		// Quest
		$stmt_que->bindValue(":user_id", $user_id, PDO::PARAM_INT);
		$stmt_que->execute();
		while ($row = $stmt_que->fetch(PDO::FETCH_ASSOC)) {
			if ($row['Cleared'] && $row['Restaged']) {
				$user['Q_CR'] ++;
			} elseif ($row['Cleared'] && !$row['Restaged']) {
				$user['Q_CnR'] ++;
			} elseif (!$row['Cleared'] && $row['Restaged']) {
				$user['Q_nCR'] ++;
			} elseif (!$row['Cleared'] && !$row['Restaged']) {
				$user['Q_nCnR'] ++;
			}
		}

		// Level
		$stmt_lev->bindValue(":user_id", $user_id, PDO::PARAM_INT);
		$stmt_lev->execute();
		while ($row = $stmt_lev->fetch(PDO::FETCH_ASSOC)) {
			if ($row['Cleared']) {
				$user['L_C'] ++;
			} elseif (!$row['Cleared']) {
				$user['L_nC'] ++;
			}
		}

		echo implode(',', $user) . "\n";
	}

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
}


?>