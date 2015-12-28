<?php
try {

	error_reporting(0);
	$dbh = new PDO ( "sqlsrv:server = tcp:yadw63xtf8.database.secure.windows.net,1433; Database = hackforplay-staging", "hackforplay@yadw63xtf8", "9PFLn21u9TkiqlKx3ceAbawXSGsBPGT");
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
			$stmt		= $dbh->prepare('SELECT "ParentID" FROM "Project" WHERE "ID"=:project_id');
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

	// キューから取り出し
	$stmt_stock = $dbh->prepare('SELECT "ID","Project","Code","Publish","Registered","Thumbnail","NewStage" FROM "CodeStock" ORDER BY "ID" DESC');
	$stmt_stock->execute();

	$project_id_cache = array();
	$code_cache = array();
	$stmt_se_code	= $dbh->prepare('SELECT "ID" AS "CodeID" FROM "Code" WHERE "Value"=:value');
	$stmt_in_code	= $dbh->prepare('INSERT INTO "Code" ("Value") VALUES(:value)');
	while ($row = $stmt_stock->fetch(PDO::FETCH_ASSOC)) {
		// すでに更新されたProject ID?
		if (array_search($row['Project'], $project_id_cache) !== FALSE) continue;
		array_push($project_id_cache, $row['Project']);

		// 古いコードのValue-IDテーブルをキャッシュのためにロード
		$current_code = getCurrentCodeAsCache($row['Project']);
		$code_cache = array_merge($current_code, $code_cache);

		// current_codeと全く同じなら除外
		if (implode("\n", $current_code) === $row['Code']) continue; // No change

		$new_code = explode("\n", $row['Code']);
		$new_code_count = count($new_code);
		$new_index = array();
		foreach ($new_code as $key => $value) {
			// 0.old codeの配列に「同じ行」がないか調べる（キャッシュ）
			if (isset($code_cache[$value])) {
				$new_index[$key]	= $code_cache[$value];
				continue;
			}
			// 1.Code.IDの取得をこころみる
			$stmt_se_code->bindValue(":value", $value, PDO::PARAM_STR);
			$stmt_se_code->execute();
			$new_index[$key]	= $stmt_se_code->fetch(PDO::FETCH_COLUMN, 0);

			if (empty($new_index[$key])) {
				// 2.Codeを追加し、IDを取得する
				$stmt_in_code->bindValue(":value", $value, PDO::PARAM_STR);
				$stmt_in_code->execute();
				$new_index[$key] = $dbh->lastInsertId('Code');
			}
			// その行もキャッシュ
			$code_cache[$value] = $new_index[$key];
		}

		// データを格納
		$stmt	= $dbh->prepare('INSERT INTO "Script" ("ProjectID","LineNum","Thumbnail","Registered") VALUES(:project_id,:line,:thumb_url,:registered)');
		$stmt->bindValue(":project_id", $row['Project'], PDO::PARAM_INT);
		$stmt->bindValue(":line", $new_code_count, PDO::PARAM_INT);
		$stmt->bindValue(":thumb_url", $row['Thumbnail'], PDO::PARAM_STR);
		$stmt->bindValue(":registered", $row['Registered'], PDO::PARAM_STR);
		$result = $stmt->execute();
		if (!$result) continue; // 失敗
		$script_id = $dbh->lastInsertId('Script');

		$insertion_max	= 500; // 一度に挿入できる最大数
		for ($offset_index=0; $offset_index < $new_code_count; $offset_index += $insertion_max) {

			$once			= array_slice($new_index, $offset_index, $insertion_max); // max以下の個数を取得(添え字は0から)
			$placeHolder	= array_fill(0, count($once), '(?,?,?)');
			$stmt	= $dbh->prepare('INSERT INTO "Line"("ScriptID","Line","CodeID") VALUES' . implode(',', $placeHolder));
			foreach ($once as $key => $value) {
				$stmt->bindValue($key * 3 + 1, $script_id, PDO::PARAM_INT);
				$stmt->bindValue($key * 3 + 2, $key + $offset_index, PDO::PARAM_INT);
				$stmt->bindValue($key * 3 + 3, $value, PDO::PARAM_INT);
			}
			$stmt->execute();
		}
	}

	exit('success ' . date('Y-m-d H:i:s'));

} catch (Exception $e) {
	die($e->getMessage() . date(' Y-m-d H:i:s'));
}
?>