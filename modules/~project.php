<?php
/**
 * /module/~project のコントローラ
 * Input: module:token (, version)
 * **** versionの設定は未対応 (常に最新版をfetch) ****
 * **** 常に最新版をfetchした場合、モジュール側のスクリプト変更によって呼び出し側がうまく動作しない場合がある ****
 * **** requireの利用は未対応（コード全体を関数として返す） ****
*/

require_once '../preload.php';

$token = filter_input(INPUT_GET, 'module');

$stmt = $dbh->prepare('SELECT "ID","Written" FROM "Project" WHERE "Token"=:token');
$stmt->bindValue(':token', $token, PDO::PARAM_STR);
$stmt->execute();
$project = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$project) { // プロジェクトが空
  header('HTTP/1.0 404 Not Found');
  echo "Project not found";
  exit;
} elseif (!$project['Written']) {
  header('HTTP/1.0 404 Not Found');
  echo "Project found but there is no script";
  exit;
}

// 最新のScriptをfetch
$stmt = $dbh->prepare('SELECT "ID","RawCode" FROM "Script" WHERE "ProjectID"=:project_id ORDER BY "Registered" DESC');
$stmt->bindValue(':project_id', $project['ID'], PDO::PARAM_INT);
$stmt->execute();
$script  = $stmt->fetch(PDO::FETCH_ASSOC);

?>
define(function (require, exports, module) {

<?php echo $script['RawCode']; ?>

  return function() {};

});
