<?php

try {

	require_once '../preload.php';

	$show_code = filter_input(INPUT_GET, 'show_code', FILTER_VALIDATE_BOOLEAN);

	$stmt = $dbh->prepare('SELECT COUNT(*) FROM "Line"');
	$stmt->execute();
	$line_count = $stmt->fetch(PDO::FETCH_COLUMN, 0);

	$stmt = $dbh->prepare('SELECT "ID","Value" FROM "Code"');
	$stmt->execute();
	$code = $stmt->fetchAll(PDO::FETCH_COLUMN | PDO::FETCH_GROUP);
	// Trimming
	$cursor = array();
	foreach ($code as $key => $value) {
		$trimmed = $code[$key]['Trim'] = preg_replace('/^\s*/', '', $value[0]);
		if (isset($cursor[$trimmed])) {
			$code[$key]['Cursor'] = $cursor[$trimmed];
		} else {
			$cursor[$trimmed] = $key;
			$code[$key]['Cursor'] = $key;
		}
	}

	$stmt = $dbh->prepare('SELECT "CodeID" FROM "Line"');
	$stmt->execute();

	$count = array();
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$id = $row['CodeID'];
		if ($id == -1) continue;

		$id = $code[$id]['Cursor'];
		if ($code[$id]['Trim'] === '') {
			$line_count --; // Without empty line
		} elseif (isset($count[$id])) {
			$count[$id] ++;
		} else {
			$count[$id] = 1;
		}
	}
	arsort($count);

} catch (Exception $e) {
	print_r($e);
	die();
}

?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title></title>
	<style type="text/css">
		div {
			font-family: monospace;
			white-space: pre;
		}
	</style>
</head>
<body>
<div><?php echo count($count) . "\t" . $line_count; ?></div>
<?php $sum = 0; ?>
<?php foreach ($count as $key => $value) : $sum += $value; ?>
<?php if ($show_code) : ?>
<div><?php printf("%07d\t%.10f\t%.10f\t%s", $value, $value / $line_count, $sum / $line_count, htmlspecialchars($code[$key]['Trim'])); ?></div>
<?php else : ?>
<div><?php printf("%07d\t%.10f\t%.10f", $value, $value / $line_count, $sum / $line_count); ?></div>
<?php endif; ?>
<?php endforeach; ?>
</body>
</html>
