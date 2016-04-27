<?php
/*
KeyValueDataに値を挿入するインターフェースを提供する
$dataは配列でもよいが、値はstring型に変換できる必要がある
*/
function setData($attendance_id, $data, $dbh)
{
	// プリペアドステートメント
	$stmt_se_data	= $dbh->prepare('SELECT "ID" FROM "KeyValueData" WHERE "KeyString"=:key_string AND "ValueString"=:value_string');
	$stmt_in_data	= $dbh->prepare('INSERT INTO "KeyValueData" ("KeyString","ValueString") VALUES(:key_string,:value_string)');
	$stmt_in_map	= $dbh->prepare('INSERT INTO "AttendanceMap" ("AttendanceID","KeyValueDataID") VALUES(:attendance_id,:key_value_data_id)');

	$data = is_array($data) ? $data : array($data);
	foreach ($data as $key => $value) {
		$key_string		= (string)$key;
		$value_string	= (string)$value;

		// 1.KeyValueData.IDを取得する
		$stmt_se_data->bindValue(":key_string", $key_string, PDO::PARAM_STR);
		$stmt_se_data->bindValue(":value_string", $value_string, PDO::PARAM_STR);
		$stmt_se_data->execute();
		$key_value_data	= $stmt_se_data->fetch(PDO::FETCH_ASSOC);

		if (empty($key_value_data)) {
			// 2.KeyValueDataを作成し、IDを取得する
			$stmt_in_data->bindValue(":key_string", $key_string, PDO::PARAM_STR);
			$stmt_in_data->bindValue(":value_string", $value_string, PDO::PARAM_STR);
			$stmt_in_data->execute();
			$key_value_data = array('ID' => $dbh->lastInsertId('KeyValueData'));
		}

		// 3.Mapに新しい行を追加する
		$stmt_in_map->bindValue(":attendance_id", $attendance_id, PDO::PARAM_INT);
		$stmt_in_map->bindValue(":key_value_data_id", $key_value_data['ID'], PDO::PARAM_INT);
		$stmt_in_map->execute();

	}
}
?>
