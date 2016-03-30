<?php
/**
 * TestChannel を作成し、 session user の最新プロジェクトをアサインする
*/

try {

  require_once './preload.php';

  session_start();
  $session_userid = $_SESSION['UserID'];
  session_commit();

  if (!$session_userid) {
    header("HTTP/1.0 401 Unauthorized");
    die;
  }

  $stmt = $dbh->prepare('SELECT "ID" FROM "Channel" WHERE "CommunityID"=:community_id');
  $stmt->bindValue(':community_id', 1, PDO::PARAM_INT);
  $stmt->execute();
  $id = $stmt->fetch(PDO::FETCH_COLUMN);

  if (!$id) {
    $stmt = $dbh->prepare('INSERT INTO "Channel" ("CommunityID","Name","DisplayName","Registered") VALUES(:community_id,:name,:dname,:gmt)');
    $stmt->bindValue(':community_id', 1, PDO::PARAM_INT);
    $stmt->bindValue(':name', 'test', PDO::PARAM_STR);
    $stmt->bindValue(':dname', 'テストチャンネル', PDO::PARAM_STR);
    $stmt->bindValue(':gmt', gmdate('Y-m-d H:i:s'), PDO::PARAM_STR);
    $stmt->execute();
    $id = $dbh->lastInsertId('Channel');
  }

  // 最新のProjectをフェッチ
  $stmt = $dbh->prepare('SELECT "ID","Token" FROM "Project" WHERE "ID"=(SELECT MAX("ID") FROM "Project" WHERE "UserID"=:userid AND "State"=:enabled AND "Written"=:true)');
  $stmt->bindValue(':userid', $session_userid, PDO::PARAM_INT);
  $stmt->bindValue(':enabled', 'enabled', PDO::PARAM_STR);
  $stmt->bindValue(':true', true, PDO::PARAM_BOOL);
  $stmt->execute();
  $project = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$project) {
    echo 'no-project';
    die;
  }

  // 更新
  $stmt = $dbh->prepare('UPDATE "Channel" SET "ProjectID"=:project_id,"ProjectToken"=:project_token,"UserID"=:userid,"Updated"=:gmt WHERE "ID"=:id');
  $stmt->bindValue(':project_id', $project['ID'], PDO::PARAM_INT);
  $stmt->bindValue(':project_token', $project['Token'], PDO::PARAM_STR);
  $stmt->bindValue(':userid', $session_userid, PDO::PARAM_INT);
  $stmt->bindValue(':gmt', gmdate('Y-m-d H:i:s'), PDO::PARAM_STR);
  $stmt->bindValue(':id', $id, PDO::PARAM_INT);
  $result = $stmt->execute();

  if (!$result) {
    echo 'database-error';
  }

} catch (Exception $e) {
  var_dump($e);
  Rollbar::report_exception($e);
  die;
}
?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <a href="./cast/?name=test">Go to casting page</a>
  </body>
</html>
