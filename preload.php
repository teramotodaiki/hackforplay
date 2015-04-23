<?php
// Require before processing

// 1.Generate PDO object (connecting mysql)
$pdo = null;
$useLocalDB = true;
try {
	if(($useLocalDB && $_SERVER['SERVER_NAME'] == 'localhost')){
		$pdo = new PDO('mysql:dbname=hackforplay-old;host=localhost;charset=utf8;', 'hackforplay', 'RtPF7JRSZ5XzFasc');
		$pdo->exec("SET sql_mode='ANSI_QUOTES'");
		$dbh 	= new PDO("mysql:dbname=hackforplay;host=localhost;charset=utf8", 'hackforplay', 'RtPF7JRSZ5XzFasc');
		$dbh->exec("SET sql_mode='ANSI_QUOTES'");
	}else{
		// $pdo = new PDO('mysql:dbname=hackforplay;host=ja-cdbr-azure-west-a.cloudapp.net;charset=utf8;', 'ba714e6056fb6c', 'd66371c3');
    	$pdo = new PDO ( "sqlsrv:server = tcp:yadw63xtf8.database.secure.windows.net,1433; Database = hackforplay-release", "hackforplay@yadw63xtf8", "9PFLn21u9TkiqlKx3ceAbawXSGsBPGT");
	}
    $pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
    $dbh->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
}
catch ( PDOException $e ) {
    print( "Error connecting to SQL Server." );
    die(print_r($e));
}

?>