<?php
/*
Message, Code, File, Lineの組み合わせでテーブルに格納し、Attendanceとひも付けて例外を格納する
*/
function setExceptionData($exception, $token=NULL)
{
	global $dbh;

	// Exceptionを探索
	$stmt	= $dbh->prepare('SELECT "ID" FROM "ExceptionData" WHERE "Message"=:message AND "Code"=:code AND "File"=:flie AND "Line"=:line');
	$stmt->bindValue(":message", $exception->getMessage(), PDO::PARAM_STR);
	$stmt->bindValue(":code", $exception->getCode(), PDO::PARAM_INT);
	$stmt->bindValue(":flie", $exception->getFile(), PDO::PARAM_STR);
	$stmt->bindValue(":line", $exception->getLine(), PDO::PARAM_INT);
	$stmt->execute();
	$ex_id	= $stmt->fetch(PDO::FETCH_COLUMN, 0);

	if (empty($ex_id)) {
		// 新しくExceptionを追加
		$stmt	= $dbh->prepare('INSERT INTO "ExceptionData"("Message","Code","File","Line") VALUES(:message,:code,:flie,:line)');
		$stmt->bindValue(":message", $exception->getMessage(), PDO::PARAM_STR);
		$stmt->bindValue(":code", $exception->getCode(), PDO::PARAM_INT);
		$stmt->bindValue(":flie", $exception->getFile(), PDO::PARAM_STR);
		$stmt->bindValue(":line", $exception->getLine(), PDO::PARAM_INT);
		$stmt->execute();
		$ex_id	= $dbh->lastInsertId('ExceptionData');
	}

	// AttendanceIDを取得
	$attendance_id		= NULL;
	if ($token !== NULL) {
		$stmt	= $dbh->prepare('SELECT "ID" FROM  "Attendance" WHERE "Token"=:token');
		$stmt->bindValue(":token", $token, PDO::PARAM_STR);
		$stmt->execute();
		$attendance_id	= $stmt->fetch(PDO::FETCH_COLUMN, 0);
		if (!$attendance_id) {
			$attendance_id	= NULL;
		}
	}
	// Mapにひも付け
	$stmt	= $dbh->prepare('INSERT INTO "ExceptionMap"("AttendanceID","DataID","gmt") VALUES(:attendance_id,:ex_id,:gmt)');
	$stmt->bindValue(":attendance_id", $attendance_id, PDO::PARAM_INT);
	$stmt->bindValue(":ex_id", $ex_id, PDO::PARAM_INT);
	$stmt->bindValue(":gmt", gmdate('Y-m-d H:i:s'));
	$flag	= $stmt->execute();

	return $flag;
}

?>