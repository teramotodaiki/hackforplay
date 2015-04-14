<?php
require_once 'preload.php';
 ?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title></title>
</head>
<body>
<?php
try {

$res = $pdo->query("CREATE TABLE challenge_reason (id int(11) NOT NULL,user_id int(11) DEFAULT NULL,text varchar(255) NOT NULL,enabled tinyint(1) NOT NULL,time datetime NOT NULL COMMENT);");
var_dump($res);
echo "<br><br>";
/*
$res = $pdo->query("CREATE TABLE `challenge_vote` (
`id` int(11) NOT NULL,
  `code_id` int(11) NOT NULL,
  `stage_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reason_id` int(11) NOT NULL,
  `time` datetime NOT NULL
);");
var_dump($res);
echo "<br><br>";

$res = $pdo->query("CREATE TABLE `code` (
`id` int(11) NOT NULL,
  `play_id` int(11) NOT NULL,
  `stage_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `raw` text NOT NULL,
  `time` datetime NOT NULL,
  `error` tinyint(1) NOT NULL,
  `voted` int(11) NOT NULL DEFAULT '0',
  `displayed` int(11) NOT NULL DEFAULT '0'
);");
var_dump($res);
echo "<br><br>";

$res = $pdo->query("CREATE TABLE `play` (
`id` int(11) NOT NULL,
  `token` varchar(32) NOT NULL COMMENT 'unique hex(16bit) each play',
  `user_id` int(11) NOT NULL,
  `stage_id` int(11) NOT NULL COMMENT 'stage.id',
  `clear` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'have cleared',
  `begin` datetime NOT NULL COMMENT 'when you begin playing',
  `finish` datetime DEFAULT NULL COMMENT 'when WILL you clear, be NULL before'
);");
var_dump($res);
echo "<br><br>";

$res = $pdo->query("CREATE TABLE `restaging` (
`id` int(11) NOT NULL,
  `play_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `stage_id` int(11) NOT NULL,
  `code` text NOT NULL,
  `time` datetime NOT NULL,
  `origin_id` int(11) DEFAULT NULL COMMENT 'restaging.id',
  `author` text NOT NULL,
  `stage_name` text NOT NULL,
  `thumbnail` text
);");
var_dump($res);
echo "<br><br>";

$res = $pdo->query("CREATE TABLE `stage` (
`id` int(11) NOT NULL,
  `path` text NOT NULL COMMENT 'directory path',
  `title` text NOT NULL COMMENT 'max 100 chars',
  `next` int(11) DEFAULT NULL,
  `playcount` int(11) NOT NULL DEFAULT '0',
  `playable` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Can user play this',
  `type` enum('official','replay') NOT NULL DEFAULT 'official' COMMENT '0:official, 1:replay',
  `restaging_id` int(11) DEFAULT NULL COMMENT 'restaging.id'
);");
var_dump($res);
echo "<br><br>";

$res = $pdo->query("CREATE TABLE `user` (
`id` int(11) NOT NULL,
  `key` varchar(32) NOT NULL COMMENT 'cookie has. made from hex',
  `beta` tinyint(1) NOT NULL COMMENT 'Are you a beta-user?',
  `begin` datetime NOT NULL,
  `last` datetime DEFAULT NULL
);");
var_dump($res);
echo "<br><br>";

$res = $pdo->query("ALTER TABLE `challenge_reason`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `text` (`text`);");
var_dump($res);
echo "<br><br>";

$res = $pdo->query("ALTER TABLE `challenge_vote`
	ADD PRIMARY KEY (`id`);");
var_dump($res);
echo "<br><br>";

$res = $pdo->query("ALTER TABLE `code`
 ADD PRIMARY KEY (`id`);");
var_dump($res);
echo "<br><br>";

$res = $pdo->query("ALTER TABLE `play`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `token` (`token`);");
var_dump($res);
echo "<br><br>";

$res = $pdo->query("ALTER TABLE `restaging`
 ADD PRIMARY KEY (`id`);");
var_dump($res);
echo "<br><br>";

$res = $pdo->query("ALTER TABLE `stage`
 ADD PRIMARY KEY (`id`);");
var_dump($res);
echo "<br><br>";

$res = $pdo->query("ALTER TABLE `user`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `key` (`key`);");
var_dump($res);
echo "<br><br>";
*/
}catch ( PDOException $e ) {
    print( "Error connecting to SQL Server." );
    die(print_r($e));
}

 ?>
</body>
</html>