<?php
/**
* SQLを利用したsessionを登録します
*/
class SQLSessionHundler implements SessionHandlerInterface
{
	public $dbh;

	function __construct($database_hundler)
	{
		$this->dbh	= $database_hundler;
	}

	function open($save_path, $name)
	{
		// session_start() されたときコールされる
		return true;
	}

	function read($session_id)
	{
		// session_start() されたときコールされる

		$stmt	= $this->dbh->prepare('SELECT "Data" FROM "Sessions" WHERE "ID"=:id');
		$stmt->bindValue(":id", $session_id, PDO::PARAM_STR);
		$stmt->execute();
		$session_data	= $stmt->fetch(PDO::FETCH_COLUMN, 0);

		return $session_data;
	}

	function write($session_id, $session_data)
	{
		// session_start() されたときコールされる

		// time()の戻り値をUTCにセット
		date_default_timezone_set('UTC');

		// SessionIDの存在確認
		$stmt	= $this->dbh->prepare('SELECT COUNT("ID") FROM "Sessions" WHERE "ID"=:id');
		$stmt->bindValue(":id", $session_id, PDO::PARAM_STR);
		$stmt->execute();
		$row	= $stmt->fetch(PDO::FETCH_COLUMN, 0);

		if ($row) {
			// 存在
			$stmt	= $this->dbh->prepare('UPDATE "Sessions" SET"Data"=:data, "Timestamp"=:gmt WHERE "ID"=:id');
			$stmt->bindValue(":id", $session_id, PDO::PARAM_STR);
			$stmt->bindValue(":data", $session_data, PDO::PARAM_STR);
			$stmt->bindValue(":gmt", time(), PDO::PARAM_INT);
			return $stmt->execute();

		} else {
			try {
				// 追加
				$stmt	= $this->dbh->prepare('INSERT INTO "Sessions"("ID","Data","Timestamp") VALUES(:id,:data,:gmt)');
				$stmt->bindValue(":id", $session_id, PDO::PARAM_STR);
				$stmt->bindValue(":data", $session_data, PDO::PARAM_STR);
				$stmt->bindValue(":gmt", time(), PDO::PARAM_INT);
				return $stmt->execute();
			} catch (PDOException $e) {
				/**
				 * issue:
				 * PDOException: SQLSTATE[23000]: [Microsoft][ODBC Driver 11 for SQL Server][SQL Server]Violation of PRIMARY KEY constraint 'PK__Sessions__3214EC2782EACC4B'. Cannot insert duplicate key in object 'dbo.Sessions'. The duplicate key value is (acpn619ekhuj2doopjg67feng5).
				*/
				return false;
			}
		}
	}

	function destroy($session_id)
	{
		// sessionがclose,commitされるときにコールされる

		$stmt	= $this->dbh->prepare('DELETE FROM "Sessions" WHERE "ID"=:id');
		$stmt->bindValue(":id", $session_id, PDO::PARAM_STR);
		$stmt->execute();
		return true;
	}

	function close()
	{
		// sessionがclose,commitされるときにコールされる
		return true;
	}

	function gc($maxlifetime)
	{
		// phpのガベージコレクションが実行されるときコールされる

		// time()の戻り値をUTCにセット
		date_default_timezone_set('UTC');

		$stmt	= $this->dbh->prepare('DELETE FROM "Sessions" WHERE "Timestamp" < ?');
		$stmt->bindValue(1, time() - $maxlifetime, PDO::PARAM_INT);
		$stmt->execute();
		return true;
	}
}

// セッション設定
session_cache_limiter('private_no_expire');
session_cache_expire(48 * 60); // 48時間セッション継続
session_set_cookie_params(48 * 60 * 60);
ini_set('session.gc_maxlifetime', 48 * 60 * 60);
session_set_save_handler(new SQLSessionHundler($dbh));

?>
