<?php
/**
 * /resources/?author={AuthorName}&sub={SubName}
 * get JSON data of resource
*/

require_once '../preload.php';

$author = filter_input(INPUT_GET, 'author') or die('invalid-author-name');
$sub = filter_input(INPUT_GET, 'sub') or die('invalid-sub-name');

$stmt = $dbh->prepare('SELECT "SpriteWidth","SpriteHeight" FROM "Resource" WHERE "AuthorName"=:author AND "SubName"=:sub');
$stmt->bindValue(':author', $author, PDO::PARAM_STR);
$stmt->bindValue(':sub', $sub, PDO::PARAM_STR);
$stmt->execute();

$resource = $stmt->fetch(PDO::FETCH_ASSOC) or die('resource-not-found');
$resource['SourceURL'] = "/src/?author=$author&sub=$sub";

echo json_encode($resource);

?>
