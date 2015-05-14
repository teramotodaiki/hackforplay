<?php
/*
そのプロジェクトの現在のコードをシリアライズして文字列として取得する
*/
function getCurrentCode($project_id)
{
	global $dbh;

	$stmt	= $dbh->prepare('SELECT "LineNum" FROM "Difference" WHERE "ProjectID"=:project_id ORDER BY "ID" DESC');
	$stmt->bindValue("project_id", $project_id, PDO::PARAM_INT);
	$stmt->execute();
	$recent	= $stmt->fetch(PDO::FETCH_ASSOC);
	if (empty($recent)) {
		$recent	= array('LineNum' => 0);
	}

	$stmt	= $dbh->prepare('SELECT "Value" FROM "Line" INNER JOIN "Code" ON "Line"."CodeID"="Code"."ID" WHERE "Append"=:each_line AND "DifferenceID" IN (SELECT "ID" FROM "Difference" WHERE "ProjectID"=:project_id) ORDER BY "DifferenceID" DESC');
	for ($each_line=0; $each_line < $recent['LineNum']; $each_line++) {
		$stmt->bindValue(":each_line", $each_line, PDO::PARAM_INT);
		$stmt->bindValue(":project_id", $project_id, PDO::PARAM_INT);
		$stmt->execute();
		$lines[$each_line]	= $stmt->fetch(PDO::FETCH_COLUMN, 0);
	}

	$code	= implode("\n", $lines);
	return $code;
}

 ?>