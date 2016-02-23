<?php
// Set raw code

$limit = filter_input(INPUT_GET, 'limit');
if (!$limit) { exit('Input limit'); }

$updated = 0;

require_once 'preload.php';

$stmt_se	= $dbh->prepare('SELECT "ID" FROM "Script" WHERE "RawCode" IS NULL');
$stmt_se->execute();

$stmt_code	= $dbh->prepare('SELECT "Code"."Value" FROM "Code" INNER JOIN "Line" ON "Line"."CodeID"="Code"."ID" WHERE "Line"."ScriptID"=:script_id ORDER BY "Line"."Line"');

$stmt_up	= $dbh->prepare('UPDATE "Script" SET "RawCode"=:code WHERE "ID"=:script_id');

while (($row = $stmt_se->fetch(PDO::FETCH_ASSOC)) && $limit--) {

	$stmt_code->bindValue(":script_id", $row['ID'], PDO::PARAM_INT);
	$stmt_code->execute();

	$lines	= $stmt_code->fetchAll(PDO::FETCH_COLUMN, 0);
	if (empty($lines)) {
		$code	= '';
	} else {
		$code	= implode("\n", $lines);
	}

	$stmt_up->bindValue(":code", $code, PDO::PARAM_STR);
	$stmt_up->bindValue(":script_id", $row['ID'], PDO::PARAM_INT);
	$stmt_up->execute();
	$updated ++;

}

echo('success! ' . $updated);


?>
