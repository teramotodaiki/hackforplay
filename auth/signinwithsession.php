<?php
/*
セッション情報をもとにサインインを行う
Input:
Output: no-session , success
*/

require_once '../preload.php';

try {

	session_start();
	if (isset($_SESSION['UserID'])) {

		// サインインに成功
		// もしチュートリアルのトラッキング情報が残っていれば、AnonymousUserとUserを関連付ける
		if (isset($_SESSION['AnonymousUserID'])) {
			$stmt			= $dbh->prepare('SELECT "UserID" FROM "AnonymousUser" WHERE "ID"=:anonymous_user_id');
			$stmt->bindValue(":anonymous_user_id", $_SESSION['AnonymousUserID'] , PDO::PARAM_INT);
			$stmt->execute();
			$current_userid	= $stmt->fetch(PDO::FETCH_COLUMN, 0);

			// まだ関連付けされたUserがなければ、このUserを関連付ける
			if (!$current_userid) {
				$stmt		= $dbh->prepare('UPDATE "AnonymousUser" SET "UserID"=:session_userid WHERE "ID"=:anonymous_user_id');
				$stmt->bindValue(":session_userid", $_SESSION['UserID'], PDO::PARAM_INT);
				$stmt->bindValue(":anonymous_user_id", $_SESSION['AnonymousUserID'], PDO::PARAM_INT);
				$stmt->execute();

				unset($_SESSION['AnonymousUserID']); // 不要なセッションをunset
			}
		}

		exit("success");
	}else{
		exit("no-session");
	}

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}

 ?>