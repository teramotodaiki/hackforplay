<?php
/*
Embed frame の起点ファイル
MODを入れる場合はGETパラメータに mod=yes をつける デフォルトではMODなしと認識する
MODを利用しない場合は plane.php , 利用する場合は amd.php コントローラを require する
*/

// $mod	= filter_input(INPUT_GET, 'mod', FILTER_VALIDATE_BOOLEAN);
$mod = true; // Usually use mod

if ($mod) {
	require_once './amd.php';
} else {
	require_once './plane.php';
}

?>
