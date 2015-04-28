<?php
/*
ステージの情報をDBから取得し、変数にもたせ、セッションがある場合はプレイのログをつける
Input:	id
Stage.State:
  published:公開されている/プレイ可能
  judging:	審査中/プレイ可能
  rejected:	審査等でリジェクトされた/プレイ不可能
*/

// ステージの情報を取得
$missing_page = '../r'; // ステージ情報が取得できなかった時に飛ぶページ

$stageid = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if($stageid == FALSE || $stageid == NULL){
	header('Location:' . $missing_page);
	exit();
}

try{
	$stmt	= $dbh->prepare('SELECT "ID","Mode","ProjectID","Path","Title","Playcount","NextStageID" FROM "Stage" WHERE "ID"=:stageid AND "State"!=:rejected');
	$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
	$stmt->bindValue(":rejected", 'rejected', PDO::PARAM_STR);
	$stmt->execute();
	$stage	= $stmt->fetch(PDO::FETCH_ASSOC);
	if($stage == NULL){
		header('Location:' . $missing_page);
		exit();
	}
}catch(PDOException $e){
	print_r($e);
	die();
}

if ($stage['Mode'] == 'replay') {
	// リプレイ
}

// if(isset($stage['restaging_id'])){
// 	try{
// 		$stmt	= $pdo->prepare('SELECT * FROM "restaging" WHERE "id"=:id');
// 		$stmt->bindValue(":id", $stage['restaging_id'], PDO::PARAM_INT);
// 		$stmt->execute();
// 		$restaging = $stmt->fetch(PDO::FETCH_ASSOC);
// 	}catch(PDOException $e){
// 		print("PDO Error B");
// 		exit();
// 	}
// }

// playcountを更新
try {
	$stmt	= $dbh->prepare('UPDATE "Stage" SET "Playcount"="Playcount"+1 WHERE "ID"=:stageid');
	$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
	$stmt->execute();

} catch (PDOException $e) {
	print_r($e);
	die();
}

// プレイログ
session_start();
if(isset($_SESSION['UserID'])){
	// プレイのログをつける

}
session_commit();

// try{
// 	if(!isset($user['id'])){
// 		// Missing user
// 	} else {
// 		// 5-2.Record token-user_id pair
// 		$stmt = $pdo->prepare('INSERT INTO "play" ("token","user_id","stage_id","begin") VALUES(:token, :user_id, :stage_id, :begin)');
// 		$stmt->bindValue(":token", $token, PDO::PARAM_STR);
// 		$stmt->bindValue(":user_id", $user['id'], PDO::PARAM_INT);
// 		$stmt->bindValue(":stage_id", $stage['id'], PDO::PARAM_INT);
// 		$stmt->bindValue(":begin", date("Y-m-d H:i:s"), PDO::PARAM_STR);
// 		$flag = $stmt->execute();
// 		if(!$flag){
// 			// Failed to record
// 			$token = "";
// 		}else{
// 			// increase playcount
// 			$stmt = $pdo->prepare('UPDATE "stage" SET "playcount"="playcount"+1 WHERE "id"=:id');
// 			$stmt->bindValue(":id", $id, PDO::PARAM_INT);
// 			$stmt->execute();
// 		}
// 	}
// }catch(PDOException $e){
// 	// Failed to record playing log
// 	$token = "";
// }
?>