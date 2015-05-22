<?php
function getCurrentCodeAsCache($project_id)
{
	global $dbh;

	// 最も新しい(値の大きい)ScriptIDを取得
	$stmt			= $dbh->prepare('SELECT MAX("ID") FROM "Script" WHERE "ProjectID"=:project_id');
	$stmt->bindValue("project_id", $project_id, PDO::PARAM_INT);
	$stmt->execute();
	$script_id		= $stmt->fetch(PDO::FETCH_COLUMN, 0);

	if (!$script_id) {
		// プロジェクトがまだ空の場合、親プロジェクトのプロジェクトの最新のコミットを利用
		$stmt		= $dbh->prepare('SELECT "ParentID" FROM "Project" WHERE "ProjectID"=:project_id');
		$stmt->bindValue("project_id", $project_id, PDO::PARAM_INT);
		$stmt->execute();
		$parent_id	= $stmt->fetch(PDO::FETCH_COLUMN, 0);
		if (!$parent_id) {
			return array(); // キャッシュなし
		}
		// 最も新しい(値の大きい)ScriptIDを取得
		$stmt			= $dbh->prepare('SELECT MAX("ID") FROM "Script" WHERE "ProjectID"=:parent_id');
		$stmt->bindValue("parent_id", $parent_id, PDO::PARAM_INT);
		$stmt->execute();
		$script_id		= $stmt->fetch(PDO::FETCH_COLUMN, 0);
		if (!$script_id) {
			return array();
		}
	}

	$stmt			= $dbh->prepare('SELECT "Code"."Value","Code"."ID" FROM "Code" INNER JOIN "Line" ON "Line"."CodeID"="Code"."ID" WHERE "Line"."ScriptID"=:script_id ORDER BY "Line"."Line"');
	$stmt->bindValue(":script_id", $script_id, PDO::PARAM_INT);
	$stmt->execute();

	$result			= $stmt->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_COLUMN | PDO::FETCH_UNIQUE);
	return $result;
}
?>