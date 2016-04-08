<?php
/**
 * /stages/
 * POST (id:Number, data:JSON)
 * returns 'success' or error messages
 * 指定されたIDのステージの情報を更新する
 * 更新するには、Stage.TeamIDが指すチームのPublishingManagement権限を持つUserのsessionが必要
 * !!! 更新できないパラメータを定義すべき !!!
*/

require_once '../preload.php';

session_start();
$session_userid  = isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();
if (!$session_userid) {
  die('no-session');
}

$stage_id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT) or die('invalid-id');

$stmt = $dbh->prepare('SELECT * FROM "Stage" WHERE "ID"=:stage_id');
$stmt->bindValue(':stage_id', $stage_id, PDO::PARAM_INT);
$stmt->execute();
$current  = $stmt->fetch(PDO::FETCH_ASSOC) or die('stage-not-found');

// 権限を確認する
$stmt = $dbh->prepare('SELECT "PublishingManagement" FROM "UserTeamMap" WHERE "UserID"=:session_userid AND "TeamID"=:current_teamid AND "Enabled"=1');
$stmt->bindValue(':session_userid', $session_userid, PDO::PARAM_INT);
$stmt->bindValue(':current_teamid', $current['TeamID'], PDO::PARAM_INT);
$stmt->execute();
if (!$stmt->fetch(PDO::FETCH_COLUMN)) {
  die('unauthorized');
}

$data_json = filter_input(INPUT_POST, 'data');
$data = json_decode($data_json, true) or die('invalid-data');

// $currentの連想配列のキーを利用して$dataで指定されたカラムの存在を確認する
$placeholder_array = [];
foreach ($data as $key => $value) {
  switch ($key) {
    case 'Registered':
    case 'Published':
      $data[$key] = $value ? $value : gmdate('Y-m-d H:i:s');
      break;
    default:
      if (!array_key_exists($key, $current))
        die("column-not-found $key");
      break;
  }
  array_push($placeholder_array, "\"$key\"=:$key");
}

// placeholderを生成
$placeholder = implode(',', $placeholder_array);
$stmt = $dbh->prepare("UPDATE \"Stage\" SET $placeholder WHERE \"ID\"=:stage_id");
$data['stage_id'] = $stage_id;
$result = $stmt->execute($data);
if (!$result) {
  die('database-error');
}

echo "success";

?>
