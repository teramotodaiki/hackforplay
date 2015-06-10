<?php
// Develop: E_ALL, Release: 0

// 1.Generate PDO object (connecting mysql)
$pdo = null;
$useLocalDB = true;
try {
	if(($useLocalDB && $_SERVER['SERVER_NAME'] === 'localhost')){
		error_reporting(E_ALL);
		$dbh 	= new PDO("mysql:dbname=hackforplay-localhost;host=localhost;charset=utf8", 'hackforplay', 'RtPF7JRSZ5XzFasc');
		$dbh->exec("SET sql_mode='ANSI_QUOTES'");
	}elseif($_SERVER['SERVER_NAME'] === 'hackforplay-staging.azurewebsites.net'){
		error_reporting(0);
    	$dbh = new PDO ( "sqlsrv:server = tcp:yadw63xtf8.database.secure.windows.net,1433; Database = hackforplay-staging", "hackforplay@yadw63xtf8", "9PFLn21u9TkiqlKx3ceAbawXSGsBPGT");
	}else{
		error_reporting(0);
    	$dbh = new PDO ( "sqlsrv:server = tcp:yadw63xtf8.database.secure.windows.net,1433; Database = hackforplay", "hackforplay@yadw63xtf8", "9PFLn21u9TkiqlKx3ceAbawXSGsBPGT");
	}
    $dbh->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
}
catch ( PDOException $e ) {
    print( "Error connecting to SQL Server." );
    die();
}

// セッション ユーザーID取得
session_cache_limiter('private_no_expire');
session_cache_expire(48 * 60); // 48時間セッション継続
session_set_cookie_params(48 * 60 * 60);
session_start();
if(isset($_SESSION['UserID'])){
	$session_userid = $_SESSION['UserID'];
}else{
	$session_userid = NULL;
}
session_commit();

print_r(session_get_cookie_params());
exit();

// 暗号化キーの生成
$encription_key = pack('H*', "29fdebae5e1d48b54763051cef08bc55abe017e2ffb2a00a3bcb04b7e103a0cd");


?>