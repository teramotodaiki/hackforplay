<?php

require_once 'preload.php';
$affected = 0;

try {

  $stmt_prj = $dbh->prepare('SELECT "Project"."ID","Project"."UserID","Project"."SourceStageID","Stage"."Src" FROM "Project" INNER JOIN "Stage" ON "Project"."SourceStageID"="Stage"."ID" WHERE "ReservedID" IS NULL AND "Project"."State"=:enabled');
  $stmt_prj->bindValue(":enabled", 'enabled', PDO::PARAM_STR);
  $stmt_prj->execute();

  $stmt_stg	= $dbh->prepare('INSERT INTO "Stage" ("UserID","Mode","ProjectID","State","SourceID","Src") VALUES(:userid,:replay,:projectid,:reserved,:source_id,:stage_src)');
  $stmt_upd	= $dbh->prepare('UPDATE "Project" SET "ReservedID"=:new_stage_id WHERE "ID"=:projectid');


  while ($project = $stmt_prj->fetch(PDO::FETCH_ASSOC)) {

    // ステージを事前に作成
    $stmt_stg->bindValue(":userid", $project['UserID'], PDO::PARAM_INT);
    $stmt_stg->bindValue(":replay", 'replay', PDO::PARAM_STR);
    $stmt_stg->bindValue(":projectid", $project['ID'], PDO::PARAM_INT);
    $stmt_stg->bindValue(":reserved", 'reserved', PDO::PARAM_STR);
    $stmt_stg->bindValue(":source_id", $project['SourceStageID'], PDO::PARAM_INT);
    $stmt_stg->bindValue(":stage_src", $project['Src'], PDO::PARAM_STR);
    $flag 	= $stmt_stg->execute();
    if (!$flag) {
      exit('database-error');
    }
    $new_stage_id = $dbh->lastInsertId('Stage');

    // プロジェクトに紐付け
    $stmt_upd->bindValue(":new_stage_id", $new_stage_id, PDO::PARAM_INT);
    $stmt_upd->bindValue(":projectid", $project['ID'], PDO::PARAM_INT);
    $flag 	= $stmt_upd->execute();
    if (!$flag) {
      exit('database-error');
    }

    $affected ++;

  }

} catch (Exception $e) {

  var_dump($e);

} finally {
  echo "$affected rows affected";
}

?>
