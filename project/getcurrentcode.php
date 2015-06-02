<?php
/*
そのプロジェクトの現在のコードをシリアライズして文字列として取得する
*/
function getCurrentCode($project_id)
{
	global $dbh;

	// 最も新しい(値の大きい)ScriptIDを取得
	$stmt	= $dbh->prepare('SELECT MAX("ID") FROM "Script" WHERE "ProjectID"=:project_id');
	$stmt->bindValue("project_id", $project_id, PDO::PARAM_INT);
	$stmt->execute();
	$script_id	= $stmt->fetch(PDO::FETCH_COLUMN, 0);
	if (empty($script_id)) {
		return ''; // プロジェクトが空
	}

	$stmt	= $dbh->prepare('SELECT "Code"."Value" FROM "Code" INNER JOIN "Line" ON "Line"."CodeID"="Code"."ID" WHERE "Line"."ScriptID"=:script_id ORDER BY "Line"."Line"');
	$stmt->bindValue(":script_id", $script_id, PDO::PARAM_INT);
	$stmt->execute();

	$lines	= $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
	if (empty($lines)) {
		return '';
	}

	$code	= implode("\n", $lines);
	return $code;
}
?>