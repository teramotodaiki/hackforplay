<?php
/*
過去７日間の継続ログイン日数の分布
Output:	JSON{distribution_of_continuoslylog}
*/

require_once '../preload.php';

try {

	// 現在GMTから9日間以内のAttendanceをすべて取得
	$gmnow		= gmdate('Y-m-d H:i:s');
	$_9daysago	= (new DateTime($gmnow))->modify('-9 days')->format('Y-m-d H:i:s');
	$stmt	= $dbh->prepare('SELECT "UserID","Begin" FROM "Attendance" WHERE "End">:_begin ORDER BY "Begin" DESC');
	$stmt->bindValue(":_begin", $_9daysago, PDO::PARAM_STR);
	$stmt->execute();

	$values			= array_fill(0, 7, 0);
	foreach ($stmt->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_COLUMN) as $UserID => $attendance) {

		// 現地時間で[今日]の00:00:00を表すGMTのDateTime := DATE (datetime ~ datetime+1day)
		$offset_sec	= (new DateTime($attendance[0]))->format('Z');
		$offset		= DateInterval::createFromDateString($offset_sec . ' seconds');
		$datetime	= (new DateTime($gmnow))->add($offset)->setTime(0, 0, 0)->sub($offset);

		$datetime->modify('+1 day');
		$count		= 0;
		// Attendance.Begin(降順)を[今日]から1日ずつ遡りながら捕捉する
		for ($day_ago=0; $day_ago < 8; $day_ago++) {

			$_end		= $datetime->format('Y-m-d H:i:s');
			$_begin		= $datetime->modify('-1 day')->format('Y-m-d H:i:s');
			foreach ($attendance as $key => $registered) {
				if ($registered < $_end) {
					// DATE の終点より早いレコード。DATEに含まれる可能性がある
					if ($registered > $_begin) {
						// DATEに含まれるレコード
						$count++;
						if ($count >= 8) {
							// [今日]から含めてすでに7をカウントしたので、終了する
							break 2;
						}

					}elseif ($day_ago > 0) {
						// $day_ago == 0 は [今日]である。[昨日]以降のDATEに含まれない場合、継続でないと判断する
						break 2;
					}
					break;
				}
			}
		}
		if ($count > 0) {
			$values[$count-1] ++; // 分布をつくる
		}
	}

	// ラベル
	$labels	= array();
	for ($i=1; $i < 7; $i++) {
		array_push($labels, (string)$i);
	}
	array_push($labels, '7+');

	$distribution_of_continuoslylog				= new stdClass;
	$distribution_of_continuoslylog->labels		= $labels;
	$distribution_of_continuoslylog->values		= $values;

	$json = json_encode($distribution_of_continuoslylog);
	if ($json === FALSE) {
		exit('parse-error');
	}
	echo $json;

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>