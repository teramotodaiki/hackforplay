<?php
/*
Project IDからプロジェクトの情報を取得する
Input:	project_id
Output:	(JSON{information_of_project})
information_of_project:
	data : ソースコードなどのデータ
}
*/

require_once '../preload.php';

$project_id = filter_input(INPUT_POST, 'project_id', FILTER_VALIDATE_INT);
if ($project_id === FALSE || $project_id === NULL) {
	exit();
}

// プロジェクトの情報を取得
try {
	$stmt	= $dbh->prepare('SELECT "Data" FROM "Project" WHERE "ID"=:project_id');
	$stmt->bindValue(":project_id", $project_id, PDO::PARAM_INT);
	$stmt->execute();
	$project = $stmt->fetch(PDO::FETCH_ASSOC);
	if (empty($project)) {
		exit();
	}
} catch (PDOException $e) {
	print_r($e);
	die();
}

// データを格納
$item 	= new stdClass();
$item->data 		= $project['Data'];

// 出力
$json = json_encode($item);

if ($json === FALSE) {
	exit('parse-error');
}

echo $json;

?>