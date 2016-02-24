<?php
// Set raw code

$limit = filter_input(INPUT_GET, 'limit');
if (!$limit) { exit('Input limit'); }

$updated = 0;

require_once 'preload.php';

$stmt	= $dbh->prepare('SELECT COUNT(*) FROM "Script" WHERE "RawCode" IS NULL');
$stmt->execute();
$count = $stmt->fetch(PDO::FETCH_COLUMN);

$stmt_se	= $dbh->prepare('SELECT "ID" FROM "Script" WHERE "RawCode" IS NULL');
$stmt_se->execute();

$stmt_code	= $dbh->prepare('SELECT "Code"."Value" FROM "Code" INNER JOIN "Line" ON "Line"."CodeID"="Code"."ID" WHERE "Line"."ScriptID"=:script_id ORDER BY "Line"."Line"');

$stmt_up	= $dbh->prepare('UPDATE "Script" SET "RawCode"=:code WHERE "ID"=:script_id');

try {
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
} catch (Exception $e) {
		var_dump($e);
		echo '<p>';
} finally {
		echo '<p>empty lines ' . $count;
		echo '<p>updated     ' . $updated;
}

echo('<p id="success"></p>');

?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="Cache-control" content="no-cache">
		<meta http-equiv="Expires" content="-1">
		<title></title>
	</head>
	<body>
		<script type="text/javascript">
			setTimeout(function () {
				window.location = window.location.href;
			}, 1000);
			console.log(document.getElementById('success'));
			document.getElementById('success').innerHTML = 'success ' + new Date().getTime();
		</script>
	</body>
</html>
