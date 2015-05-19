<?php
function getCurrentCodeAsCache($project_id)
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

	$stmt	= $dbh->prepare('SELECT "Code"."Value","Code"."ID" FROM "Code" INNER JOIN "Line" ON "Line"."CodeID"="Code"."ID" WHERE "Line"."ScriptID"=:script_id ORDER BY "Line"."Line"');
	$stmt->bindValue(":script_id", $script_id, PDO::PARAM_INT);
	$stmt->execute();

	$result			= $stmt->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_COLUMN | PDO::FETCH_UNIQUE);
	return $result;
}
?>